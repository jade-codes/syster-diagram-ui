import { describe, it, expect } from 'bun:test';
import {
  buildGraph,
  calculateLevels,
  applyLevelLayout,
  applyGridLayout,
  categorizeNodes,
  stripEdgeLabels,
  stripNodeData,
} from '../views/layoutUtils';
import type { DiagramNode, DiagramEdge } from '@opensyster/diagram-core';

function node(id: string, type = 'PartUsage'): DiagramNode {
  return { id, type, position: { x: 0, y: 0 }, data: { name: id } };
}

function edge(id: string, source: string, target: string, type?: string): DiagramEdge {
  return { id, source, target, type, label: `${source}->${target}` };
}

describe('layoutUtils', () => {
  describe('buildGraph', () => {
    it('builds adjacency list from edges', () => {
      const edges = [edge('e1', 'A', 'B'), edge('e2', 'A', 'C'), edge('e3', 'B', 'D')];
      const graph = buildGraph(edges);

      expect(graph.get('A')).toEqual(['B', 'C']);
      expect(graph.get('B')).toEqual(['D']);
      expect(graph.has('C')).toBe(false);
    });
  });

  describe('calculateLevels', () => {
    it('assigns levels via BFS', () => {
      const nodes = [node('A'), node('B'), node('C'), node('D')];
      const edges = [edge('e1', 'A', 'B'), edge('e2', 'B', 'C'), edge('e3', 'B', 'D')];

      const levels = calculateLevels(nodes, edges);

      expect(levels.get('A')).toBe(0);
      expect(levels.get('B')).toBe(1);
      expect(levels.get('C')).toBe(2);
      expect(levels.get('D')).toBe(2);
    });

    it('handles disconnected nodes', () => {
      const nodes = [node('A'), node('B'), node('Orphan')];
      const edges = [edge('e1', 'A', 'B')];

      const levels = calculateLevels(nodes, edges);

      expect(levels.get('A')).toBe(0);
      expect(levels.get('B')).toBe(1);
      // Orphan has no incoming edges so it's treated as a root at level 0
      expect(levels.has('Orphan')).toBe(true);
    });
  });

  describe('applyLevelLayout', () => {
    it('positions nodes by level (TB)', () => {
      const nodes = [node('A'), node('B')];
      const edges = [edge('e1', 'A', 'B')];

      const result = applyLevelLayout(nodes, edges, { direction: 'TB' });

      expect(result[0].position.y).toBeLessThan(result[1].position.y);
    });

    it('positions nodes by level (LR)', () => {
      const nodes = [node('A'), node('B')];
      const edges = [edge('e1', 'A', 'B')];

      const result = applyLevelLayout(nodes, edges, { direction: 'LR' });

      expect(result[0].position.x).toBeLessThan(result[1].position.x);
    });
  });

  describe('applyGridLayout', () => {
    it('arranges nodes in a grid', () => {
      const nodes = [node('A'), node('B'), node('C'), node('D')];

      const result = applyGridLayout(nodes);

      // Should be 2x2 grid (sqrt(4) = 2)
      expect(result[0].position).toEqual({ x: 0, y: 0 });
      expect(result[1].position.x).toBeGreaterThan(0);
      expect(result[2].position.y).toBeGreaterThan(0);
    });
  });

  describe('categorizeNodes', () => {
    it('categorizes nodes by matcher functions', () => {
      const nodes = [
        node('Part1', 'PartUsage'),
        node('Port1', 'PortUsage'),
        node('Action1', 'ActionUsage'),
        node('Other', 'SomethingElse'),
      ];

      const result = categorizeNodes(nodes, {
        parts: (n) => n.type?.includes('Part') ?? false,
        ports: (n) => n.type?.includes('Port') ?? false,
        actions: (n) => n.type?.includes('Action') ?? false,
      });

      expect(result.parts).toHaveLength(1);
      expect(result.ports).toHaveLength(1);
      expect(result.actions).toHaveLength(1);
      expect(result.other).toHaveLength(1);
    });
  });

  describe('stripEdgeLabels', () => {
    it('removes labels from edges', () => {
      const edges = [
        edge('e1', 'A', 'B'),
        edge('e2', 'B', 'C'),
      ];

      const result = stripEdgeLabels(edges);

      expect(result[0].label).toBeUndefined();
      expect(result[1].label).toBeUndefined();
    });
  });

  describe('stripNodeData', () => {
    it('removes specified keys from node data', () => {
      const nodes: DiagramNode[] = [
        { id: '1', type: 'State', position: { x: 0, y: 0 }, data: { name: 'Idle', entryAction: 'init()', exitAction: 'cleanup()' } },
      ];

      const result = stripNodeData(nodes, ['entryAction', 'exitAction']);

      expect(result[0].data.name).toBe('Idle');
      expect(result[0].data.entryAction).toBeUndefined();
      expect(result[0].data.exitAction).toBeUndefined();
    });
  });
});
