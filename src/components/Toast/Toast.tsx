import React from 'react';
import { Info as InfoIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, X as XIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    info:    { border: 'rgba(255,255,255,0.5)', background: 'rgba(3,3,3,0.55)' },
    success: { border: 'rgba(0,162,5,0.7)',     background: 'rgba(3,21,4,0.55)' },
    error:   { border: 'rgba(222,0,0,0.7)',     background: 'rgba(21,3,3,0.55)' },
    text: '#ffffff',
    textSecondary: '#ffffff',
    iconColor: '#ffffff',
    closeColor: '#ffffff',
  },
  light: {
    info:    { border: 'rgba(0,0,0,0.12)',   background: 'rgba(255,255,255,0.7)' },
    success: { border: 'rgba(0,162,5,0.3)',  background: 'rgba(240,255,240,0.7)' },
    error:   { border: 'rgba(222,0,0,0.3)', background: 'rgba(255,240,240,0.7)' },
    text: '#1a1a1a',
    textSecondary: '#333333',
    iconColor: '#1a1a1a',
    closeColor: '#888888',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant = 'info' | 'success' | 'error';

export interface ToastProps {
  /**
   * Vizuální varianta určující barvu okraje a tón pozadí.
   * - `'info'`    — bílý / neutrální okraj, tmavé pozadí
   * - `'success'` — zelený okraj (#00A205), tmavé nazelenalé pozadí
   * - `'error'`   — červený okraj (#DE0000), tmavé načervenalé pozadí
   * @default 'info'
   */
  variant?: ToastVariant;
  /**
   * Tučný nadpis notifikace.
   */
  title: string;
  /**
   * Volitelný sekundární popis vykreslený pod nadpisem menším písmem.
   */
  content?: string;
  /**
   * Vlastní ikona vykreslená na levé straně.
   * Pokud chybí, použije se vestavěná SVG ikona odpovídající variantě.
   */
  icon?: React.ReactNode;
  /**
   * Callback volaný při kliknutí na tlačítko zavření (✕).
   * Pokud není zadán, tlačítko zavření se nezobrazí.
   */
  onClose?: () => void;
  /**
   * ARIA role pro přístupnost.
   * Použijte `'alert'` pro naléhavé zprávy, `'status'` pro běžné.
   * @default 'alert'
   */
  role?: 'alert' | 'status' | 'log';
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
}

const defaultIcons: Record<ToastVariant, React.ReactNode> = {
  info: <InfoIcon size={28} color="currentColor" />,
  success: <CheckCircleIcon size={28} color="#00A205" />,
  error: <XCircleIcon size={28} color="#DE0000" />,
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Notifikace se třemi úrovněmi závažnosti.
 * Vykresluje se s efektem rozmazaného skla, vždy v tmavém režimu.
 *
 * Tlačítko zavření se zobrazí pouze pokud je zadáno `onClose`.
 * Vlastní ikona může nahradit výchozí variantní ikonu přes prop `icon`.
 *
 * @example
 * ```tsx
 * <Toast variant="success" title="Uloženo" content="Změny byly uloženy." onClose={dismiss} />
 * <Toast variant="error"   title="Chyba" content="Něco se pokazilo." onClose={dismiss} />
 * <Toast variant="info"    title="Upozornění" onClose={dismiss} />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  content,
  icon,
  onClose,
  role = 'alert',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const { border, background } = t[variant];
  const resolvedIcon = icon ?? defaultIcons[variant];

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '12px 12px 12px 16px',
        backgroundColor: background,
        border: `2px solid ${border}`,
        borderRadius: '8px',
        /* backdrop-filter moved to Toaster wrapper for stacking context compatibility */
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      {/* Body: icon + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: t.iconColor }}>
          {resolvedIcon}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            color: t.text,
            lineHeight: 'normal',
          }}>
            {title}
          </span>
          {content && (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              color: t.textSecondary,
              lineHeight: 'normal',
            }}>
              {content}
            </span>
          )}
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Zavřít notifikaci"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: t.closeColor,
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <XIcon size={16} color="currentColor" />
        </button>
      )}
    </div>
  );
};
