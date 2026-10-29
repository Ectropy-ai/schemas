# Changelog

## Unreleased

- **`voxel/voxel-group` 2.3.0.** Additions only: `rolledUpCost.priceSource`, optional, states where the members' prices came from, with the `flow/cost-rollup` price-source vocabulary (`tenant`, `reference`, `baseline`, `mixed`, `none`). Every instance valid at 2.2.0 stays valid.
- **New: `flow/cost-rollup` 0.1.0.** An estimated cost as a tree a reader can walk, from a project through its groups, voxels and elements to each assembly, zone and layer. Every node carries its `cost` (`money`, or null with an `unpricedReason`), its `quantity` and `unitCost` (`rate`), its `priceSource` (`tenant`, `reference`, `baseline`, `mixed` or `none`), its `coverage` (priced and total layers at or beneath it), its `confidence` and `asOf` date; a layer names its `product` (`productKey`) and the `priceRef` it was costed at. The rollup states its one `currency`, and optionally the `tenant` whose own prices it may use and the `region` its prices are for. Additions only.
- **One product key, and region as a jurisdiction area (breaking, draft schemas).**
  - **`flow/flow-common` 0.6.0.** New `productKey` -- a catalog product as the manufacturer's slug and the manufacturer's own product identifier -- and `jurisdictionArea`, an area named by its published scheme and code (ISO 3166, US Census and OMB, Statistics Canada). Additions only.
  - **`flow/logistic-unit` 0.3.0, `flow/intake/material-intake` 0.3.0, `flow/vendor-price-submission` 0.4.0.** `bpcProduct` is a `productKey`, not a free string; an instance carrying a string fails.
  - **`flow/vendor-price-submission` 0.4.0.** `catalogProductKey` (0.3.0) is removed: `bpcProduct` names the same product. A product may be identified by `bpcProduct` alone. `region` is a `jurisdictionArea`; absent, the price applies nationally.
- **`flow/vendor-price-submission` 0.3.0.** Additions, and one narrowing. A price may be entered by a member of the receiving tenant as well as by the vendor: `vendorRef` or the new `submittedBy` is required, and the price belongs to `targetTenant` either way. New optional `priceKind` (`vendor-published`, `vendor-invoice`, `contracted`, `estimated`), `supersedes`, `basis`, `provenance` and `sourceDocument` (the price list or quote, as a file reference). A product may be identified by `catalogProductKey`, the manufacturer's slug and its own product identifier. `priceUom` must be a code in the `_definitions/units` UN/CEFACT Recommendation 20 catalog, not any two- or three-character code; this is the one change an instance valid at 0.2.0 can fail.
- **`voxel/voxel-group` 2.2.0.** `rolledUpCost.currency` is any ISO 4217 code from `_definitions/units`, not only USD.
- **New: `_definitions/file-reference` 0.1.0.** A reference to a file a record depends on and does not embed: `uri`, `sha256`, `contentType` (the IANA media type an Asset Administration Shell File element carries), and optionally `sizeBytes`, `format` (for example `dstv-nc-8.0`, `dstv-xas`, `ifc-4.3`, `aasx`) and `provenance`. `flow/intake/bag-pointer` is unchanged.
- **New: `_definitions/classification-ref` 0.1.0.** A record's class in one published system -- `cci`, `etim`, `ifc`, `bsdd`, `iec-81346-aspect`, the Uniclass and OmniClass tables, `uniformat-ii` or `din-276` -- with its licence, whether it was verified against the publisher (a VERIFIED reference names how and against which version) and when it was observed.
- **`flow/flow-common` 0.5.0.** Additions only: a `unitId` may be an IEC 61406 identification link, an https URL under the issuer's own domain; a `partyUri` may be issued under any issuer's own domain, as a location URI already may. Every instance valid at 0.4.0 stays valid.
- **`_definitions/units` 1.2.0.** Addition: `ghgIntensity`, a greenhouse-gas mass per one unit of something (its value, unit, gas, GWP basis and the unit it is per), the form a product's declared impact takes.
- **`_definitions/units` 1.1.0.** Additions only: LTN (long ton), STC (stick) and the Recommendation 21 package codes XBG (bag), XRO (roll) and XST (sheet), each a count of packages, not of what they hold.
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
