# StatusBadge

Status dot indicator with optional label and pulse animation. Supports custom statuses.

**Import:** `import { StatusBadge } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `status` | `'online' | 'offline' | 'away' | 'busy' | string` | — | Yes | Status type. Custom strings use color prop. |
| `color` | `string` | — |  | Override dot color for custom statuses. |
| `label` | `string` | — |  | Text label next to dot. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `pulse` | `boolean` | false |  | Pulsing animation on any status. |

## Usage

```tsx
<StatusBadge status="online" label="Online" pulse />
<StatusBadge status="custom" color="#8B5CF6" label="In review" />
```
