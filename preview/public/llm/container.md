# Container

Wrapper container with max-width and centering.

**Import:** `import { Container } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `maxWidth` | `'sm' | 'md' | 'lg' | 'xl' | number` | 'lg' |  | Max width. |
| `padding` | `number | string` | 16 |  | Padding. |
| `centered` | `boolean` | true |  | Center on page. |

## Usage

```tsx
<Container maxWidth="lg">
  <h1>Page content</h1>
</Container>
```
