# Card

Content card for grouping related information.

**Import:** `import { Card } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | — |  | Card heading. |
| `subtitle` | `string` | — |  | Secondary subheading. |
| `header` | `ReactNode` | — |  | Custom header (overrides title/subtitle). |
| `footer` | `ReactNode` | — |  | Footer content (separated by divider). |
| `children` | `ReactNode` | — |  | Card body. |
| `hoverable` | `boolean` | false |  | Lift on hover. |
| `bordered` | `boolean` | true |  | Show border. |
| `padding` | `'none' | 'sm' | 'md' | 'lg'` | 'md' |  | Inner spacing. |

## Usage

```tsx
<Card title="Project" subtitle="Details" footer={<Button>Save</Button>}>
  <p>Card body content</p>
</Card>
```
