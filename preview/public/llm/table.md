# Table

Data table with sorting, loading state, custom cell rendering, clickable rows, and row actions.

**Import:** `import { Table } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `columns` | `TableColumn[]` | — | Yes | Column definitions: { key, header, sortable?, width?, render? }. |
| `data` | `any[]` | — | Yes | Data rows. |
| `loading` | `boolean` | false |  | Show skeleton rows. |
| `emptyText` | `string` | 'Žádná data' |  | Empty state text. |
| `onSort` | `(key, direction) => void` | — |  | Sort callback. |
| `striped` | `boolean` | false |  | Alternating row colors. |
| `hoverable` | `boolean` | true |  | Row hover highlight. |
| `onRowClick` | `(row, index) => void` | — |  | Row click callback. |
| `rowActions` | `(row) => ReactNode` | — |  | Render action buttons for each row. |

## Usage

```tsx
<Table
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status', render: (val) => <Badge label={val} /> },
  ]}
  data={users}
  onSort={(key, dir) => sort(key, dir)}
/>
```
