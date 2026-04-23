import { describe, it, expect } from 'vitest';
import {
  VST_DEFAULT_TTL_SECONDS,
  INTERNAL_CLAIM_HEADERS,
  INTERNAL_SERVICE_TOKEN_HEADER,
  type LuhTechClaims,
  type LuhTechUserClaims,
  type LuhTechViewerToken,
} from '../types/jwt-claims.js';

// ── Compile-time guard ───────────────────────────────────────────────────────
// LuhTechViewerToken['is_admin'] must be the literal type false, never boolean.
// If this line fails to compile, the type regressed to boolean.
// @ts-expect-error — assigning true to LuhTechViewerToken['is_admin'] must be a type error
const _vstIsAdminGuard: LuhTechViewerToken['is_admin'] = true;
void _vstIsAdminGuard;

describe('VST_DEFAULT_TTL_SECONDS', () => {
  it('equals 3600', () => {
    expect(VST_DEFAULT_TTL_SECONDS).toBe(3600);
  });
});

describe('INTERNAL_CLAIM_HEADERS', () => {
  it('has all required keys', () => {
    expect(INTERNAL_CLAIM_HEADERS).toHaveProperty('TENANT_ID');
    expect(INTERNAL_CLAIM_HEADERS).toHaveProperty('AUTHORITY_LEVEL');
    expect(INTERNAL_CLAIM_HEADERS).toHaveProperty('LICENSE_TIER');
    expect(INTERNAL_CLAIM_HEADERS).toHaveProperty('IS_ADMIN');
    expect(INTERNAL_CLAIM_HEADERS).toHaveProperty('TOKEN_TYPE');
    expect(INTERNAL_CLAIM_HEADERS).toHaveProperty('SUB');
  });

  it('header values are X-prefixed strings', () => {
    for (const value of Object.values(INTERNAL_CLAIM_HEADERS)) {
      expect(value).toMatch(/^X-/);
    }
  });
});

describe('INTERNAL_SERVICE_TOKEN_HEADER', () => {
  it('is the correct header name', () => {
    expect(INTERNAL_SERVICE_TOKEN_HEADER).toBe('X-Internal-Service-Token');
  });
});

describe('LuhTechClaims discriminated union', () => {
  const baseClaims = {
    sub: 'user-abc',
    tenant_id: 'tenant-demo',
    license_tier: 2 as const,
    authority_level: 4 as const,
    scopes: ['materials:read', 'cost:read'],
    iat: 1_700_000_000,
    exp: 1_700_086_400,
  };

  const userClaims: LuhTechClaims = {
    ...baseClaims,
    token_type: 'user',
    email: 'erik@luh.tech',
    is_admin: true,
  };

  const viewerToken: LuhTechClaims = {
    ...baseClaims,
    token_type: 'viewer',
    parent_jti: 'parent-jti-xyz',
    is_admin: false,
  };

  it('user token_type narrows to LuhTechUserClaims and exposes email + is_admin', () => {
    if (userClaims.token_type === 'user') {
      // TypeScript narrows to LuhTechUserClaims — email and is_admin are accessible
      expect(userClaims.email).toBe('erik@luh.tech');
      expect(userClaims.is_admin).toBe(true);
    } else {
      throw new Error('Expected token_type to be user');
    }
  });

  it('viewer token_type narrows to LuhTechViewerToken and exposes parent_jti', () => {
    if (viewerToken.token_type === 'viewer') {
      // TypeScript narrows to LuhTechViewerToken — parent_jti accessible, is_admin is false
      expect(viewerToken.parent_jti).toBe('parent-jti-xyz');
      expect(viewerToken.is_admin).toBe(false);
    } else {
      throw new Error('Expected token_type to be viewer');
    }
  });

  it('viewer is_admin is always false at runtime', () => {
    const vst: LuhTechViewerToken = {
      ...baseClaims,
      token_type: 'viewer',
      parent_jti: 'pjti-1',
      is_admin: false,
    };
    expect(vst.is_admin).toBe(false);
    expect(vst.is_admin).not.toBe(true);
  });

  it('base claims are present on both token types', () => {
    for (const claims of [userClaims, viewerToken]) {
      expect(claims.sub).toBe('user-abc');
      expect(claims.tenant_id).toBe('tenant-demo');
      expect(claims.license_tier).toBe(2);
      expect(claims.authority_level).toBe(4);
      expect(claims.scopes).toContain('materials:read');
    }
  });
});
