# Stat

Statistical value display with trend indicator. Supports loading, clickable, and helper text.

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
| `loading` | `boolean` | false |  | Show skeleton placeholder. |
| `onClick` | `() => void` | — |  | Click callback — stat behaves as a button. |
| `helper` | `string | ReactNode` | — |  | Helper text below the value. |

## Usage

```tsx
<Stat label="Revenue" value="€52,400" change={8.2} trend="up" />
<Stat label="Users" value="1,234" loading />
<Stat label="Orders" value="89" onClick={() => navigate('/orders')} />
```
