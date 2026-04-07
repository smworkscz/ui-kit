# Textarea

Multi-line text input with character counter, auto-height, and resize options.

**Import:** `import { Textarea } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — |  | Label text. |
| `error` | `boolean | string` | — |  | Error state. |
| `helperText` | `string` | — |  | Helper text below. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `rows` | `number` | 4 |  | Visible rows. |
| `maxLength` | `number` | — |  | Max characters (shows counter). |
| `resize` | `'none' | 'vertical' | 'both'` | 'vertical' |  | Resize mode. |
| `autoHeight` | `boolean` | false |  | Auto-grow to fit content. |
| `minRows` | `number` | 1 |  | Min rows (with autoHeight). |
| `maxRows` | `number` | — |  | Max rows before scrolling (with autoHeight). |

## Usage

```tsx
<Textarea label="Description" placeholder="Write..." maxLength={500} />
<Textarea autoHeight minRows={2} maxRows={10} />
```
