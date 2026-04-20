/**
 * @fileoverview CORE voxel geometry types for ectropy-ai/core.
 *
 * Source of truth: prisma/schema.prisma
 *   - Voxel model       (lines 802-898, 43 fields total in Prisma)
 *   - VoxelGrid model   (lines 901-934, 19 fields in Prisma, F-5 addition)
 *
 * VoxelGeometry is the 24-field CORE subset of Voxel. IMPL fields
 * (decision_count, percent_complete, cost, schedule, relations,
 * voxel_grid_id, parent_voxel_id, created_at, updated_at) stay in
 * Ectropy-Business on the VoxelFull shape.
 *
 * VoxelGridRecord is the full VoxelGrid row shape (one-to-one mapping).
 *
 * Line references are point-in-time at extraction (2026-04-21); the Prisma
 * model name is the stable citation.
 */

// ─── DB CHECK-constraint enums (voxel_grids_*_check) ────────────────────────

/** Grid lifecycle. Mirrors DB CHECK (status IN (...)). */
export type VoxelGridStatus = 'PENDING' | 'GENERATING' | 'COMPLETE' | 'FAILED';

/** Resolution tier. Mirrors DB CHECK (resolution_tier IN (...)). */
export type VoxelGridResolutionTier = 'COARSE' | 'STANDARD' | 'FINE';

/** Source data type. Mirrors DB CHECK (source_type IN (...)). */
export type VoxelGridSourceType = 'BIM' | 'SCAN' | 'MANUAL';

/**
 * PostGIS geometry(PointZ, 0) serialized as WKT string.
 *
 * DB column type: `geometry(PointZ, 0)`. In Prisma this is
 * `Unsupported("geometry(PointZ, 0)")`.
 *
 * Read path: `SELECT ST_AsText(geom) AS geom FROM voxels` →
 *   'POINT Z (x y z)' string.
 *
 * Write path: INSERT via SQL expression
 *   `ST_SetSRID(ST_MakePoint(coord_x, coord_y, coord_z), 0)`.
 *
 * Nullable for rows that pre-date the F-5 backfill (no longer possible
 * on staging or production after the 2026-04-20 migration).
 */
export type GeomPointZ = string | null;

// ─── VoxelGeometry — CORE 24-field subset of the voxels table ──────────────

/**
 * CORE 24-field geometry shape of a single voxel.
 *
 * Corresponds to prisma/schema.prisma `model Voxel` (@@map("voxels")).
 * IMPL fields — decision/cost/schedule/relations/grid FK — are excluded
 * and live on `VoxelFull` in Ectropy-Business.
 */
export interface VoxelGeometry {
  /** Primary key, uuid. Source: Voxel.id. */
  id: string;

  /** Globally unique URN. Source: Voxel.urn (VARCHAR(200), @unique). */
  urn: string;

  /** FK to projects table. Source: Voxel.project_id. */
  project_id: string;

  /** Human-readable slug e.g. 'VOX-L2-MECH-047'. Source: Voxel.voxel_id. */
  voxel_id: string;

  /**
   * Work lifecycle enum. Source: Voxel.status (VoxelStatus Prisma enum).
   * Canonical values: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETE' | 'BLOCKED'.
   * Typed as string here to keep @ectropy/schemas decoupled from
   * Prisma-generated enum namespaces.
   */
  status: string;

  /**
   * Operational health. Source: Voxel.health_status (VoxelHealthStatus enum).
   * Typed as string for the same decoupling reason as `status`.
   */
  health_status: string;

  /** Voxel centroid X in metres. Source: Voxel.coord_x. */
  coord_x: number;
  /** Voxel centroid Y in metres. Source: Voxel.coord_y. */
  coord_y: number;
  /** Voxel centroid Z in metres. Source: Voxel.coord_z. */
  coord_z: number;

  /** Voxel edge length in metres. Source: Voxel.resolution. */
  resolution: number;

  /** AABB minimum X in metres. Source: Voxel.min_x. */
  min_x: number;
  /** AABB maximum X in metres. Source: Voxel.max_x. */
  max_x: number;
  /** AABB minimum Y in metres. Source: Voxel.min_y. */
  min_y: number;
  /** AABB maximum Y in metres. Source: Voxel.max_y. */
  max_y: number;
  /** AABB minimum Z in metres. Source: Voxel.min_z. */
  min_z: number;
  /** AABB maximum Z in metres. Source: Voxel.max_z. */
  max_z: number;

