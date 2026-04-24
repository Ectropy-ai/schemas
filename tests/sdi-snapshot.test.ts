import { describe, it, expect } from 'vitest';
import type {
  SdiSnapshot,
  SdiComponents,
  SdiClassification,
} from '../types/sdi-snapshot.types.js';

const minComponents: SdiComponents = {
  viablePathCount: 47,
  constraintCount: 3,
  resourceSlackRatio: 0.72,
  eigenmodeStability: 0.88,
};

describe('SdiComponents', () => {
  it('constructs minimal valid object', () => {
    expect(minComponents.viablePathCount).toBe(47);
    expect(minComponents.resourceSlackRatio).toBe(0.72);
  });

  it('constructs maximal valid object', () => {
    const c: SdiComponents = {
      ...minComponents,
      dependencyDepth: 4,
      criticalPathSlack: 72.5,
    };
    expect(c.dependencyDepth).toBe(4);
    expect(c.criticalPathSlack).toBe(72.5);
  });
});

describe('SdiSnapshot', () => {
  const classification: SdiClassification = 'healthy';

  it('constructs minimal valid object', () => {
    const snap: SdiSnapshot = {
      $id: 'urn:luhtech:project:sdi-snapshot:SDI-2026-0001',
      schemaVersion: '3.0.0',
      timestamp: '2026-04-23T08:00:00Z',
      projectId: 'canadian-plant-pilot',
      sdiValue: 15000,
      classification,
      components: minComponents,
    };
    expect(snap.schemaVersion).toBe('3.0.0');
    expect(snap.sdiValue).toBe(15000);
    expect(snap.classification).toBe('healthy');
  });

  it('constructs maximal valid object with every optional field', () => {
    const snap: SdiSnapshot = {
      $id: 'urn:luhtech:project:sdi-snapshot:SDI-2026-0002',
      schemaVersion: '3.0.0',
      timestamp: '2026-04-23T09:00:00Z',
      projectId: 'canadian-plant-pilot',
      zoneId: 'ZONE-D',
      sdiValue: 25000,
      sdiLog: 4.4,
      shannonEntropy: 14.6,
      classification: 'abundant',
      explorationBudget: 0.75,
      components: minComponents,
      thresholds: { critical: 100, warning: 1000, healthy: 10000, abundant: 100000 },
      trend: { direction: 'increasing', velocity: 0.12, projectedClassificationChange: 'stable', historicalWindow: 7 },
      budgetBreakdown: { sdiFactor: 0.4, stabilityFactor: 0.35, resourceFactor: 0.25 },
      eigenmodeVector: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.85, 0.75],
      constraints: [{ id: 'c1', type: 'schedule', severity: 0.3, description: 'look-ahead conflict' }],
      triggeredBy: 'zone-analysis-service',
      linkedDecisionEvent: 'urn:luhtech:project:decision-event:DEV-2026-0001',
      graphMetadata: { inEdges: [], outEdges: [] },
    };
    expect(snap.eigenmodeVector).toHaveLength(12);
    expect(snap.trend?.direction).toBe('increasing');
    expect(snap.budgetBreakdown?.sdiFactor).toBe(0.4);
  });

  it('readonly enforcement — @ts-expect-error on mutation', () => {
    const snap: SdiSnapshot = {
      $id: 'urn:luhtech:x:sdi-snapshot:SDI-001',
      schemaVersion: '3.0.0',
      timestamp: '2026-01-01T00:00:00Z',
      projectId: 'test',
      sdiValue: 1000,
      classification: 'warning',
      components: minComponents,
    };
    // @ts-expect-error — sdiValue is readonly
    snap.sdiValue = 9999;
  });
});
