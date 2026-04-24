import { describe, it, expect } from 'vitest';
import type { SuccessPattern, PatternOutcomeProfile } from '../types/success-pattern.types.js';

const minOutcome: PatternOutcomeProfile = {
  expectedSuccessRate: 0.87,
};

const eigenVec = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.85, 0.75] as const;

describe('SuccessPattern', () => {
  it('constructs minimal valid object', () => {
    const pat: SuccessPattern = {
      $id: 'urn:luhtech:project:success-pattern:PAT-2026-0001',
      schemaVersion: '3.0.0',
      contextSignature: eigenVec,
      actionType: 'approve',
      outcomeProfile: minOutcome,
      confidence: 0.9,
      frequency: 12,
    };
    expect(pat.schemaVersion).toBe('3.0.0');
    expect(pat.confidence).toBe(0.9);
    expect(pat.frequency).toBe(12);
  });

  it('constructs maximal valid object with every optional field', () => {
    const pat: SuccessPattern = {
      $id: 'urn:luhtech:project:success-pattern:PAT-2026-0002',
      schemaVersion: '3.0.0',
      contextSignature: eigenVec,
      classification: 'LEAD',
      actionType: 'approve',
      actionTemplate: {
        type: 'approve',
        parameters: { budgetLimit: 5000 },
        constraints: ['must-have-photos'],
      },
      outcomeProfile: {
        expectedSuccessRate: 0.92,
        expectedImprovement: 1.15,
        variance: 0.05,
        bestCase: 0.98,
        worstCase: 0.75,
      },
      confidence: 0.9,
      frequency: 12,
      successCount: 11,
      lastApplied: '2026-04-20T14:00:00Z',
      lastUpdated: '2026-04-23T08:00:00Z',
      contextBreadth: 0.6,
      sourceDecisions: ['urn:luhtech:project:decision-event:DEV-2026-0001'],
      decayFactor: 0.95,
      halfLifeDays: 180,
      projectId: 'canadian-plant-pilot',
      isGlobal: false,
      domain: 'construction-commercial',
      tags: ['MEP', 'material-substitution'],
      validationGates: { succeeded: true, replicable: true, generalizable: true, significant: true },
      mergeHistory: [{ timestamp: '2026-04-01T00:00:00Z', mergedPatternUrn: 'urn:luhtech:x:success-pattern:PAT-X', resultingConfidence: 0.9 }],
      graphMetadata: { inEdges: [], outEdges: [] },
    };
    expect(pat.classification).toBe('LEAD');
    expect(pat.domain).toBe('construction-commercial');
    expect(pat.validationGates?.succeeded).toBe(true);
    expect(pat.mergeHistory).toHaveLength(1);
  });

  it('readonly enforcement — @ts-expect-error on mutation', () => {
    const pat: SuccessPattern = {
      $id: 'urn:luhtech:x:success-pattern:PAT-001',
      schemaVersion: '3.0.0',
      contextSignature: eigenVec,
      actionType: 'approve',
      outcomeProfile: { expectedSuccessRate: 0.8 },
      confidence: 0.8,
      frequency: 1,
    };
    // @ts-expect-error — confidence is readonly
    pat.confidence = 0.99;
  });
});
