import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    border: 'rgba(255,255,255,0.12)',
    borderHover: 'rgba(255,255,255,0.25)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    divider: 'rgba(255,255,255,0.08)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    border: 'rgba(0,0,0,0.1)',
    borderHover: 'rgba(0,0,0,0.2)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    divider: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Padding config ──────────────────────────────────────────────────────────

const paddingMap = {
  none: '0',
  sm: '12px',
  md: '20px',
  lg: '28px',
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CardProps {
  /** Titulek karty. */
  title?: string;
  /** Podtitulek karty. */
  subtitle?: string;
  /** Vlastní obsah záhlaví — přepíše `title` a `subtitle`. */
  header?: React.ReactNode;
  /** Obsah patičky karty. */
  footer?: React.ReactNode;
  /** Obsah karty. */
  children?: React.ReactNode;
  /** Při `true` se karta jemně zvedne při najetí myší. @default false */
  hoverable?: boolean;
  /** Zobrazí rámeček kolem karty. @default true */
  bordered?: boolean;
  /**
   * Velikost vnitřního odsazení.
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Card ────────────────────────────────────────────────────────────────────

/**
 * Karta dle SM-UI design systému.
 *
 * Podporuje titulek, záhlaví, patičku, hoverable efekt
 * a tmavý / světlý režim přes `useTheme`.
 *
 * @example
 * ```tsx
 * <Card title="Statistiky" subtitle="Přehled za poslední měsíc">
 *   <p>Obsah karty…</p>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  header,
  footer,
  children,
  hoverable = false,
  bordered = true,
  padding = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const pad = paddingMap[padding];

  const cardStyle: React.CSSProperties = {
    backgroundColor: t.background,
    border: bordered ? `1px solid ${t.border}` : 'none',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'border-color 0.15s ease, box-shadow 0.2s ease, transform 0.2s ease',
    cursor: hoverable ? 'pointer' : undefined,
    ...style,
  };

  const headerContent = header ?? (
    (title || subtitle) ? (
      <div style={{ padding: pad, paddingBottom: children || footer ? '0' : pad }}>
        {title && (
          <div
            style={{
              fontFamily: "'Zalando Sans Expanded', sans-serif",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 'normal',
              color: t.text,
            }}
          >
            {title}
          </div>
        )}
        {subtitle && (
          <div
            style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '13px',
              lineHeight: 'normal',
              color: t.textSecondary,
              marginTop: '4px',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    ) : null
  );

  return (
    <div
      className={className}
      style={cardStyle}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = t.borderHover;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            theme === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = bordered ? t.border : 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {headerContent}

      {children && (
        <div style={{ padding: pad }}>
          {children}
        </div>
      )}

      {footer && (
        <>
          <div style={{ borderTop: `1px solid ${t.divider}` }} />
          <div style={{ padding: pad }}>
            {footer}
          </div>
        </>
      )}
    </div>
  );
};

Card.displayName = 'Card';
