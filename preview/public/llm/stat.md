# Stat

Statistical value display with trend indicator.

**Import:** `import { Stat } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — | Yes | Stat label. |
| `value` | `string | number` | — | Yes | Main value. |
| `change` | `number` | — |  | Percentage change. |
| `changeLabel` | `string` | — |  | Change description text. |
| `trend` | `'up' | 'down' | 'neutral'` | 'neutral' |  | Trend direction. |
| `icon` | `ReactNode` | — |  | Icon. |

## Usage

```tsx
<Stat label="Revenue" value="€52,400" change={8.2} trend="up" />
```
