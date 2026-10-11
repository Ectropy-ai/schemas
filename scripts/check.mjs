// The gate every change to the standard passes, in CI and before publish:
// canonical formatting, $id equals the served URL, closure (no $ref leaves schemas.ectropy.ai),
// every schema compiles under draft-07, every example validates, public text says only what a
// shape is, no private schema is present, and no published version changes.
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { BASE, DRAFT7, PROPRIETARY, ROOT, canonical, idOf, load, read, relOf, schemaFiles } from './lib.mjs';
import { publishedVersions } from './versions.mjs';

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const files = schemaFiles();
const schemas = Object.fromEntries(files.map((rel) => [rel, load(rel)]));

// 1. Shape of each file.
for (const rel of files) {
  const s = schemas[rel];
  if (read(rel) !== canonical(s)) fail(rel, 'not in canonical form (2-space JSON, UTF-8, trailing newline)');
  if (s.$schema !== DRAFT7) fail(rel, `$schema must be ${DRAFT7}`);
  if (s.$id !== idOf(rel)) fail(rel, `$id must be ${idOf(rel)} (got ${s.$id})`);
  if (!/^\d+\.\d+\.\d+$/.test(s.version || '')) fail(rel, 'version must be semver');
  if (!s.title || !s.description) fail(rel, 'title and description are required');
}

// 2. Closure: every $ref is local or names a schema in this repo, and its fragment resolves.
const pointer = (doc, frag) => {
  let node = doc;
  for (const raw of frag.replace(/^\//, '').split('/').filter(Boolean)) {
    const key = decodeURIComponent(raw).replace(/~1/g, '/').replace(/~0/g, '~');
    if (node == null || !(key in node)) return undefined;
    node = node[key];
  }
  return node;
};
const walk = (node, visit, path = []) => {
  if (Array.isArray(node)) node.forEach((v, i) => walk(v, visit, [...path, i]));
  else if (node && typeof node === 'object') {
    visit(node, path);
    for (const [k, v] of Object.entries(node)) walk(v, visit, [...path, k]);
  }
};
for (const rel of files) {
  walk(schemas[rel], (node) => {
    if (typeof node.$ref !== 'string') return;
    const [base, frag = ''] = node.$ref.split('#');
    const target = base === '' ? rel : relOf(base);
    if (target === null) return fail(rel, `$ref leaves ${BASE}: ${node.$ref}`);
    if (!schemas[target]) return fail(rel, `$ref names no schema in this repo: ${node.$ref}`);
    if (frag && pointer(schemas[target], frag) === undefined) fail(rel, `$ref fragment does not resolve: ${node.$ref}`);
  });
}

// 3. Every schema compiles, with every other schema registered under its $id.
const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
for (const rel of files) ajv.addSchema(schemas[rel]);
const EPCIS = '_vendor/gs1/epcis-json-schema-2.0.1.json';
const epcis = load(EPCIS);
ajv.addSchema(epcis);
for (const rel of files) {
  try {
    ajv.getSchema(idOf(rel));
  } catch (e) {
    fail(rel, `does not compile: ${e.message}`);
  }
}

// 4. Examples: each is listed in examples/manifest.json against the schema it shows, and validates.
// An intake example must also validate against GS1's EPCIS 2.0.1 JSON Schema, which the profile narrows.
const manifest = load('examples/manifest.json').examples;
const exampleFiles = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const full = join(dir, n);
    return statSync(full).isDirectory() ? exampleFiles(full) : n.endsWith('.json') && n !== 'manifest.json' ? [relative(ROOT, full).split(sep).join('/')] : [];
  });
const listed = new Set(manifest.map((e) => e.example));
for (const ex of exampleFiles(join(ROOT, 'examples'))) if (!listed.has(ex)) fail(ex, 'not listed in examples/manifest.json');
for (const { example, schema, epcis: alsoEpcis } of manifest) {
  if (!existsSync(join(ROOT, example))) { fail(example, 'listed in the manifest but missing'); continue; }
  if (!schemas[schema]) { fail(example, `manifest names no schema ${schema}`); continue; }
  const instance = load(example);
  const v = ajv.getSchema(idOf(schema));
  if (v && !v(instance)) fail(example, `fails ${schema}: ${ajv.errorsText(v.errors)}`);
  if (alsoEpcis) {
    const doc = { '@context': instance['@context'], type: 'EPCISDocument', schemaVersion: '2.0', creationDate: instance.eventTime, epcisBody: { eventList: [instance] } };
    const e = ajv.getSchema(epcis.$id);
    if (!e(doc)) fail(example, `fails EPCIS 2.0.1: ${ajv.errorsText(e.errors)}`);
  }
}

// 5. Public text names the shape and its fields only.
const FORBIDDEN = [
  [/\bd-\d{4}-\d\d-\d\d-[a-z0-9-]+/, 'an internal deliverable or decision id'],
  [/\b(?:FU|RULE|DEC)-[A-Z0-9]+(?:-[A-Z0-9]+)*/, 'an internal follow-up, rule or decision id'],
  [/\b(?:SR|EB|BT|LB|EAS) ?#\d+/, 'an internal pull-request reference'],
  [/\bDISPATCH-/, 'an internal work order'],
  [/schemas\.luh\.tech/, 'the private registry domain'],
  [/\b[\w./-]+\.(?:py|tsx?|msg)\b/, 'a code path'],
  [/\bSEPPA\b/, 'an internal product name'],
];
const FORBIDDEN_KEYS = new Set(['x-authoring', '_metadata']);
const VALUE_KEYS = new Set(['$id', '$ref', '$schema', 'pattern', 'const', 'enum', 'examples', 'default']);
for (const rel of files) {
  walk(schemas[rel], (node, path) => {
    for (const [k, v] of Object.entries(node)) {
      if (FORBIDDEN_KEYS.has(k)) fail(rel, `carries ${k} at /${[...path, k].join('/')}`);
      if (typeof v !== 'string' || VALUE_KEYS.has(k)) continue;
      for (const [re, what] of FORBIDDEN) if (re.test(v)) fail(rel, `/${[...path, k].join('/')} names ${what}: "${v.match(re)[0]}"`);
    }
  });
}
for (const [re, what] of FORBIDDEN) {
  const m = read('README.md').match(re);
  if (m) fail('README.md', `names ${what}: "${m[0]}"`);
}

// 6. No private schema is here, and the package ships every schema directory.
for (const p of PROPRIETARY) if (existsSync(join(ROOT, p))) fail(p, 'a private schema is in the public repo');
const shipped = new Set(load('package.json').files);
for (const dir of new Set(files.map((f) => f.split('/')[0]))) if (!shipped.has(dir)) fail('package.json', `files omits ${dir}/`);

// 7. A published version never changes: new content needs a new version.
let versionCount = 0;
try {
  const { published, conflicts } = publishedVersions();
  versionCount = published.size;
  for (const c of conflicts) fail(c.split(':')[0], c.slice(c.indexOf(':') + 2));
} catch (e) {
  fail('history', e.message);
}

if (problems.length) {
  console.error(problems.map((p) => `FAIL ${p}`).join('\n'));
  console.error(`\n${problems.length} problem(s) in ${files.length} schema(s)`);
  process.exit(1);
}
console.log(`PASS ${files.length} schemas, ${manifest.length} examples, ${versionCount} published versions: canonical, closed under ${BASE}, compiled, public text clean, versions immutable`);
