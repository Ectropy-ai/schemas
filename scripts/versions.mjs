// Every version of every schema the standard has published, read from git history since the
// 1.0.0 release (the first at https://schemas.ectropy.ai/), plus the working tree. A version is
// immutable: one schema version has exactly one content. build-site serves each at
// v/{version}/{path}; check fails when a schema's content changes without a version bump.
import { execFileSync } from 'node:child_process';
import { NOT_SCHEMAS, ROOT, canonical, load, schemaFiles } from './lib.mjs';

export const SINCE = 'v1.0.0';

/**
 * Schemas withdrawn from the standard before anyone adopted them. No version of a withdrawn
 * schema is served at any path, and the immutability check ignores its history.
 */
export const WITHDRAWN = new Set(['surface/surface-registry.schema.json']);

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });
const isSchema = (rel) => rel.endsWith('.schema.json') && !NOT_SCHEMAS.has(rel.split('/')[0]) && rel.includes('/') && !WITHDRAWN.has(rel);

/** { published: Map<"path@version", {rel, version, text, from}>, conflicts: string[] } */
export function publishedVersions() {
  try {
    git('rev-parse', '--verify', '--quiet', `${SINCE}^{commit}`);
  } catch {
    throw new Error(`tag ${SINCE} is not in this clone -- check out with full history and tags (fetch-depth: 0)`);
  }
  const commits = [git('rev-parse', `${SINCE}^{commit}`).trim(), ...git('rev-list', '--reverse', '--first-parent', `${SINCE}..HEAD`).split('\n').filter(Boolean)];
  const states = commits.map((c) => ({
    from: c.slice(0, 12),
    files: git('ls-tree', '-r', '--name-only', c).split('\n').filter(isSchema).map((rel) => [rel, JSON.parse(git('show', `${c}:${rel}`))]),
  }));
  states.push({ from: 'working tree', files: schemaFiles().map((rel) => [rel, load(rel)]) });

  const published = new Map();
  const conflicts = [];
  for (const { from, files } of states) {
    for (const [rel, schema] of files) {
      const key = `${rel}@${schema.version}`;
      const text = canonical(schema);
      const seen = published.get(key);
      if (!seen) published.set(key, { rel, version: schema.version, text, from });
      else if (seen.text !== text) conflicts.push(`${rel}: version ${schema.version} changed without a version bump (published at ${seen.from}, differs at ${from})`);
    }
  }
  return { published, conflicts: [...new Set(conflicts)] };
}
