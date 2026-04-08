# DataGrid

Advanced table with row selection, sticky header, and custom cell rendering.

**Import:** `import { DataGrid } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `columns` | `DataGridColumn[]` | — | Yes | Column defs with optional align, minWidth. |
| `data` | `any[]` | — | Yes | Row data. |
| `selectable` | `boolean` | false |  | Show row checkboxes. |
| `onSelectionChange` | `(ids: string[]) => void` | — |  | Selection change callback. |
| `loading` | `boolean` | false |  | Show skeleton rows. |
| `stickyHeader` | `boolean` | false |  | Sticky table header. |
| `rowKey` | `string` | 'id' |  | Key for row identification. |
| `onRowClick` | `(row: any) => void` | — |  | Row click callback. |

## Usage

```tsx
<DataGrid
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', align: 'center' },
  ]}
  data={users}
  selectable
  stickyHeader
/>
```
