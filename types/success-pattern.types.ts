/**
 * Compressed validated decision pattern (Success Stack entry).
 * Reusable wisdom extracted from successful outcomes.
 *
 * Promoted from success-pattern.schema.json (v3.0.0).
 */

import type { Urn, GraphMetadata } from './graph-metadata.types.js';

export type PatternClassification = 'LEAD' | 'DERIVED' | 'EXTERNAL' | 'FLEXIBLE';

export interface PatternOutcomeProfile {
  readonly expectedSuccessRate: number; // 0..1
  readonly expectedImprovement?: number;
  readonly variance?: number;
  readonly bestCase?: number;
  readonly worstCase?: number;
}

export interface PatternActionTemplate {
  readonly type: string;
  readonly parameters?: Record<string, unknown>;
  readonly constraints?: readonly string[];
}

export interface PatternValidationGates {
  readonly succeeded: boolean;
  readonly replicable: boolean;
  readonly generalizable: boolean;
  readonly significant: boolean;
}

export interface PatternMergeRecord {
  readonly timestamp: string;
  readonly mergedPatternUrn: Urn;
  readonly resultingConfidence: number;
}

export interface SuccessPattern {
  readonly $id: Urn;      // urn:luhtech:{venture}:success-pattern:PAT-YYYY-NNNN
  readonly schemaVersion: '3.0.0';
  readonly contextSignature: readonly number[]; // length 12 (eigenmode vector)
  readonly classification?: PatternClassification;
  readonly actionType: string;
  readonly actionTemplate?: PatternActionTemplate;
  readonly outcomeProfile: PatternOutcomeProfile;
  readonly confidence: number;            // 0..1, decays over time
  readonly frequency: number;             // applications count
  readonly successCount?: number;
  readonly lastApplied?: string;
  readonly lastUpdated?: string;
  readonly contextBreadth?: number;       // 0..1, specificity
  readonly sourceDecisions?: readonly Urn[];
  readonly decayFactor?: number;          // 0..1
  readonly halfLifeDays?: number;
  readonly projectId?: string;
  readonly isGlobal?: boolean;
  readonly domain?: string;
  readonly tags?: readonly string[];
  readonly validationGates?: PatternValidationGates;
  readonly mergeHistory?: readonly PatternMergeRecord[];
  readonly graphMetadata?: GraphMetadata;
}
