/**
 * Layout Utilities
 * 
 * Shared layout algorithms for view renderers.
 */

import type { DiagramNode, DiagramEdge } from '@opensyster/diagram-core';

export type LayoutDirection = 'TB' | 'LR';

export interface LayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalGap?: number;
  verticalGap?: number;
  direction?: LayoutDirection;
}

const DEFAULT_OPTIONS: Required<LayoutOptions> = {
  nodeWidth: 160,
  nodeHeight: 80,
  horizontalGap: 80,
  verticalGap: 100,
  direction: 'TB',
};

/** Build outgoing adjacency list from edges */
export function buildGraph(edges: DiagramEdge[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    if (!graph.has(edge.source)) graph.set(edge.source, []);
    graph.get(edge.source)!.push(edge.target);
  }
  return graph;
}

/** Calculate levels via BFS from start nodes */
export function calculateLevels(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  startNodeIds?: string[]
): Map<string, number> {
  const graph = buildGraph(edges);
  const levels = new Map<string, number>();
  
  // Find start nodes if not provided
  const hasIncoming = new Set(edges.map(e => e.target));
  const starts = startNodeIds ?? nodes.filter(n => !hasIncoming.has(n.id)).map(n => n.id);
  
  // BFS
  const queue = starts.map(id => ({ id, level: 0 }));
  starts.forEach(id => levels.set(id, 0));
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    for (const neighbor of graph.get(id) ?? []) {
      if (!levels.has(neighbor)) {
        levels.set(neighbor, level + 1);
        queue.push({ id: neighbor, level: level + 1 });
      }
    }
  }
  
  // Assign unvisited nodes to max level
  const maxLevel = Math.max(0, ...levels.values());
  nodes.forEach(n => { if (!levels.has(n.id)) levels.set(n.id, maxLevel); });
  
  return levels;
}

/** Apply level-based layout (hierarchical/flow) */
export function applyLevelLayout(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  opts: LayoutOptions = {}
): DiagramNode[] {
  const { nodeWidth, nodeHeight, horizontalGap, verticalGap, direction } = { ...DEFAULT_OPTIONS, ...opts };
  
  const levels = calculateLevels(nodes, edges);
  const maxLevel = Math.max(0, ...levels.values());
  
  // Group by level
  const byLevel = new Map<number, DiagramNode[]>();
  nodes.forEach(n => {
    const lvl = levels.get(n.id) ?? 0;
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl)!.push(n);
  });
  
  // Position nodes
  return nodes.map(node => {
    const level = levels.get(node.id) ?? 0;
    const levelNodes = byLevel.get(level) ?? [];
    const index = levelNodes.indexOf(node);
    const totalWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * horizontalGap;
    
    const x = (index * (nodeWidth + horizontalGap)) - totalWidth / 2 + 300;
    const y = level * (nodeHeight + verticalGap) + 50;
    
    return {
      ...node,
      position: direction === 'TB' ? { x, y } : { x: y, y: x },
    };
  });
}

/** Apply grid layout */
export function applyGridLayout(
  nodes: DiagramNode[],
  opts: LayoutOptions = {}
): DiagramNode[] {
  const { nodeWidth, nodeHeight, horizontalGap, verticalGap } = { ...DEFAULT_OPTIONS, ...opts };
  const columns = Math.ceil(Math.sqrt(nodes.length));
  
  return nodes.map((node, i) => ({
    ...node,
    position: {
      x: (i % columns) * (nodeWidth + horizontalGap),
      y: Math.floor(i / columns) * (nodeHeight + verticalGap),
    },
  }));
}

/** Categorize nodes by type pattern */
export function categorizeNodes<T extends string>(
  nodes: DiagramNode[],
  categories: Record<T, (node: DiagramNode) => boolean>
): Record<T, DiagramNode[]> & { other: DiagramNode[] } {
  const result: Record<string, DiagramNode[]> = { other: [] };
  Object.keys(categories).forEach(k => { result[k] = []; });
  
  for (const node of nodes) {
    let matched = false;
    for (const [key, matcher] of Object.entries(categories) as [T, (n: DiagramNode) => boolean][]) {
      if (matcher(node)) {
        result[key].push(node);
        matched = true;
        break;
      }
    }
    if (!matched) result.other.push(node);
  }
  
  return result as Record<T, DiagramNode[]> & { other: DiagramNode[] };
}

/** Strip labels from edges */
export function stripEdgeLabels(edges: DiagramEdge[]): DiagramEdge[] {
  return edges.map(e => ({ ...e, label: undefined }));
}

/** Strip specific data keys from nodes */
export function stripNodeData(nodes: DiagramNode[], keys: string[]): DiagramNode[] {
  return nodes.map(node => ({
    ...node,
    data: Object.fromEntries(
      Object.entries(node.data).filter(([k]) => !keys.includes(k))
    ),
  }));
}
