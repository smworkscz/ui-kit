# ConfirmDialog

Pre-built confirmation modal with confirm/cancel buttons. Uses Modal internally.

**Import:** `import { ConfirmDialog } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onConfirm` | `() => void` | — | Yes | Confirm callback. |
| `onCancel` | `() => void` | — | Yes | Cancel callback. |
| `title` | `string` | — | Yes | Dialog title. |
| `description` | `string` | — |  | Description text. |
| `confirmLabel` | `string` | 'Potvrdit' |  | Confirm button text. |
| `cancelLabel` | `string` | 'Zrušit' |  | Cancel button text. |
| `variant` | `'default' | 'danger'` | 'default' |  | Danger variant: red confirm button. |
| `loading` | `boolean` | false |  | Loading state on confirm button. |

## Usage

```tsx
<ConfirmDialog
  open={open}
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
  title="Smazat položku?"
  description="Tato akce je nevratná."
  variant="danger"
  confirmLabel="Smazat"
/>
```
