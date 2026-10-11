# Changelog

## Unreleased

- This repository no longer publishes to npm. `@ectropy/schemas` is the Universal Decision Log (0.4.x lineage); the 1.0.0 published from here on 2026-10-11 was an error and is deprecated.

## 1.0.0

The standard moves to its own home, https://schemas.ectropy.ai/, and this repository becomes the only source of the schemas, the site and the package.

**Breaking**

- **Identifiers.** Every `$id` and `$ref` moved from `https://schemas.luh.tech/ectropy/<path>` to `https://schemas.ectropy.ai/<path>`. Each schema's version is bumped: major from 1.0.0 up, minor below.
- **One URN definition.** The URN is defined once, at `_definitions/urn.schema.json`, and every schema references it. The `pm/*` schemas had their own narrower URN pattern. They now accept the shared form: `{id}` may carry further colon-separated segments.
- **No `const` on `$schema`.** The `pm/*` schemas no longer require `$schema` to be one fixed string. It is a plain URI, as in every other schema.

**Changed**

- `resource-pose` references `resource-status` for `resourceType`, `availability` and `activity`, and `voxel-group` for `point3`, instead of carrying copies. Validation is unchanged.
- Non-validating metadata (`definitions._metadata`, `x-authoring`) removed. Descriptions describe the shape and its fields only.
- The JSON-LD extension namespace used in intake examples is `https://schemas.ectropy.ai/flow-extension#`.
