# Navbar

Top navigation bar with logo, content, and actions slots. Optional glass effect.

**Import:** `import { Navbar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `logo` | `ReactNode` | — |  | Left logo slot. |
| `children` | `ReactNode` | — |  | Center content (nav links). |
| `actions` | `ReactNode` | — |  | Right actions slot. |
| `sticky` | `boolean` | true |  | Sticky positioning. |
| `glass` | `boolean` | true |  | Glass effect background. |

## Usage

```tsx
<Navbar logo={<Logo />} actions={<Button>Login</Button>}>
  <a href="/">Home</a>
  <a href="/about">About</a>
</Navbar>
```
