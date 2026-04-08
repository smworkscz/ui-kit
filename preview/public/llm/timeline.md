# Timeline

Vertical or horizontal timeline with dots/icons and connecting line.

**Import:** `import { Timeline } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `TimelineItem[]` | — | Yes | Items: { title, description?, date?, icon?, color? }. |
| `orientation` | `'vertical' | 'horizontal'` | 'vertical' |  | Timeline orientation. |

## Usage

```tsx
<Timeline items={[
  { title: 'Created', date: '10:00', description: 'Order placed.' },
  { title: 'Shipped', date: '14:30', color: '#00A205' },
  { title: 'Delivered', date: '18:45' },
]} />
```
