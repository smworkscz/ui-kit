# DropdownMenu

Dropdown action menu with keyboard navigation.

**Import:** `import { DropdownMenu } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `trigger` | `ReactNode` | — | Yes | Trigger element. |
| `items` | `DropdownMenuItem[]` | — | Yes | Menu items: { label, icon?, onClick?, disabled?, danger?, divider? }. |
| `position` | `'bottom-left' | 'bottom-right'` | 'bottom-left' |  | Menu position. |

## Usage

```tsx
<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: 'Edit', icon: <PencilSimpleIcon size={16} />, onClick: handleEdit },
    { label: 'Copy', onClick: handleCopy },
    { divider: true, label: '' },
    { label: 'Delete', danger: true, onClick: handleDelete },
  ]}
/>
```
