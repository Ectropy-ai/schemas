// Generates the package's TypeScript from the schemas and nothing else: one declaration file per
// schema under dist/types/, a namespace per schema in dist/index.d.ts, and dist/index.js exporting
// every schema by $id (ready for a validator's addSchema). $refs resolve from this tree, never
// the network.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { compile } from 'json-schema-to-typescript';
import { BASE, ROOT, canonical, idOf, load, read, relOf, schemaFiles } from './lib.mjs';

const DIST = join(ROOT, 'dist');
const pkg = load('package.json');
const BANNER = `/* Generated from ${BASE} by @ectropy/schemas ${pkg.version}. Do not edit. */`;

const local = {
  order: 1,
  canRead: (file) => file.url.startsWith(BASE),
  read: (file) => read(relOf(file.url.split('#')[0])),
};

const pascal = (rel) =>
  rel.replace(/\.schema\.json$/, '').replace(/^_/, '').split(/[/_-]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');

rmSync(DIST, { recursive: true, force: true });
const files = schemaFiles();
const index = [BANNER, ''];
const schemas = {};
for (const rel of files) {
  const schema = load(rel);
  const ts = await compile(schema, pascal(rel), {
    bannerComment: BANNER,
    cwd: ROOT,
    declareExternallyReferenced: true,
    additionalProperties: false,
    $refOptions: { resolve: { ectropy: local, http: false, file: false } },
  });
  const out = join(DIST, 'types', rel.replace(/\.schema\.json$/, '.d.ts'));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, ts);
  index.push(`export * as ${pascal(rel)} from './types/${rel.replace(/\.schema\.json$/, '')}.js';`);
  schemas[idOf(rel)] = schema;
}
index.push('', '/** Every schema in the standard, keyed by its $id. */', 'export declare const schemas: Readonly<Record<string, object>>;', `export declare const BASE: '${BASE}';`, '');
writeFileSync(join(DIST, 'index.d.ts'), index.join('\n'));
writeFileSync(
  join(DIST, 'index.js'),
  `${BANNER}\nexport const BASE = '${BASE}';\nexport const schemas = Object.freeze(${canonical(schemas).trimEnd()});\n`,
);
console.log(`built types for ${files.length} schemas into dist/`);
