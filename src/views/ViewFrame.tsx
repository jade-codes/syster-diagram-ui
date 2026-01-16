/**
 * ViewFrame Component
 * 
 * Container for rendering a SysML V2 view with React Flow.
 */

import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from '@xyflow/react';
import type { ResolvedView } from '@opensyster/diagram-core';
import { VIEW_TYPES } from '@opensyster/diagram-core';
import { nodeTypes } from '../nodes';
import { edgeTypes } from '../edges';

export interface ViewFrameProps {
  resolvedView: ResolvedView;
  className?: string;
  style?: React.CSSProperties;
  showHeader?: boolean;
  showFooter?: boolean;
  showMinimap?: boolean;
  showControls?: boolean;
  onNodeClick?: (nodeId: string, node: Node) => void;
  onEdgeClick?: (edgeId: string, edge: Edge) => void;
}

const VIEW_CONFIG: Record<string, { stereotype: string; color: string }> = {
  [VIEW_TYPES.GENERAL]: { stereotype: 'view', color: '#6b7280' },
  [VIEW_TYPES.INTERCONNECTION]: { stereotype: 'interconnection view', color: '#3b82f6' },
  [VIEW_TYPES.ACTION_FLOW]: { stereotype: 'action flow view', color: '#10b981' },
  [VIEW_TYPES.STATE_TRANSITION]: { stereotype: 'state transition view', color: '#8b5cf6' },
  [VIEW_TYPES.SEQUENCE]: { stereotype: 'sequence view', color: '#f59e0b' },
};

export const ViewFrame: React.FC<ViewFrameProps> = ({
  resolvedView,
  className = '',
  style,
  showHeader = true,
  showFooter = true,
  showMinimap = true,
  showControls = true,
  onNodeClick,
  onEdgeClick,
}) => {
  const { view, definition, nodes, edges, exposedCount, filteredCount } = resolvedView;
  const viewType = view.viewType ?? definition.viewType ?? VIEW_TYPES.GENERAL;
  const { stereotype, color } = VIEW_CONFIG[viewType] ?? VIEW_CONFIG[VIEW_TYPES.GENERAL];
  
  const rfNodes: Node[] = nodes.map((n, i) => ({
    id: n.id,
    type: n.type,
    position: n.position ?? { x: 100 + (i % 4) * 200, y: 100 + Math.floor(i / 4) * 150 },
    data: n.data,
  }));
  
  const rfEdges: Edge[] = edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type ?? 'default',
    label: e.label,
    data: e,
  }));
  
  return (
    <div className={`syster-view-frame ${className}`} style={{ display: 'flex', flexDirection: 'column', border: `2px solid ${color}`, borderRadius: 8, overflow: 'hidden', background: 'white', height: '100%', ...style }}>
      {showHeader && (
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${color}`, background: `${color}10` }}>
          <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>«{stereotype}»</div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>{view.name}</div>
          {definition.description && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{definition.description}</div>}
        </div>
      )}
      
      <div style={{ flex: 1, minHeight: 0 }}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick && ((_, n) => onNodeClick(n.id, n))}
          onEdgeClick={onEdgeClick && ((_, e) => onEdgeClick(e.id, e))}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          {showControls && <Controls />}
          {showMinimap && <MiniMap />}
        </ReactFlow>
      </div>
      
      {showFooter && (
        <div style={{ padding: '8px 16px', borderTop: `1px solid ${color}`, background: '#f9fafb', fontSize: 12, color: '#666', display: 'flex', justifyContent: 'space-between' }}>
          <span>Showing {filteredCount} of {exposedCount} elements</span>
          {view.viewpoint && <span>Viewpoint: {typeof view.viewpoint === 'string' ? view.viewpoint : view.viewpoint.name}</span>}
        </div>
      )}
    </div>
  );
};
