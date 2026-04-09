# Combobox

Input with autocomplete dropdown. Type to filter, select from options or enter custom values.

**Import:** `import { Combobox } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `options` | `{ value: string; label?: string }[]` | — | Yes | Available options. |
| `value` | `string | string[]` | — | Yes | Current value. string[] when multiple. |
| `onChange` | `(value: any) => void` | — | Yes | Change callback. Returns string[] when multiple. |
| `multiple` | `boolean` | false |  | Allow selecting multiple options (renders tags). |
| `clearable` | `boolean` | false |  | Show clear button to reset selection. |
| `onInputChange` | `(input: string) => void` | — |  | Callback for input text changes (for async filtering). |
| `onCreate` | `(value: string) => void` | — |  | Called when Enter pressed with custom value (allowCustom only). |
| `renderOption` | `(option, highlighted) => ReactNode` | — |  | Custom option rendering. |
| `notFoundContent` | `ReactNode` | — |  | Custom "no results" content. |
| `footer` | `ReactNode | ((close) => ReactNode)` | — |  | Content below options. Function receives close() to dismiss dropdown. |
| `onOpenChange` | `(open: boolean) => void` | — |  | Called when dropdown opens/closes. |
| `onSelect` | `(value, option) => void` | — |  | Called when an option is selected. |
| `onDeselect` | `(value, option) => void` | — |  | Called when an option is deselected (multiple). |
| `onClear` | `() => void` | — |  | Called when selection is cleared. |
| `onFocus` | `(event) => void` | — |  | Called on focus. |
| `onBlur` | `(event) => void` | — |  | Called on blur. |
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

// Multi-select
<Combobox
  multiple
  options={countries}
  value={selectedCountries}
  onChange={setSelectedCountries}
  placeholder="Vyberte země..."
/>
```
