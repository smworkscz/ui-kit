# Link

Styled anchor link with icon support.

**Import:** `import { Link } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'default' | 'danger'` | 'default' |  | Color variant. |
| `icon` | `ReactNode` | — |  | Icon. |
| `iconPosition` | `'left' | 'right'` | 'left' |  | Icon position. |
| `href` | `string` | — |  | URL. |

## Usage

```tsx
<Link href="/about">About us</Link>
<Link href="/delete" variant="danger">Delete account</Link>
```
