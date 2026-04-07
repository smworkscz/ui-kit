# Tabs / Tab / TabPanel

Tabbed content switcher with underline and pills variants.

**Import:** `import { Tabs } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string` | — | Yes | Active tab value (Tabs). |
| `onChange` | `(value: string) => void` | — | Yes | Tab change callback (Tabs). |
| `variant` | `'underline' | 'pills'` | 'underline' |  | Tab style (Tabs). |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size (Tabs). |
| `fullWidth` | `boolean` | false |  | Stretch tabs (Tabs). |

## Usage

```tsx
<Tabs value={tab} onChange={setTab}>
  <Tab value="general" label="General" />
  <Tab value="settings" label="Settings" />
  <TabPanel value="general">General content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```
