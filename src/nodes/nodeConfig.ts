import { NODE_TYPES } from '@opensyster/diagram-core';
import type { NodeCategory } from '../theme/tokens';

/**
 * Configuration for a SysML node's display properties.
 * Colors are determined by category + theme at render time.
 */
export interface NodeConfig {
  /** Semantic category for color theming */
  category: NodeCategory;
  /** Stereotype label (e.g., "part def", "port def") */
  stereotype: string;
  /** Whether to show features list */
  showFeatures?: boolean;
  /** Whether to show direction indicator */
  showDirection?: boolean;
  /** Render as compact property (no stereotype, smaller) */
  isProperty?: boolean;
}

// ========== Config Builders ==========

/** Create a definition config with features */
const def = (category: NodeCategory, name: string): NodeConfig => ({
  category,
  stereotype: `${name} def`,
  showFeatures: true,
});

/** Create a definition config with direction (for ports) */
const defDir = (category: NodeCategory, name: string): NodeConfig => ({
  category,
  stereotype: `${name} def`,
  showFeatures: true,
  showDirection: true,
});

/** Create a usage config with features */
const usage = (category: NodeCategory, name: string): NodeConfig => ({
  category,
  stereotype: name,
  showFeatures: true,
});

/** Create a usage config with direction (for ports, refs) */
const usageDir = (category: NodeCategory, name: string): NodeConfig => ({
  category,
  stereotype: name,
  showFeatures: true,
  showDirection: true,
});

/** Create a property-style config (compact, no stereotype) */
const property = (category: NodeCategory): NodeConfig => ({
  category,
  stereotype: '',
  isProperty: true,
});

// ========== Node Configurations ==========

/**
 * SysML v2 node type configurations.
 * 
 * Uses fine-grained categories for distinct colors per element type.
 * Definitions and usages have different shades within their color family.
 */
