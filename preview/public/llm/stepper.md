# Stepper

Step wizard for multi-step processes.

**Import:** `import { Stepper } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `steps` | `{ label: string; description?: string }[]` | — | Yes | Step definitions. |
| `activeStep` | `number` | — | Yes | Active step index (0-based). |
| `orientation` | `'horizontal' | 'vertical'` | 'horizontal' |  | Orientation. |
| `clickable` | `boolean | 'completed'` | false |  | Allow clicking steps. |
| `onStepClick` | `(index: number) => void` | — |  | Step click callback. |

## Usage

```tsx
<Stepper
  steps={[
    { label: 'Account', description: 'Create account' },
    { label: 'Profile', description: 'Fill details' },
    { label: 'Done' },
  ]}
  activeStep={1}
/>
```
