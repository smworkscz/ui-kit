# SegmentedControl

Segmented toggle for choosing between a few options. Animated sliding indicator.

**Import:** `import { SegmentedControl } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `(string | { value, label?, disabled? })[]` | — | Yes | Segment data. Strings auto-convert. |
| `value` | `string` | — | Yes | Currently selected value. |
| `onChange` | `(value: string) => void` | — | Yes | Change callback. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `fullWidth` | `boolean` | false |  | Stretch to container width. |
| `orientation` | `'horizontal' | 'vertical'` | 'horizontal' |  | Orientation. |
| `disabled` | `boolean` | false |  | Disable all segments. |

## Usage

```tsx
<SegmentedControl data={['List', 'Grid', 'Table']} value={view} onChange={setView} />
<SegmentedControl
  data={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]}
  value={plan}
  onChange={setPlan}
/>
```
