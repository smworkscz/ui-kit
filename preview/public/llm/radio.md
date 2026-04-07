# RadioGroup

Radio button group for selecting one option from a list.

**Import:** `import { RadioGroup } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string` | — |  | Currently selected value. |
| `onChange` | `(value: string) => void` | — |  | Change callback. |
| `options` | `{ value: string; label: string; disabled?: boolean }[]` | — | Yes | List of options. |
| `label` | `string` | — |  | Group label. |
| `direction` | `'vertical' | 'horizontal'` | 'vertical' |  | Layout direction. |
| `error` | `boolean | string` | — |  | Error state. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<RadioGroup
  label="Notification method"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push' },
  ]}
  value={method}
  onChange={setMethod}
/>
```
