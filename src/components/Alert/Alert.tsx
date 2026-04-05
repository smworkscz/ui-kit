import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    titleText: '#ffffff',
    descriptionText: 'rgba(255,255,255,0.85)',
    closeColor: 'rgba(255,255,255,0.6)',
    closeHover: 'rgba(255,255,255,0.9)',
  },
  light: {
    text: '#1a1a1a',
    titleText: '#1a1a1a',
    descriptionText: 'rgba(0,0,0,0.7)',
    closeColor: 'rgba(0,0,0,0.4)',
    closeHover: 'rgba(0,0,0,0.8)',
  },
} as const;

const variantTokens = {
  info: {
    border: 'rgba(255,255,255,0.7)',
    borderLight: 'rgba(0,0,0,0.3)',
    background: 'rgba(255,255,255,0.06)',
    backgroundLight: 'rgba(0,0,0,0.04)',
    iconColor: 'rgba(255,255,255,0.7)',
    iconColorLight: 'rgba(0,0,0,0.5)',
  },
  success: {
    border: '#00A205',
    borderLight: '#00A205',
    background: 'rgba(0,162,5,0.08)',
    backgroundLight: 'rgba(0,162,5,0.06)',
    iconColor: '#00A205',
    iconColorLight: '#00A205',
  },
  warning: {
    border: '#F5A623',
    borderLight: '#F5A623',
    background: 'rgba(245,166,35,0.08)',
    backgroundLight: 'rgba(245,166,35,0.06)',
    iconColor: '#F5A623',
    iconColorLight: '#F5A623',
  },
  error: {
    border: '#DE0000',
    borderLight: '#DE0000',
    background: 'rgba(222,0,0,0.08)',
    backgroundLight: 'rgba(222,0,0,0.06)',
    iconColor: '#DE0000',
    iconColorLight: '#DE0000',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /**
   * Vizuální varianta určující barvu levého okraje a tón pozadí.
   * - `'info'`    — neutrální / informační
   * - `'success'` — úspěch (zelená)
   * - `'warning'` — varování (oranžovo-žlutá)
   * - `'error'`   — chyba (červená)
   * @default 'info'
   */
  variant?: AlertVariant;
  /**
   * Tučný nadpis upozornění.
   */
  title: string;
  /**
   * Volitelný popis vykreslený pod nadpisem menším písmem.
   */
  children?: React.ReactNode;
  /**
   * Vlastní ikona vykreslená na levé straně.
   * Pokud chybí, použije se vestavěná SVG ikona odpovídající variantě.
   */
  icon?: React.ReactNode;
  /**
   * Zobrazí tlačítko zavření (✕).
   * @default false
   */
  closable?: boolean;
  /**
   * Callback volaný při kliknutí na tlačítko zavření.
   */
  onClose?: () => void;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

// ─── Built-in icons ──────────────────────────────────────────────────────────

const InfoIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.5" />
    <path d="M10 9v5M10 7v1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SuccessIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.5" />
    <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L1.5 17h17L10 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 8v4M10 14v1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ErrorIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.5" />
    <path d="M7 7l6 6M13 7l-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Statický banner pro zobrazení důležitých informací, varování nebo chyb.
 * Na rozdíl od `Toast` se jedná o inline prvek, nikoliv plovoucí notifikaci.
 *
 * Zobrazuje barevný levý okraj (4 px) a jemně tónované pozadí
 * odpovídající zvolené variantě. Obsahuje vestavěné ikony pro každou
 * variantu, které lze nahradit vlastní ikonou přes prop `icon`.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Uloženo">Změny byly úspěšně uloženy.</Alert>
 * <Alert variant="error" title="Chyba" closable onClose={handleClose}>Něco se pokazilo.</Alert>
 * <Alert variant="warning" title="Pozor">Tato akce je nevratná.</Alert>
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  closable = false,
  onClose,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const vt = variantTokens[variant];
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isLight = theme === 'light';
  const borderColor = isLight ? vt.borderLight : vt.border;
  const bgColor = isLight ? vt.backgroundLight : vt.background;
  const iconColor = isLight ? vt.iconColorLight : vt.iconColor;

  const defaultIcons: Record<AlertVariant, React.ReactNode> = {
    info: <InfoIcon color={iconColor} />,
    success: <SuccessIcon color={iconColor} />,
    warning: <WarningIcon color={iconColor} />,
    error: <ErrorIcon color={iconColor} />,
  };

  const resolvedIcon = icon ?? defaultIcons[variant];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '4px',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      {/* Ikona */}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '1px' }}>
        {resolvedIcon}
      </span>

      {/* Obsah */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: "'Zalando Sans Expanded', sans-serif",
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: 'normal',
          color: t.titleText,
        }}>
          {title}
        </span>
        {children && (
          <div style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '1.4',
            color: t.descriptionText,
          }}>
            {children}
          </div>
        )}
      </div>

      {/* Tlačítko zavření */}
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Zavřít upozornění"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: t.closeColor,
            flexShrink: 0,
            marginTop: '1px',
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
