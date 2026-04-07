# useTheme

Hook to detect current theme. Returns "light" or "dark". Reacts to changes automatically.

**Import:** `import { useTheme } from '@smworks-cz/ui-kit'`

**Returns:** `'light' | 'dark'`

## Usage

```tsx
import { useTheme } from '@smworks-cz/ui-kit';

const theme = useTheme(); // 'light' | 'dark'

// Inline tokens pattern (recommended)
const tokens = {
  dark: { bg: '#1a1a1a', text: '#fff' },
  light: { bg: '#fff', text: '#1a1a1a' },
} as const;
const t = tokens[useTheme()];
```

## Notes

- Reads data-theme attribute from <html> or <body>
- Falls back to prefers-color-scheme media query
- Default: "light"
- Uses MutationObserver + matchMedia listener for reactivity
