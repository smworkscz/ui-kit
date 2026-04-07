# Pagination

Page navigation with smart page reduction.

**Import:** `import { Pagination } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `page` | `number` | — | Yes | Current page (1-indexed). |
| `totalPages` | `number` | — | Yes | Total pages. |
| `onChange` | `(page: number) => void` | — | Yes | Page change callback. |
| `siblings` | `number` | 1 |  | Pages around current. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Pagination page={page} totalPages={20} onChange={setPage} />
```
