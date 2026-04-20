/**
 * @fileoverview CORE IFC file metadata type for ectropy-ai/core.
 *
 * Source of truth: prisma/schema.prisma
 *   - UploadedIfcFile model (line 408, 9 fields + 2 relations)
 *
 * Only defined in prisma/schema.prisma — no alternate shape in
 * schema.shared.prisma.
 *
 * Relations (project, uploader) are excluded from CORE; they belong
 * on the Ectropy-Business UploadedIfcFileFull extension.
 */

/**
 * Full CORE row shape of an uploaded_ifc_files record.
 *
 * Corresponds to prisma/schema.prisma `model UploadedIfcFile`
 * (@@map("uploaded_ifc_files")). Tracks the lifecycle of an IFC
 * file from upload through extraction.
 */
export interface UploadedIfcFileRecord {
  /** Primary key, uuid. Source: UploadedIfcFile.id. */
  id: string;

  /** FK to projects table. Source: UploadedIfcFile.project_id. */
  project_id: string;

  /**
   * FK to the user who uploaded the file. Nullable for system-sourced
   * files (e.g. demo bundle fixtures, CI test uploads).
   * Source: UploadedIfcFile.user_id (UUID, nullable).
   */
  user_id: string | null;

  /** Original uploaded filename. Source: UploadedIfcFile.file_name (VARCHAR(255)). */
  file_name: string;

  /**
   * Storage path (S3/Spaces key, or local path during dev).
   * Source: UploadedIfcFile.file_path (VARCHAR(500)).
   */
  file_path: string;

  /**
   * File size in bytes. Source: UploadedIfcFile.file_size (BigInt).
   *
   * Prisma's BigInt deserializes to `bigint` from the DB; JSON wire-format
   * serializations emit `number` (safe for IFC files up to ~9 PB; practical
   * limit is the filesystem, not the type). Consumers should accept either.
   */
  file_size: bigint | number;

  /**
   * MIME type e.g. 'application/x-step', 'application/octet-stream'.
   * Source: UploadedIfcFile.mime_type (VARCHAR(100)).
   */
  mime_type: string;

  /**
   * Upload lifecycle. Free-text in DB, canonical values:
   *   'pending' (default) → 'uploaded' → 'parsed' / 'failed'.
   * Source: UploadedIfcFile.upload_status (VARCHAR(50), @default("pending")).
   */
  upload_status: string;

  /** Upload timestamp. Source: UploadedIfcFile.uploaded_at. */
  uploaded_at: Date;
}
