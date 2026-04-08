# Notification

Persistent in-layout notification banner. Not an overlay — stays in document flow.

**Import:** `import { Notification } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'info' | 'success' | 'warning' | 'error'` | 'info' |  | Visual variant. |
| `title` | `string` | — | Yes | Notification title. |
| `children` | `ReactNode` | — |  | Description content. |
| `closable` | `boolean` | false |  | Show close button. |
| `onClose` | `() => void` | — |  | Close callback. |
| `icon` | `ReactNode` | — |  | Custom icon. |
| `action` | `ReactNode` | — |  | Action button on the right. |

## Usage

```tsx
<Notification variant="warning" title="Update available" action={<Button size="sm">Update</Button>}>
  Version 2.0 is ready to install.
</Notification>
```

## Notes

- Unlike Toast, this stays in the layout — not a floating overlay
