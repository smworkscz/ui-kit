# ProgressBar / ProgressCircle

Progress indicator as bar or circle.

**Import:** `import { ProgressBar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Value 0-100. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size (ProgressBar). |
| `color` | `string` | '#E8612D' |  | Bar/circle color. |
| `showValue` | `boolean` | false |  | Show percentage. |
| `label` | `string` | — |  | Label text. |
| `striped` | `boolean` | false |  | Striped effect (ProgressBar). |
| `animated` | `boolean` | false |  | Animate stripes (ProgressBar). |

## Usage

```tsx
<ProgressBar value={65} showValue label="Upload" />
<ProgressCircle value={75} showValue />
```
