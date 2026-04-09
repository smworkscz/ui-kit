# Calendar

Calendar with compact (date-picker with event dots) and full-size (month grid with spanning event bars) modes.

**Import:** `import { Calendar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `Date | null` | — |  | Selected date. |
| `onChange` | `(date: Date) => void` | — |  | Date select callback. |
| `view` | `'month' | 'week'` | 'month' |  | Calendar view (compact mode only). |
| `fullSize` | `boolean` | false |  | Full-size mode with event bars instead of dots. |
| `events` | `CalendarEvent[]` | — |  | Events: { date, endDate?, title, color?, textColor?, emoji? }. |
| `onEventClick` | `(event: CalendarEvent) => void` | — |  | Event click callback (fullSize). |
| `firstDay` | `0 | 1` | 1 |  | First day of week (0=Sun, 1=Mon). |
| `locale` | `'cs' | 'en'` | 'cs' |  | Language for labels. |
| `maxEventsPerDay` | `number` | 3 |  | Max visible events per cell (fullSize). |
| `initialDate` | `Date` | — |  | Initial navigation date. |
| `minDate` | `Date` | — |  | Minimum selectable date. |
| `maxDate` | `Date` | — |  | Maximum selectable date. |

## Usage

```tsx
// Compact
<Calendar value={date} onChange={setDate} events={events} />

// Full-size with event bars
<Calendar fullSize events={events} onEventClick={(ev) => console.log(ev)} />
```

## Notes

- fullSize shows colored bars that span multiple days via endDate
- Compact mode shows event dots (original behavior)
- Multi-day events span across columns in full-size mode
- Events beyond maxEventsPerDay show "+N" indicator
