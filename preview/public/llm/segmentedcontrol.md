# SegmentedControl

Segmented toggle for choosing between a few options. Animated sliding indicator.

**Import:** `import { SegmentedControl } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `(string | { value, label?, icon?, disabled? })[]` | — | Yes | Segment data. Can have icon, label, or both. |
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

// Icon only
<SegmentedControl
  data={[
    { value: 'list', icon: <ListIcon size={16} /> },
    { value: 'grid', icon: <GridFourIcon size={16} /> },
  ]}
  value={view}
  onChange={setView}
/>

// Icon + label
<SegmentedControl
  data={[
    { value: 'light', label: 'Light', icon: <SunIcon size={14} /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon size={14} /> },
  ]}
  value={theme}
  onChange={setTheme}
/>
```
