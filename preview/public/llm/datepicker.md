# DatePicker

Date picker with calendar popup. Supports single and range mode with optional time selection.

**Import:** `import { DatePicker } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `mode` | `'single' | 'range'` | 'single' |  | Selection mode. |
| `showTime` | `boolean` | false |  | Add time selection. |
| `value` | `Date | null | [Date, Date]` | — |  | Current value. |
| `onChange` | `(value: any) => void` | — |  | Change callback. |
| `label` | `string` | — |  | Label text. |
| `error` | `boolean | string` | — |  | Error state. |
| `disabled` | `boolean` | false |  | Disable interaction. |
| `clearable` | `boolean` | false |  | Clear button. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `minDate` | `Date` | — |  | Minimum allowed date. |
| `maxDate` | `Date` | — |  | Maximum allowed date. |

## Usage

```tsx
<DatePicker label="Date" value={date} onChange={setDate} />
<DatePicker mode="range" value={[start, end]} onChange={setRange} />
<DatePicker showTime label="Date & Time" />
```
