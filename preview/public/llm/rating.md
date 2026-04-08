# Rating

Star rating input with hover preview.

**Import:** `import { Rating } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Current rating. |
| `onChange` | `(value: number) => void` | — |  | Change callback. |
| `max` | `number` | 5 |  | Maximum stars. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `readOnly` | `boolean` | false |  | Display only, no interaction. |
| `label` | `string` | — |  | Label text. |

## Usage

```tsx
<Rating value={rating} onChange={setRating} max={5} />
<Rating value={4.5} readOnly />
```
