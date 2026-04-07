# Slider

Range slider for selecting numeric values. Supports range mode.

**Import:** `import { Slider } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number | [number, number]` | — | Yes | Current value. |
| `onChange` | `(value) => void` | — |  | Change callback. |
| `min` | `number` | 0 |  | Minimum value. |
| `max` | `number` | 100 |  | Maximum value. |
| `step` | `number` | 1 |  | Step size. |
| `label` | `string` | — |  | Label text. |
| `showValue` | `boolean` | false |  | Show current value. |
| `range` | `boolean` | false |  | Range mode (min-max). |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Slider value={50} onChange={setValue} label="Volume" showValue />
<Slider value={[20, 80]} onChange={setRange} range />
```
