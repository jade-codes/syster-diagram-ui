/**
 * GeneralView Layout Strategy
 * 
 * Uses ELK.js for automatic hierarchical layout:
 * - No overlapping nodes
 * - Proper containment for nested elements
 * - Properties, attributes, and ports rendered as TEXT inside parent (not separate nodes)
 */

import type { Node, Edge } from '@xyflow/react';
import type { DiagramSymbol, DiagramRelationship, ViewConfig } from '../types';
import { shouldShowNodeType, shouldShowEdgeType } from '../types';
import { NODE_TYPES } from '@opensyster/diagram-core';
import type { LayoutStrategy, LayoutResult, LayoutNodeData } from './strategy';
import { applyElkLayout } from './elk-layout';
import { calculateNodeSize } from './sizing';

type NodeCategory = 'structural' | 'property' | 'port';

/** Set of valid node types for quick lookup */
const VALID_NODE_TYPES = new Set(Object.values(NODE_TYPES));

/**
 * Check if a node type is valid.
 */
function isValidNodeType(nodeType: string): boolean {
  return VALID_NODE_TYPES.has(nodeType as any);
}

/**
 * Categorize a node type to determine how it should be rendered.
 * - 'structural' = rendered as a box/node
 * - 'property' = rendered as text inside parent
 * - 'port' = rendered as text inside parent (could be boundary decoration in future)
 */
function getNodeCategory(nodeType: string): NodeCategory {
  // Ports - render as text/decoration, not nodes
  if (nodeType.includes('Port')) return 'port';
  
  // Properties/Attributes - render as text compartment
  if (['AttributeUsage', 'AttributeDef', 'ReferenceUsage', 'Feature'].includes(nodeType)) return 'property';
  
  // Everything else is structural (packages, parts, actions, etc.)
  return 'structural';
}

export class GeneralViewLayout implements LayoutStrategy {
  async apply(
    symbols: DiagramSymbol[], 
    relationships: DiagramRelationship[], 
    config: ViewConfig
  ): Promise<LayoutResult> {
    // Step 1: Separate structural elements from properties/ports
    const structuralSymbols: DiagramSymbol[] = [];
    const propertiesByParent = new Map<string, string[]>();
    const portsByParent = new Map<string, string[]>();
    
    for (const symbol of symbols) {
      if (!shouldShowNodeType(symbol.nodeType, config)) continue;
      
      const category = getNodeCategory(symbol.nodeType);
      
      if (category === 'structural') {
        structuralSymbols.push(symbol);
      } else if (symbol.parent) {
        // Aggregate properties and ports by parent
        const map = category === 'port' ? portsByParent : propertiesByParent;
        if (!map.has(symbol.parent)) map.set(symbol.parent, []);
        
        // Format: "name : Type" or "direction name : Type"
        let text = symbol.name;
        if (symbol.direction) text = `${symbol.direction} ${text}`;
        if (symbol.typedBy) text += ` : ${symbol.typedBy.split('::').pop()}`;
        
        map.get(symbol.parent)!.push(text);
      }
    }
    
    // Step 2: Build nodes with proper sizing (before ELK layout)
    const nodes = this.buildNodes(structuralSymbols, propertiesByParent, portsByParent);
    
    // Step 3: Build edges
    const filteredRelationships = relationships.filter(r => shouldShowEdgeType(r.type, config));
    const edges = this.buildEdges(filteredRelationships, nodes);
    
    // Step 4: Apply ELK layout (async)
    const layoutedNodes = await applyElkLayout(nodes, edges, {
      algorithm: 'layered',
      direction: 'DOWN',
      nodeSpacing: 60,
      layerSpacing: 80,
      padding: 40,
    });
    
    return { nodes: layoutedNodes, edges };
  }
  
  private buildNodes(
    symbols: DiagramSymbol[], 
    propertiesByParent: Map<string, string[]>,
    portsByParent: Map<string, string[]>
  ): Node<LayoutNodeData>[] {
    const nodeIds = new Set(symbols.map(s => this.toNodeId(s.qualifiedName)));
    const hasChildren = new Set<string>();
    
    // Find which nodes have children
    for (const symbol of symbols) {
      if (symbol.parent) {
        hasChildren.add(this.toNodeId(symbol.parent));
      }
    }
    
    const nodes: Node<LayoutNodeData>[] = [];
    
    for (const symbol of symbols) {
      const id = this.toNodeId(symbol.qualifiedName);
      const parentId = symbol.parent ? this.toNodeId(symbol.parent) : undefined;
      
      let nodeType = symbol.nodeType;
      if (!isValidNodeType(nodeType)) {
        nodeType = 'default' as any;
      }
      
      // Merge in properties and ports as features
      const qn = symbol.qualifiedName;
      const properties = propertiesByParent.get(qn) || [];
      const ports = portsByParent.get(qn) || [];
      const allFeatures = [
        ...properties,
        ...(ports.length > 0 ? ['---', ...ports] : []),
        ...(symbol.features || []),
      ].filter(f => f);
      
      // Calculate node size based on features and whether it's a container
      const isContainer = hasChildren.has(id);
      const size = calculateNodeSize(allFeatures, isContainer);
      
      const node: Node<LayoutNodeData> = {
        id,
        type: nodeType,
        position: { x: 0, y: 0 }, // ELK will set this
        data: {
          name: symbol.name,
          qualifiedName: symbol.qualifiedName,
          features: allFeatures.length > 0 ? allFeatures : undefined,
          typedBy: symbol.typedBy,
          direction: symbol.direction,
        },
        style: {
          width: size.width,
          height: size.height,
        },
      };
      
      // Set parent relationship for ELK hierarchy
      if (parentId && nodeIds.has(parentId)) {
        node.parentId = parentId;
        node.extent = 'parent';
      }
      
      nodes.push(node);
    }
    
    return nodes;
  }
  
  private buildEdges(relationships: DiagramRelationship[], nodes: Node<LayoutNodeData>[]): Edge[] {
    const nodeIds = new Set(nodes.map(n => n.id));
    const edges: Edge[] = [];
    
    for (let i = 0; i < relationships.length; i++) {
      const rel = relationships[i];
      const sourceId = this.toNodeId(rel.source);
      const targetId = this.toNodeId(rel.target);
      
      // Only create edge if both endpoints are structural nodes
      if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
        edges.push({ 
          id: `edge_${i}`, 
          source: sourceId, 
          target: targetId, 
          type: rel.type, 
          label: rel.type,
        });
      }
    }
    
    return edges;
  }
  
  private toNodeId(qualifiedName: string): string {
    return qualifiedName.replace(/::/g, '_');
  }
}
