import { describe, it, expect } from 'vitest';
// Validates that NodeNext module resolution and tsconfig are correctly wired.
// VoxelGeometry is a v0.2.0 type — if this import breaks, A.2 additions broke existing exports.
import type { VoxelGeometry } from '../types/voxel.types.js';

describe('@ectropy/schemas v0.2.0', () => {
  it('VoxelGeometry module resolves at runtime', async () => {
    // Dynamic import confirms .js extension path resolution works under vitest + NodeNext
    const mod = await import('../types/voxel.types.js');
    expect(mod).toBeDefined();
  });

  it('index re-exports all type modules without error', async () => {
    const index = await import('../types/index.js');
    expect(index).toBeDefined();
  });
});

// Compile-time guard: VoxelGeometry must remain an object type after v0.3.0 additions
type _Guard = VoxelGeometry extends object ? true : never;
const _check: _Guard = true;
void _check;
