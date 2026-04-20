/**
 * @fileoverview CORE construction element type for ectropy-ai/core.
 *
 * Source of truth: prisma/schema.prisma
 *   - ConstructionElement model (line 387, 10 fields + 2 relations)
 *   - ElementStatus enum         (line 175, 7 values)
 *
 * Mirrors the active monolith schema (snake_case column names).
 * The alternative shape in prisma/schema.shared.prisma is NOT used —
 * that file is an emerging split not yet wired into the running app
 * (confirmed 2026-04-21 during F-6 SP1 ground truth).
 *
 * Relations (project, creator) are excluded from CORE — they belong
 * on the Ectropy-Business ConstructionElementFull extension.
 */

/**
 * Element lifecycle enum. Mirrors prisma `enum ElementStatus` (line 175).
 * DB column uses these lowercase string literals.
 */
export type ElementStatus =
  | 'planned'
  | 'design_approved'
  | 'procurement'
  | 'in_progress'
  | 'completed'
  | 'on_hold'
  | 'rejected';

/**
 * Full CORE row shape of a construction_elements record.
 *
 * Corresponds to prisma/schema.prisma `model ConstructionElement`
 * (@@map("construction_elements")). BIM elements extracted from IFC.
 */
export interface ConstructionElementRecord {
  /** Primary key, uuid. Source: ConstructionElement.id. */
  id: string;

  /** FK to projects table. Source: ConstructionElement.project_id. */
  project_id: string;

  /**
   * IFC entity type e.g. 'IfcWall', 'IfcDuctSegment'.
   * Source: ConstructionElement.element_type (VARCHAR(100)).
   */
  element_type: string;

  /**
   * Human-readable element name (free-text).
   * Source: ConstructionElement.element_name (VARCHAR(255), NOT NULL).
   */
  element_name: string;

  /**
   * IFC GlobalId if element originated from an IFC import.
   * Source: ConstructionElement.ifc_id (VARCHAR(255), nullable).
   */
  ifc_id: string | null;

  /**
   * Element-specific properties (material, dimensions, fire rating, etc.).
   * Source: ConstructionElement.properties (JsonB, @default("{}")).
   */
  properties: Record<string, unknown>;

  /**
   * Element lifecycle status. Source: ConstructionElement.status
   * (ElementStatus Prisma enum, @default(planned)).
   */
  status: ElementStatus;

  /**
   * FK to user who created the element row. Nullable for system-imported
   * elements. Source: ConstructionElement.created_by (UUID, nullable).
   */
  created_by: string | null;

  /** Row creation timestamp. Source: ConstructionElement.created_at. */
  created_at: Date;

  /** Row last-updated timestamp. Source: ConstructionElement.updated_at. */
  updated_at: Date;
}
