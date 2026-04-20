/**
 * @fileoverview CORE Speckle stream registry type for ectropy-ai/core.
 *
 * Source of truth: prisma/schema.prisma
 *   - SpeckleStream model (line 542, 6 fields + 1 relation)
 *
 * Mirrors the active monolith schema (minimal shape). The alternative
 * richer shape in prisma/schema.shared.prisma (with tenantId, commitId,
 * branchName, serverUrl, objectCount, lastSync) is NOT used — that file
 * is an emerging split not yet wired into the running app
 * (confirmed 2026-04-21 during F-6 SP1 ground truth).
 *
 * The `project` relation is excluded from CORE; it belongs on the
 * Ectropy-Business SpeckleStreamFull extension.
 */

/**
 * Full CORE row shape of a speckle_streams record.
 *
 * Corresponds to prisma/schema.prisma `model SpeckleStream`
 * (@@map("speckle_streams")). Thin registry mapping external Speckle
 * stream IDs to Ectropy project scope. Written by Stage 4 IFC Ingestion
 * via upsert on stream_id.
 */
export interface SpeckleStreamRecord {
  /** Primary key, uuid. Source: SpeckleStream.id. */
  id: string;

  /**
   * FK to projects table (note: column name differs from other models,
   * which use project_id). Source: SpeckleStream.construction_project_id.
   */
  construction_project_id: string;

  /**
   * External Speckle server stream identifier.
   * Source: SpeckleStream.stream_id (VARCHAR(255), @unique — globally unique
   * across the DB, not scoped to project).
   */
  stream_id: string;

  /**
   * Human-readable stream name from Speckle.
   * Source: SpeckleStream.stream_name (VARCHAR(500), NOT NULL).
   */
  stream_name: string;

  /** Row creation timestamp. Source: SpeckleStream.created_at. */
  created_at: Date;

  /** Row last-updated timestamp. Source: SpeckleStream.updated_at. */
  updated_at: Date;
}
