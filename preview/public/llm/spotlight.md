# Spotlight

Command palette / search overlay. Controlled component — filtering is done by the consumer.

**Import:** `import { Spotlight } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `value` | `string` | — | Yes | Search input value (controlled). |
| `onChange` | `(value: string) => void` | — | Yes | Input change callback. |
| `results` | `SpotlightItem[]` | — | Yes | Pre-filtered results: { id, label, description?, category, icon?, onSelect }. |
| `loading` | `boolean` | false |  | Show skeleton loading state instead of results. |
| `placeholder` | `string` | 'Hledat...' |  | Input placeholder. |

## Usage

```tsx
const [open, setOpen] = useState(false);
const [query, setQuery] = useState('');
const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

<Spotlight
  open={open}
  onClose={() => { setOpen(false); setQuery(''); }}
  value={query}
  onChange={setQuery}
  results={filtered}
  loading={isSearching}
/>
```

## Notes

- Consumer handles all filtering logic
- Results grouped by category automatically
- Keyboard: arrows navigate, enter selects, escape closes
- loading=true shows skeleton rows while fetching results
