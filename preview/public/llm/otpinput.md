# OTPInput

One-time password input with individual digit boxes. Supports paste, auto-advance, and separators.

**Import:** `import { OTPInput } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `length` | `number` | 6 |  | Number of digit boxes. |
| `value` | `string` | — | Yes | Current OTP string. |
| `onChange` | `(value: string) => void` | — | Yes | Change callback. |
| `separatorAfter` | `number` | — |  | Insert separator after every N digits. |
| `separator` | `ReactNode` | '-' |  | Separator content. |
| `error` | `boolean | string` | — |  | Error state. |
| `disabled` | `boolean` | false |  | Disable input. |
| `autoFocus` | `boolean` | false |  | Auto-focus first box. |
| `label` | `string` | — |  | Label text. |

## Usage

```tsx
<OTPInput value={otp} onChange={setOtp} length={6} separatorAfter={3} />
```

## Notes

- Auto-advances to next box on input
- Backspace moves to previous box
- Paste fills all boxes
