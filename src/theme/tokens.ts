/**
 * Design Tokens for SysML Diagram Visualization
 * 
 * Based on SysML v2 graphical notation conventions and modern design systems.
 * These tokens provide a single source of truth for visual styling.
 */

// ========== Colors ==========

/**
 * Semantic color palette for SysML element categories.
 * Based on common SysML tool conventions (Cameo, Papyrus, Enterprise Architect).
 */
export const COLORS = {
  // Structural elements (blue family)
  structural: {
    primary: '#3b82f6',      // blue-500 - main color
    light: '#eff6ff',        // blue-50 - background
    border: '#2563eb',       // blue-600 - borders
    text: '#1e40af',         // blue-800 - text
  },
  
  // Ports and interfaces (purple family)
  interface: {
    primary: '#8b5cf6',      // violet-500
    light: '#f5f3ff',        // violet-50
    border: '#7c3aed',       // violet-600
    text: '#5b21b6',         // violet-800
  },
  
  // Behavioral elements - actions, states (green family)
  behavioral: {
    primary: '#10b981',      // emerald-500
    light: '#ecfdf5',        // emerald-50
    border: '#059669',       // emerald-600
    text: '#065f46',         // emerald-800
  },
  
  // Requirements (amber/orange family)
  requirement: {
    primary: '#f59e0b',      // amber-500
    light: '#fffbeb',        // amber-50
    border: '#d97706',       // amber-600
    text: '#92400e',         // amber-800
  },
  
  // Cases - use case, analysis, verification (indigo family)
  case: {
    primary: '#6366f1',      // indigo-500
    light: '#eef2ff',        // indigo-50
    border: '#4f46e5',       // indigo-600
    text: '#3730a3',         // indigo-800
  },
  
  // Views and viewpoints (teal family)
  view: {
    primary: '#14b8a6',      // teal-500
    light: '#f0fdfa',        // teal-50
    border: '#0d9488',       // teal-600
    text: '#115e59',         // teal-800
  },
  
  // Other/miscellaneous (slate family)
  other: {
    primary: '#64748b',      // slate-500
    light: '#f8fafc',        // slate-50
    border: '#475569',       // slate-600
    text: '#1e293b',         // slate-800
  },
  
  // Packages and namespaces (slate/gray family)
  package: {
    primary: '#64748b',      // slate-500
    light: '#f8fafc',        // slate-50
    border: '#475569',       // slate-600
    text: '#1e293b',         // slate-800
  },
  
  // Connections and relationships
  connection: {
    default: '#94a3b8',      // slate-400
    typing: '#3b82f6',       // blue-500
    specialization: '#8b5cf6', // violet-500
    composition: '#1e293b',  // slate-800
    dependency: '#64748b',   // slate-500
  },
  
  // UI colors
  ui: {
    background: '#ffffff',
    surface: '#f8fafc',      // slate-50
    border: '#e2e8f0',       // slate-200
    text: '#1e293b',         // slate-800
    textMuted: '#64748b',    // slate-500
    textLight: '#94a3b8',    // slate-400
  },
} as const;

// ========== Spacing ==========

/**
 * Spacing scale (in pixels).
 * Based on 4px base unit for consistent rhythm.
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ========== Typography ==========

/**
 * Typography tokens for consistent text styling.
 */
export const TYPOGRAPHY = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Fira Code", "Consolas", monospace',
  },
  
  fontSize: {
    xs: '10px',
    sm: '11px',
    md: '12px',
    lg: '14px',
    xl: '16px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ========== Node Dimensions ==========

/**
 * Standard dimensions for different node types.
 */
export const NODE_DIMENSIONS = {
  // Definition nodes (part def, port def, etc.)
  definition: {
    minWidth: 160,
    maxWidth: 300,
    headerHeight: 32,
    padding: SPACING.md,
  },
  
  // Usage nodes (part, port, etc.)
  usage: {
    minWidth: 120,
    maxWidth: 240,
    headerHeight: 28,
    padding: SPACING.sm,
  },
  
  // Property nodes (attributes, references)
  property: {
    height: 24,
    padding: SPACING.sm,
  },
  
  // Port nodes (small squares on boundaries)
  port: {
    size: 24,
    labelOffset: 4,
  },
  
  // Package/container nodes
  container: {
    minWidth: 200,
    headerHeight: 36,
    padding: SPACING.lg,
    cornerRadius: 0, // Packages have no rounded corners in SysML
  },
} as const;

// ========== Borders & Shadows ==========

/**
 * Border and shadow styling tokens.
 */
export const BORDERS = {
  width: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
  
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
  },
} as const;

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 4px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
} as const;

