# ectropy-ai/schemas (public)

Public schema surface for Ectropy, LuhTech Holdings' construction intelligence platform.
Serves `schemas.luh.tech/ectropy/**`.

## Scope — explicit allow-list, not inherited

A schema is public here **only because it's been named public** in
`luh-tech/schema-registry`'s classification manifest (`schemas/schema-classification.json`,
role, `audience: public`) — never by default, never because it happened to be in a prior
repo. Default is private. Everything in this repo is data-structure/interchange-shape;
nothing here is a decision algorithm, scoring model, or routing logic — see the
open-core boundary test in the classification manifest.

## Contents (as of 2026-07-05, this repo's genesis)

| File | `$id` |
|---|---|
| `voxel/voxel-v3.schema.json` | `https://schemas.luh.tech/ectropy/voxel/voxel-v3.schema.json` |
| `voxel/voxel-group.schema.json` | `https://schemas.luh.tech/ectropy/voxel/voxel-group.schema.json` |
| `pm/decision.schema.json` | `https://schemas.luh.tech/ectropy/pm/decision.schema.json` |
| `pm/consequence.schema.json` | `https://schemas.luh.tech/ectropy/pm/consequence.schema.json` |
| `pm/inspection.schema.json` | `https://schemas.luh.tech/ectropy/pm/inspection.schema.json` |
| `pm/participant.schema.json` | `https://schemas.luh.tech/ectropy/pm/participant.schema.json` |
| `pm/schedule-proposal.schema.json` | `https://schemas.luh.tech/ectropy/pm/schedule-proposal.schema.json` |

`voxel/*` carried over unchanged from this repo's prior identity (see Provenance).
`pm/*` relocated from `luh-tech/schema-registry`'s `schemas/pm/` — their `$id` changed
from `.../pm/<name>.schema.json` to `.../ectropy/pm/<name>.schema.json` to match this
repo's serving prefix; no other content change.

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
