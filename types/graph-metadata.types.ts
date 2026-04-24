/**
 * Universal graph traversal metadata. Used by every persisted entity
 * in the LuhTech ecosystem to enable bidirectional graph queries.
 */

export type Urn = string; // urn:luhtech:{venture}:{type}:{id}

export interface GraphEdge {
  readonly from: Urn;
  readonly to: Urn;
  readonly type: string;       // open vocabulary, domain-defined
  readonly weight?: number;    // 0..1
  readonly label?: string;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt?: string; // ISO 8601
}

export interface GraphMetadata {
  readonly inEdges: readonly Urn[];
  readonly outEdges: readonly Urn[];
  readonly edges?: readonly GraphEdge[];
  readonly linkedMilestone?: Urn; // v3.1
  readonly linkedFeature?: Urn;   // v3.1
}
