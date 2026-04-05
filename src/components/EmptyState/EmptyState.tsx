import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    textSecondary: '#ACACAC',
    iconColor: 'rgba(255,255,255,0.2)',
  },
  light: {
    text: '#1a1a1a',
    textSecondary: '#888888',
    iconColor: 'rgba(0,0,0,0.15)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Ikona zobrazená nad titulkem. */
  icon?: React.ReactNode;
  /** Hlavní titulek prázdného stavu. */
  title: string;
  /** Doplňkový popis. */
  description?: string;
  /** Akční prvek — typicky tlačítko. */
  action?: React.ReactNode;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

/**
 * Prázdný stav dle SM-UI design systému.
 *
 * Centrovaný layout s volitelnou ikonou, titulkem,
 * popisem a akčním tlačítkem.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="Žádné výsledky"
 *   description="Zkuste upravit filtr nebo vytvořit nový záznam."
 *   action={<Button>Vytvořit záznam</Button>}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        gap: '12px',
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: '48px',
            lineHeight: 1,
            color: t.iconColor,
            marginBottom: '4px',
          }}
        >
          {icon}
        </div>
      )}

      <div
        style={{
          fontFamily: "'Zalando Sans Expanded', sans-serif",
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: 'normal',
          color: t.text,
        }}
      >
        {title}
      </div>

      {description && (
        <div
          style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            lineHeight: '1.5',
            color: t.textSecondary,
            maxWidth: '360px',
          }}
        >
          {description}
        </div>
      )}

      {action && (
        <div style={{ marginTop: '8px' }}>
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
