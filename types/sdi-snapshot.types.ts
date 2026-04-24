/**
 * Solution Density Index snapshot. Captures the state of decision
 * space density at a point in time. Works at any scale — project,
 * regional, planetary (per GAIA model).
 *
 * Promoted from sdi-snapshot.schema.json (v3.0.0).
 */

import type { Urn, GraphMetadata } from './graph-metadata.types.js';

export type SdiClassification = 'critical' | 'warning' | 'healthy' | 'abundant';

export interface SdiComponents {
  readonly viablePathCount: number;
  readonly constraintCount: number;
  readonly resourceSlackRatio: number;    // 0..1
  readonly eigenmodeStability: number;    // 0..1
  readonly dependencyDepth?: number;
  readonly criticalPathSlack?: number;    // hours
}

export interface SdiThresholds {
  readonly critical: number;
  readonly warning: number;
  readonly healthy: number;
  readonly abundant: number;
}

export interface SdiTrend {
  readonly direction: 'increasing' | 'stable' | 'decreasing' | 'volatile';
  readonly velocity?: number;
  readonly projectedClassificationChange?: 'upgrade' | 'stable' | 'downgrade';
  readonly historicalWindow?: number; // days
}

export interface SdiBudgetBreakdown {
  readonly sdiFactor: number;       // 0..1 contribution
  readonly stabilityFactor: number; // 0..1 contribution
  readonly resourceFactor: number;  // 0..1 contribution
}

export interface SdiConstraint {
  readonly id: string;
  readonly type: string;
  readonly severity: number;    // 0..1
  readonly description?: string;
}

export interface SdiSnapshot {
  readonly $id: Urn;        // urn:luhtech:{venture}:sdi-snapshot:SDI-YYYY-NNNN
  readonly schemaVersion: '3.0.0';
  readonly timestamp: string;
  readonly projectId: string;
  readonly zoneId?: string;
  readonly sdiValue: number;            // raw SDI count
  readonly sdiLog?: number;             // log10(SDI)
  readonly shannonEntropy?: number;     // log2(SDI)
  readonly classification: SdiClassification;
  readonly explorationBudget?: number;  // 0..1
  readonly components: SdiComponents;
  readonly thresholds?: SdiThresholds;
  readonly trend?: SdiTrend;
  readonly budgetBreakdown?: SdiBudgetBreakdown;
  readonly eigenmodeVector?: readonly number[];  // length 12
  readonly constraints?: readonly SdiConstraint[];
  readonly triggeredBy?: string;
  readonly linkedDecisionEvent?: Urn;
  readonly graphMetadata?: GraphMetadata;
}
