# Popover

Floating panel with arbitrary content, triggered by click or hover.

**Import:** `import { Popover } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `ReactNode` | — | Yes | Popover content. |
| `children` | `ReactElement` | — | Yes | Trigger element. |
| `position` | `'top' | 'bottom' | 'left' | 'right'` | 'bottom' |  | Position. |
| `trigger` | `'click' | 'hover'` | 'click' |  | Trigger type. |

## Usage

```tsx
<Popover content={<div>Popover content here</div>} trigger="click">
  <Button>Open popover</Button>
</Popover>
```
