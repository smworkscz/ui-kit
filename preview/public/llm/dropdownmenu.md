# DropdownMenu

Dropdown action menu with keyboard navigation.

**Import:** `import { DropdownMenu } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `trigger` | `ReactNode` | — | Yes | Trigger element. |
| `items` | `DropdownMenuItem[]` | — | Yes | Menu items: { label (string | ReactNode), icon?, onClick?, disabled?, danger?, divider?, category? }. |
| `position` | `'bottom-left' | 'bottom-right'` | 'bottom-left' |  | Menu position. |

## Usage

```tsx
<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { category: 'Actions', label: '' },
    { label: 'Edit', icon: <PencilSimpleIcon size={16} />, onClick: handleEdit },
    { label: 'Copy', onClick: handleCopy },
    { category: 'Danger zone', label: '' },
    { label: 'Delete', danger: true, onClick: handleDelete },
  ]}
/>

// ReactNode label without onClick — passive custom content (no padding, no hover, no close)
// ReactNode label with onClick — clickable custom item (no padding, has hover, closes)
```

## Notes

- label accepts ReactNode for custom content
- ReactNode label without onClick: no padding, no hover, no close on click
- ReactNode label with onClick: no padding, has hover, closes on click
- category: string renders an uppercase section header to group items
