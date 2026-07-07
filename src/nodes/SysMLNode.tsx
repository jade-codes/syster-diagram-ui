import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { DiagramSymbol } from '../types';
import { useTheme, type NodeCategory, type CategoryColors } from '../theme';

/** Node data is the symbol data with additional layout info */
type NodeData = DiagramSymbol & { [key: string]: unknown };

export interface SysMLNodeProps {
  id: string;
  data: NodeData;
  /** Node category for theme-based coloring */
  category: NodeCategory;
  /** Stereotype label (e.g., "part def") */
  stereotype: string;
  showFeatures?: boolean;
  showDirection?: boolean;
  isProperty?: boolean;
}

/** Group features by category based on their metadata or naming */
function groupFeatures(features: string[]): { parts: string[]; attributes: string[]; actions: string[] } {
  const groups = { parts: [] as string[], attributes: [] as string[], actions: [] as string[] };
  
  for (const f of features) {
    const lower = f.toLowerCase();
    if (lower.includes('action') || lower.includes(':action')) {
      groups.actions.push(f);
    } else if (lower.includes('attribute') || lower.includes('attr') || !f.includes(':')) {
      groups.attributes.push(f);
    } else {
      groups.parts.push(f);
    }
  }
  return groups;
}

/**
 * SysML Node Component using React Flow's built-in styling patterns.
 * Colors are derived from the theme based on node category.
 */
export const SysMLNode: React.FC<SysMLNodeProps> = ({
  id,
  data,
  category,
  stereotype,
  showFeatures = false,
  showDirection = false,
  isProperty = false,
}) => {
  const theme = useTheme();
  const colors: CategoryColors = theme.categories[category] ?? theme.categories['other'];
  
  const features = (data.features as string[]) || [];
  const typedBy = data.typedBy as string | undefined;
  const direction = showDirection ? (data.direction as string | undefined) : undefined;
  const groups = groupFeatures(features);
  const hasContent = showFeatures && features.length > 0;

  // Compact property node
  if (isProperty) {
    return (
      <div 
        className="react-flow__node-default" 
        style={{ 
          padding: '4px 8px', 
          fontSize: '11px',
          background: theme.ui.background,
          color: theme.ui.text,
          borderColor: colors.border,
        }}
      >
        <Handle type="target" position={Position.Left} />
        <span>{data.name}</span>
        {typedBy && <span style={{ opacity: 0.6 }}>: {typedBy}</span>}
        <Handle type="source" position={Position.Right} />
      </div>
    );
  }

  return (
    <div 
      className="react-flow__node-default"
      style={{
        padding: 0,
        width: '100%',
        height: '100%',
        minWidth: 180,
        borderColor: colors.border,
        borderWidth: 2,
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: hasContent ? `1px solid ${colors.border}` : 'none',
        background: colors.light,
      }}>
        {stereotype && (
          <div style={{ fontSize: '10px', color: theme.ui.textMuted, textAlign: 'center' }}>
            «{stereotype}»
          </div>
        )}
        <div style={{ fontWeight: 600, textAlign: 'center', fontSize: '13px', color: colors.text }}>
          {direction && <span style={{ fontWeight: 400, color: theme.ui.textMuted }}>{direction} </span>}
          {data.name}
          {typedBy && <span style={{ fontWeight: 400, color: theme.ui.textMuted }}> : {typedBy}</span>}
        </div>
      </div>

      {/* Body with sections */}
      {hasContent && (
        <div style={{ background: colors.light, fontSize: '11px', borderTop: `1px solid ${colors.border}`, paddingBottom: '12px' }}>
          {groups.parts.length > 0 && (
            <Section title="parts" items={groups.parts} nodeId={id} prefix="part" colors={colors} theme={theme} />
          )}
          {groups.attributes.length > 0 && (
            <Section title="attributes" items={groups.attributes} nodeId={id} prefix="attr" colors={colors} theme={theme} />
          )}
          {groups.actions.length > 0 && (
            <Section title="actions" items={groups.actions} nodeId={id} prefix="action" colors={colors} theme={theme} />
          )}
        </div>
      )}
      
      {/* Spacer for nodes without content */}
      {!hasContent && <div style={{ paddingBottom: '8px' }} />}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

/** Section component for feature groups */
const Section: React.FC<{ 
  title: string; 
  items: string[]; 
  nodeId: string; 
  prefix: string;
  colors: CategoryColors;
  theme: ReturnType<typeof useTheme>;
}> = ({ 
  title, items, nodeId, prefix, colors, theme 
}) => (
  <div>
    <div style={{ padding: '4px 10px 2px', fontStyle: 'italic', color: theme.ui.textMuted, fontSize: '10px' }}>
      {title}
    </div>
    {items.map((item, i) => (
      <div key={i} style={{ padding: '3px 10px', position: 'relative', color: theme.ui.text }}>
        {item}
        <Handle 
          type="source" 
          position={Position.Right} 
          id={`${nodeId}-${prefix}-${i}`}
          style={{ right: -4 }}
        />
      </div>
    ))}
  </div>
);
