# ectropy-ai/schemas (public)

Public schema surface for Ectropy, LuhTech Holdings' construction intelligence platform.
Canonical `$id`/`$schema` namespace is `schemas.luh.tech/ectropy/**`; see "Serving" below
for how that domain is actually populated.

## Scope — explicit allow-list, not inherited

A schema is public here **only because it's been named public** in
`luh-tech/schema-registry`'s classification manifest (`schemas/schema-classification.json`,
role, `audience: public`) — never by default, never because it happened to be in a prior
repo. Default is private. Everything in this repo is data-structure/interchange-shape;
nothing here is a decision algorithm, scoring model, or routing logic — see the
open-core boundary test in the classification manifest.

## Contents (last updated 2026-07-14)

| File | `$id` | version |
|---|---|---|
| `voxel/voxel-v3.schema.json` | `https://schemas.luh.tech/ectropy/voxel/voxel-v3.schema.json` | 1.2.0 |
| `voxel/voxel-group.schema.json` | `https://schemas.luh.tech/ectropy/voxel/voxel-group.schema.json` | 1.1.1 |
| `pm/decision.schema.json` | `https://schemas.luh.tech/ectropy/pm/decision.schema.json` | 1.0.0 |
| `pm/consequence.schema.json` | `https://schemas.luh.tech/ectropy/pm/consequence.schema.json` | 1.0.0 |
| `pm/inspection.schema.json` | `https://schemas.luh.tech/ectropy/pm/inspection.schema.json` | 1.0.0 |
| `pm/participant.schema.json` | `https://schemas.luh.tech/ectropy/pm/participant.schema.json` | 1.0.0 |
| `pm/schedule-proposal.schema.json` | `https://schemas.luh.tech/ectropy/pm/schedule-proposal.schema.json` | 1.0.0 |
| `surface/surface-registry.schema.json` | `https://schemas.luh.tech/ectropy/surface/surface-registry.schema.json` | 1.0.0 |

`voxel/*` carried over unchanged from this repo's prior identity (see Provenance).
`pm/*` relocated from `luh-tech/schema-registry`'s `schemas/pm/` — their `$id` changed
from `.../pm/<name>.schema.json` to `.../ectropy/pm/<name>.schema.json` to match this
repo's serving prefix; no other content change. `voxel-group`'s `groupId` docstring was
reconciled to deployed reality (hash-slug, not human-readable) in v1.1.1 (2026-07-08).
`surface/surface-registry.schema.json` was added 2026-07-13, promoting a schema that
EB's `web-dashboard` surface-registry instance had already been declaring against
without a canonical landing.

**Note:** the deploy workflow's push trigger (`.github/workflows/deploy-pages.yml`)
watches `pm/**` and `voxel/**` only — it does not currently list `surface/**`, so a
`surface/*` change won't auto-fire a Pages deploy without `workflow_dispatch` or a
trigger-path update.

## Serving

This repo's own GitHub Pages workflow (`deploy-pages.yml`) publishes to its default
`ectropy-ai.github.io/schemas/ectropy/**` URL only — it does not claim any custom domain
(the old CNAME/domain-claim step was removed 2026-07-09, commit `5b04325`). The custom
domain `schemas.luh.tech` is served by `luh-tech/schema-registry` under the ratified
SR-private-Pages architecture (`d-2026-07-06-sr-private-pages-serving`): SR checks out
this repo and rsyncs it into its own `_site/ectropy/`. `$id`/`$schema` values here still
point at `schemas.luh.tech/ectropy/**` because that's the canonical identity regardless
of which Pages deploy physically serves it.

## Provenance

This repo is a clean recreate. The prior `ectropy-ai/schemas` (containing, alongside
public content, 6 product-mechanism schemas that should never have been in a public
repo) is archived, unchanged, at `ectropy-ai/schemas-archived-2026-07-05` — every prior
commit, including `f846c082710a6ad7d1c1a84d45f69a76a3899777`, remains reachable there
indefinitely. This repo's history starts clean, from this commit, containing only the
classified-public set. No git history was rewritten anywhere; the old repo was renamed
and preserved, not deleted or force-pushed.

Part of `d-2026-07-05-eas-proprietary-recreate`, Stage 2 of 5.

Enterprise Excellence. Schema-First. No Shortcuts.
