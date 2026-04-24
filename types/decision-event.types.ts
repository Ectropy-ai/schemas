/**
 * THE universal immutable decision event.
 *
 * Every domain (construction-commercial, construction-residential,
 * farming, planetary, research-protocol, carbon-mrv, etc.) writes
 * decisions into this same shape.
 *
 * Domain-specific data rides in trigger.context and
 * mediation.selectedAction.parameters, typed by the domain's
 * separately-published context schema package.
 *
 * Required `domain` field discriminates context interpretation.
 *
 * Append-only. All fields readonly. Immutability is structural.
 *
 * Promoted from decision-event.schema.v3.1.json with one addition:
 * the required `domain` discriminator field.
 */

import type { Urn, GraphMetadata } from './graph-metadata.types.js';
import type { AuthorityLevel } from './agent-tool.js';

export type DecisionAgentType = 'PLATFORM' | 'TENANT';
export type DecisionClassification = 'LEAD' | 'DERIVED' | 'EXTERNAL' | 'FLEXIBLE';
export type DecisionTriggerType = 'scheduled' | 'exception' | 'opportunity' | 'escalation';
export type DecisionEngineSource = 'engine1' | 'engine2' | 'blend' | 'escalate';
export type DecisionRiskLevel = 'low' | 'medium' | 'high';
export type DecisionRiskOverall = 'low' | 'medium' | 'high' | 'critical';
export type DecisionMonitoringResponse =
  | 'fallback' | 'escalate' | 'constrain' | 're_mediate' | 'alert';
export type DecisionMonitoringType =
  | 'sdi_breach' | 'timeline_deviation' | 'resource_exhaustion'
  | 'cascade_detection' | 'confidence_collapse' | 'scope_creep' | 'dependency_block';
export type SdiClassificationLabel = 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'ABUNDANT';

export interface DecisionTriggerContext {
  readonly milestoneId?: string;
  readonly featureId?: string;
  readonly schemaPath?: string;
  readonly impactedFiles?: readonly string[];
  // Open: domain context packages add typed payloads
  readonly [key: string]: unknown;
}

export interface DecisionTrigger {
  readonly type: DecisionTriggerType;
  readonly source: string;
  readonly urgency: number;     // 0..1
  readonly deadline?: string;   // ISO 8601
  readonly context?: DecisionTriggerContext;
}

export interface DecisionResourceAvailability {
  readonly laborSlack?: number;
  readonly materialSlack?: number;
  readonly equipmentSlack?: number;
  readonly budgetSlack?: number;
  readonly slackRatio?: number;           // combined 0..1
  readonly effortHoursRemaining?: number; // v3.1
  readonly daysToDeadline?: number;       // v3.1
}

export interface DecisionStateSnapshot {
  readonly sdi: number;
  readonly sdiClassification?: SdiClassificationLabel;
  readonly eigenmodes: readonly number[];       // length 12
  readonly eigenmodeLabels?: readonly string[]; // length 12, v3.1
  readonly activeConstraints: readonly string[];
  readonly resourceAvailability: DecisionResourceAvailability;
  readonly downstreamDependencies?: readonly Urn[];
  readonly upstreamDecisions?: readonly Urn[];
}

export interface DecisionAction {
  readonly actionType: string;
  readonly targetUrn?: Urn;
  readonly parameters?: Record<string, unknown>;
  readonly estimatedDuration?: number;           // hours
  readonly estimatedCost?: number;               // USD
  readonly impactedMilestones?: readonly Urn[];  // v3.1
}

export interface DecisionProjectedOutcome {
  readonly successProbability?: number;
  readonly expectedImprovement?: number;
  readonly variance?: number;
  readonly confidenceInterval?: {
    readonly lower: number;
    readonly upper: number;
  };
}

export interface DecisionPatternSummary {
  readonly patternUrn: Urn;
  readonly actionType: string;
  readonly confidence: number;
  readonly frequency: number;
  readonly similarityScore?: number;
  readonly classification?: DecisionClassification;
}

export interface DecisionEngine1Output {
  readonly applicablePatterns?: readonly DecisionPatternSummary[];
  readonly patternMatchScores?: readonly number[];
  readonly confidence?: number;
  readonly recommendedAction?: DecisionAction;
  readonly projectedOutcome?: DecisionProjectedOutcome;
  readonly queryLatencyMs?: number;
  readonly selectedPatternUrn?: Urn; // v3.1
}

