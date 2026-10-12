# Ectropy open standard

JSON Schemas (draft-07) for construction project data: voxels and voxel groups, project decisions, inspections and participants, resource status and pose, jobsite material, equipment, robot and labour-time intake, logistic units, waste streams, carbon reports, and the payroll edge.

- **Served:** every schema at its `$id` under `https://schemas.ectropy.ai/`. [`index.json`](https://schemas.ectropy.ai/index.json) lists them.
This repository is the only source of the served schemas. It does not publish an npm package: `@ectropy/schemas` on npm is the Universal Decision Log, a separate package.

## Scope

Interchange shapes only: how a record is structured for storage and exchange. A schema is here only when it has been named public. Algorithms, scoring and routing logic are not in this repository.

## Schemas

| Path | Title | Version |
|---|---|---|
| [_definitions/provenance.schema.json](https://schemas.ectropy.ai/_definitions/provenance.schema.json) | Provenance | 0.1.0 |
| [_definitions/urn.schema.json](https://schemas.ectropy.ai/_definitions/urn.schema.json) | Ectropy URN | 1.0.0 |
| [flow/carbon-report.schema.json](https://schemas.ectropy.ai/flow/carbon-report.schema.json) | Carbon Report | 0.2.0 |
| [flow/flow-common.schema.json](https://schemas.ectropy.ai/flow/flow-common.schema.json) | Jobsite Flow Common Definitions | 0.4.0 |
| [flow/intake/bag-pointer.schema.json](https://schemas.ectropy.ai/flow/intake/bag-pointer.schema.json) | Robot Recording Pointer | 0.3.0 |
| [flow/intake/equipment-intake.schema.json](https://schemas.ectropy.ai/flow/intake/equipment-intake.schema.json) | Equipment Intake (ESx) | 0.2.0 |
| [flow/intake/inspection-intake.schema.json](https://schemas.ectropy.ai/flow/intake/inspection-intake.schema.json) | Inspection Intake (ISx) | 0.2.0 |
| [flow/intake/labor-time-intake.schema.json](https://schemas.ectropy.ai/flow/intake/labor-time-intake.schema.json) | Labour Time Intake (HSx) | 0.3.0 |
| [flow/intake/material-intake.schema.json](https://schemas.ectropy.ai/flow/intake/material-intake.schema.json) | Material Intake (MSx) | 0.2.0 |
| [flow/intake/robot-intake.schema.json](https://schemas.ectropy.ai/flow/intake/robot-intake.schema.json) | Robot Intake (RSx) | 0.2.0 |
| [flow/logistic-unit.schema.json](https://schemas.ectropy.ai/flow/logistic-unit.schema.json) | Logistic Unit | 0.2.0 |
| [flow/tag-binding.schema.json](https://schemas.ectropy.ai/flow/tag-binding.schema.json) | Tag Binding | 0.2.0 |
| [flow/vendor-price-submission.schema.json](https://schemas.ectropy.ai/flow/vendor-price-submission.schema.json) | Vendor Price Submission | 0.2.0 |
| [flow/waste-stream.schema.json](https://schemas.ectropy.ai/flow/waste-stream.schema.json) | Waste Stream | 0.2.0 |
| [payroll/compliance-report.schema.json](https://schemas.ectropy.ai/payroll/compliance-report.schema.json) | Payroll Compliance Report | 0.2.0 |
| [payroll/identity-vault-boundary.schema.json](https://schemas.ectropy.ai/payroll/identity-vault-boundary.schema.json) | Identity Vault Boundary | 0.2.0 |
| [payroll/pay-period.schema.json](https://schemas.ectropy.ai/payroll/pay-period.schema.json) | Pay Period | 0.2.0 |
| [payroll/pay-rule-set.schema.json](https://schemas.ectropy.ai/payroll/pay-rule-set.schema.json) | Pay Rule Set | 0.2.0 |
| [payroll/payroll-export.schema.json](https://schemas.ectropy.ai/payroll/payroll-export.schema.json) | Payroll Export | 0.2.0 |
| [pm/consequence.schema.json](https://schemas.ectropy.ai/pm/consequence.schema.json) | Consequence Schema | 2.2.0 |
| [pm/decision.schema.json](https://schemas.ectropy.ai/pm/decision.schema.json) | PM Decision Schema | 2.2.0 |
| [pm/inspection.schema.json](https://schemas.ectropy.ai/pm/inspection.schema.json) | Inspection Schema | 2.2.0 |
| [pm/participant.schema.json](https://schemas.ectropy.ai/pm/participant.schema.json) | Participant Schema | 2.0.0 |
| [pm/schedule-proposal.schema.json](https://schemas.ectropy.ai/pm/schedule-proposal.schema.json) | Schedule Proposal Schema | 2.1.0 |
| [resource/resource-pose.schema.json](https://schemas.ectropy.ai/resource/resource-pose.schema.json) | Resource Pose Schema | 2.0.0 |
| [resource/resource-status.schema.json](https://schemas.ectropy.ai/resource/resource-status.schema.json) | Resource Status Schema | 2.0.1 |
| [voxel/voxel-group.schema.json](https://schemas.ectropy.ai/voxel/voxel-group.schema.json) | Voxel Group Schema | 2.1.0 |
| [voxel/voxel-v3.schema.json](https://schemas.ectropy.ai/voxel/voxel-v3.schema.json) | Voxel Schema | 3.0.0 |

**What is here, and what is not.** The standard holds what a record is when it crosses a handoff between firms: its shape, keys, identifiers and vocabularies, and the fields that carry results. It does not hold how a record is proven, checked or decided. A record carries proof in a provenance envelope that names the proof scheme and holds the proof as an opaque value; each scheme is defined outside this standard. Public text says what a field is, never how it is computed.

**Identifiers.** Records name themselves and each other with one URN form, defined once in [`_definitions/urn.schema.json`](https://schemas.ectropy.ai/_definitions/urn.schema.json): `urn:luhtech:{issuer}:{type}:{id}`.

**Jobsite flow intake.** Each intake profile narrows GS1 EPCIS 2.0. Every intake event must also validate against GS1's EPCIS 2.0.1 JSON Schema; the repository vendors that schema as a test fixture and does not republish it.

## Using the schemas

- **Latest:** fetch a schema from its `$id`. That URL always serves the schema's current version.
- **Pinned:** fetch `https://schemas.ectropy.ai/v/{version}/{path}` for one exact version. Those bytes never change. [`index.json`](https://schemas.ectropy.ai/index.json) lists every published version of every schema.
- **Vendored:** copy this repository at a commit.

`npm run build` generates TypeScript types locally from the schemas.

## Versioning

- Each schema carries a semver `version`. A published version is immutable: changing a schema's content without changing its version fails the gate.
- A change that can reject a previously valid instance, or that moves a schema's `$id`, is breaking. It bumps that schema's major version, or its minor version below 1.0.0.
- **Maturity** follows the version. Below 1.0.0 a schema is *draft*, and a minor release may break it. From 1.0.0 it is *stable*, and only a major release breaks it.
- The `$id` never carries a version. A breaking change keeps the `$id`, and earlier versions stay at their `v/{version}/` paths.
- [CHANGELOG.md](CHANGELOG.md) records every release.

## Changing the standard

`npm run check` is the gate, run in CI on every pull request. It checks that:
- every file is in canonical form;
- every `$id` equals its served URL;
- no `$ref` leaves `schemas.ectropy.ai`;
- every schema compiles;
- every example in `examples/` validates;
- public text describes shapes and fields only, never how a value is computed;
- no published version has changed since 1.0.0.

`npm run build` generates the types; `npm run site` stages what Pages serves.

## License

[Apache-2.0](LICENSE).
