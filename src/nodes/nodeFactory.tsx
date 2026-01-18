import { FC } from 'react';
import { SysMLNode } from './SysMLNode';
import { NodeConfig, NODE_CONFIGS, getNodeConfig } from './nodeConfig';
import { NODE_TYPES } from '@opensyster/diagram-core';
import type { DiagramSymbol } from '../types';

/** Node data is the symbol data with additional layout info */
type NodeData = DiagramSymbol & { [key: string]: unknown };

/**
 * Props for SysML node components.
 * Compatible with React Flow's node component requirements.
 */
interface SysMLNodeProps {
  id: string;
  type: string;
  data: NodeData;
}

/**
 * Unified SysML node component.
 * 
 * Looks up configuration from NODE_CONFIGS based on node type at render time.
 * This replaces the previous pattern of generating 60+ separate components.
 * 
 * @example
 * ```tsx
 * <ReactFlow
 *   nodes={nodes}
 *   edges={edges}
 *   nodeTypes={nodeTypes}
 * />
 * ```
 */
export const UnifiedSysMLNode: FC<SysMLNodeProps> = ({ id, type, data }) => {
  const config = getNodeConfig(type);
  
  return (
    <SysMLNode
      id={id}
      data={data}
      category={config.category}
      stereotype={config.stereotype}
      showFeatures={config.showFeatures}
      showDirection={config.showDirection}
      isProperty={config.isProperty}
    />
  );
};

UnifiedSysMLNode.displayName = 'UnifiedSysMLNode';

/**
 * Node types map for React Flow.
 * 
 * Registers the unified component for ALL known SysML node types.
 * React Flow requires explicit registration for each type.
 */
export const nodeTypes: Record<string, FC<SysMLNodeProps>> = Object.fromEntries([
  // Register all known SysML/KerML node types
  ...Object.values(NODE_TYPES).map(type => [type, UnifiedSysMLNode]),
  // Fallback for unknown types
  ['default', UnifiedSysMLNode],
]);

// Re-export for consumers who need config access
export { getNodeConfig, NODE_CONFIGS };
export type { NodeConfig };

