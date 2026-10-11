// Shared by check, build-types and build-site: what the standard is, read from the tree.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const BASE = 'https://schemas.ectropy.ai/';
export const DRAFT7 = 'http://json-schema.org/draft-07/schema#';

// Never part of the standard: tooling, fixtures, build output.
const NOT_SCHEMAS = new Set(['.git', '.github', 'node_modules', '_vendor', 'examples', 'scripts', 'dist', '_site']);

// Product-mechanism schemas that live in the private registry. Their presence here is a leak.
export const PROPRIETARY = [
  'decision/sdi-snapshot.schema.json',
  'decision/success-pattern.schema.json',
  'decision/decision-event.schema.json',
  'efas/eigenmode-forecast.schema.json',
  'authority/authority-level.schema.json',
  'govsx/authority-tier.schema.json',
];

/** Every *.schema.json in the standard, as sorted posix paths relative to the repo root. */
export function schemaFiles(dir = ROOT) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (dir === ROOT && NOT_SCHEMAS.has(name)) continue;
      out.push(...schemaFiles(full));
    } else if (name.endsWith('.schema.json')) {
      out.push(relative(ROOT, full).split(sep).join('/'));
    }
  }
  return out.sort();
}

export const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
export const load = (rel) => JSON.parse(read(rel));
export const canonical = (value) => JSON.stringify(value, null, 2) + '\n';
export const idOf = (rel) => BASE + rel;
export const relOf = (id) => (id.startsWith(BASE) ? id.slice(BASE.length) : null);
