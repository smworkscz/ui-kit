# Calendar

Full month/week calendar grid with event dots and date selection.

**Import:** `import { Calendar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `Date | null` | — |  | Selected date. |
| `onChange` | `(date: Date) => void` | — |  | Date select callback. |
| `view` | `'month' | 'week'` | 'month' |  | Calendar view. |
| `events` | `{ date: Date; title: string; color?: string }[]` | — |  | Events shown as colored dots. |
| `minDate` | `Date` | — |  | Minimum selectable date. |
| `maxDate` | `Date` | — |  | Maximum selectable date. |

## Usage

```tsx
<Calendar value={date} onChange={setDate} events={events} />
```

## Notes

- Events are visual dots only — handle display yourself
- Today highlighted with primary color