// ========== Layout Constants ==========

/**
 * Layout spacing for automatic diagram layout.
 */
export const LAYOUT = {
  nodeGap: {
    horizontal: 60,
    vertical: 40,
  },
  
  rankSeparation: 80,
  
  edgeSeparation: 20,
  
  containerPadding: {
    top: 48,    // Room for header
    right: 24,
    bottom: 24,
    left: 24,
  },
} as const;

// ========== Z-Index Layers ==========

/**
 * Z-index values for layering elements.
 */
export const Z_INDEX = {
  edges: 0,
  nodes: 1,
  ports: 2,
  labels: 3,
  overlay: 10,
  tooltip: 100,
} as const;

// ========== Theme Types ==========

/** 
 * Node category for color mapping.
 * Fine-grained categories allow different colors for definitions vs usages
 * and different element types within the same semantic group.
 */
export type NodeCategory = 
  // Structural - different shades of blue
  | 'part-def' | 'part-usage'
  | 'item-def' | 'item-usage'
  | 'attribute'
  // Interface - purple/violet family
  | 'port-def' | 'port-usage'
  | 'interface' | 'connection' | 'flow'
  // Behavioral - green family
  | 'action-def' | 'action-usage'
  | 'state-def' | 'state-usage'
  | 'calculation'
  // Requirements - orange/amber family
  | 'requirement-def' | 'requirement-usage'
  | 'constraint'
  // Cases - indigo family
  | 'case-def' | 'case-usage'
  // Views - teal family
  | 'view-def' | 'view-usage'
  // Other
  | 'package' | 'other';

/** Color set for a node category */
export interface CategoryColors {
  primary: string;
  light: string;    // background
  border: string;
  text: string;
}

/** Theme name type */
export type ThemeName = 'light' | 'dark' | 'pastel';

/** Complete theme definition */
export interface Theme {
  name: ThemeName;
  categories: Record<NodeCategory, CategoryColors>;
  ui: {
    background: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
  };
}

// ========== Light Theme ==========

export const lightTheme: Theme = {
  name: 'light',
  categories: {
    // Structural - blue family with variations
    'part-def': { primary: '#2563eb', light: '#dbeafe', border: '#1d4ed8', text: '#1e40af' },      // strong blue
    'part-usage': { primary: '#3b82f6', light: '#eff6ff', border: '#2563eb', text: '#1e40af' },    // medium blue
    'item-def': { primary: '#0284c7', light: '#e0f2fe', border: '#0369a1', text: '#075985' },      // sky blue
    'item-usage': { primary: '#0ea5e9', light: '#f0f9ff', border: '#0284c7', text: '#075985' },    // light sky
    'attribute': { primary: '#6366f1', light: '#e0e7ff', border: '#4f46e5', text: '#3730a3' },     // indigo for attrs
    
    // Interface - purple/violet family
    'port-def': { primary: '#7c3aed', light: '#ede9fe', border: '#6d28d9', text: '#5b21b6' },      // strong violet
    'port-usage': { primary: '#8b5cf6', light: '#f5f3ff', border: '#7c3aed', text: '#5b21b6' },    // medium violet
    'interface': { primary: '#a855f7', light: '#faf5ff', border: '#9333ea', text: '#6b21a8' },     // purple
    'connection': { primary: '#c026d3', light: '#fdf4ff', border: '#a21caf', text: '#86198f' },    // fuchsia
    'flow': { primary: '#d946ef', light: '#fdf4ff', border: '#c026d3', text: '#86198f' },          // pink-purple
    
    // Behavioral - green family
    'action-def': { primary: '#059669', light: '#d1fae5', border: '#047857', text: '#065f46' },    // strong emerald
    'action-usage': { primary: '#10b981', light: '#ecfdf5', border: '#059669', text: '#065f46' },  // medium emerald
    'state-def': { primary: '#16a34a', light: '#dcfce7', border: '#15803d', text: '#166534' },     // strong green
    'state-usage': { primary: '#22c55e', light: '#f0fdf4', border: '#16a34a', text: '#166534' },   // medium green
    'calculation': { primary: '#65a30d', light: '#ecfccb', border: '#4d7c0f', text: '#365314' },   // lime
    
    // Requirements - orange/amber family  
    'requirement-def': { primary: '#d97706', light: '#fef3c7', border: '#b45309', text: '#92400e' }, // strong amber
    'requirement-usage': { primary: '#f59e0b', light: '#fffbeb', border: '#d97706', text: '#92400e' }, // medium amber
    'constraint': { primary: '#ea580c', light: '#ffedd5', border: '#c2410c', text: '#9a3412' },    // orange
    
    // Cases - indigo/slate family
    'case-def': { primary: '#4f46e5', light: '#e0e7ff', border: '#4338ca', text: '#3730a3' },      // strong indigo
    'case-usage': { primary: '#6366f1', light: '#eef2ff', border: '#4f46e5', text: '#3730a3' },    // medium indigo
    
    // Views - teal/cyan family
    'view-def': { primary: '#0d9488', light: '#ccfbf1', border: '#0f766e', text: '#115e59' },      // strong teal
    'view-usage': { primary: '#14b8a6', light: '#f0fdfa', border: '#0d9488', text: '#115e59' },    // medium teal
    
    // Other
    'package': { primary: '#475569', light: '#f1f5f9', border: '#334155', text: '#1e293b' },       // slate
    'other': { primary: '#64748b', light: '#f8fafc', border: '#475569', text: '#1e293b' },         // lighter slate
  },
  ui: {
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b',
  },
};

