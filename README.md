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

## Development

### DevContainer Setup (Recommended)

This project includes a DevContainer configuration for a consistent development environment.

**Using VS Code:**
1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this repository in VS Code
3. Click "Reopen in Container" when prompted (or use Command Palette: "Dev Containers: Reopen in Container")

**What's included:**
- Node.js 20 LTS
- Bun runtime
- ESLint, Prettier
- GitHub CLI
- All VS Code extensions pre-configured

### Manual Setup

If not using DevContainer:

```bash
# Install dependencies
npm install
# or
bun install

# Run tests
npm test
# or
bun test
```