  /** Building name (free-text). Source: Voxel.building (VARCHAR(100), nullable). */
  building: string | null;
  /** Storey name from IFC e.g. 'Level 1'. Source: Voxel.level (VARCHAR(50), nullable). */
  level: string | null;
  /** Zone identifier (free-text). Source: Voxel.zone (VARCHAR(100), nullable). */
  zone: string | null;
  /** Room identifier. Source: Voxel.room (VARCHAR(100), nullable). */
  room: string | null;
  /** Grid cross-reference e.g. 'B3'. Source: Voxel.grid_reference. */
  grid_reference: string | null;

  /**
   * System classification. Source: Voxel.system (VARCHAR(50), nullable).
   * DB column is free-text. Canonical values emitted by the F-3 IFC
   * Extraction Service are SystemType ('ARCH' | 'STRUCT' | 'HVAC' |
   * 'PLUMB' | 'ELEC' | 'CIVIL' | 'UNKNOWN' — see ./bundle.types).
   */
  system: string | null;

  /**
   * Array of IFC GlobalIds whose bboxes contributed to this voxel cell.
   * Source: Voxel.ifc_elements (text[], @default([])).
   */
  ifc_elements: string[];

  /**
   * PostGIS PointZ(SRID=0) geometry, WKT-serialized via ST_AsText.
   * Source: Voxel.geom (Unsupported("geometry(PointZ, 0)"), F-5 addition).
   */
  geom: GeomPointZ;
}

// ─── VoxelGridRecord — full row shape of voxel_grids table ──────────────────

/**
 * Full row shape of a voxel_grids record.
 *
 * Corresponds to prisma/schema.prisma `model VoxelGrid` (@@map("voxel_grids")).
 * One row per voxelization run per project per (resolution_tier, source_type).
 * Written by Stage 4 IFC Ingestion during the Intake Pipeline (F-5).
 */
export interface VoxelGridRecord {
  /** Primary key, uuid. Source: VoxelGrid.id. */
  id: string;

  /** FK to projects table. Source: VoxelGrid.project_id. */
  project_id: string;

  /**
   * Speckle stream identifier if sourced from Speckle.
   * Source: VoxelGrid.stream_id (TEXT, NOT NULL — empty string if none).
   */
  stream_id: string;

  /** Speckle object identifier within the stream. Source: VoxelGrid.object_id. */
  object_id: string | null;

  /** Coordinate reference system units; default 'meters'. Source: VoxelGrid.crs_units. */
  crs_units: string;

  /** Grid bbox minimum X in metres. Source: VoxelGrid.bbox_min_x. */
  bbox_min_x: number | null;
  /** Grid bbox maximum X in metres. Source: VoxelGrid.bbox_max_x. */
  bbox_max_x: number | null;
  /** Grid bbox minimum Y in metres. Source: VoxelGrid.bbox_min_y. */
  bbox_min_y: number | null;
  /** Grid bbox maximum Y in metres. Source: VoxelGrid.bbox_max_y. */
  bbox_max_y: number | null;
  /** Grid bbox minimum Z in metres. Source: VoxelGrid.bbox_min_z. */
  bbox_min_z: number | null;
  /** Grid bbox maximum Z in metres. Source: VoxelGrid.bbox_max_z. */
  bbox_max_z: number | null;

  /** Voxel edge length in metres; default 0.1. Source: VoxelGrid.resolution. */
  resolution: number;

  /** Resolution tier (DB-enforced). Source: VoxelGrid.resolution_tier. */
  resolution_tier: VoxelGridResolutionTier;

  /** Source type (DB-enforced). Source: VoxelGrid.source_type. */
  source_type: VoxelGridSourceType;

  /** Grid lifecycle status (DB-enforced). Source: VoxelGrid.status. */
  status: VoxelGridStatus;

  /**
   * Count of voxels in the grid. Null while status='PENDING' or 'GENERATING'.
   * Source: VoxelGrid.voxel_count (Int?).
   */
  voxel_count: number | null;

  /** Timestamp when the grid finished generating. Source: VoxelGrid.generated_at. */
  generated_at: Date | null;

  /** Row creation timestamp. Source: VoxelGrid.created_at. */
  created_at: Date;

  /** Row last-updated timestamp. Source: VoxelGrid.updated_at. */
  updated_at: Date;
}
