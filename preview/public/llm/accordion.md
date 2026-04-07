# Accordion / AccordionItem

Collapsible content sections.

**Import:** `import { Accordion } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `multiple` | `boolean` | false |  | Allow multiple open items (Accordion). |
| `title` | `string` | — | Yes | Item title (AccordionItem). |
| `children` | `ReactNode` | — | Yes | Item content (AccordionItem). |
| `defaultOpen` | `boolean` | false |  | Start expanded (AccordionItem). |
| `disabled` | `boolean` | false |  | Disable toggle (AccordionItem). |

## Usage

```tsx
<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2" defaultOpen>Content 2</AccordionItem>
</Accordion>
```
