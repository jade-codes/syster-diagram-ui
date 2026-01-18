import { describe, test, expect, mock, afterEach } from 'bun:test';
import { render, screen, cleanup } from '@testing-library/react';
import { NODE_TYPES } from '@opensyster/diagram-core';

// Mock @xyflow/react before importing components
mock.module('@xyflow/react', () => ({
  Handle: () => null,
  Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { nodeTypes, getNodeConfig, UnifiedSysMLNode } from '../nodes/nodeFactory';
import { NODE_CONFIGS } from '../nodes/nodeConfig';
import { SysMLNode } from '../nodes/SysMLNode';

// Clean up after each test to prevent DOM pollution
afterEach(() => {
  cleanup();
});

// Minimal test data - only includes fields the components actually use
interface TestNodeData {
  name: string;
  qualifiedName: string;
  nodeType: string;
  features?: string[];
  direction?: string;
}

describe('UnifiedSysMLNode', () => {
  test('renders with config-based stereotype', () => {
    const data: TestNodeData = {
      name: 'TestElement',
      qualifiedName: 'Pkg::TestElement',
      nodeType: NODE_TYPES.PART_DEF,
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PART_DEF} data={data as any} />);

    expect(screen.getByText('«part def»')).toBeDefined();
    expect(screen.getByText('TestElement')).toBeDefined();
  });

  test('shows features from config', () => {
    const data: TestNodeData = {
      name: 'TestElement',
      qualifiedName: 'Pkg::TestElement',
      nodeType: NODE_TYPES.PART_DEF,
      features: ['myFeature: Integer'],
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PART_DEF} data={data as any} />);

    expect(screen.getByText('myFeature: Integer')).toBeDefined();
  });

  test('shows multiple features correctly', () => {
    const data: TestNodeData = {
      name: 'TestElement',
      qualifiedName: 'Pkg::TestElement',
      nodeType: NODE_TYPES.PART_DEF,
      features: ['feature1: String', 'feature2: Integer', 'feature3: Boolean'],
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PART_DEF} data={data as any} />);

    expect(screen.getByText('feature1: String')).toBeDefined();
    expect(screen.getByText('feature2: Integer')).toBeDefined();
    expect(screen.getByText('feature3: Boolean')).toBeDefined();
  });

  test('shows direction when showDirection is true in config', () => {
    const data: TestNodeData = {
      name: 'DataPort',
      qualifiedName: 'Pkg::DataPort',
      nodeType: NODE_TYPES.PORT_DEF,
      direction: 'in',
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PORT_DEF} data={data as any} />);

    expect(screen.getByText('in')).toBeDefined();
  });

  test('has displayName set', () => {
    expect(UnifiedSysMLNode.displayName).toBe('UnifiedSysMLNode');
  });

  test('hides direction when showDirection is false', () => {
    const data: TestNodeData = {
      name: 'TestPart',
      qualifiedName: 'Pkg::TestPart',
      nodeType: NODE_TYPES.PART_DEF,
      direction: 'inout', // Even with direction data, it should be hidden
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PART_DEF} data={data as any} />);

    // Direction should not appear since part def doesn't have showDirection
    expect(screen.queryByText('inout')).toBeNull();
  });

  test('shows typedBy when present', () => {
    const data = {
      name: 'myPart',
      qualifiedName: 'Pkg::myPart',
      nodeType: NODE_TYPES.PART_USAGE,
      typedBy: 'Vehicle',
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PART_USAGE} data={data as any} />);

    expect(screen.getByText(': Vehicle')).toBeDefined();
  });

  test('groups features into parts, attributes, and actions', () => {
    const data: TestNodeData = {
      name: 'TestElement',
      qualifiedName: 'Pkg::TestElement',
      nodeType: NODE_TYPES.PART_DEF,
      features: [
        'doSomething: Action',       // Should go to actions
        'name: String',               // Should go to attributes (no colon with type)
        'engine: Engine',             // Should go to parts
        'performTask: action',        // Should go to actions (lowercase)
        'attr_value: Integer',        // Should go to attributes (has attr)
      ],
    };

    render(<UnifiedSysMLNode id="test-1" type={NODE_TYPES.PART_DEF} data={data as any} />);

    // Check section headers
    expect(screen.getByText('parts')).toBeDefined();
    expect(screen.getByText('attributes')).toBeDefined();
    expect(screen.getByText('actions')).toBeDefined();
  });
});

