# Toast (useToast)

Toast notifications with auto-dismiss and stack animation. Requires ToasterProvider.

**Import:** `import { Toast (useToast) } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'info' | 'success' | 'error'` | 'info' |  | Notification type. |
| `title` | `string` | — | Yes | Notification title. |
| `content` | `string` | — |  | Optional description. |
| `icon` | `ReactNode` | — |  | Custom icon. |
| `duration` | `number` | 4000 |  | Auto-dismiss in ms (0 = permanent). |

## Usage

```tsx
// 1. Wrap app in ToasterProvider
<ToasterProvider position="bottom-right" duration={4000}>
  <App />
</ToasterProvider>

// 2. Use the hook
const { toast, dismiss } = useToast();
toast({ variant: 'success', title: 'Saved!', content: 'Changes saved.' });

// Manual dismiss
const id = toast({ title: 'Loading...', duration: 0 });
dismiss(id);
```

## Notes

- ToasterProvider must wrap the app
- toast() returns an ID for manual dismiss
- duration prop on ToasterProvider sets global default
