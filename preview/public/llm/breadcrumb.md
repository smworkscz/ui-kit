# Breadcrumb

Breadcrumb navigation showing page hierarchy.

**Import:** `import { Breadcrumb } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `{ label: string; href?: string }[]` | — | Yes | Navigation items. |
| `separator` | `ReactNode` | '/' |  | Separator between items. |

## Usage

```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Current' },
]} />
```
