# Modal

Modal dialog with overlay, focus trap, and glass effect.

**Import:** `import { Modal } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `title` | `string` | — |  | Header title. |
| `children` | `ReactNode` | — | Yes | Body content. |
| `footer` | `ReactNode` | — |  | Footer content (buttons). |
| `size` | `'sm' | 'md' | 'lg' | 'fullscreen'` | 'md' |  | Size preset. |
| `closeOnOverlay` | `boolean` | true |  | Close on overlay click. |
| `closeOnEscape` | `boolean` | true |  | Close on Escape key. |
| `showClose` | `boolean` | true |  | Show close button (×). |

## Usage

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Confirm">
  <p>Are you sure?</p>
</Modal>
```

## Notes

- Renders via React portal to document.body
- Includes focus trap and body scroll lock
- Glass effect with backdrop-filter: blur(32px)
