# DragList

Drag & drop sortable list. Supports flat and tree mode with custom rendering.

**Import:** `import { DragList } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `DragListItem[]` | — | Yes | Items: { id, label, icon?, children?, expanded?, data? }. |
| `onReorder` | `(items) => void` | — | Yes | Reorder callback. |
| `renderItem` | `(item, dragProps) => ReactNode` | — |  | Custom render with drag handle props. |
| `allowNesting` | `boolean` | false |  | Enable tree mode. |
| `maxDepth` | `number` | 3 |  | Max nesting depth. |
| `dragMode` | `'full' | 'handle'` | 'full' |  | Full card or handle-only drag. |

## Usage

```tsx
<DragList
  items={items}
  onReorder={setItems}
  allowNesting
  dragMode="handle"
  renderItem={(item, { handleProps }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span {...handleProps}><DotsSixVerticalIcon size={16} /></span>
      <span>{item.label}</span>
    </div>
  )}
/>
```

## Notes

- renderItem receives handleProps for custom drag handle placement
- allowNesting enables tree mode — drag to center of card to nest
- Collapsed nodes auto-expand on hover during drag
