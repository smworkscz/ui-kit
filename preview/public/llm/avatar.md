# Avatar

User avatar displaying initials.

**Import:** `import { Avatar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `initials` | `string` | — | Yes | 1-2 letters (auto-uppercase). |
| `size` | `'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number` | 'md' |  | Size (2xs: 16px, xs: 20px, sm: 32px, md: 40px, lg: 64px, xl: 96px). |
| `borderRadius` | `string | number` | '8px' |  | Corner rounding. |

## Usage

```tsx
<Avatar initials="JD" size="md" />
<Avatar initials="A" size={32} borderRadius="50%" />
```
