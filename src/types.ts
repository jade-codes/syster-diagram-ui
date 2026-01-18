/**
 * Diagram Input Types
 * 
 * These types define diagram-ui's public API - the shape of data it accepts.
 * The consumer (vscode-viewer) is responsible for transforming its data
 * (e.g., LSP responses) into this format.
 */

import type { NODE_TYPES, EDGE_TYPES } from '@opensyster/diagram-core';

// ========== Node Types ==========

/** All valid node types */
export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

/** All valid edge types */
export type EdgeType = typeof EDGE_TYPES[keyof typeof EDGE_TYPES];

// ========== Input Data ==========

/**
 * Symbol/element to render as a node.
 */
export interface DiagramSymbol {
  /** Simple name */
  name: string;
  
  /** Fully qualified name (used as ID) */
  qualifiedName: string;
  
  /** Node type - should match NODE_TYPES values */
  nodeType: string;
  
  /** Parent's qualified name for nesting */
  parent?: string;
  
  /** Features to display (for definitions) */
  features?: string[];
  
  /** Type reference (for usages) */
  typedBy?: string;
  
  /** Direction for ports: "in", "out", "inout" */
  direction?: "in" | "out" | "inout";
}

/**
 * Relationship to render as an edge.
 */
export interface DiagramRelationship {
  /** Relationship type - should match EDGE_TYPES values */
  type: string;
  
  /** Source symbol's qualified name */
  source: string;
  
  /** Target symbol's qualified name */
  target: string;
  
  /** Optional label */
  label?: string;
  
  /** Optional multiplicity (e.g., "4", "*") */
  multiplicity?: string;
}

/**
 * Complete input data for the diagram component.
 */
export interface DiagramData {
  symbols: DiagramSymbol[];
  relationships: DiagramRelationship[];
}

// ========== View Configuration ==========

/** Standard view types */
export type ViewType = 
  | 'GeneralView'
  | 'InterconnectionView'
  | 'ActionFlowView'
  | 'StateTransitionView'
  | 'SequenceView';

/**
 * Configuration for how to render a view.
 */
export interface ViewConfig {
  /** View type */
  type: ViewType;
  
  /** Layout direction */
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  
  /** Node types to include (empty = all) */
  includeNodeTypes?: string[];
  
  /** Edge types to include (empty = all) */
  includeEdgeTypes?: string[];
  
  /** Whether to show nesting */
  showNesting?: boolean;
}

/** Default view config */
export const DEFAULT_VIEW_CONFIG: ViewConfig = {
  type: 'GeneralView',
  direction: 'TB',
  showNesting: true,
};

// ========== Helpers ==========

/**
 * Check if a node type should be shown based on view config.
 */
export function shouldShowNodeType(nodeType: string, config: ViewConfig): boolean {
  if (!config.includeNodeTypes || config.includeNodeTypes.length === 0) {
    return true;
  }
  return config.includeNodeTypes.includes(nodeType);
}

/**
 * Check if an edge type should be shown based on view config.
 */
export function shouldShowEdgeType(edgeType: string, config: ViewConfig): boolean {
  if (!config.includeEdgeTypes || config.includeEdgeTypes.length === 0) {
    return true;
  }
  return config.includeEdgeTypes.includes(edgeType);
}
