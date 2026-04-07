# Skeleton

Loading placeholder with shimmer animation.

**Import:** `import { Skeleton } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'text' | 'circle' | 'rect'` | 'text' |  | Shape. |
| `width` | `number | string` | '100%' |  | Width. |
| `height` | `number | string` | — |  | Height. |
| `lines` | `number` | 1 |  | Number of lines (text variant). |
| `animate` | `boolean` | true |  | Shimmer animation. |

## Usage

```tsx
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rect" width="100%" height={200} />
```
