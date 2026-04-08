# NumberInput

Numeric input with +/- buttons, min/max clamping, step, prefix/suffix. Compact variant with stacked chevrons.

**Import:** `import { NumberInput } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Current value. |
| `onChange` | `(value: number) => void` | — | Yes | Change callback. |
| `variant` | `'default' | 'compact'` | 'default' |  | Default: side buttons. Compact: stacked chevrons on right. |
| `min` | `number` | — |  | Minimum value. |
| `max` | `number` | — |  | Maximum value. |
| `step` | `number` | 1 |  | Increment/decrement step. |
| `label` | `string` | — |  | Label text. |
| `prefix` | `string` | — |  | Text before value (e.g. "$"). |
| `suffix` | `string` | — |  | Text after value (e.g. "kg"). |
| `error` | `boolean | string` | — |  | Error state. |
| `disabled` | `boolean` | false |  | Disable input. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<NumberInput value={qty} onChange={setQty} min={0} max={100} label="Množství" />
<NumberInput variant="compact" value={count} onChange={setCount} suffix="ks" />
```

## Notes

- Hold +/- button for continuous increment
- Value is clamped to min/max on change
