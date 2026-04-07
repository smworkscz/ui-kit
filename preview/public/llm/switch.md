# Switch

Toggle switch with smooth animation.

**Import:** `import { Switch } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean` | false |  | Toggle state. |
| `onChange` | `(checked: boolean) => void` | — |  | Change callback. |
| `label` | `string` | — |  | Label text. |
| `disabled` | `boolean` | false |  | Disable interaction. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Switch label="Dark mode" checked={dark} onChange={setDark} />
```
