import { describe, it, expect } from 'vitest';
import type { Urn, GraphEdge, GraphMetadata } from '../types/graph-metadata.types.js';

describe('GraphEdge', () => {
  it('constructs minimal valid object', () => {
    const edge: GraphEdge = {
      from: 'urn:luhtech:project:voxel:VOX-001',
      to: 'urn:luhtech:project:pm-decision:DEC-001',
      type: 'contains',
    };
    expect(edge.from).toBe('urn:luhtech:project:voxel:VOX-001');
    expect(edge.to).toBe('urn:luhtech:project:pm-decision:DEC-001');
    expect(edge.type).toBe('contains');
  });

  it('constructs maximal valid object with every optional field', () => {
    const edge: GraphEdge = {
      from: 'urn:luhtech:project:voxel:VOX-001',
      to: 'urn:luhtech:project:pm-decision:DEC-001',
      type: 'triggers',
      weight: 0.85,
      label: 'primary spatial reference',
      metadata: { tradeAffected: 'MEP', severity: 'HIGH' },
      createdAt: '2026-04-23T12:00:00Z',
    };
    expect(edge.weight).toBe(0.85);
    expect(edge.label).toBe('primary spatial reference');
    expect(edge.createdAt).toBe('2026-04-23T12:00:00Z');
  });
});

describe('GraphMetadata', () => {
  it('constructs minimal valid object', () => {
    const meta: GraphMetadata = {
      inEdges: [],
      outEdges: [],
    };
    expect(meta.inEdges).toHaveLength(0);
    expect(meta.outEdges).toHaveLength(0);
  });

  it('constructs maximal valid object with every optional field', () => {
    const meta: GraphMetadata = {
      inEdges: ['urn:luhtech:project:voxel:VOX-001'],
      outEdges: ['urn:luhtech:project:consequence:CONSQ-001'],
      edges: [
        { from: 'urn:luhtech:project:voxel:VOX-001', to: 'urn:luhtech:project:pm-decision:DEC-001', type: 'contains' },
      ],
      linkedMilestone: 'urn:luhtech:project:milestone:M-001',
      linkedFeature: 'urn:luhtech:ectropy:feature:F-007',
    };
    expect(meta.edges).toHaveLength(1);
    expect(meta.linkedMilestone).toBe('urn:luhtech:project:milestone:M-001');
    expect(meta.linkedFeature).toBe('urn:luhtech:ectropy:feature:F-007');
  });

  it('readonly enforcement — @ts-expect-error on mutation', () => {
    const meta: GraphMetadata = { inEdges: [], outEdges: [] };
    // @ts-expect-error — inEdges is readonly
    meta.inEdges = ['urn:luhtech:x:y:z'];
  });

  it('Urn is just a string alias', () => {
    const u: Urn = 'urn:luhtech:project:voxel:VOX-001';
    expect(typeof u).toBe('string');
  });
});
