# Button

Button for primary actions, secondary operations, and outline variants. Supports icons, loading state, and can render as a link.

**Import:** `import { Button } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'primary' | 'secondary' | 'outline' | 'danger'` | 'primary' |  | Visual style. Danger variant is red (#EF3838). |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `icon` | `ReactNode` | — |  | Optional icon (SVG or component). |
| `iconPosition` | `'left' | 'right'` | 'left' |  | Icon position relative to text. |
| `loading` | `boolean` | false |  | Shows spinner and disables interaction. |
| `fullWidth` | `boolean` | false |  | Stretches button to full container width. |
| `disabled` | `boolean` | false |  | Disables interaction. |
| `onClick` | `() => void` | — |  | Click callback. Inherited from native HTML attributes. |
| `href` | `string` | — |  | If provided, renders as <a> instead of <button>. |
| `children` | `ReactNode` | — |  | Button text content. |

## Usage

```tsx
<Button variant="primary" onClick={handleClick}>Save</Button>
<Button variant="outline" icon={<PlusIcon size={16} />}>Add</Button>
<Button loading>Processing...</Button>
<Button href="/about">Link button</Button>
```

## Notes

- Renders as `<a>` when `href` is provided, otherwise `<button>`
- Icon-only mode (square) when no children provided
- Uses `@phosphor-icons/react` for icons
