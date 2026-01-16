import { describe, it, expect } from 'bun:test';
import {
  ViewFrame,
  ViewRenderer,
  GeneralViewRenderer,
  InterconnectionViewRenderer,
  ActionFlowViewRenderer,
  StateTransitionViewRenderer,
  buildGraph,
  calculateLevels,
  applyLevelLayout,
  applyGridLayout,
} from '../views';

describe('views module exports', () => {
  it('exports ViewFrame component', () => {
    expect(ViewFrame).toBeDefined();
    expect(typeof ViewFrame).toBe('function');
  });

  it('exports ViewRenderer component', () => {
    expect(ViewRenderer).toBeDefined();
    expect(typeof ViewRenderer).toBe('function');
  });

  it('exports named view renderers', () => {
    expect(GeneralViewRenderer).toBeDefined();
    expect(InterconnectionViewRenderer).toBeDefined();
    expect(ActionFlowViewRenderer).toBeDefined();
    expect(StateTransitionViewRenderer).toBeDefined();
  });

  it('exports layout utility functions', () => {
    expect(typeof buildGraph).toBe('function');
    expect(typeof calculateLevels).toBe('function');
    expect(typeof applyLevelLayout).toBe('function');
    expect(typeof applyGridLayout).toBe('function');
  });
});
