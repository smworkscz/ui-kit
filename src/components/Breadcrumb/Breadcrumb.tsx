import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ACACAC',
    activeText: '#ffffff',
    linkHover: '#E8612D',
    separator: 'rgba(255,255,255,0.3)',
  },
  light: {
    text: '#888888',
    activeText: '#1a1a1a',
    linkHover: '#E8612D',
    separator: 'rgba(0,0,0,0.25)',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  /** Zobrazovaný text položky. */
  label: string;
  /** URL odkazu. Pokud chybí, položka se vykreslí jako prostý text. */
  href?: string;
  /** Voláno při kliknutí na položku. */
  onClick?: (e: React.MouseEvent) => void;
  /** Volitelná ikona vykreslená před textem. */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  /** Seznam položek drobečkové navigace. */
  items: BreadcrumbItem[];
  /** Oddělovací znak mezi položkami. @default '/' */
  separator?: React.ReactNode;
  /** Dodatečná CSS třída pro obalový element. */
  className?: string;
  /** Další inline styly pro obalový element. */
  style?: React.CSSProperties;
}

// ─── Breadcrumb ─────────────────────────────────────────────────────────────

/**
 * Drobečková navigace dle SM-UI design systému.
 *
 * Poslední položka je vždy zobrazena jako aktuální stránka
 * (tučnější písmo, bez odkazu).
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Domů', href: '/' },
 *     { label: 'Projekty', href: '/projekty' },
 *     { label: 'Detail' },
 *   ]}
 * />
 * ```
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  return (
    <nav
      aria-label="Drobečková navigace"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: '14px',
        lineHeight: 'normal',
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span
                aria-hidden="true"
                style={{
                  color: t.separator,
                  userSelect: 'none',
                  fontSize: '13px',
                }}
              >
                {separator}
              </span>
            )}

            {isLast ? (
              <span
                aria-current="page"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: t.activeText,
                  fontWeight: 600,
                }}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href ?? '#'}
                onClick={item.onClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: t.text,
                  fontWeight: 400,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = t.linkHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = t.text;
                }}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
