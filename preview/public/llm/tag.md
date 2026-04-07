# Tag / Badge

Tag for categorization. Badge for status labels.

**Import:** `import { Tag } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — | Yes | Tag/Badge text. |
| `onRemove` | `() => void` | — |  | Remove callback — shows ✕ button (Tag only). |

## Usage

```tsx
<Tag label="React" onRemove={() => remove('react')} />
<Badge label="NEW" />
```

## Notes

- Badge text is automatically uppercased
- Tag and Badge are separate exports from the same module
