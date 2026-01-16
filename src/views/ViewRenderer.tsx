/**
 * ViewRenderer
 * 
 * Unified renderer for all SysML V2 view types.
 * Automatically applies appropriate layout based on view type.
 */

import React from 'react';
import type { ResolvedView } from '@opensyster/diagram-core';
import { VIEW_TYPES } from '@opensyster/diagram-core';
import { ViewFrame, type ViewFrameProps } from './ViewFrame';
import { 
  applyLevelLayout, 
  applyGridLayout, 
  stripEdgeLabels, 
  stripNodeData,
  type LayoutDirection,
} from './layoutUtils';

export interface ViewRendererProps extends Omit<ViewFrameProps, 'resolvedView'> {
  resolvedView: ResolvedView;
  layoutDirection?: LayoutDirection;
  showLabels?: boolean;
  showDetails?: boolean;
}

/** Get layout function for view type */
function getLayoutForViewType(viewType: string) {
  switch (viewType) {
    case VIEW_TYPES.INTERCONNECTION:
      return applyGridLayout;
    case VIEW_TYPES.ACTION_FLOW:
    case VIEW_TYPES.STATE_TRANSITION:
    case VIEW_TYPES.GENERAL:
    default:
      return applyLevelLayout;
  }
}

/** Get hidden data keys for view type when details are off */
function getHiddenDataKeys(viewType: string): string[] {
  switch (viewType) {
    case VIEW_TYPES.STATE_TRANSITION:
      return ['entryAction', 'exitAction', 'doActivity'];
    default:
      return [];
  }
}

export const ViewRenderer: React.FC<ViewRendererProps> = ({
  resolvedView,
  layoutDirection = 'TB',
  showLabels = true,
  showDetails = true,
  ...viewFrameProps
}) => {
  const viewType = resolvedView.view.viewType ?? 
                   resolvedView.definition.viewType ?? 
                   VIEW_TYPES.GENERAL;
  
  const processedView = React.useMemo(() => {
    const layoutFn = getLayoutForViewType(viewType);
    let nodes = layoutFn(resolvedView.nodes, resolvedView.edges, { direction: layoutDirection });
    let edges = resolvedView.edges;
    
    if (!showLabels) {
      edges = stripEdgeLabels(edges);
    }
    
    if (!showDetails) {
      nodes = stripNodeData(nodes, getHiddenDataKeys(viewType));
    }
    
    return { ...resolvedView, nodes, edges };
  }, [resolvedView, viewType, layoutDirection, showLabels, showDetails]);
  
  return <ViewFrame resolvedView={processedView} {...viewFrameProps} />;
};

// Convenience exports for specific view types (just pre-configured ViewRenderer)
export const GeneralViewRenderer: React.FC<ViewRendererProps> = (props) => (
  <ViewRenderer {...props} />
);

export const InterconnectionViewRenderer: React.FC<ViewRendererProps> = (props) => (
  <ViewRenderer {...props} />
);

export const ActionFlowViewRenderer: React.FC<ViewRendererProps> = (props) => (
  <ViewRenderer {...props} />
);

export const StateTransitionViewRenderer: React.FC<ViewRendererProps> = (props) => (
  <ViewRenderer {...props} />
);

export default ViewRenderer;
