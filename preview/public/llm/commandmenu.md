# CommandMenu

Command palette with grouped commands, search, keyboard shortcuts display.

**Import:** `import { CommandMenu } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `groups` | `CommandGroup[]` | — | Yes | Command groups: { label, items: CommandItem[] }. |
| `placeholder` | `string` | — |  | Search placeholder. |

## Usage

```tsx
<CommandMenu
  open={open}
  onClose={() => setOpen(false)}
  groups={[
    { label: 'Actions', items: [
      { id: 'new', label: 'New project', shortcut: '⌘N', onSelect: handleNew },
      { id: 'search', label: 'Search', icon: <MagnifyingGlassIcon />, onSelect: handleSearch },
    ]},
  ]}
/>
```

## Notes

- CommandItem: { id, label, description?, icon?, shortcut?, onSelect }
- Search filters across all groups
- Keyboard: arrows navigate, enter selects, escape closes
