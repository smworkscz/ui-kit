# Spinner

Rotating loading indicator.

**Import:** `import { Spinner } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | `'sm' | 'md' | 'lg' | number` | 'md' |  | Size (sm: 16px, md: 24px, lg: 40px). |
| `color` | `string` | — |  | Color (default: currentColor). |
| `label` | `string` | 'Načítání' |  | ARIA label. |

## Usage

```tsx
<Spinner size="md" />
<Spinner size={32} color="#FC4F00" />
```