describe('nodeTypes', () => {
  test('contains all node types from NODE_CONFIGS', () => {
    const configKeys = Object.keys(NODE_CONFIGS);
    
    for (const key of configKeys) {
      expect(nodeTypes[key]).toBeDefined();
      expect(typeof nodeTypes[key]).toBe('function');
    }
  });

  test('includes all definition types', () => {
    const definitionTypes = [
      NODE_TYPES.PART_DEF,
      NODE_TYPES.PORT_DEF,
      NODE_TYPES.ACTION_DEF,
      NODE_TYPES.STATE_DEF,
      NODE_TYPES.REQUIREMENT_DEF,
      NODE_TYPES.ITEM_DEF,
      NODE_TYPES.ATTRIBUTE_DEF,
      NODE_TYPES.VIEW_DEF,
    ];

    for (const type of definitionTypes) {
      expect(nodeTypes[type]).toBeDefined();
    }
  });

  test('includes all usage types', () => {
    const usageTypes = [
      NODE_TYPES.PART_USAGE,
      NODE_TYPES.PORT_USAGE,
      NODE_TYPES.ACTION_USAGE,
      NODE_TYPES.REQUIREMENT_USAGE,
    ];

    for (const type of usageTypes) {
      expect(nodeTypes[type]).toBeDefined();
    }
  });

  test('includes default fallback', () => {
    expect(nodeTypes['default']).toBeDefined();
  });

  test('renders a part def node correctly', () => {
    const PartDefNode = nodeTypes[NODE_TYPES.PART_DEF];
    
    const data: TestNodeData = {
      name: 'Vehicle',
      qualifiedName: 'Pkg::Vehicle',
      nodeType: NODE_TYPES.PART_DEF,
      features: ['engine: Engine'],
    };

    render(<PartDefNode id="vehicle-1" type={NODE_TYPES.PART_DEF} data={data as any} />);

    expect(screen.getByText('«part def»')).toBeDefined();
    expect(screen.getByText('Vehicle')).toBeDefined();
    expect(screen.getByText('engine: Engine')).toBeDefined();
  });

  test('renders a port def node with direction', () => {
    const PortDefNode = nodeTypes[NODE_TYPES.PORT_DEF];
    
    const data: TestNodeData = {
      name: 'DataPort',
      qualifiedName: 'Pkg::DataPort',
      nodeType: NODE_TYPES.PORT_DEF,
      direction: 'out',
    };

    render(<PortDefNode id="port-1" type={NODE_TYPES.PORT_DEF} data={data as any} />);

    expect(screen.getByText('«port def»')).toBeDefined();
    expect(screen.getByText('DataPort')).toBeDefined();
    expect(screen.getByText('out')).toBeDefined();
  });
});

describe('getNodeConfig', () => {
  test('returns config for valid node type', () => {
    const config = getNodeConfig(NODE_TYPES.PART_DEF);

    expect(config).toBeDefined();
    expect(config?.stereotype).toBe('part def');
    expect(config?.category).toBe('part-def');
    expect(config?.showFeatures).toBe(true);
  });

  test('returns config for port def with showDirection', () => {
    const config = getNodeConfig(NODE_TYPES.PORT_DEF);

    expect(config).toBeDefined();
    expect(config?.stereotype).toBe('port def');
    expect(config?.showDirection).toBe(true);
  });

  test('returns default config for unknown node type', () => {
    const config = getNodeConfig('unknown-type');

    // Should return a default config
    expect(config).toBeDefined();
    expect(config?.category).toBe('other');
  });
});

