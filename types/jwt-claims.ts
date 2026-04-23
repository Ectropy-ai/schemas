import type { LicenseTier, AuthorityLevel } from './agent-tool.js';

/**
 * Canonical claim shapes for LuhTech MCP servers.
 *
 * Two token types at the edge:
 *   - LuhTechUserClaims  → long-lived, server-held, full scopes, may be admin
 *   - LuhTechViewerToken → short-lived, browser-held, narrowed scopes, never admin
 *
 * Forwarded to Tier 1 services via X-* headers (see INTERNAL_CLAIM_HEADERS).
 */

export type TokenType = 'user' | 'viewer';

/** Base claims common to both token types */
interface BaseLuhTechClaims {
  sub: string;                    // user id
  tenant_id: string;
  license_tier: LicenseTier;
  authority_level: AuthorityLevel;
  scopes: string[];
  iat: number;
  exp: number;
}

/**
 * Long-lived user session token.
 * Server-held (httpOnly cookie, session store, or API client state).
 * NEVER exposed to browser JavaScript.
 * Carries full scopes. May carry is_admin=true for @luh.tech staff.
 */
export interface LuhTechUserClaims extends BaseLuhTechClaims {
  token_type: 'user';
  email: string;
  is_admin: boolean;
}

/**
 * Viewer Service Token (VST). Short-lived, browser-held.
 * Minted server-side from a LuhTechUserClaims JWT via POST /viewer-token.
 * Scopes narrowed to viewer-safe operations.
 * is_admin ALWAYS false — admin operations stay server-side.
 */
export interface LuhTechViewerToken extends BaseLuhTechClaims {
  token_type: 'viewer';
  parent_jti: string;             // JTI of the user JWT this was minted from (audit)
  is_admin: false;                // literal false — VST can never carry admin
}

/** Discriminated union of valid claim shapes at the MCP edge */
export type LuhTechClaims = LuhTechUserClaims | LuhTechViewerToken;

/** Default VST TTL — 60 minutes, matches typical viewer session */
export const VST_DEFAULT_TTL_SECONDS = 3600;

/** Header names for claims forwarded from MCP to Tier 1 services */
export const INTERNAL_CLAIM_HEADERS = {
  TENANT_ID: 'X-Tenant-Id',
  AUTHORITY_LEVEL: 'X-Authority-Level',
  LICENSE_TIER: 'X-License-Tier',
  IS_ADMIN: 'X-Is-Admin',
  TOKEN_TYPE: 'X-Token-Type',
  SUB: 'X-User-Sub',
} as const;

/** Shared-secret header for MCP → Tier 1 service authentication */
export const INTERNAL_SERVICE_TOKEN_HEADER = 'X-Internal-Service-Token';
