# Tree

Tree view with expand/collapse, selection, and custom icons.

**Import:** `import { Tree } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `TreeNode[]` | — | Yes | Tree data: { id, label, icon?, children? }. |
| `onSelect` | `(node: TreeNode) => void` | — |  | Node select callback. |
| `selectedId` | `string` | — |  | Currently selected node ID. |
| `defaultExpanded` | `string[]` | — |  | Initially expanded node IDs. |

## Usage

```tsx
<Tree
  data={[
    { id: 'src', label: 'src', children: [
      { id: 'index', label: 'index.ts' },
    ]},
  ]}
  selectedId={selected}
  onSelect={(node) => setSelected(node.id)}
  defaultExpanded={['src']}
/>
```
