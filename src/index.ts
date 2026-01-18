/**
 * @syster/diagram-ui
 *
 * Shared React components for SysML v2 diagram visualization.
 * Used by both the viewer (read-only) and modeller (editable) packages.
 */

// ========== Types (diagram-ui's public API) ==========

export * from './types';

// ========== Nodes ==========

// Base component
export { SysMLNode, UnifiedSysMLNode } from './nodes';
export type { SysMLNodeProps } from './nodes';

// Node factory and configuration
export { NODE_CONFIGS, getNodeConfig } from './nodes/nodeConfig';
export type { NodeConfig } from './nodes/nodeConfig';

export { nodeTypes } from './nodes/nodeFactory';

// ========== Edges ==========

// Edge factory and configuration
export { EDGE_CONFIGS, getEdgeConfig, createSysMLEdge, edgeTypes } from './edges';
export type { EdgeConfig, SysMLEdgeProps } from './edges';

// ========== Layout ==========

export { createLayoutStrategy, GeneralViewLayout } from './layout';
export type { LayoutStrategy, LayoutResult } from './layout';

// ========== Theme ==========

export * from './theme';
