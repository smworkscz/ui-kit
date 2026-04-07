# Drawer

Side panel that slides in from left or right.

**Import:** `import { Drawer } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `position` | `'left' | 'right'` | 'right' |  | Slide direction. |
| `title` | `string` | — |  | Header title. |
| `children` | `ReactNode` | — | Yes | Body content. |
| `footer` | `ReactNode` | — |  | Footer content. |
| `width` | `string | number` | 400 |  | Panel width. |
| `showClose` | `boolean` | true |  | Show close button. |
| `closeOnOverlay` | `boolean` | true |  | Close on overlay click. |

## Usage

```tsx
<Drawer open={open} onClose={() => setOpen(false)} title="Details">
  <p>Drawer content</p>
</Drawer>
```