describe('NODE_CONFIGS', () => {
  test('all configs have required properties', () => {
    const missingProps: string[] = [];

    for (const [type, config] of Object.entries(NODE_CONFIGS)) {
      if (!config.category) {
        missingProps.push(`${type}: missing category`);
      }
      // stereotype can be empty for property-style nodes
    }

    expect(missingProps).toEqual([]);
  });

  test('all configs have valid categories', () => {
    const validCategories = [
      'part-def', 'part-usage', 'item-def', 'item-usage', 'attribute',
      'port-def', 'port-usage', 'interface', 'connection', 'flow',
      'action-def', 'action-usage', 'state-def', 'state-usage', 'calculation',
      'requirement-def', 'requirement-usage', 'constraint',
      'case-def', 'case-usage', 'view-def', 'view-usage',
      'package', 'other'
    ];

    const invalidCategories: string[] = [];

    for (const [type, config] of Object.entries(NODE_CONFIGS)) {
      if (!validCategories.includes(config.category)) {
        invalidCategories.push(`${type}: ${config.category}`);
      }
    }

    expect(invalidCategories).toEqual([]);
  });

  test('definition types have "def" in stereotype', () => {
    const defTypes = Object.entries(NODE_CONFIGS).filter(([type]) => type.includes('Def'));
    const invalidStereotypes: string[] = [];

    for (const [type, config] of defTypes) {
      if (config.stereotype && !config.stereotype.includes('def')) {
        invalidStereotypes.push(`${type}: ${config.stereotype}`);
      }
    }

    expect(invalidStereotypes).toEqual([]);
  });

  test('usage types do not have "def" in stereotype', () => {
    const usageTypes = Object.entries(NODE_CONFIGS).filter(([type]) => type.includes('Usage'));
    const invalidStereotypes: string[] = [];

    for (const [type, config] of usageTypes) {
      if (config.stereotype && config.stereotype.includes('def')) {
        invalidStereotypes.push(`${type}: ${config.stereotype}`);
      }
    }

    expect(invalidStereotypes).toEqual([]);
  });
});

describe('SysMLNode direct rendering', () => {
  test('renders in property mode with compact layout', () => {
    const data = {
      name: 'voltage',
      qualifiedName: 'Pkg::voltage',
      nodeType: 'AttributeUsage',
    };

    render(
      <SysMLNode
        id="prop-1"
        data={data as any}
        category="attribute"
        stereotype="attribute"
        isProperty={true}
      />
    );

    expect(screen.getByText('voltage')).toBeDefined();
  });

  test('property mode shows typedBy', () => {
    const data = {
      name: 'voltage',
      qualifiedName: 'Pkg::voltage',
      nodeType: 'AttributeUsage',
      typedBy: 'Real',
    };

    render(
      <SysMLNode
        id="prop-1"
        data={data as any}
        category="attribute"
        stereotype="attribute"
        isProperty={true}
      />
    );

    expect(screen.getByText('voltage')).toBeDefined();
    expect(screen.getByText(': Real')).toBeDefined();
  });

  test('renders non-property mode with full layout', () => {
    const data = {
      name: 'Engine',
      qualifiedName: 'Pkg::Engine',
      nodeType: NODE_TYPES.PART_DEF,
    };

    render(
      <SysMLNode
        id="part-1"
        data={data as any}
        category="part-def"
        stereotype="part def"
        isProperty={false}
      />
    );

    expect(screen.getByText('«part def»')).toBeDefined();
    expect(screen.getByText('Engine')).toBeDefined();
  });

  test('renders with no stereotype when empty', () => {
    const data = {
      name: 'GenericElement',
      qualifiedName: 'Pkg::GenericElement',
      nodeType: 'default',
    };

    render(
      <SysMLNode
        id="generic-1"
        data={data as any}
        category="other"
        stereotype=""
        showFeatures={false}
      />
    );

    expect(screen.getByText('GenericElement')).toBeDefined();
    // Should not have a stereotype line
    expect(screen.queryByText(/«.*»/)).toBeNull();
  });
});
