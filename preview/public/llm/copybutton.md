# CopyButton

Button that copies text to clipboard. Shows check icon on success.

**Import:** `import { CopyButton } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `text` | `string` | — | Yes | Text to copy. |
| `children` | `ReactNode` | — |  | Button content (for button variant). |
| `variant` | `'icon' | 'button'` | 'icon' |  | Icon-only or full button. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `onCopy` | `() => void` | — |  | Callback after successful copy (e.g. show toast). |

## Usage

```tsx
<CopyButton text="npm install @smworks-cz/ui-kit" onCopy={() => toast({ title: 'Copied!' })} />
```

## Notes

- 2-second success state with check icon
- Clipboard API with execCommand fallback
- onCopy callback for custom feedback (e.g. toast)