export interface DecisionOption {
  readonly id: string;
  readonly action?: DecisionAction;
  readonly isNovel?: boolean;
  readonly projectedSdi?: number;
  readonly riskLevel?: DecisionRiskLevel;
  readonly explorationValue?: number;
}

export interface DecisionRiskFactor {
  readonly name: string;
  readonly severity: number;    // 0..1
  readonly probability: number; // 0..1
  readonly mitigation?: string;
}

export interface DecisionRiskProfile {
  readonly overallRisk: DecisionRiskOverall;
  readonly factors?: readonly DecisionRiskFactor[];
}

export interface DecisionEngine2Output {
  readonly viableOptions?: readonly DecisionOption[];
  readonly novelOptions?: readonly DecisionOption[];
  readonly sdiProjections?: Record<string, number>;
  readonly riskProfiles?: Record<string, DecisionRiskProfile>;
  readonly explorationValue?: Record<string, number>;
  readonly computationDepth?: number;
  readonly generationLatencyMs?: number;
}

export interface DecisionMonitoringCondition {
  readonly metric: string;
  readonly operator: '<' | '>' | '<=' | '>=' | '==' | '!=';
  readonly threshold: number;
}

export interface DecisionMonitoringTrigger {
  readonly id: string;
  readonly type: DecisionMonitoringType;
  readonly condition?: DecisionMonitoringCondition;
  readonly response?: DecisionMonitoringResponse;
  readonly checkIntervalMs?: number;
}

export interface DecisionMediation {
  readonly selectedAction: DecisionAction;
  readonly sourceEngine: DecisionEngineSource;
  readonly rationale: string;
  readonly explorationAllocation: number; // 0..1
  readonly riskBearer?: string;
  readonly monitoringTriggers?: readonly DecisionMonitoringTrigger[];
  readonly fallbackAction?: DecisionAction;
  readonly escalationTarget?: string;
  readonly decisionPath?: 1 | 2 | 3 | 4 | 5;
  readonly selectedPatternUrn?: Urn; // v3.1
}

export interface DecisionDownstreamEffect {
  readonly affectedEntity: Urn;
  readonly effectType: string;
  readonly magnitude?: number;
}

export interface DecisionOutcome {
  readonly timestamp: string;
  readonly success: boolean;
  readonly actualVsProjected?: number; // -1..1
  readonly downstreamEffects?: readonly DecisionDownstreamEffect[];
  readonly learningsExtracted?: readonly string[];
  readonly compressionEligible?: boolean;
  readonly validationConfidence?: number;
  readonly patternUrn?: Urn;
  readonly milestoneUpdated?: boolean; // v3.1
}

export interface DecisionEvent {
  readonly $id: Urn;               // urn:luhtech:{project}:decision-event:DEV-YYYY-NNNN
  readonly schemaVersion: '4.0.0';
  readonly domain: string;         // discriminator: 'construction-commercial' | 'farming' | 'planetary' | etc.
  readonly timestamp: string;      // ISO 8601 — event creation
  readonly projectId: string;
  readonly agentType?: DecisionAgentType;
  readonly zoneId?: string;
  readonly phaseId?: string;
  readonly actorId: Urn;

  // v3.1 milestone/feature linkage
  readonly linkedMilestoneUrn?: Urn;
  readonly linkedFeatureUrn?: Urn;

  // v3.1 atomic reference strategy
  readonly classification?: DecisionClassification;
  readonly authorityLevel?: AuthorityLevel; // 0..6

  // v3.1 dependency chain
  readonly dependsOn?: readonly Urn[];
  readonly blocks?: readonly Urn[];

  // Dual-process decision capture
  readonly trigger: DecisionTrigger;
  readonly state: DecisionStateSnapshot;
  readonly engine1: DecisionEngine1Output;
  readonly engine2: DecisionEngine2Output;
  readonly mediation: DecisionMediation;

  // Filled when execution completes (or appended as separate event)
  readonly outcome?: DecisionOutcome;

  readonly graphMetadata?: GraphMetadata;
}
