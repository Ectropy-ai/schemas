/**
 * @fileoverview IFC extraction data shapes — the structured output of the
 * IFC Extraction Service (F-04). Consumed by the BOX voxelization engine.
 *
 * Contract guarantees:
 *   - All elements have a non-empty guid
 *   - All elements have a SystemType value (never null)
 *   - All elements have a level name (never null, never empty string)
 *   - bbox: min values strictly less than max values on all axes
 *   - GUIDs are unique within a single manifest
 *   - storeys are ordered ascending by elevation
 *   - Manifests are cached by IFC file SHA256 to avoid redundant parsing
 *
 * Extracted from apps/api-gateway/src/intake/interfaces/ifc-extraction.interface.ts
 * during F-2 schema extraction (2026-04-18).
 */

import type { IFCDiscipline, SystemType } from './bundle.types.js';

export interface BBox3D {
  min_x: number; max_x: number;
  min_y: number; max_y: number;
  min_z: number; max_z: number;
}

export interface StoreyRecord {
  name: string;
  elevation: number;
  z_min: number;
  z_max: number;
}

export interface IFCElement {
  /** IFC GlobalId — permanent identifier, unique within the building model. */
  guid: string;
  /** IFC entity type string e.g. 'IfcWall', 'IfcDuctSegment'. */
  ifc_type: string;
  /** Building system classification. */
  system: SystemType;
  /** Storey name from IfcBuildingStorey e.g. 'Level 1', 'Roof'. Never empty. */
  level: string;
  /** Storey elevation in metres above datum. */
  level_elevation: number;
  /** World-space bounding box in metres (Speckle coordinate system). */
  bbox: BBox3D;
  /** Additional IFC attributes (material, fire rating, grid ref, etc.). */
  attributes: Record<string, unknown>;
}

export interface ElementManifest {
  ifc_filename: string;
  discipline: IFCDiscipline;
  /** ISO 8601 timestamp of extraction. */
  parsed_at: string;
  storey_count: number;
  /** Storeys ordered ascending by elevation. */
  storeys: StoreyRecord[];
  element_count: number;
  elements: IFCElement[];
}
