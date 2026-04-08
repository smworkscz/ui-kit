# DataList

Key-value pair list for detail views. Supports multi-column grid and striped rows.

**Import:** `import { DataList } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `{ label: string; value: ReactNode }[]` | — | Yes | Key-value pairs. |
| `columns` | `number` | 1 |  | Number of columns. |
| `striped` | `boolean` | false |  | Striped row backgrounds. |

## Usage

```tsx
<DataList items={[
  { label: 'Name', value: 'John Doe' },
  { label: 'Email', value: 'john@example.com' },
  { label: 'Role', value: <Badge label="Admin" /> },
]} columns={2} />
```
