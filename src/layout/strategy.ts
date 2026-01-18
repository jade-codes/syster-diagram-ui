/**
 * Layout strategy interface and factory.
 */

import type { Node, Edge } from '@xyflow/react';
import type { DiagramSymbol, DiagramRelationship, ViewConfig, ViewType } from '../types';

/**
 * Node data type for layout - uses index signature for React Flow compatibility.
 */
export interface LayoutNodeData {
  name: string;
  qualifiedName?: string;
  features?: string[];
  typedBy?: string;
  direction?: string;
  [key: string]: unknown;
}

/**
 * Result of applying a layout strategy.
 */
export interface LayoutResult {
  nodes: Node<LayoutNodeData>[];
  edges: Edge[];
}

/**
 * Interface for layout strategies.
 * Layout is async because ELK runs asynchronously.
 */
export interface LayoutStrategy {
  apply(
    symbols: DiagramSymbol[],
    relationships: DiagramRelationship[],
    config: ViewConfig
  ): Promise<LayoutResult>;
}

/**
 * Factory to create the appropriate layout strategy for a view type.
 */
export function createLayoutStrategy(viewType: ViewType): LayoutStrategy {
  const { GeneralViewLayout } = require('./general-view');
  
  switch (viewType) {
    case 'InterconnectionView':
    case 'ActionFlowView':
    case 'StateTransitionView':
    case 'GeneralView':
    default:
      return new GeneralViewLayout();
  }
}
