import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    default: '#ffffff',
    danger: '#EF3838',
    hoverBg: 'rgba(0,0,0,0.7)',
  },
  light: {
    default: '#1a1a1a',
    danger: '#EF3838',
    hoverBg: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type LinkVariant = 'default' | 'danger';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /**
   * Barevná varianta.
   * - `'default'` — bílá (tmavý režim) / tmavá (světlý režim)
   * - `'danger'`  — červená `#EF3838` v obou režimech
   * @default 'default'
   */
  variant?: LinkVariant;
  /**
   * Ikona vykreslená vedle textu odkazu.
   * Typicky 14×14 SVG nebo komponenta ikony.
   */
  icon?: React.ReactNode;
  /**
   * Na které straně se ikona zobrazí vzhledem k textu.
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Zda zobrazit ikonu.
   * Umožňuje podmíněně skrýt ikonu bez odebrání prop.
   * @default true
   */
  showIcon?: boolean;
  /** Další inline styly pro `<a>` element. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro `<a>` element. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Inline odkaz / akční trigger dle SM-UI design systému.
 * Vykresluje se jako nativní `<a>` element a dědí všechny anchor atributy
 * (`href`, `target`, `rel`, `onClick`, `aria-*`, …).
 *
 * Ve variantě `danger` používá červenou (#EF3838) pro destruktivní akce.
 * Při hoveru se přidá jemné tmavé pozadí.
 *
 * @example
 * ```tsx
 * <Link href="/nastaveni">Nastavení</Link>
 * <Link variant="danger" onClick={onDelete} icon={<TrashIcon />}>Smazat</Link>
 * <Link icon={<ArrowIcon />} iconPosition="right" href="/dalsi">Další krok</Link>
 * ```
 */
export const Link: React.FC<LinkProps> = ({
  variant = 'default',
  icon,
  iconPosition = 'left',
  showIcon = true,
  children,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
  ...rest
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const [hovered, setHovered] = useState(false);

  const color = variant === 'danger' ? t.danger : t.default;

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: hovered ? t.hoverBg : 'transparent',
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 'normal',
    color,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.15s ease',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    ...style,
  };

  const iconEl = showIcon && icon
    ? <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
    : null;

  return (
    <a
      style={linkStyle}
      className={className}
      target={target}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      {...rest}
    >
      {iconPosition === 'right' ? (
        <>{children}{iconEl}</>
      ) : (
        <>{iconEl}{children}</>
      )}
    </a>
  );
};
