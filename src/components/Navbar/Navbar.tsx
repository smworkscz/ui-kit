import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(26,26,26,0.7)',
    backgroundSolid: '#1a1a1a',
    border: 'rgba(255,255,255,0.1)',
    shadow: '0 1px 0 rgba(255,255,255,0.04)',
  },
  light: {
    background: 'rgba(255,255,255,0.7)',
    backgroundSolid: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
    shadow: '0 1px 0 rgba(0,0,0,0.03)',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NavbarProps {
  /** Logo nebo název aplikace (vykresleno vlevo). */
  logo?: React.ReactNode;
  /** Navigační obsah (vykresleno uprostřed). */
  children?: React.ReactNode;
  /** Akční prvky – tlačítka, avatar apod. (vykresleno vpravo). */
  actions?: React.ReactNode;
  /** Zda je navbar přilepený k hornímu okraji. @default true */
  sticky?: boolean;
  /** Zda použít glass efekt (průhledné pozadí s rozmazáním). @default true */
  glass?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Navbar ─────────────────────────────────────────────────────────────────

/**
 * Horní navigační lišta aplikace.
 *
 * Obsahuje tři sloty: logo (vlevo), children (uprostřed)
 * a actions (vpravo). Podporuje glass efekt a sticky pozici.
 *
 * @example
 * ```tsx
 * <Navbar
 *   logo={<span>MyApp</span>}
 *   actions={<Button size="sm">Přihlásit</Button>}
 * >
 *   <a href="/about">O nás</a>
 * </Navbar>
 * ```
 */
export const Navbar: React.FC<NavbarProps> = ({
  logo,
  children,
  actions,
  sticky = true,
  glass = true,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  return (
    <header
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        padding: '0 20px',
        backgroundColor: glass ? t.background : t.backgroundSolid,
        borderBottom: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        boxSizing: 'border-box',
        ...(glass
          ? {
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }
          : {}),
        ...(sticky
          ? {
              position: 'sticky',
              top: 0,
              zIndex: 1000,
            }
          : {}),
        ...style,
      }}
    >
      {/* Logo – vlevo */}
      {logo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {logo}
        </div>
      )}

      {/* Navigační obsah – uprostřed */}
      {children && (
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {children}
        </nav>
      )}

      {/* Akce – vpravo */}
      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {actions}
        </div>
      )}
    </header>
  );
};

Navbar.displayName = 'Navbar';
