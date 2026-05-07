# Tooltip

Hover tooltip bubble.

**Import:** `import { Tooltip } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `string | ReactNode` | — | Yes | Tooltip content. |
| `children` | `ReactElement` | — | Yes | Trigger element. |
| `position` | `'top' | 'bottom' | 'left' | 'right'` | 'top' |  | Position. |
| `delay` | `number` | 0 |  | Show delay in ms. |
| `mode` | `'anchor' | 'cursor'` | 'anchor' |  | Positioning mode. cursor follows mouse. |
| `autoFlip` | `boolean` | true |  | Auto-flip when tooltip exits viewport. |
| `offset` | `[number, number]` | [0, 0] |  | Offset from trigger/cursor in px. |
| `openDelay` | `number` | — |  | Open delay in ms. Overrides delay. |
| `closeDelay` | `number` | 0 |  | Close delay in ms for hover-out grace. |

## Usage

```tsx
<Tooltip content="Delete this item" position="top">
  <Button variant="outline">Delete</Button>
</Tooltip>
```
