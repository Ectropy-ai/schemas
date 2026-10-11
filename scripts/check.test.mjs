// The gate catches what it claims to: each case seeds one defect into a copy of the repo and
// expects check.mjs to fail naming it; the untouched copy passes.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROOT } from './lib.mjs';

function copy() {
  const dir = mkdtempSync(join(tmpdir(), 'eas-check-'));
  cpSync(ROOT, dir, { recursive: true, filter: (src) => !/[/\\](node_modules|\.git|dist|_site)$/.test(src) });
  symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'), 'dir');
  return dir;
}
const run = (dir) => spawnSync(process.execPath, [join(dir, 'scripts/check.mjs')], { encoding: 'utf8' });
const edit = (dir, rel, fn) => {
  const p = join(dir, rel);
  const s = JSON.parse(readFileSync(p, 'utf8'));
  fn(s);
  writeFileSync(p, JSON.stringify(s, null, 2) + '\n');
};

const CASES = {
  'a $ref leaving the standard': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.properties.decisionId = { $ref: 'https://schemas.luh.tech/_definitions/graph.schema.json#/definitions/urn' }; }), /\$ref leaves/],
  'a $ref fragment that does not resolve': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.properties.decisionId = { $ref: 'https://schemas.ectropy.ai/_definitions/urn.schema.json#/nope' }; }), /fragment does not resolve/],
  'an $id that is not the served URL': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.$id = 'https://schemas.ectropy.ai/pm/other.schema.json'; }), /\$id must be/],
  'an internal id in public text': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.description += ' Per d-2026-01-01-x-y.'; }), /internal deliverable/],
  'the private registry domain in public text': [(d) => edit(d, 'flow/tag-binding.schema.json', (s) => { s.description += ' See schemas.luh.tech.'; }), /private registry domain/],
  'non-validating authoring metadata': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s['x-authoring'] = {}; }), /carries x-authoring/],
  'a file not in canonical form': [(d) => writeFileSync(join(d, 'pm/decision.schema.json'), JSON.stringify(JSON.parse(readFileSync(join(d, 'pm/decision.schema.json'), 'utf8')))), /canonical form/],
  'an example its schema rejects': [(d) => edit(d, 'examples/flow/example.tag-binding.json', (s) => { s.unexpected = true; }), /fails flow\/tag-binding/],
  'an example missing from the manifest': [(d) => writeFileSync(join(d, 'examples/flow/example.extra.json'), '{}\n'), /not listed in examples\/manifest.json/],
  'a private schema in the public repo': [(d) => {
    mkdirSync(join(d, 'decision'));
    const s = JSON.parse(readFileSync(join(d, 'pm/decision.schema.json'), 'utf8'));
    s.$id = 'https://schemas.ectropy.ai/decision/decision-event.schema.json';
    writeFileSync(join(d, 'decision/decision-event.schema.json'), JSON.stringify(s, null, 2) + '\n');
  }, /private schema/],
};

test('the untouched repo passes', () => {
  const dir = copy();
  try {
    const r = run(dir);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

for (const [name, [seed, expected]] of Object.entries(CASES)) {
  test(`fails on ${name}`, () => {
    const dir = copy();
    try {
      seed(dir);
      const r = run(dir);
      assert.equal(r.status, 1, `expected failure, got:\n${r.stdout}${r.stderr}`);
      assert.match(r.stderr, expected);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
