import { describe, it, expect } from 'vitest';
import {
  LICENSE_TIERS,
  AUTHORITY_LEVELS,
  type LicenseTier,
  type AuthorityLevel,
} from '../types/agent-tool.js';

describe('LICENSE_TIERS', () => {
  it('has all 5 keys (0–4)', () => {
    const keys = Object.keys(LICENSE_TIERS).map(Number) as LicenseTier[];
    expect(keys).toHaveLength(5);
    expect(keys).toContain(0);
    expect(keys).toContain(1);
    expect(keys).toContain(2);
    expect(keys).toContain(3);
    expect(keys).toContain(4);
  });

  it('labels match spec', () => {
    expect(LICENSE_TIERS[0].label).toBe('anonymous');
    expect(LICENSE_TIERS[1].label).toBe('free');
    expect(LICENSE_TIERS[2].label).toBe('professional');
    expect(LICENSE_TIERS[3].label).toBe('enterprise');
    expect(LICENSE_TIERS[4].label).toBe('admin');
  });

  it('all entries have non-empty description', () => {
    for (const tier of [0, 1, 2, 3, 4] as LicenseTier[]) {
      expect(LICENSE_TIERS[tier].description.length).toBeGreaterThan(0);
    }
  });
});

describe('AUTHORITY_LEVELS', () => {
  it('has all 7 keys (0–6)', () => {
    const keys = Object.keys(AUTHORITY_LEVELS).map(Number) as AuthorityLevel[];
    expect(keys).toHaveLength(7);
    expect(keys).toContain(0);
    expect(keys).toContain(1);
    expect(keys).toContain(2);
    expect(keys).toContain(3);
    expect(keys).toContain(4);
    expect(keys).toContain(5);
    expect(keys).toContain(6);
  });

  it('labels match spec', () => {
    expect(AUTHORITY_LEVELS[0].label).toBe('anonymous');
    expect(AUTHORITY_LEVELS[1].label).toBe('field');
    expect(AUTHORITY_LEVELS[2].label).toBe('project');
    expect(AUTHORITY_LEVELS[3].label).toBe('company');
    expect(AUTHORITY_LEVELS[4].label).toBe('architect');
    expect(AUTHORITY_LEVELS[5].label).toBe('owner');
    expect(AUTHORITY_LEVELS[6].label).toBe('founder');
  });

  it('all entries have non-empty description', () => {
    for (const level of [0, 1, 2, 3, 4, 5, 6] as AuthorityLevel[]) {
      expect(AUTHORITY_LEVELS[level].description.length).toBeGreaterThan(0);
    }
  });
});
