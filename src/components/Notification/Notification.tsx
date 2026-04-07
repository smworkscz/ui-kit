import React, { useState } from 'react';
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  XCircle as XCircleIcon,
  X as XIcon,
} from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    titleText: '#ffffff',
    bodyText: 'rgba(255,255,255,0.85)',
    closeColor: 'rgba(255,255,255,0.6)',
    closeHover: 'rgba(255,255,255,0.9)',
    border: 'rgba(255,255,255,0.1)',
  },
  light: {
    titleText: '#1a1a1a',
    bodyText: 'rgba(0,0,0,0.7)',
    closeColor: 'rgba(0,0,0,0.4)',
    closeHover: 'rgba(0,0,0,0.8)',
    border: 'rgba(0,0,0,0.08)',
  },
} as const;

const variantTokens = {
  info: {
    bg: 'rgba(255,255,255,0.06)',
    bgLight: 'rgba(0,0,0,0.04)',
    accent: 'rgba(255,255,255,0.7)',
    accentLight: 'rgba(0,0,0,0.5)',
  },
  success: {
    bg: 'rgba(0,162,5,0.08)',
    bgLight: 'rgba(0,162,5,0.06)',
    accent: '#00A205',
    accentLight: '#00A205',
  },
  warning: {
    bg: 'rgba(245,166,35,0.08)',
    bgLight: 'rgba(245,166,35,0.06)',
    accent: '#F5A623',
    accentLight: '#F5A623',
  },
  error: {
    bg: 'rgba(222,0,0,0.08)',
    bgLight: 'rgba(222,0,0,0.06)',
    accent: '#DE0000',
    accentLight: '#DE0000',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface NotificationProps {
  /** Vizuální varianta notifikace. @default 'info' */
  variant?: NotificationVariant;
  /** Titulek notifikace. */
  title: string;
  /** Obsah / popis notifikace. */
  children?: React.ReactNode;
  /** Zobrazí tlačítko zavření. @default false */
  closable?: boolean;
  /** Voláno při zavření notifikace. */
  onClose?: () => void;
  /** Vlastní ikona (nahradí výchozí ikonu varianty). */
  icon?: React.ReactNode;
  /** Akční prvek zobrazený na pravé straně (tlačítko apod.). */
  action?: React.ReactNode;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Notification ───────────────────────────────────────────────────────────

/**
 * Inline notifikační banner pro trvalé zobrazení v layoutu.
 *
 * Na rozdíl od `Toast` se nejedná o plovoucí overlay, ale o součást
 * obsahu stránky. Podporuje varianty info/success/warning/error,
 * volitelný akční prvek a zavírací tlačítko.
 *
 * @example
 * ```tsx
 * <Notification variant="success" title="Uloženo" closable>
 *   Změny byly úspěšně uloženy.
 * </Notification>
 * <Notification
 *   variant="warning"
 *   title="Nová verze"
 *   action={<Button size="sm">Aktualizovat</Button>}
 * >
 *   Je dostupná nová verze aplikace.
 * </Notification>
 * ```
 */
export const Notification: React.FC<NotificationProps> = ({
  variant = 'info',
  title,
  children,
  closable = false,
  onClose,
  icon,
  action,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const vt = variantTokens[variant];
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isLight = theme === 'light';
  const bgColor = isLight ? vt.bgLight : vt.bg;
  const accentColor = isLight ? vt.accentLight : vt.accent;

  const defaultIcons: Record<NotificationVariant, React.ReactNode> = {
    info: <InfoIcon size={20} color={accentColor} />,
    success: <CheckCircleIcon size={20} color={accentColor} />,
    warning: <WarningIcon size={20} color={accentColor} />,
    error: <XCircleIcon size={20} color={accentColor} />,
  };

  const resolvedIcon = icon ?? defaultIcons[variant];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      role="status"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: bgColor,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Ikona */}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '1px' }}>
        {resolvedIcon}
      </span>

      {/* Obsah */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: 'normal',
            color: t.titleText,
          }}
        >
          {title}
        </span>
        {children && (
          <div
            style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontWeight: 400,
              fontSize: '13px',
              lineHeight: '1.4',
              color: t.bodyText,
            }}
          >
            {children}
          </div>
        )}
      </div>

      {/* Akce */}
      {action && (
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '1px' }}>
          {action}
        </div>
      )}

      {/* Tlačítko zavření */}
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Zavřít notifikaci"
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
          <XIcon size={16} color="currentColor" />
        </button>
      )}
    </div>
  );
};

Notification.displayName = 'Notification';
