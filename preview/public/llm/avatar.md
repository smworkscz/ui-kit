# Avatar

User avatar displaying initials.

**Import:** `import { Avatar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `initials` | `string` | — | Yes | 1-2 letters (auto-uppercase). |
| `size` | `'sm' | 'md' | 'lg' | number` | 'md' |  | Size (sm: 40px, md: 70px, lg: 96px). |
| `borderRadius` | `string | number` | '8px' |  | Corner rounding. |

## Usage

```tsx
<Avatar initials="JD" size="md" />
<Avatar initials="A" size={32} borderRadius="50%" />
```
