/**
 * Shared sizing constants for SysML nodes.
 * 
 * SINGLE SOURCE OF TRUTH - used by:
 * - SysMLNode.tsx (rendering)
 * - general-view.ts (node size calculation)
 * - elk-layout.ts (parent padding calculation)
 */

/** Sizing constants in pixels */
export const NODE_SIZING = {
  /** Header area (stereotype + name + padding) */
  headerHeight: 60,
  
  /** Section title like "attributes", "parts" */
  sectionHeaderHeight: 24,
  
  /** Each feature/attribute line */
  itemHeight: 26,
  
  /** Bottom padding inside content area */
  bottomPadding: 20,
  
  /** Gap between parent content and children */
  childGap: 20,
  
  /** Minimum node height */
  minHeight: 90,
  
  /** Minimum container height */
  minContainerHeight: 200,
  
  /** Default node width */
  defaultWidth: 200,
  
  /** Minimum container width */
  minContainerWidth: 300,
} as const;

/**
 * Group features into categories matching SysMLNode rendering.
 * Returns counts for each section.
 */
export function groupFeatureCounts(features: string[]): { parts: number; attrs: number; actions: number } {
  let parts = 0, attrs = 0, actions = 0;
  
  for (const f of features) {
    const lower = f.toLowerCase();
    if (lower.includes('action') || lower.includes(':action')) {
      actions++;
    } else if (lower.includes('attribute') || lower.includes('attr') || !f.includes(':')) {
      attrs++;
    } else {
      parts++;
    }
  }
  
  return { parts, attrs, actions };
}

/**
 * Calculate total content height for a node based on its features.
 */
export function calculateContentHeight(features: string[]): number {
  const { parts, attrs, actions } = groupFeatureCounts(features);
  const featureCount = features.length;
  
  if (featureCount === 0) {
    return NODE_SIZING.headerHeight + 10; // Small padding
  }
  
  // Count sections that have items
  const sectionCount = (parts > 0 ? 1 : 0) + (attrs > 0 ? 1 : 0) + (actions > 0 ? 1 : 0);
  
  const featureHeight = (sectionCount * NODE_SIZING.sectionHeaderHeight) + 
                        (featureCount * NODE_SIZING.itemHeight) + 
                        NODE_SIZING.bottomPadding;
  
  return NODE_SIZING.headerHeight + featureHeight;
}

/**
 * Calculate node dimensions.
 */
export function calculateNodeSize(features: string[], isContainer: boolean): { width: number; height: number } {
  const contentHeight = calculateContentHeight(features);
  
  if (isContainer) {
    return {
      width: NODE_SIZING.minContainerWidth,
      height: Math.max(NODE_SIZING.minContainerHeight, contentHeight + 60),
    };
  }
  
  return {
    width: NODE_SIZING.defaultWidth,
    height: Math.max(NODE_SIZING.minHeight, contentHeight),
  };
}

/**
 * Calculate ELK top padding for a parent node.
 * This is where children will start (below parent's header + features).
 */
export function calculateElkTopPadding(features: string[]): number {
  return calculateContentHeight(features) + NODE_SIZING.childGap;
}
