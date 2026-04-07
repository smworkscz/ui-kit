# Stack

Flex layout container for easy element alignment.

**Import:** `import { Stack } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `direction` | `'row' | 'column'` | 'column' |  | Layout direction. |
| `gap` | `number | string` | 8 |  | Gap between items. |
| `align` | `'start' | 'center' | 'end' | 'stretch'` | 'stretch' |  | Align items. |
| `justify` | `'start' | 'center' | 'end' | 'between' | 'around'` | 'start' |  | Justify content. |
| `wrap` | `boolean` | false |  | Flex wrap. |
| `fullWidth` | `boolean` | false |  | Full width. |

## Usage

```tsx
<Stack direction="row" gap={16} align="center">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</Stack>
```