// ========== Dark Theme ==========

export const darkTheme: Theme = {
  name: 'dark',
  categories: {
    // Structural - blue family
    'part-def': { primary: '#3b82f6', light: '#1e3a5f', border: '#2563eb', text: '#93c5fd' },
    'part-usage': { primary: '#60a5fa', light: '#172554', border: '#3b82f6', text: '#bfdbfe' },
    'item-def': { primary: '#0ea5e9', light: '#0c4a6e', border: '#0284c7', text: '#7dd3fc' },
    'item-usage': { primary: '#38bdf8', light: '#082f49', border: '#0ea5e9', text: '#bae6fd' },
    'attribute': { primary: '#818cf8', light: '#1e1b4b', border: '#6366f1', text: '#a5b4fc' },
    
    // Interface - purple family
    'port-def': { primary: '#8b5cf6', light: '#2e1065', border: '#7c3aed', text: '#c4b5fd' },
    'port-usage': { primary: '#a78bfa', light: '#1e1b4b', border: '#8b5cf6', text: '#ddd6fe' },
    'interface': { primary: '#c084fc', light: '#3b0764', border: '#a855f7', text: '#e9d5ff' },
    'connection': { primary: '#e879f9', light: '#4a044e', border: '#d946ef', text: '#f5d0fe' },
    'flow': { primary: '#f0abfc', light: '#581c87', border: '#e879f9', text: '#fae8ff' },
    
    // Behavioral - green family
    'action-def': { primary: '#10b981', light: '#064e3b', border: '#059669', text: '#6ee7b7' },
    'action-usage': { primary: '#34d399', light: '#022c22', border: '#10b981', text: '#a7f3d0' },
    'state-def': { primary: '#22c55e', light: '#14532d', border: '#16a34a', text: '#86efac' },
    'state-usage': { primary: '#4ade80', light: '#052e16', border: '#22c55e', text: '#bbf7d0' },
    'calculation': { primary: '#a3e635', light: '#1a2e05', border: '#84cc16', text: '#d9f99d' },
    
    // Requirements - amber family
    'requirement-def': { primary: '#f59e0b', light: '#451a03', border: '#d97706', text: '#fcd34d' },
    'requirement-usage': { primary: '#fbbf24', light: '#78350f', border: '#f59e0b', text: '#fde68a' },
    'constraint': { primary: '#f97316', light: '#431407', border: '#ea580c', text: '#fdba74' },
    
    // Cases - indigo family
    'case-def': { primary: '#6366f1', light: '#1e1b4b', border: '#4f46e5', text: '#a5b4fc' },
    'case-usage': { primary: '#818cf8', light: '#312e81', border: '#6366f1', text: '#c7d2fe' },
    
    // Views - teal family
    'view-def': { primary: '#14b8a6', light: '#042f2e', border: '#0d9488', text: '#5eead4' },
    'view-usage': { primary: '#2dd4bf', light: '#134e4a', border: '#14b8a6', text: '#99f6e4' },
    
    // Other
    'package': { primary: '#64748b', light: '#0f172a', border: '#475569', text: '#94a3b8' },
    'other': { primary: '#94a3b8', light: '#1e293b', border: '#64748b', text: '#cbd5e1' },
  },
  ui: {
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
  },
};

