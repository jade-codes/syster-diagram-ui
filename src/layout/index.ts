/**
 * Layout strategies for SysML diagrams.
 * 
 * Each view type can have its own layout strategy that determines
 * how nodes are positioned and sized.
 */

export { createLayoutStrategy, type LayoutStrategy, type LayoutResult, type LayoutNodeData } from './strategy';
export { GeneralViewLayout } from './general-view';
export { applyElkLayout, type ElkLayoutOptions } from './elk-layout';
