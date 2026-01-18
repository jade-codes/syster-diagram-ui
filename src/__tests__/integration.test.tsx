/**
 * Integration tests for diagram rendering flow.
 * 
 * Tests the complete flow from symbol data to rendered nodes.
 */
import { describe, test, expect, mock, afterEach } from 'bun:test';
import { render, screen, cleanup } from '@testing-library/react';
import { NODE_TYPES } from '@opensyster/diagram-core';
import type { DiagramSymbol } from '../types';

// Local isValidNodeType since it's no longer exported from diagram-core
const VALID_NODE_TYPES = new Set(Object.values(NODE_TYPES));
function isValidNodeType(nodeType: string): boolean {
  return VALID_NODE_TYPES.has(nodeType as any);
}

// Mock @xyflow/react
mock.module('@xyflow/react', () => ({
  Handle: () => null,
  Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { nodeTypes, getNodeConfig } from '../nodes/nodeFactory';
import { NODE_CONFIGS } from '../nodes/nodeConfig';

afterEach(() => {
  cleanup();
});

// ========== Test: Node type registry ==========

describe('nodeTypes registry', () => {
  test('contains all expected NODE_TYPES', () => {
    const registeredTypes = Object.keys(nodeTypes);
    
    // Check all NODE_TYPES are registered
    for (const [key, value] of Object.entries(NODE_TYPES)) {
      expect(registeredTypes).toContain(value);
    }
  });

  test('has matching configs and components', () => {
    // Every config should produce a component
    for (const nodeType of Object.keys(NODE_CONFIGS)) {
      expect(nodeTypes[nodeType]).toBeDefined();
      expect(typeof nodeTypes[nodeType]).toBe('function');
    }
  });
});

// ========== Test: isValidNodeType validation ==========

describe('isValidNodeType validation', () => {
  test('returns true for all NODE_TYPES values', () => {
    for (const nodeType of Object.values(NODE_TYPES)) {
      expect(isValidNodeType(nodeType)).toBe(true);
    }
  });

  test('returns false for invalid types', () => {
    expect(isValidNodeType('InvalidType')).toBe(false);
    expect(isValidNodeType('NotARealType')).toBe(false);
    expect(isValidNodeType('SomeGarbageType')).toBe(false);
    expect(isValidNodeType('')).toBe(false);
  });
});

// ========== Test: Symbol nodeType integration ==========

describe('Symbol nodeType integration', () => {
  // Example symbols that match diagram-ui's expected format
  const symbols: DiagramSymbol[] = [
    {
      name: 'Engine',
      qualifiedName: 'CarWithShapeAndCSG::Engine',
      nodeType: 'PartDef',
    },
    {
      name: 'cylinder1',
      qualifiedName: 'CarWithShapeAndCSG::Engine::cylinder1',
      nodeType: 'ItemUsage',
    },
    {
      name: 'shape',
      qualifiedName: 'CarWithShapeAndCSG::Engine::cylinder1::shape',
      nodeType: 'ItemUsage',
      typedBy: 'Cylinder',
    },
    {
      name: 'radius',
      qualifiedName: 'CarWithShapeAndCSG::Engine::cylinder1::shape::radius',
      nodeType: 'ReferenceUsage',
    },
    {
      name: 'coordinateFrame',
      qualifiedName: 'CarWithShapeAndCSG::Engine::cylinder1::coordinateFrame',
      nodeType: 'AttributeUsage',
    },
    {
      name: 'fuelPort',
      qualifiedName: 'Vehicle::fuelPort',
      nodeType: 'PortUsage',
      direction: 'in',
    },
  ];

  test('all symbols have valid nodeType', () => {
    for (const symbol of symbols) {
      expect(isValidNodeType(symbol.nodeType)).toBe(true);
    }
  });

  test('all nodeTypes have registered components', () => {
    for (const symbol of symbols) {
      expect(nodeTypes[symbol.nodeType]).toBeDefined();
    }
  });

  test('renders each symbol correctly', () => {
    for (const symbol of symbols) {
      const Component = nodeTypes[symbol.nodeType];
      
      cleanup();
      
      render(
        <Component
          id={symbol.qualifiedName.replace(/::/g, '_')}
          data={{
            name: symbol.name,
            qualifiedName: symbol.qualifiedName,
            nodeType: symbol.nodeType,
            typedBy: symbol.typedBy,
            direction: symbol.direction,
          }}
        />
      );

      // Should render the name
      expect(screen.getByText(symbol.name)).toBeDefined();
    }
  });
});