export const NODE_CONFIGS: Record<string, NodeConfig> = {
  // ==================== Structural ====================
  // Parts (blue family)
  [NODE_TYPES.PART_DEF]:           def('part-def', 'part'),
  [NODE_TYPES.PART_USAGE]:         usage('part-usage', 'part'),
  
  // Items (sky blue)
  [NODE_TYPES.ITEM_DEF]:           def('item-def', 'item'),
  [NODE_TYPES.ITEM_USAGE]:         usage('item-usage', 'item'),
  
  // Attributes (indigo)
  [NODE_TYPES.ATTRIBUTE_DEF]:      def('attribute', 'attribute'),
  [NODE_TYPES.ATTRIBUTE_USAGE]:    property('attribute'),
  
  // Occurrences (use part colors)
  [NODE_TYPES.OCCURRENCE_DEF]:     def('part-def', 'occurrence'),
  [NODE_TYPES.OCCURRENCE_USAGE]:   usage('part-usage', 'occurrence'),
  
  // Individuals (use item colors)
  [NODE_TYPES.INDIVIDUAL_DEF]:     def('item-def', 'individual'),
  [NODE_TYPES.INDIVIDUAL_USAGE]:   usage('item-usage', 'individual'),
  
  [NODE_TYPES.SNAPSHOT_USAGE]:     usage('item-usage', 'snapshot'),
  [NODE_TYPES.TIMESLICE_USAGE]:    usage('item-usage', 'timeslice'),
  [NODE_TYPES.REFERENCE_USAGE]:    property('attribute'),

  // ==================== Interfaces ====================
  // Ports (violet)
  [NODE_TYPES.PORT_DEF]:           defDir('port-def', 'port'),
  [NODE_TYPES.PORT_USAGE]:         usageDir('port-usage', 'port'),
  
  // Interfaces (purple)
  [NODE_TYPES.INTERFACE_DEF]:      def('interface', 'interface'),
  [NODE_TYPES.INTERFACE_USAGE]:    usage('interface', 'interface'),
  
  // Connections (fuchsia)
  [NODE_TYPES.CONNECTION_DEF]:     def('connection', 'connection'),
  [NODE_TYPES.CONNECTION_USAGE]:   usage('connection', 'connection'),
  
  // Flows (pink-purple)
  [NODE_TYPES.FLOW_DEF]:           defDir('flow', 'flow'),
  [NODE_TYPES.FLOW_USAGE]:         usageDir('flow', 'flow'),

  // ==================== Behavioral ====================
  // Actions (emerald)
  [NODE_TYPES.ACTION_DEF]:         def('action-def', 'action'),
  [NODE_TYPES.ACTION_USAGE]:       usage('action-usage', 'action'),
  [NODE_TYPES.PERFORM_ACTION_USAGE]: usage('action-usage', 'perform'),
  
  // States (green)
  [NODE_TYPES.STATE_DEF]:          def('state-def', 'state'),
  [NODE_TYPES.STATE_USAGE]:        usage('state-usage', 'state'),
  [NODE_TYPES.EXHIBIT_STATE_USAGE]: usage('state-usage', 'exhibit'),
  
  // Calculations (lime)
  [NODE_TYPES.CALCULATION_DEF]:    def('calculation', 'calculation'),
  [NODE_TYPES.CALCULATION_USAGE]:  usage('calculation', 'calc'),

  // ==================== Requirements ====================
  // Requirements (amber)
  [NODE_TYPES.REQUIREMENT_DEF]:    def('requirement-def', 'requirement'),
  [NODE_TYPES.REQUIREMENT_USAGE]:  usage('requirement-usage', 'requirement'),
  [NODE_TYPES.SATISFY_REQUIREMENT_USAGE]: usage('requirement-usage', 'satisfy'),
  
  // Concerns (use requirement colors)
  [NODE_TYPES.CONCERN_DEF]:        def('requirement-def', 'concern'),
  [NODE_TYPES.CONCERN_USAGE]:      usage('requirement-usage', 'concern'),
  
  // Constraints (orange)
  [NODE_TYPES.CONSTRAINT_DEF]:     def('constraint', 'constraint'),
  [NODE_TYPES.CONSTRAINT_USAGE]:   usage('constraint', 'constraint'),

  // ==================== Cases ====================
  // Cases (indigo)
  [NODE_TYPES.CASE_DEF]:           def('case-def', 'case'),
  [NODE_TYPES.CASE_USAGE]:         usage('case-usage', 'case'),
  
  [NODE_TYPES.USE_CASE_DEF]:       def('case-def', 'use case'),
  [NODE_TYPES.INCLUDE_USE_CASE_USAGE]: usage('case-usage', 'include'),
  
  [NODE_TYPES.ANALYSIS_CASE_DEF]:  def('case-def', 'analysis case'),
  [NODE_TYPES.VERIFICATION_CASE_DEF]: def('case-def', 'verification case'),

  // ==================== Views ====================
  // Views (teal)
  [NODE_TYPES.VIEW_DEF]:           def('view-def', 'view'),
  [NODE_TYPES.VIEW_USAGE]:         usage('view-usage', 'view'),
  
  [NODE_TYPES.VIEWPOINT_DEF]:      def('view-def', 'viewpoint'),
  [NODE_TYPES.RENDERING_DEF]:      def('view-def', 'rendering'),

  // ==================== Other ====================
  // Allocations
  [NODE_TYPES.ALLOCATION_DEF]:     def('other', 'allocation'),
  [NODE_TYPES.ALLOCATION_USAGE]:   usage('other', 'allocate'),
  
  // Enumerations
  [NODE_TYPES.ENUMERATION_DEF]:    def('attribute', 'enumeration'),
  [NODE_TYPES.ENUMERATION_USAGE]:  usage('attribute', 'enum'),
  
  // Metadata
  [NODE_TYPES.METADATA_DEF]:       def('other', 'metadata'),

  // ==================== KerML Types ====================
  // Packages (slate)
  [NODE_TYPES.PACKAGE]:            { category: 'package', stereotype: 'package', showFeatures: true },
  [NODE_TYPES.LIBRARY_PACKAGE]:    { category: 'package', stereotype: 'library package', showFeatures: true },
  [NODE_TYPES.FEATURE]:            { category: 'other', stereotype: 'feature', showFeatures: false },
  
  // KerML Classifiers
  [NODE_TYPES.TYPE_DEF]:           def('other', 'type'),
  [NODE_TYPES.CLASSIFIER_DEF]:     def('other', 'classifier'),
  [NODE_TYPES.CLASS_DEF]:          def('part-def', 'class'),
  [NODE_TYPES.DATATYPE_DEF]:       def('attribute', 'datatype'),
  [NODE_TYPES.STRUCTURE_DEF]:      def('part-def', 'struct'),
  [NODE_TYPES.BEHAVIOR_DEF]:       def('action-def', 'behavior'),
  [NODE_TYPES.FUNCTION_DEF]:       def('calculation', 'function'),
  [NODE_TYPES.ASSOCIATION_DEF]:    def('connection', 'assoc'),
  [NODE_TYPES.ASSOCIATION_STRUCTURE_DEF]: def('connection', 'assoc struct'),
  [NODE_TYPES.METACLASS_DEF]:      def('other', 'metaclass'),
  
  // Default fallback for unknown types
  'default':                       { category: 'other', stereotype: 'element', showFeatures: true },
};

/** Get config for a node type, with fallback to default */
export function getNodeConfig(nodeType: string): NodeConfig {
  return NODE_CONFIGS[nodeType] ?? NODE_CONFIGS['default'];
}