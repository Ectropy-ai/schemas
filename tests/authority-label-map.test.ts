import { describe, it, expect } from 'vitest';
import {
  GENERIC_AUTHORITY,
  type AuthorityLabelMap,
} from '../types/authority-label-map.types.js';

describe('AuthorityLabelMap', () => {
  it('constructs minimal valid object', () => {
    const map: AuthorityLabelMap = {
      domain: 'test',
      labels: {
        0: 'anon', 1: 'field', 2: 'project', 3: 'company',
        4: 'architect', 5: 'owner', 6: 'founder',
      },
    };
    expect(map.domain).toBe('test');
    expect(map.labels[0]).toBe('anon');
  });

  it('constructs maximal valid object with every optional field', () => {
    const map: AuthorityLabelMap = {
      domain: 'construction-commercial',
      labels: {
        0: 'FIELD', 1: 'FOREMAN', 2: 'SUPERINTENDENT', 3: 'PM',
        4: 'ARCHITECT', 5: 'OWNER', 6: 'REGULATORY',
      },
      description: 'Commercial construction 7-tier cascade',
    };
    expect(map.description).toBe('Commercial construction 7-tier cascade');
    expect(map.labels[6]).toBe('REGULATORY');
  });

  it('readonly enforcement — @ts-expect-error on mutation', () => {
    const map: AuthorityLabelMap = {
      domain: 'x',
      labels: { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g' },
    };
    // @ts-expect-error — domain is readonly
    map.domain = 'y';
  });
});

describe('GENERIC_AUTHORITY', () => {
  it('has all 7 keys (0..6)', () => {
    const keys = Object.keys(GENERIC_AUTHORITY.labels).map(Number);
    expect(keys).toHaveLength(7);
    for (let i = 0; i <= 6; i++) expect(keys).toContain(i);
  });

  it('domain is generic', () => {
    expect(GENERIC_AUTHORITY.domain).toBe('generic');
  });

  it('labels match v0.3.0 names', () => {
    expect(GENERIC_AUTHORITY.labels[0]).toBe('anonymous');
    expect(GENERIC_AUTHORITY.labels[1]).toBe('field');
    expect(GENERIC_AUTHORITY.labels[2]).toBe('project');
    expect(GENERIC_AUTHORITY.labels[3]).toBe('company');
    expect(GENERIC_AUTHORITY.labels[4]).toBe('architect');
    expect(GENERIC_AUTHORITY.labels[5]).toBe('owner');
    expect(GENERIC_AUTHORITY.labels[6]).toBe('founder');
  });
});
