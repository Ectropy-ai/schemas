/**
 * Canonical tool interface for all LuhTech MCP servers.
 * Platform MCP (CIS, port 3002) and SEPPÄ MCP (port 3003) both consume this.
 *
 * Auth model: three-layer
 *   - Edge (MCP): user JWT or VST validated, claims extracted
 *   - Service (Tier 1): shared-secret trust, claims forwarded as headers
 *   - Data (PG): RLS policies enforce tenant isolation
 *
 * Tool execution gating:
 *   - minLicenseTier checked at tool-list time (visibility)
 *   - minAuthorityLevel + scopes checked at tool-call time (permission)
 *   - viewerCallable checked at tool-call time if token_type === 'viewer'
 *   - Admin (@luh.tech, user JWT only) bypasses both if adminBypass is true
 */

import type { Tool } from '@anthropic-ai/sdk/resources/messages';

export type LicenseTier = 0 | 1 | 2 | 3 | 4;
// 0 anonymous, 1 free, 2 professional, 3 enterprise, 4 admin

export type AuthorityLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
// 0 anonymous, 1 field, 2 project, 3 company, 4 architect, 5 owner, 6 founder

export type ToolCategory =
  // Platform MCP categories (CIS)
  | 'materials' | 'cost' | 'labor' | 'carbon'
  | 'compliance' | 'permit' | 'weather' | 'voxel'
  // SEPPÄ MCP categories (Ectropy-specific)
  | 'decision' | 'schedule' | 'consequence' | 'graph' | 'rag' | 'deliverable'
  // Shared
  | 'core';

export interface AgentTool extends Tool {
  /** Snake_case tool name, unique within an MCP server */
  name: string;

  /** Human-readable description for agent consumption */
  description: string;

  /** Tool category — used for grouping and discovery */
  category: ToolCategory;

  /** Which backend service powers this tool (e.g., 'bpc-service', 'cost-service', 'mcp-internal') */
  service: string;

  /** Backend endpoint path if service is external (e.g., '/api/v1/bpc/resolve') */
  endpoint?: string;

  /** Minimum license tier required to see this tool in tool-list responses */
  minLicenseTier: LicenseTier;

  /** Minimum authority level required to execute this tool */
  minAuthorityLevel?: AuthorityLevel;

  /** OAuth-style scopes required (e.g., ['materials:read', 'materials:write']) */
  scopes: string[];

  /** If true, results are scoped to the caller's tenant_id. Data-layer RLS also enforced. */
  tenantScoped: boolean;

  /** If true (default), admin tier (4) bypasses all gates. Applies only to user JWTs — VSTs cannot carry admin. */
  adminBypass: boolean;

  /**
   * Can this tool be called with a Viewer Service Token (VST)?
   *   true  = browser/viewer context can invoke (SEPPÄ chat, BIM overlay, mobile field app)
   *   false = server-only (bulk operations, admin actions, sensitive mutations)
   *
   * Independent of license tier. A tier-1 read tool may still be !viewerCallable
   * if it's sensitive enough to require a server-held user JWT.
   */
  viewerCallable: boolean;

  /** JSON Schema for input — required by MCP protocol */
  input_schema: Tool['input_schema'];
}

/** Canonical license tier metadata */
export const LICENSE_TIERS: Record<LicenseTier, { label: string; description: string }> = {
  0: { label: 'anonymous', description: 'No authentication — health endpoints only' },
  1: { label: 'free', description: 'Self-signup, self-hosted — read-only intelligence' },
  2: { label: 'professional', description: 'Subscription tier — read + AI-driven writes' },
  3: { label: 'enterprise', description: 'Subscription tier — bulk ops, multi-project' },
  4: { label: 'admin', description: '@luh.tech staff — bypass all gates (user JWT only)' },
};

/** Canonical authority level metadata */
export const AUTHORITY_LEVELS: Record<AuthorityLevel, { label: string; description: string }> = {
  0: { label: 'anonymous', description: 'Not authenticated' },
  1: { label: 'field', description: 'Field worker — read site-relevant data' },
  2: { label: 'project', description: 'Project role — project-scoped read/write' },
  3: { label: 'company', description: 'Company-wide read + project write' },
  4: { label: 'architect', description: 'Cross-project technical decisions' },
  5: { label: 'owner', description: 'Owner-level approvals' },
  6: { label: 'founder', description: 'Full portfolio access (Erik)' },
};
