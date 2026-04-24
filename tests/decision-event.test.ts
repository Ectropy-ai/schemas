import { describe, it, expect } from 'vitest';
import type {
  DecisionEvent,
  DecisionTrigger,
  DecisionStateSnapshot,
  DecisionEngine1Output,
  DecisionEngine2Output,
  DecisionMediation,
  DecisionTriggerContext,
} from '../types/decision-event.types.js';

const eigenVec = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.85, 0.75] as const;

const minTrigger: DecisionTrigger = {
  type: 'exception',
  source: 'clash-detection-service',
  urgency: 0.85,
};

const minState: DecisionStateSnapshot = {
  sdi: 15000,
  eigenmodes: eigenVec,
  activeConstraints: ['schedule-look-ahead-4'],
  resourceAvailability: {},
};

const minEngine1: DecisionEngine1Output = {};

const minEngine2: DecisionEngine2Output = {};

const minMediation: DecisionMediation = {
  selectedAction: { actionType: 'approve' },
  sourceEngine: 'engine1',
  rationale: 'Pattern match confidence 0.92 exceeds threshold',
  explorationAllocation: 0.1,
};

function makeMinimalEvent(): DecisionEvent {
  return {
    $id: 'urn:luhtech:canadian-plant-pilot:decision-event:DEV-2026-0001',
    schemaVersion: '4.0.0',
    domain: 'construction-commercial',
    timestamp: '2026-04-23T10:00:00Z',
    projectId: 'canadian-plant-pilot',
    actorId: 'urn:luhtech:canadian-plant-pilot:participant:lisa-chen',
    trigger: minTrigger,
    state: minState,
    engine1: minEngine1,
    engine2: minEngine2,
    mediation: minMediation,
  };
}

describe('DecisionEvent — minimal', () => {
  it('constructs minimal valid object (required fields only)', () => {
    const ev = makeMinimalEvent();
    expect(ev.schemaVersion).toBe('4.0.0');
    expect(ev.domain).toBe('construction-commercial');
    expect(ev.trigger.type).toBe('exception');
  });
});

describe('DecisionEvent — maximal', () => {
  it('constructs maximal valid object with every optional field', () => {
    const ev: DecisionEvent = {
      ...makeMinimalEvent(),
      agentType: 'PLATFORM',
      zoneId: 'ZONE-D',
      phaseId: 'MEP-ROUGH-IN',
      linkedMilestoneUrn: 'urn:luhtech:canadian-plant-pilot:milestone:M-003',
      linkedFeatureUrn: 'urn:luhtech:ectropy:feature:F-007',
      classification: 'LEAD',
      authorityLevel: 3,
      dependsOn: ['urn:luhtech:canadian-plant-pilot:decision-event:DEV-2026-0000'],
      blocks: ['urn:luhtech:canadian-plant-pilot:decision-event:DEV-2026-0002'],
      trigger: {
        ...minTrigger,
        deadline: '2026-04-24T17:00:00Z',
        context: {
          decisionType: 'APPROVAL',
          voxelRef: 'urn:luhtech:canadian-plant-pilot:voxel:VOX-ZONE-D-36-30-12',
          title: 'HVAC Supply Duct Routing Conflict',
          criticalPath: true,
          lookAheadWeek: 4,
        },
      },
      state: {
        ...minState,
        sdiClassification: 'HEALTHY',
        eigenmodeLabels: ['schedule', 'budget', 'quality', 'safety', 'scope', 'resource', 'risk', 'dependency', 'authority', 'pattern', 'entropy', 'stability'],
        downstreamDependencies: ['urn:luhtech:canadian-plant-pilot:decision-event:DEV-2026-0002'],
      },
      engine1: {
        applicablePatterns: [{
          patternUrn: 'urn:luhtech:project:success-pattern:PAT-001',
          actionType: 'approve',
          confidence: 0.92,
          frequency: 12,
          similarityScore: 0.91,
        }],
        confidence: 0.92,
        queryLatencyMs: 45,
      },
      engine2: { viableOptions: [], computationDepth: 3, generationLatencyMs: 120 },
      mediation: {
        ...minMediation,
        decisionPath: 1,
        selectedPatternUrn: 'urn:luhtech:project:success-pattern:PAT-001',
        monitoringTriggers: [{
          id: 'mon-001',
          type: 'sdi_breach',
          condition: { metric: 'sdi', operator: '<', threshold: 1000 },
          response: 'fallback',
          checkIntervalMs: 60000,
        }],
      },
      outcome: {
        timestamp: '2026-04-23T10:05:00Z',
        success: true,
        actualVsProjected: 0.95,
        learningsExtracted: ['MEP reroute at Grid C3 viable within same takt zone'],
        compressionEligible: true,
        milestoneUpdated: true,
      },
      graphMetadata: {
        inEdges: ['urn:luhtech:canadian-plant-pilot:voxel:VOX-ZONE-D-36-30-12'],
        outEdges: ['urn:luhtech:canadian-plant-pilot:consequence:CONSQ-001'],
      },
    };
    expect(ev.authorityLevel).toBe(3);
    expect(ev.classification).toBe('LEAD');
    expect(ev.outcome?.success).toBe(true);
    expect(ev.state.eigenmodeLabels).toHaveLength(12);
    expect(ev.mediation.decisionPath).toBe(1);
  });
});

describe('DecisionEvent — domain extensibility', () => {
  it('trigger.context accepts arbitrary domain-specific properties while universal fields stay typed', () => {
    const constructionContext: DecisionTriggerContext = {
      decisionType: 'APPROVAL',
      voxelRef: 'urn:luhtech:project:voxel:VOX-001',
      title: 'HVAC Duct Reroute',
      criticalPath: true,
      lookAheadWeek: 4,
      budgetEstimated: 45000,
      trade: 'MEP',
      clashSeverity: 'HIGH',
    };

    const ev: DecisionEvent = {
      ...makeMinimalEvent(),
      domain: 'construction-commercial',
      trigger: { ...minTrigger, context: constructionContext },
    };

    expect(ev.domain).toBe('construction-commercial');
    expect(ev.trigger.context?.['decisionType']).toBe('APPROVAL');
    expect(ev.trigger.context?.['budgetEstimated']).toBe(45000);
    expect(ev.trigger.context?.['trade']).toBe('MEP');
    // Universal fields remain typed
    expect(ev.schemaVersion).toBe('4.0.0');
    expect(typeof ev.actorId).toBe('string');
  });
});

describe('DecisionEvent — readonly enforcement', () => {
  it('@ts-expect-error on $id mutation', () => {
    const ev = makeMinimalEvent();
    // @ts-expect-error — $id is readonly
    ev.$id = 'urn:luhtech:x:decision-event:mutated';
  });

  it('@ts-expect-error on domain mutation', () => {
    const ev = makeMinimalEvent();
    // @ts-expect-error — domain is readonly
    ev.domain = 'farming';
  });
});
