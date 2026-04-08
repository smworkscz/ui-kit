# Select

Dropdown select with search, multi-select, clear, and keyboard navigation.

**Import:** `import { Select } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — |  | Label text above the select (uppercase styled). |
| `options` | `SelectOption[]` | — | Yes | Array of { value: string; label?: string; disabled?: boolean }. |
| `value` | `string | string[] | null` | — |  | Current value (string for single, array for multiple). |
| `onChange` | `(value: any) => void` | — |  | Change callback. |
| `multiple` | `boolean` | false |  | Enable multi-select. |
| `searchable` | `boolean` | false |  | Show search/filter input in dropdown. |
| `clearable` | `boolean` | false |  | Show clear button. |
| `disabled` | `boolean` | false |  | Disable select. |
| `loading` | `boolean` | false |  | Show spinner instead of chevron. |
| `error` | `boolean | string` | — |  | Error state or message. |
| `placeholder` | `string` | 'Vyberte…' |  | Placeholder text. |

## Usage

```tsx
<Select
  label="Framework"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  value={value}
  onChange={setValue}
  searchable
  clearable
/>
```

## Notes

- Portal-based dropdown for proper stacking
- Keyboard navigation (arrows, enter, escape)
- Multi-select shows tags for selected values
