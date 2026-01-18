/**
 * ELK.js Layout Adapter
 * 
 * Converts between React Flow nodes/edges and ELK graph format,
 * runs the ELK layout algorithm, and returns positioned nodes.
 */

import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';

import type { Node, Edge } from '@xyflow/react';
import { calculateElkTopPadding } from './sizing';

// ELK instance (reusable)
const elk = new ELK();

// Default ELK layout options for SysML diagrams
const DEFAULT_OPTIONS: Record<string, string> = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '40',
  'elk.spacing.edgeNode': '20',
  'elk.layered.spacing.nodeNodeBetweenLayers': '60',
  'elk.layered.spacing.edgeNodeBetweenLayers': '20',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.padding': '[top=20,left=20,bottom=20,right=20]',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.separateConnectedComponents': 'true',
  // Aspect ratio: prefer more square layouts (1.6 = golden ratio-ish)
  'elk.aspectRatio': '1.6',
  // Wrapping for better grid-like behavior
  'elk.layered.wrapping.strategy': 'MULTI_EDGE',
  'elk.layered.wrapping.additionalEdgeSpacing': '20',
};

export interface ElkLayoutOptions {
  /** ELK algorithm: 'layered', 'rectpacking', 'force', etc. */
  algorithm?: string;
  /** Layout direction: 'DOWN', 'RIGHT', 'UP', 'LEFT' */
  direction?: 'DOWN' | 'RIGHT' | 'UP' | 'LEFT';
  /** Spacing between sibling nodes */
  nodeSpacing?: number;
  /** Spacing between layers (for layered algorithm) */
  layerSpacing?: number;
  /** Padding inside container nodes */
  padding?: number;
}

/**
 * Apply ELK layout to React Flow nodes and edges.
 * 
 * @param nodes - React Flow nodes (may include parentId for hierarchy)
 * @param edges - React Flow edges
 * @param options - Layout configuration
 * @returns Nodes with updated positions
 */
export async function applyElkLayout<T extends Record<string, unknown> = Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  options: ElkLayoutOptions = {}
): Promise<Node<T>[]> {
  if (nodes.length === 0) return nodes;

  // Build ELK options from user config
  const elkOptions = { ...DEFAULT_OPTIONS };
  if (options.algorithm) elkOptions['elk.algorithm'] = options.algorithm;
  if (options.direction) elkOptions['elk.direction'] = options.direction;
  if (options.nodeSpacing) elkOptions['elk.spacing.nodeNode'] = String(options.nodeSpacing);
  if (options.layerSpacing) elkOptions['elk.layered.spacing.nodeNodeBetweenLayers'] = String(options.layerSpacing);
  if (options.padding) elkOptions['elk.padding'] = `[top=${options.padding},left=${options.padding},bottom=${options.padding},right=${options.padding}]`;

  // Convert to ELK graph format
  const elkGraph = buildElkGraph(nodes, edges, elkOptions);

  // Run ELK layout
  const layoutedGraph = await elk.layout(elkGraph);

  // Apply positions back to nodes
  return applyLayoutToNodes(nodes, layoutedGraph);
}

/**
 * Build ELK graph from React Flow nodes/edges.
 * Handles hierarchy via parentId.
 */
function buildElkGraph<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  options: Record<string, string>
): ElkNode {
  // Create a map of node ID to its children
  const childrenMap = new Map<string | undefined, Node<T>[]>();
  
  for (const node of nodes) {
    const parentId = node.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(node);
  }

  // Recursively build ELK node tree
  function buildElkNode(node: Node<T>, isChild = false): ElkNode {
    const children = childrenMap.get(node.id) || [];
    const width = (node.style?.width as number) || node.measured?.width || 180;
    const height = (node.style?.height as number) || node.measured?.height || 80;
    
    // Calculate top padding using shared sizing logic
    const nodeData = node.data as Record<string, unknown> | undefined;
    const features = (nodeData?.features as string[]) || [];
    const topPadding = calculateElkTopPadding(features);

    const elkNode: ElkNode = {
      id: node.id,
      width,
      height,
      // Container nodes with children get special layout
      ...(children.length > 0 && {
        layoutOptions: {
          // Use rectpacking for grid-like layout inside containers
          'elk.algorithm': 'rectpacking',
          'elk.spacing.nodeNode': '30',
          'elk.padding': `[top=${topPadding},left=20,bottom=30,right=20]`,
          // Target width controls how many nodes per row
          'elk.rectpacking.widthApproximation.targetWidth': '600',
          // Allow container to grow to fit children
          'elk.nodeSize.constraints': 'MINIMUM_SIZE',
        },
        children: children.map(c => buildElkNode(c, true)),
      }),
    };

    return elkNode;
  }

  // Build root-level nodes
  const rootNodes = childrenMap.get(undefined) || [];
  const elkChildren = rootNodes.map(n => buildElkNode(n, false));

  // Convert edges (only include edges where both endpoints exist)
  const nodeIds = new Set(nodes.map(n => n.id));
  const elkEdges: ElkExtendedEdge[] = edges
    .filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
    .map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

  return {
    id: 'root',
    layoutOptions: options,
    children: elkChildren,
    edges: elkEdges,
  };
}

/**
 * Apply ELK layout positions back to React Flow nodes.
 */
function applyLayoutToNodes<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  layoutedGraph: ElkNode
): Node<T>[] {
  // Build a map of node ID to ELK position
  const positionMap = new Map<string, { x: number; y: number; width?: number; height?: number }>();

  function collectPositions(elkNode: ElkNode) {
    if (elkNode.id !== 'root') {
      positionMap.set(elkNode.id, {
        x: elkNode.x ?? 0,
        y: elkNode.y ?? 0,
        width: elkNode.width,
        height: elkNode.height,
      });
    }
    for (const child of elkNode.children || []) {
      collectPositions(child);
    }
  }

  collectPositions(layoutedGraph);

  // Apply positions to nodes
  return nodes.map(node => {
    const pos = positionMap.get(node.id);
    if (!pos) return node;

    return {
      ...node,
      position: { x: pos.x, y: pos.y },
      style: {
        ...node.style,
        ...(pos.width && { width: pos.width }),
        ...(pos.height && { height: pos.height }),
      },
    };
  });
}
