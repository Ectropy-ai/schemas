/**
 * Universal evidence record. Every domain has evidence; the universal
 * structure carries SHA-256 chain of custody, capture timestamp,
 * actor, and optional geographic location. Each domain defines its
 * own typed evidence subtype with a constrained `type` enum.
 */

import type { Urn } from './graph-metadata.types.js';

export interface EvidenceLocation {
  readonly lat: number;
  readonly lng: number;
  readonly accuracy?: number; // meters
}

export interface Evidence {
  readonly $id: Urn;
  readonly type: string;       // domain-defined enum string
  readonly uri: string;        // storage URI (s3://, https://, ipfs://, etc.)
  readonly hash: string;       // SHA-256 hex of the artifact
  readonly timestamp: string;  // ISO 8601 — when captured
  readonly capturedBy: Urn;
  readonly description?: string;
  readonly location?: EvidenceLocation;
  readonly metadata?: Record<string, unknown>;
}
