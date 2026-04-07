# Checkbox

Checkbox with indeterminate state, error messages, and size variants.

**Import:** `import { Checkbox } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean` | false |  | Checked state. |
| `onChange` | `(checked: boolean) => void` | — |  | Change callback. |
| `label` | `string` | — |  | Label text. |
| `disabled` | `boolean` | false |  | Disable interaction. |
| `error` | `boolean | string` | — |  | Error state or message. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `indeterminate` | `boolean` | false |  | Show dash instead of checkmark. |

## Usage

```tsx
<Checkbox label="I agree" checked={agreed} onChange={setAgreed} />
<Checkbox indeterminate label="Select all" />
```
