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
  cpSync(ROOT, dir, { recursive: true, filter: (src) => !/[/\\](node_modules|dist|_site)$/.test(src) });
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
  'a $ref leaving the standard': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.properties.decisionId = { $ref: 'https://example.org/schemas/graph.schema.json#/definitions/id' }; }), /\$ref leaves/],
  'a $ref fragment that does not resolve': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.properties.decisionId = { $ref: 'https://schemas.ectropy.ai/_definitions/record-id.schema.json#/nope' }; }), /fragment does not resolve/],
  'an $id that is not the served URL': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s.$id = 'https://schemas.ectropy.ai/pm/other.schema.json'; }), /\$id must be/],
  'how a value is computed, in public text': [(d) => edit(d, 'voxel/voxel-group.schema.json', (s) => { s.properties.memberCount.description = 'Members, computed at write time.'; s.version = '9.9.9'; }), /names how a value is computed/],
  'non-validating authoring metadata': [(d) => edit(d, 'pm/decision.schema.json', (s) => { s['x-authoring'] = {}; }), /carries x-authoring/],
  'a file not in canonical form': [(d) => writeFileSync(join(d, 'pm/decision.schema.json'), JSON.stringify(JSON.parse(readFileSync(join(d, 'pm/decision.schema.json'), 'utf8')))), /canonical form/],
  'a record id that is not an https URI on its issuer\'s domain': [(d) => edit(d, 'examples/pm/example.decision.json', (s) => { s.$id = 'urn:example:pm-decision:1'; }), /fails pm\/decision/],
  'an example its schema rejects': [(d) => edit(d, 'examples/flow/example.tag-binding.json', (s) => { s.unexpected = true; }), /fails flow\/tag-binding/],
  'an example missing from the manifest': [(d) => writeFileSync(join(d, 'examples/flow/example.extra.json'), '{}\n'), /not listed in examples\/manifest.json/],
  'a greenhouse-gas split that does not add up': [(d) => edit(d, 'examples/_definitions/example.ghg-mass.json', (s) => { s.split.fossil = 2; }), /splits into parts adding to/],
  'a lot with no facility': [(d) => edit(d, 'examples/flow/example.logistic-unit-lot.json', (s) => { delete s.contents[0].originFacility; }), /fails flow\/logistic-unit/],
  'a custody event that is not a transformation': [(d) => edit(d, 'examples/flow/example.custody-event.json', (s) => { s.type = 'ObjectEvent'; }), /fails flow\/custody-event/],
  'a tariff schedule naming a period it does not define': [(d) => edit(d, 'examples/flow/example.utility-tariff.sheet.json', (s) => { s.energyWeekdaySchedule[0][12] = 2; }), /names period 2, which energyRateStructure does not define/],
  'a tariff rate per a unit other than its charge': [(d) => edit(d, 'examples/flow/example.utility-tariff.sheet.json', (s) => { s.fixedChargeFirstMeter.denominator = 'KWH'; }), /fails flow\/utility-tariff/],
  'a database tariff with no record label': [(d) => edit(d, 'examples/flow/example.utility-tariff.urdb.json', (s) => { delete s.source.urdbLabel; }), /fails flow\/utility-tariff/],
  'a dynamic tariff with no market price': [(d) => edit(d, 'examples/flow/example.utility-tariff.sheet.json', (s) => { s.pricing = 'dynamic'; }), /fails flow\/utility-tariff/],
  'a contracted demand with no capacity': [(d) => edit(d, 'examples/flow/example.utility-tariff.sheet.json', (s) => { s.demandBasis = 'contracted'; }), /fails flow\/utility-tariff/],
  'a market-based grid factor with no instrument': [(d) => edit(d, 'examples/flow/example.grid-factor.residual-mix.json', (s) => { delete s.instrument; }), /fails flow\/grid-factor/],
  'an energy reading in a non-energy unit': [(d) => edit(d, 'examples/flow/example.energy-reading.machine.json', (s) => { s.energy.uom = 'KGM'; }), /fails flow\/energy-reading/],
  'a published version changed without a bump': [(d) => edit(d, 'flow/tag-binding.schema.json', (s) => { s.description += ' Edited.'; }), /changed without a version bump/],
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

test('a changed schema with a new version passes', () => {
  const dir = copy();
  try {
    edit(dir, 'flow/tag-binding.schema.json', (s) => { s.description += ' Edited.'; s.version = '0.2.1'; });
    const r = run(dir);
    assert.equal(r.status, 0, r.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
