import React, { useState } from 'react';
import { Info as InfoIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, XCircle as XCircleIcon, X as XIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    titleText: '#ffffff',
    descriptionText: 'rgba(255,255,255,0.85)',
    closeColor: 'rgba(255,255,255,0.6)',
    closeHover: 'rgba(255,255,255,0.9)',
    glassBg: 'rgba(24,24,24,0.8)',
    glassBorder: 'rgba(255,255,255,0.1)',
    defaultBg: 'rgba(255,255,255,0.04)',
  },
  light: {
    text: '#1a1a1a',
    titleText: '#1a1a1a',
    descriptionText: 'rgba(0,0,0,0.7)',
    closeColor: 'rgba(0,0,0,0.4)',
    closeHover: 'rgba(0,0,0,0.8)',
    glassBg: 'rgba(255,255,255,0.8)',
    glassBorder: 'rgba(0,0,0,0.08)',
    defaultBg: 'rgba(0,0,0,0.02)',
  },
} as const;

const variantTokens = {
  info: {
    accent: 'rgba(255,255,255,0.7)',
    accentLight: 'rgba(0,0,0,0.3)',
    bg: 'rgba(255,255,255,0.06)',
    bgLight: 'rgba(0,0,0,0.04)',
    icon: 'rgba(255,255,255,0.7)',
    iconLight: 'rgba(0,0,0,0.5)',
  },
  success: {
    accent: '#00A205',
    accentLight: '#00A205',
    bg: 'rgba(0,162,5,0.08)',
    bgLight: 'rgba(0,162,5,0.06)',
    icon: '#00A205',
    iconLight: '#00A205',
  },
  warning: {
    accent: '#F5A623',
    accentLight: '#F5A623',
    bg: 'rgba(245,166,35,0.08)',
    bgLight: 'rgba(245,166,35,0.06)',
    icon: '#F5A623',
    iconLight: '#F5A623',
  },
  error: {
    accent: '#DE0000',
    accentLight: '#DE0000',
    bg: 'rgba(222,0,0,0.08)',
    bgLight: 'rgba(222,0,0,0.06)',
    icon: '#DE0000',
    iconLight: '#DE0000',
  },
} as const;

const defaultIcons: Record<BannerVariant, React.ReactNode> = {
  info: <InfoIcon size={20} />,
  success: <CheckCircleIcon size={20} />,
  warning: <WarningIcon size={20} />,
  error: <XCircleIcon size={20} />,
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';
export type BannerPosition = 'top' | 'bottom';

export interface BannerProps {
  /** Vizuální varianta. @default 'info' */
  variant?: BannerVariant;
  /** Tučný titulek. */
  title?: string;
  /** Obsah banneru. */
  children?: React.ReactNode;
  /** Zobrazí zavírací tlačítko. @default false */
  closable?: boolean;
  /** Callback při zavření. */
  onClose?: () => void;
  /** Vlastní ikona. Pokud není zadána, použije se výchozí dle varianty. */
  icon?: React.ReactNode;
  /** Pozice akcentního proužku. @default 'top' */
  position?: BannerPosition;
  /** Přilepí banner na pozici. @default false */
  sticky?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Banner ──────────────────────────────────────────────────────────────────

/**
 * Oznámovací banner na celou šířku.
 *
 * Plnohodnotný banner pro oznámení, varování nebo chybové hlášky.
 * Lze přilepit na horní nebo dolní okraj pomocí `sticky`.
 *
 * @example
 * ```tsx
 * <Banner variant="warning" title="Údržba" sticky>
 *   Systém bude nedostupný 12. dubna od 22:00.
 * </Banner>
 * ```
 */
export const Banner: React.FC<BannerProps> = ({
  variant = 'info',
  title,
  children,
  closable = false,
  onClose,
  icon,
  position = 'top',
  sticky = false,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const v = variantTokens[variant];
  const [visible, setVisible] = useState(true);

  if (!visible) return null;
  if (!title && !children) return null;

  const isLight = theme === 'light';
  const accentColor = isLight ? v.accentLight : v.accent;
  const bgColor = sticky ? (isLight ? t.glassBg : t.glassBg) : (isLight ? v.bgLight : v.bg);
  const iconColor = isLight ? v.iconLight : v.icon;
  const displayIcon = icon ?? defaultIcons[variant];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      role="alert"
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 20px',
        backgroundColor: bgColor,
        borderTop: position === 'bottom' ? `3px solid ${accentColor}` : 'none',
        borderBottom: position === 'top' ? `3px solid ${accentColor}` : 'none',
        boxSizing: 'border-box',
        fontFamily: "'Zalando Sans', sans-serif",
        ...(sticky ? {
          position: 'sticky',
          [position]: 0,
          zIndex: 1000,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: `1px solid ${t.glassBorder}`,
          borderRight: `1px solid ${t.glassBorder}`,
        } : {}),
        ...style,
      }}
    >
      {/* Icon */}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: iconColor, marginTop: '1px' }}>
        {displayIcon}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontWeight: 600, fontSize: '14px', color: t.titleText, lineHeight: 'normal' }}>
            {title}
          </div>
        )}
        {children && (
          <div style={{ fontSize: '13px', color: t.descriptionText, lineHeight: '1.5', marginTop: title ? '4px' : 0 }}>
            {children}
          </div>
        )}
      </div>

      {/* Close */}
      {closable && (
        <button
          type="button"
          aria-label="Zavřít"
          onClick={handleClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            border: 'none',
            background: 'transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            color: t.closeColor,
            flexShrink: 0,
            transition: 'color 0.12s ease',
            padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = t.closeHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = t.closeColor; }}
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
};

Banner.displayName = 'Banner';
