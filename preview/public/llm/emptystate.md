# EmptyState

Empty state with icon, title, description, and optional action.

**Import:** `import { EmptyState } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | — | Yes | Main heading. |
| `description` | `string` | — |  | Description text. |
| `icon` | `ReactNode` | — |  | Illustration icon. |
| `action` | `ReactNode` | — |  | Action button. |

## Usage

```tsx
<EmptyState
  icon={<TrayIcon size={48} />}
  title="No data"
  description="Nothing here yet."
  action={<Button>Add item</Button>}
/>
```
