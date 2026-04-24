/**
 * Extensible authority labeling. The 0..6 numeric AuthorityLevel
 * scale (defined in agent-tool.ts) is canonical and universal.
 * Labels for each level are extensible per domain.
 *
 * Each domain context package publishes its own AuthorityLabelMap
 * constant. GENERIC is the default when no domain context applies.
 */

import type { AuthorityLevel } from './agent-tool.js';

export interface AuthorityLabelMap {
  readonly domain: string;
  readonly labels: Readonly<Record<AuthorityLevel, string>>;
  readonly description?: string;
}

/** Default labels — current v0.3.0 names. Used for portal/anonymous
 *  flows, generic agent operations, or cases without domain context. */
export const GENERIC_AUTHORITY: AuthorityLabelMap = {
  domain: 'generic',
  labels: {
    0: 'anonymous',
    1: 'field',
    2: 'project',
    3: 'company',
    4: 'architect',
    5: 'owner',
    6: 'founder',
  },
  description: 'Generic LuhTech authority labels (v0.3.0 default scale)',
};
