# SMWORKS UI KIT — Design System

## Barvy

### Primární
| Token | Hodnota | Použití |
|-------|---------|---------|
| Primary | `#FC4F00` | Hlavní akcentová barva, tlačítka, aktivní stavy |
| Primary Hover | `#FF6D2A` | Hover stav primární barvy |
| Primary Alpha | `rgba(246,84,14,0.8)` | Badge pozadí |

### Neutrální – Dark mode
| Token | Hodnota | Použití |
|-------|---------|---------|
| Background | `#1a1a1a` | Hlavní pozadí aplikace |
| Surface | `rgba(24,24,24,0.95)` | Karty, dropdowny, modály |
| Surface Glass | `rgba(24,24,24,0.8)` | Spotlight, glass efekty |
| Text Primary | `#ffffff` | Hlavní text |
| Text Secondary | `#eaeaea` | Tělo textu |
| Text Muted | `#888888` | Placeholdery, sekundární info |
| Border | `rgba(255,255,255,0.1)` | Okraje komponent |
| Divider | `rgba(255,255,255,0.08)` | Oddělovací čáry |
| Hover | `rgba(255,255,255,0.06)` | Hover pozadí položek |

### Neutrální – Light mode
| Token | Hodnota | Použití |
|-------|---------|---------|
| Background | `#ffffff` | Hlavní pozadí aplikace |
| Surface | `rgba(255,255,255,0.95)` | Karty, dropdowny, modály |
| Surface Glass | `rgba(255,255,255,0.8)` | Spotlight, glass efekty |
| Text Primary | `#1a1a1a` | Hlavní text |
| Text Secondary | `#333333` | Tělo textu |
| Text Muted | `#999999` | Placeholdery, sekundární info |
| Border | `rgba(0,0,0,0.08)` | Okraje komponent |
| Divider | `rgba(0,0,0,0.06)` | Oddělovací čáry |
| Hover | `rgba(0,0,0,0.04)` | Hover pozadí položek |

### Sémantické
| Token | Hodnota | Použití |
|-------|---------|---------|
| Error | `#EF3838` | Chybové stavy, danger akce |
| Success | `#00A205` | Úspěšné stavy |

---

## Typografie

### Font families
| Rodina | Použití |
|--------|---------|
| `'Zalando Sans', sans-serif` | Tělo textu, inputy, popisky |
| `'Zalando Sans Expanded', sans-serif` | Nadpisy (h1–h6), labely, badge, category headers |

### Škála
| Prvek | Velikost | Váha | Další |
|-------|----------|------|-------|
| Category label | `10px` | 400 | `text-transform: uppercase`, `letter-spacing: 0.06em` |
| Badge | `10px` | 400 | `text-transform: uppercase` (Expanded) |
| Small body | `12px` | 400 | Popisy, sekundární text |
| Body | `14px` | 400–500 | Výchozí velikost textu |
| Input | `16px` | 400 | Vyhledávací pole |
| Title | `18px` | 600 | Záhlaví modálů, sekcí |

### Dostupné váhy
200 (ExtraLight), 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 900 (Black)

---

## Glass efekt

Glassmorphismus se používá pro overlay komponenty a sticky prvky.

```css
background-color: rgba(24, 24, 24, 0.8);   /* dark */
background-color: rgba(255, 255, 255, 0.8); /* light */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1); /* dark */
border: 1px solid rgba(0, 0, 0, 0.08);      /* light */
```

### Kde se používá
- **Sticky top bar** – `rgba(26,26,26,0.7)` / `rgba(255,255,255,0.7)` + `blur(20px)`
- **Modal** – `rgba(24,24,24,0.97)` + `blur(20px)`
- **DropdownMenu** – `rgba(24,24,24,0.95)` + `blur(20px)`
- **Spotlight** – `rgba(24,24,24,0.8)` + `blur(20px)`
- **Toast** – Má vlastní glass variantu

---

## Stíny

| Úroveň | Dark | Light |
|---------|------|-------|
| Elevated (dropdown, spotlight) | `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset` | `0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset` |
| High (modal) | `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset` | `0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03) inset` |

---

## Border radius

| Prvek | Hodnota |
|-------|---------|
| Tag | `4px` |
| Kbd badge | `6px` |
| Dropdown item, button | `6–8px` |
| Input, spotlight item | `8px` |
| Badge | `12px` |
| Dropdown, card | `12px` |
| Modal, spotlight | `16px` |

---

## Animace

| Vlastnost | Hodnota |
|-----------|---------|
| Duration | `180ms` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Hover transition | `0.12s ease` |
| Pattern | Scale (0.95→1) + opacity (0→1) pro otevření |

### State machine
Všechny overlay komponenty (Modal, DropdownMenu, Spotlight) používají:
```
idle → opening → open → closing → idle
```

---

## Token pattern

Každá komponenta definuje inline design tokens:

```typescript
const tokens = {
  dark: {
    background: '...',
    text: '...',
    border: '...',
  },
  light: {
    background: '...',
    text: '...',
    border: '...',
  },
} as const;

// V komponentě:
const theme = useTheme();
const t = tokens[theme];
```

---

## Detekce tématu

- Atribut `data-theme="dark"` nebo `data-theme="light"` na `<html>` nebo `<body>`
- Fallback: `prefers-color-scheme: dark` media query
- Hook `useTheme()` naslouchá změnám přes `MutationObserver` + `matchMedia`
- Výchozí hodnota: `'light'`

---

## Ikony

- Knihovna: `@phosphor-icons/react` (peer dependency)
- Výchozí velikost v komponentách: `16px`
- Váha: `regular` (výchozí) nebo `bold` pro důraz
