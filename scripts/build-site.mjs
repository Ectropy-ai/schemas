// Stages what https://schemas.ectropy.ai/ serves: every schema at the path its $id names, an
// index.json listing them, an index.html for people, and nothing else.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BASE, ROOT, canonical, idOf, load, schemaFiles } from './lib.mjs';

const SITE = join(ROOT, '_site');
const pkg = load('package.json');
rmSync(SITE, { recursive: true, force: true });
mkdirSync(SITE);

const files = schemaFiles();
const entries = files.map((rel) => {
  const s = load(rel);
  mkdirSync(dirname(join(SITE, rel)), { recursive: true });
  cpSync(join(ROOT, rel), join(SITE, rel));
  return { $id: idOf(rel), title: s.title, version: s.version };
});

writeFileSync(join(SITE, 'index.json'), canonical({ name: 'Ectropy open standard', base: BASE, license: pkg.license, repository: 'https://github.com/Ectropy-ai/schemas', schemas: entries }));
writeFileSync(join(SITE, '.nojekyll'), '');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rows = entries.map((e) => `<tr><td><a href="${esc(e.$id)}">${esc(e.$id.slice(BASE.length))}</a></td><td>${esc(e.title)}</td><td>${esc(e.version)}</td></tr>`).join('\n');
writeFileSync(
  join(SITE, 'index.html'),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ectropy Schemas</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:2rem auto;max-width:60rem;padding:0 1rem;color:#1a1a1a;background:#fff}table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:.35rem .5rem;border-bottom:1px solid #ddd}code{font-size:.9em}@media (prefers-color-scheme:dark){body{color:#e6e6e6;background:#111}td,th{border-color:#333}a{color:#8ab4f8}}</style>
</head><body>
<h1>Ectropy open standard</h1>
<p>JSON Schema (draft-07) for construction project data. Each schema is served at its <code>$id</code>; <a href="index.json">index.json</a> lists them. Use a schema by its <code>$id</code>, or vendor <a href="https://github.com/Ectropy-ai/schemas">the repository</a> at a commit. ${esc(pkg.license)}.</p>
<table><thead><tr><th>Schema</th><th>Title</th><th>Version</th></tr></thead><tbody>
${rows}
</tbody></table>
</body></html>
`,
);
console.log(`staged ${files.length} schemas into _site/`);
