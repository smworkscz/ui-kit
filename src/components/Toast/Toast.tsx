import React from 'react';

// ─── Design tokens ───────────────────────────────────────────────────────────
// Toast is always dark-themed by design (overlays / notification tray).

const variantTokens = {
  info: {
    border: 'rgba(255,255,255,0.7)',
    background: 'rgba(3,3,3,0.75)',
  },
  success: {
    border: '#00A205',
    background: 'rgba(3,21,4,0.75)',
  },
  error: {
    border: '#DE0000',
    background: 'rgba(21,3,3,0.75)',
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

// ─── Built-in icons ───────────────────────────────────────────────────────────

const InfoIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 12.5v7M14 9.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11.5" stroke="#00A205" strokeWidth="1.5"/>
    <path d="M9 14.5l3.5 3.5 6.5-7" stroke="#00A205" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11.5" stroke="#DE0000" strokeWidth="1.5"/>
    <path d="M10 10l8 8M18 10l-8 8" stroke="#DE0000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const defaultIcons: Record<ToastVariant, React.ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  error: <ErrorIcon />,
};

const CloseIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

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
  const { border, background } = variantTokens[variant];
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
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      {/* Body: icon + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: '#ffffff' }}>
          {resolvedIcon}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            color: '#ffffff',
            lineHeight: 'normal',
          }}>
            {title}
          </span>
          {content && (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              color: '#ffffff',
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
            color: '#ffffff',
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
