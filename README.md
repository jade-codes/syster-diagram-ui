# @syster/diagram-ui

React UI components for SysML v2 diagrams.

## Installation

```bash
npm install @syster/diagram-ui
```

## Usage

```tsx
import { nodeTypes, edgeTypes } from '@syster/diagram-ui';
import { ReactFlow } from '@xyflow/react';

function DiagramViewer({ nodes, edges }) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    />
  );
}
```

## Features

- React Flow node components for SysML element types
- React Flow edge components for SysML relationships
- Styled for VS Code themes
- Supports all SysML v2 definition and usage types

## Dependencies

- `@xyflow/react` - React Flow library
- `@syster/diagram-core` - Core data types

## License

MIT
