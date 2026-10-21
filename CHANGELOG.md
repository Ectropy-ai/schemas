# Changelog

## Unreleased

- **New: `_definitions/units` 1.0.0.** One definition of units, quantities, money, time and ratios for every record. `uom` is a UN/CEFACT Recommendation 20 common code (revision 11e) from a catalog that names each code's title, symbol, quantity kind, factor to the coherent SI unit (exact, or to NIST SP 811's seven significant digits) and the spellings sources use for it. `currency` is an ISO 4217 code with its minor-unit exponent (the maintenance agency's list of 2026-09-17). With them: `quantity`, `rate` (numerator per denominator), `money` (a decimal amount and its currency), `instant`, `date`, `duration` (ISO 8601), `fraction`, `ghgMass` (a greenhouse-gas mass with its gas and GWP basis) and `coordinateUnits`. Nothing existing changes in this release; the schemas move to these definitions in their own releases.
- **The line between the standard and the work on it.** The standard holds what a record is at a handoff between firms; how a record is proven, checked or decided is not part of it. Public text says what a field is, never how it is computed, and the gate holds this.
  - **New: `_definitions/provenance` 0.1.0.** A record carries proof in a provenance envelope: the proof scheme's identifier, the proof as an opaque value, and optionally when and by whom it was issued. `pm/decision`, `pm/consequence`, `pm/inspection` 2.2.0, `pm/schedule-proposal` 2.1.0 and `voxel/voxel-v3` 3.0.0 each carry an optional `provenance` list.
  - **Withdrawn: `surface/surface-registry`.** It describes one platform's user interface, not a record that crosses a handoff, and no one outside that platform adopted it. It is no longer served at any path, including its pinned versions.
  - **`voxel/voxel-v3` 3.0.0 (breaking).** An acknowledgment identifies its worker by `workerRef` only: `workerName` is removed and the acknowledgment is closed.
  - **`flow/flow-common` 0.4.0.** A location URI may be issued under any issuer's own domain, not one fixed domain.
  - **Descriptions.** `voxel/voxel-group` 2.1.0, `voxel/voxel-v3` and `resource/resource-status` 2.0.1 describe their fields without derivation rules or internal values. The record metadata no longer declares `syncStatus`.
- **PM records 2.1.0, voxel 2.1.0.** Additions only; every instance valid at 2.0.0 stays valid.
  - `pm/decision`: `decisionId` accepts any hyphen-separated alphanumeric identifier whose first segment starts with a letter (`D-0001` now validates, as its own description shows). `voxelRef` is optional, for decisions with no spatial location. New optional `analysis`: situation, risk if unresolved, who can decide, pre-approval, recommended action.
  - `pm/inspection`: new optional `decisionResults` (each reviewed decision and its result), `evidence`, and `result.conditions`.
  - `pm/consequence`: `category` adds `COORDINATION_CONFLICT`, `TOLERANCE_VARIANCE`, `MATERIAL_MISMATCH` and `ACCESS_ISSUE`.
  - `voxel/voxel-v3`: a tolerance override's `standardValue` and `approvedValue` carry an optional `tolerance`, the permitted deviation.
- **Pinned versions.** Every published version of every schema is served, unchanged, at `https://schemas.ectropy.ai/v/{version}/{path}`. `index.json` lists each schema's versions and maturity.
- **Immutable versions.** The gate fails when a schema's content changes without a version bump.
- **Maturity.** Below 1.0.0 a schema is draft; from 1.0.0 it is stable.
- The site no longer advertises an npm package.
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
