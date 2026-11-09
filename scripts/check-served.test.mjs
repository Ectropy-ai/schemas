// The served check catches what it claims to, against a fake host.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ABSENT, servedFindings } from './check-served.mjs';

const BASE = 'https://example.test/';
const FILES = [['pm/decision.schema.json', '{"a":1}\n'], ['index.json', '{"schemas":[]}\n']];
const host = (overrides = {}) => async (url) => {
  const rel = url.slice(BASE.length);
  if (rel in overrides) return overrides[rel];
  const hit = FILES.find(([p]) => p === rel);
  return hit ? { status: 200, body: hit[1] } : { status: 404, body: 'not found' };
};

test('a host serving exactly the built site passes', async () => {
  assert.deepEqual(await servedFindings(FILES, host(), BASE), []);
});
test('a missing file is a finding', async () => {
  const f = await servedFindings(FILES, host({ 'pm/decision.schema.json': { status: 404, body: '' } }), BASE);
  assert.match(f.join('\n'), /pm\/decision\.schema\.json: answers 404/);
});
test('stale bytes are a finding', async () => {
  const f = await servedFindings(FILES, host({ 'index.json': { status: 200, body: '{}' } }), BASE);
  assert.match(f.join('\n'), /index\.json: served bytes differ/);
});
test('a catch-all host that answers 200 for any path is a finding', async () => {
  const f = await servedFindings(FILES, host({ [ABSENT]: { status: 200, body: '<html>' } }), BASE);
  assert.match(f.join('\n'), /not 404/);
});
