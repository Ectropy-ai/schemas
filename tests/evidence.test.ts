import { describe, it, expect } from 'vitest';
import type { Evidence, EvidenceLocation } from '../types/evidence.types.js';

describe('EvidenceLocation', () => {
  it('constructs minimal valid object', () => {
    const loc: EvidenceLocation = { lat: 49.2194, lng: -122.5984 };
    expect(loc.lat).toBe(49.2194);
    expect(loc.lng).toBe(-122.5984);
  });

  it('constructs maximal valid object', () => {
    const loc: EvidenceLocation = { lat: 49.2194, lng: -122.5984, accuracy: 2.5 };
    expect(loc.accuracy).toBe(2.5);
  });
});

describe('Evidence', () => {
  it('constructs minimal valid object', () => {
    const ev: Evidence = {
      $id: 'urn:luhtech:project:evidence:EV-001',
      type: 'photo',
      uri: 's3://ectropy-staging-configs/evidence/EV-001.jpg',
      hash: 'a'.repeat(64),
      timestamp: '2026-04-23T09:15:00Z',
      capturedBy: 'urn:luhtech:project:participant:lisa-chen',
    };
    expect(ev.$id).toBe('urn:luhtech:project:evidence:EV-001');
    expect(ev.hash).toHaveLength(64);
  });

  it('constructs maximal valid object with every optional field', () => {
    const ev: Evidence = {
      $id: 'urn:luhtech:project:evidence:EV-002',
      type: 'measurement',
      uri: 'https://ectropy.ai/evidence/EV-002.json',
      hash: 'b'.repeat(64),
      timestamp: '2026-04-23T10:00:00Z',
      capturedBy: 'urn:luhtech:project:participant:james-okafor',
      description: 'Structural clearance measurement at Grid B3',
      location: { lat: 49.2194, lng: -122.5984, accuracy: 1.0 },
      metadata: { instrument: 'laser-rangefinder', unit: 'mm', value: 230 },
    };
    expect(ev.description).toBe('Structural clearance measurement at Grid B3');
    expect(ev.location?.accuracy).toBe(1.0);
    expect(ev.metadata?.['value']).toBe(230);
  });

  it('readonly enforcement — @ts-expect-error on mutation', () => {
    const ev: Evidence = {
      $id: 'urn:luhtech:x:evidence:E',
      type: 'photo',
      uri: 's3://bucket/key',
      hash: 'a'.repeat(64),
      timestamp: '2026-01-01T00:00:00Z',
      capturedBy: 'urn:luhtech:x:participant:p',
    };
    // @ts-expect-error — $id is readonly
    ev.$id = 'urn:luhtech:x:evidence:mutated';
  });
});