// ========== Pastel Theme ==========

export const pastelTheme: Theme = {
  name: 'pastel',
  categories: {
    // Structural - soft blues
    'part-def': { primary: '#60a5fa', light: '#bfdbfe', border: '#3b82f6', text: '#374151' },      // sky blue
    'part-usage': { primary: '#7dd3fc', light: '#cfe8fc', border: '#38bdf8', text: '#374151' },    // lighter sky
    'item-def': { primary: '#818cf8', light: '#c7d2fe', border: '#6366f1', text: '#374151' },      // indigo
    'item-usage': { primary: '#a5b4fc', light: '#e0e7ff', border: '#818cf8', text: '#374151' },    // light indigo
    'attribute': { primary: '#c084fc', light: '#e9d5ff', border: '#a855f7', text: '#374151' },     // purple
    
    // Interface - soft purples/pinks
    'port-def': { primary: '#e879f9', light: '#f5d0fe', border: '#d946ef', text: '#374151' },      // fuchsia
    'port-usage': { primary: '#f0abfc', light: '#fae8ff', border: '#e879f9', text: '#374151' },    // light fuchsia
    'interface': { primary: '#f472b6', light: '#fbcfe8', border: '#ec4899', text: '#374151' },     // pink
    'connection': { primary: '#fb7185', light: '#fecdd3', border: '#f43f5e', text: '#374151' },    // rose
    'flow': { primary: '#fda4af', light: '#ffe4e6', border: '#fb7185', text: '#374151' },          // light rose
    
    // Behavioral - soft blues/cyans (not greens)
    'action-def': { primary: '#22d3ee', light: '#a5f3fc', border: '#06b6d4', text: '#374151' },    // cyan
    'action-usage': { primary: '#67e8f9', light: '#cffafe', border: '#22d3ee', text: '#374151' },  // light cyan
    'state-def': { primary: '#38bdf8', light: '#bae6fd', border: '#0ea5e9', text: '#374151' },     // sky
    'state-usage': { primary: '#7dd3fc', light: '#e0f2fe', border: '#38bdf8', text: '#374151' },   // light sky
    'calculation': { primary: '#a78bfa', light: '#ddd6fe', border: '#8b5cf6', text: '#374151' },   // violet
    
    // Requirements - soft oranges/corals
    'requirement-def': { primary: '#fb923c', light: '#fed7aa', border: '#f97316', text: '#374151' }, // orange
    'requirement-usage': { primary: '#fdba74', light: '#ffedd5', border: '#fb923c', text: '#374151' }, // light orange
    'constraint': { primary: '#f87171', light: '#fecaca', border: '#ef4444', text: '#374151' },    // red/coral
    
    // Cases - soft purples
    'case-def': { primary: '#a78bfa', light: '#ddd6fe', border: '#8b5cf6', text: '#374151' },      // violet
    'case-usage': { primary: '#c4b5fd', light: '#ede9fe', border: '#a78bfa', text: '#374151' },    // light violet
    
    // Views - soft blues
    'view-def': { primary: '#60a5fa', light: '#bfdbfe', border: '#3b82f6', text: '#374151' },      // blue
    'view-usage': { primary: '#93c5fd', light: '#dbeafe', border: '#60a5fa', text: '#374151' },    // light blue
    
    // Other - soft pink/mauve instead of gray
    'package': { primary: '#c4b5fd', light: '#ede9fe', border: '#a78bfa', text: '#374151' },       // soft violet
    'other': { primary: '#f9a8d4', light: '#fce7f3', border: '#f472b6', text: '#374151' },         // soft pink
  },
  ui: {
    background: '#fefcff',
    surface: '#fdf4ff',
    border: '#f5d0fe',
    text: '#374151',
    textMuted: '#6b7280',
  },
};

/** Get theme by name */
export function getTheme(name: ThemeName): Theme {
  switch (name) {
    case 'dark': return darkTheme;
    case 'pastel': return pastelTheme;
    default: return lightTheme;
  }
}
