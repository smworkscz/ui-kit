# Sheet

Lightweight panel sliding from any direction. Glass effect with overlay.

**Import:** `import { Sheet } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `children` | `ReactNode` | — | Yes | Panel content. |
| `side` | `'bottom' | 'right' | 'left' | 'top'` | 'bottom' |  | Slide direction. |
| `title` | `string` | — |  | Panel title. |
| `showClose` | `boolean` | true |  | Show close button. |

## Usage

```tsx
<Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="Filters">
  <FilterForm />
</Sheet>
```
