# Alert

Informational banner with variant colors and optional close button.

**Import:** `import { Alert } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'info' | 'success' | 'warning' | 'error'` | 'info' |  | Visual variant. |
| `title` | `string` | — | Yes | Alert heading. |
| `children` | `ReactNode` | — |  | Description below title. |
| `icon` | `ReactNode` | — |  | Custom icon (replaces default). |
| `closable` | `boolean` | false |  | Show close button. |
| `onClose` | `() => void` | — |  | Close callback. |

## Usage

```tsx
<Alert variant="success" title="Saved">Changes were saved successfully.</Alert>
<Alert variant="error" title="Error" closable onClose={handleClose}>Something went wrong.</Alert>
```
