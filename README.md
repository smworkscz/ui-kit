# SMWORKS UI KIT

React component library for SMWORKS applications. Built with TypeScript, inline design tokens, and dark/light theme support.

## Installation

```bash
# yarn
yarn add @smworks-cz/ui-kit

# npm
npm install @smworks-cz/ui-kit

# pnpm
pnpm add @smworks-cz/ui-kit
```

### Peer dependencies

```bash
yarn add react react-dom @phosphor-icons/react
```

| Package | Version |
|---------|---------|
| `react` | >= 18 |
| `react-dom` | >= 18 |
| `@phosphor-icons/react` | >= 2.1.0 |

## Usage

```tsx
import { Button, Input, Modal } from '@smworks-cz/ui-kit';

function App() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
```

### Theme setup

Set the `data-theme` attribute on `<body>` to switch between light and dark mode:

```tsx
// Dark mode
document.body.setAttribute('data-theme', 'dark');

// Light mode
document.body.setAttribute('data-theme', 'light');
```

Use the `useTheme()` hook to read the current theme in your components:

```tsx
import { useTheme } from '@smworks-cz/ui-kit';

function MyComponent() {
  const theme = useTheme(); // 'light' | 'dark'
  return <div>{theme}</div>;
}
```

### Toast notifications

Wrap your app in `ToasterProvider` and use the `useToast()` hook:

```tsx
import { ToasterProvider, useToast, Button } from '@smworks-cz/ui-kit';

function App() {
  return (
    <ToasterProvider position="bottom-right">
      <MyApp />
    </ToasterProvider>
  );
}

function MyApp() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({ variant: 'success', title: 'Saved!' })}>
      Save
    </Button>
  );
}
```

## Components

### Forms
Button, Input, Select, DatePicker, Checkbox, Radio, Switch, Textarea, Slider, FileUpload, SegmentedControl

### Data display
Table, Card, Accordion, Tabs, Tooltip, Popover, Skeleton, EmptyState, Stat, Avatar, Tag, Badge

### Navigation & layout
Modal, Drawer, Breadcrumb, Pagination, Stepper, DropdownMenu, Link, Spotlight

### Feedback
Toast, Alert, Progress, ProgressCircle, Spinner

### Utility
Divider, Stack, Container, DragList

### Hooks
`useTheme`, `useToast`

## Fonts

The library uses **Zalando Sans** and **Zalando Sans Expanded** fonts. Import them in your app entry point:

```tsx
import '@smworks-cz/ui-kit/dist/fonts/fonts.css';
```

## Design system

All components use inline design tokens with automatic dark/light mode support:

- **Primary color:** `#FC4F00`
- **Glass effect:** `backdrop-filter: blur(20-32px)` on overlays
- **Animation:** `180ms` with `cubic-bezier(0.16, 1, 0.3, 1)`
- **Icons:** [@phosphor-icons/react](https://phosphoricons.com/)
- **Fonts:** Zalando Sans (body), Zalando Sans Expanded (headings)

## TypeScript

Full TypeScript support out of the box. Type definitions are included in the package.

```tsx
import type { ButtonProps, InputProps, ModalProps } from '@smworks-cz/ui-kit';
```

## License

[MIT](LICENSE) - SMWORKS s.r.o.
