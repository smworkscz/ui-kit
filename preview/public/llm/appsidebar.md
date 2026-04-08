# AppSidebar

Collapsible application sidebar with glass effect. No built-in toggle — consumer provides their own.

**Import:** `import { AppSidebar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `ReactNode` | — | Yes | Sidebar content (nav items). |
| `collapsed` | `boolean` | false |  | Collapsed state. |
| `onCollapse` | `(collapsed: boolean) => void` | — |  | Collapse change callback. |
| `width` | `number` | 260 |  | Expanded width in px. |
| `collapsedWidth` | `number` | 64 |  | Collapsed width in px. |

## Usage

```tsx
<AppSidebar collapsed={collapsed} onCollapse={setCollapsed}>
  <nav>...</nav>
</AppSidebar>
```

## Notes

- No built-in collapse button — add your own
- Icons center horizontally when collapsed
