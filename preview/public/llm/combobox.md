# Combobox

Input with autocomplete dropdown. Type to filter, select from options or enter custom values.

**Import:** `import { Combobox } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `options` | `{ value: string; label?: string }[]` | — | Yes | Available options. |
| `value` | `string` | — | Yes | Current value. |
| `onChange` | `(value: string) => void` | — | Yes | Change callback. |
| `onInputChange` | `(input: string) => void` | — |  | Callback for input text changes (for async filtering). |
| `onCreate` | `(value: string) => void` | — |  | Called when Enter pressed with custom value (allowCustom only). |
| `renderOption` | `(option, highlighted) => ReactNode` | — |  | Custom option rendering. |
| `notFoundContent` | `ReactNode` | — |  | Custom "no results" content. |
| `footer` | `ReactNode` | — |  | Content below the options list. |
| `allowCustom` | `boolean` | false |  | Allow typing arbitrary values. |
| `placeholder` | `string` | — |  | Placeholder text. |
| `label` | `string` | — |  | Label text. |
| `error` | `boolean | string` | — |  | Error state. |
| `disabled` | `boolean` | false |  | Disable input. |
| `loading` | `boolean` | false |  | Show loading spinner. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Combobox
  options={countries}
  value={country}
  onChange={setCountry}
  allowCustom
  onCreate={(val) => addCountry(val)}
  placeholder="Vyberte zemi..."
/>
```
