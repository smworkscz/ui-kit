# Tooltip

Hover tooltip bubble.

**Import:** `import { Tooltip } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `string | ReactNode` | — | Yes | Tooltip content. |
| `children` | `ReactElement` | — | Yes | Trigger element. |
| `position` | `'top' | 'bottom' | 'left' | 'right'` | 'top' |  | Position. |
| `delay` | `number` | 200 |  | Show delay in ms. |

## Usage

```tsx
<Tooltip content="Delete this item" position="top">
  <Button variant="outline">Delete</Button>
</Tooltip>
```
