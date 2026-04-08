# ColorPicker

Color picker with swatch, hex input, and preset color palette.

**Import:** `import { ColorPicker } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string` | — | Yes | Current hex color. |
| `onChange` | `(color: string) => void` | — | Yes | Change callback. |
| `presets` | `string[]` | — |  | Preset color palette. |
| `label` | `string` | — |  | Label text. |
| `disabled` | `boolean` | false |  | Disable picker. |

## Usage

```tsx
<ColorPicker value={color} onChange={setColor} label="Brand color" />
```
