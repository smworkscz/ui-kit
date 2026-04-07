# useToast

Hook for triggering toast notifications. Returns { toast, dismiss }. Requires ToasterProvider.

**Import:** `import { useToast } from '@smworks-cz/ui-kit'`

**Returns:** `{ toast: (options) => string, dismiss: (id) => void }`

## Usage

```tsx
import { useToast } from '@smworks-cz/ui-kit';

const { toast, dismiss } = useToast();

// Fire notification
toast({ variant: 'success', title: 'Saved!' });

// Permanent toast with manual dismiss
const id = toast({ title: 'Loading...', duration: 0 });
await doWork();
dismiss(id);
```

## Notes

- Must be called inside <ToasterProvider>
- toast() returns an ID string
- duration: 0 creates permanent toast
