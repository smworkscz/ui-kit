# Input

Text input with icon support, loading state, validation, clear button, and password toggle.

**Import:** `import { Input } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — |  | Label text above the input (uppercase styled). |
| `icon` | `ReactNode` | — |  | Icon inside the field. |
| `iconPosition` | `'left' | 'right'` | 'left' |  | Icon position. |
| `error` | `boolean | string` | false |  | Error state. String displays error message below. |
| `helperText` | `string` | — |  | Helper text below input. |
| `loading` | `boolean` | false |  | Shows spinner, makes read-only. |
| `clearable` | `boolean` | false |  | Shows clear button. |
| `passwordToggle` | `boolean` | — |  | Shows eye icon for password visibility. Auto-enabled for type="password". |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `fullWidth` | `boolean` | false |  | Stretches to full width. |
| `disabled` | `boolean` | false |  | Disables input. |

## Usage

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input icon={<MagnifyingGlassIcon size={16} />} placeholder="Search..." />
<Input type="password" label="Password" />
<Input error="This field is required" />
<Input loading clearable />
```

## Notes

- Extends native `<input>` HTML attributes
- Password toggle auto-enabled for type="password"
- Forward ref supported
