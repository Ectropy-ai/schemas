# Ectropy open standard

JSON Schemas (draft-07) for construction project data: voxels and voxel groups, project decisions, inspections and participants, resource status and pose, jobsite material, equipment, robot and labour-time intake, logistic units, waste streams, carbon reports, and the payroll edge.

- **Served:** every schema at its `$id` under `https://schemas.ectropy.ai/`. [`index.json`](https://schemas.ectropy.ai/index.json) lists them.
- **Packaged:** `npm install @ectropy/schemas` installs the schemas and TypeScript types generated from them, published from this repository with npm provenance.

This repository is the only source of both.

## Scope

Interchange shapes only: how a record is structured for storage and exchange. A schema is here only when it has been named public. Algorithms, scoring and routing logic are not in this repository.

## Schemas

| Path | Title | Version |
|---|---|---|
| [_definitions/urn.schema.json](https://schemas.ectropy.ai/_definitions/urn.schema.json) | Ectropy URN | 1.0.0 |
| [flow/carbon-report.schema.json](https://schemas.ectropy.ai/flow/carbon-report.schema.json) | Carbon Report | 0.2.0 |
| [flow/flow-common.schema.json](https://schemas.ectropy.ai/flow/flow-common.schema.json) | Jobsite Flow Common Definitions | 0.3.0 |
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
| [pm/consequence.schema.json](https://schemas.ectropy.ai/pm/consequence.schema.json) | Consequence Schema | 2.0.0 |
| [pm/decision.schema.json](https://schemas.ectropy.ai/pm/decision.schema.json) | PM Decision Schema | 2.0.0 |
| [pm/inspection.schema.json](https://schemas.ectropy.ai/pm/inspection.schema.json) | Inspection Schema | 2.0.0 |
| [pm/participant.schema.json](https://schemas.ectropy.ai/pm/participant.schema.json) | Participant Schema | 2.0.0 |
| [pm/schedule-proposal.schema.json](https://schemas.ectropy.ai/pm/schedule-proposal.schema.json) | Schedule Proposal Schema | 2.0.0 |
| [resource/resource-pose.schema.json](https://schemas.ectropy.ai/resource/resource-pose.schema.json) | Resource Pose Schema | 2.0.0 |
| [resource/resource-status.schema.json](https://schemas.ectropy.ai/resource/resource-status.schema.json) | Resource Status Schema | 2.0.0 |
| [surface/surface-registry.schema.json](https://schemas.ectropy.ai/surface/surface-registry.schema.json) | Surface Registry | 2.0.0 |
| [voxel/voxel-group.schema.json](https://schemas.ectropy.ai/voxel/voxel-group.schema.json) | Voxel Group Schema | 2.0.0 |
| [voxel/voxel-v3.schema.json](https://schemas.ectropy.ai/voxel/voxel-v3.schema.json) | Voxel Schema | 2.0.0 |

**Identifiers.** Records name themselves and each other with one URN form, defined once in [`_definitions/urn.schema.json`](https://schemas.ectropy.ai/_definitions/urn.schema.json): `urn:luhtech:{issuer}:{type}:{id}`.

**Jobsite flow intake.** Each intake profile narrows GS1 EPCIS 2.0. Every intake event must also validate against GS1's EPCIS 2.0.1 JSON Schema; the repository vendors that schema as a test fixture and does not republish it.

## Using the package

```ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { schemas, VoxelVoxelV3 } from '@ectropy/schemas';

const ajv = new Ajv({ strict: false });
addFormats(ajv);
Object.values(schemas).forEach((s) => ajv.addSchema(s));
const validate = ajv.getSchema('https://schemas.ectropy.ai/voxel/voxel-v3.schema.json')!;

const voxel: VoxelVoxelV3.VoxelSchema = JSON.parse(input);
if (!validate(voxel)) throw new Error(ajv.errorsText(validate.errors));
```

A single schema file is also importable: `@ectropy/schemas/voxel/voxel-v3.schema.json`.

## Versioning

- Each schema carries a semver `version`.
- A change that can reject a previously valid instance, or that moves a schema's `$id`, is breaking. It bumps that schema's major version (minor below 1.0.0) and the package's major version.
- [CHANGELOG.md](CHANGELOG.md) records every release.

## Changing the standard

`npm run check` is the gate, run in CI on every pull request and before every publish. It checks that:
- every file is in canonical form;
- every `$id` equals its served URL;
- no `$ref` leaves `schemas.ectropy.ai`;
- every schema compiles;
- every example in `examples/` validates;
- public text describes shapes and fields only.

`npm run build` generates the types; `npm run site` stages what Pages serves.

A release is a tag `v<version>` matching `package.json`. The release workflow runs the gate, builds, and publishes with npm provenance through trusted publishing.

## License

[Apache-2.0](LICENSE).
