# ProgressBar / ProgressCircle

Progress indicator as bar or circle. Supports variants, thresholds, and indeterminate mode.

**Import:** `import { ProgressBar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Value 0-max. |
| `max` | `number` | 100 |  | Maximum value. |
| `size` | `'xs' | 'sm' | 'md'` | 'md' |  | Size (ProgressBar). |
| `variant` | `'default' | 'success' | 'warning' | 'danger'` | 'default' |  | Color variant. |
| `color` | `string` | '#E8612D' |  | Bar/circle color (overrides variant). |
| `showValue` | `boolean` | false |  | Show percentage. |
| `label` | `string` | — |  | Label text. |
| `striped` | `boolean` | false |  | Striped effect (ProgressBar). |
| `animated` | `boolean` | false |  | Animate stripes (ProgressBar). |
| `thresholds` | `Array<{ value, variant }>` | — |  | Auto-switch variant based on value thresholds. |
| `indeterminate` | `boolean` | false |  | Infinite animation without specific value (ProgressBar). |
| `valueLabel` | `string | ((value) => string)` | — |  | Custom center label (ProgressCircle). |
| `thickness` | `number` | — |  | Circle stroke thickness (ProgressCircle). |

## Usage

```tsx
<ProgressBar value={65} showValue label="Upload" />
<ProgressBar indeterminate label="Loading..." />
<ProgressBar value={80} thresholds={[{value:30,variant:'danger'},{value:60,variant:'warning'},{value:100,variant:'success'}]} />
<ProgressCircle value={75} showValue />
```
