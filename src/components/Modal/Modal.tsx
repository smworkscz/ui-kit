import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    overlay: 'rgba(0,0,0,0.6)',
    cardBg: 'rgba(24,24,24,0.97)',
    cardBorder: 'rgba(255,255,255,0.1)',
    titleText: '#ffffff',
    bodyText: '#eaeaea',
    closeHover: 'rgba(255,255,255,0.08)',
    closeColor: '#ACACAC',
    divider: 'rgba(255,255,255,0.08)',
    shadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
  },
  light: {
    overlay: 'rgba(0,0,0,0.35)',
    cardBg: 'rgba(255,255,255,0.98)',
    cardBorder: 'rgba(0,0,0,0.08)',
    titleText: '#1a1a1a',
    bodyText: '#333333',
    closeHover: 'rgba(0,0,0,0.05)',
    closeColor: '#888888',
    divider: 'rgba(0,0,0,0.06)',
    shadow: '0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03) inset',
  },
} as const;

// ─── Animation duration ─────────────────────────────────────────────────────

const ANIM_DURATION = 180; // ms

// ─── Close icon ─────────────────────────────────────────────────────────────

const CloseIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { width: '400px', maxHeight: '70vh' },
  md: { width: '560px', maxHeight: '80vh' },
  lg: { width: '720px', maxHeight: '85vh' },
  fullscreen: { width: '100vw', maxHeight: '100vh' },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Řídí zobrazení modálního okna. */
  open: boolean;
  /** Voláno při zavření modálu. */
  onClose: () => void;
  /** Titulek zobrazený v záhlaví modálu. */
  title?: string;
  /** Obsah těla modálu. */
  children: React.ReactNode;
  /** Obsah patičky modálu (tlačítka apod.). */
  footer?: React.ReactNode;
  /** Velikostní preset modálu. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  /** Zavře modál kliknutím na překryvnou vrstvu. @default true */
  closeOnOverlay?: boolean;
  /** Zavře modál stisknutím klávesy Escape. @default true */
  closeOnEscape?: boolean;
  /** Zobrazí zavírací tlačítko (×) v záhlaví. @default true */
  showClose?: boolean;
  /** Dodatečná CSS třída pro kartu modálu. */
  className?: string;
  /** Další inline styly pro kartu modálu. */
  style?: React.CSSProperties;
}

// ─── Modal ──────────────────────────────────────────────────────────────────

/**
 * Modální dialog dle SM-UI design systému.
 *
 * Vykresluje se přes React portál s překryvnou vrstvou,
 * podporuje animace otevření / zavření, focus trap
 * a zamezení scrollu pozadí.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setOpen(false)} title="Potvrzení">
 *   <p>Opravdu chcete pokračovat?</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showClose = true,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];

  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // ── Open / close animation ──────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      setVisible(true);
      setAnimState('opening');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState('open'));
      });
      // Zabránit scrollu těla
      document.body.style.overflow = 'hidden';
    } else if (visible) {
      setAnimState('closing');
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
        document.body.style.overflow = '';
        // Vrátit focus
        if (previousFocusRef.current instanceof HTMLElement) {
          previousFocusRef.current.focus();
        }
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ── Cleanup při unmount ─────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Escape key ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, closeOnEscape, onClose]);

  // ── Focus trap ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible || !cardRef.current) return;
    const card = cardRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = card.querySelectorAll(focusableSelector);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    // Automatický focus na kartu
    card.focus();
    return () => document.removeEventListener('keydown', handleTab);
  }, [visible]);

  // ── Animation styles ────────────────────────────────────────────────────

  const getOverlayStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms ease`,
    };
    if (animState === 'opening' || animState === 'idle') return { ...base, opacity: 0 };
    if (animState === 'open') return { ...base, opacity: 1 };
    return { ...base, opacity: 0, pointerEvents: 'none' };
  };

  const getCardAnimStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    if (animState === 'opening' || animState === 'idle') {
      return { ...base, opacity: 0, transform: 'scale(0.95)' };
    }
    if (animState === 'open') {
      return { ...base, opacity: 1, transform: 'scale(1)' };
    }
    return { ...base, opacity: 0, transform: 'scale(0.97)', pointerEvents: 'none' };
  };

  if (!visible) return null;

  const isFullscreen = size === 'fullscreen';

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        display: 'flex',
        alignItems: isFullscreen ? 'stretch' : 'center',
        justifyContent: 'center',
        ...getOverlayStyle(),
      }}
    >
      {/* Překryvná vrstva */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: t.overlay,
        }}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Karta modálu */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={className}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: sc.width,
          maxWidth: isFullscreen ? undefined : 'calc(100vw - 32px)',
          maxHeight: isFullscreen ? '100vh' : sc.maxHeight,
          backgroundColor: t.cardBg,
          border: isFullscreen ? 'none' : `1px solid ${t.cardBorder}`,
          borderRadius: isFullscreen ? 0 : '16px',
          boxShadow: t.shadow,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          outline: 'none',
          overflow: 'hidden',
          boxSizing: 'border-box',
          ...getCardAnimStyle(),
          ...style,
        }}
      >
        {/* Záhlaví */}
        {(title || showClose) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px 16px',
              flexShrink: 0,
              borderBottom: `1px solid ${t.divider}`,
            }}
          >
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  color: t.titleText,
                }}
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                type="button"
                aria-label="Zavřít"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: t.closeColor,
                  marginLeft: 'auto',
                  flexShrink: 0,
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.closeHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <CloseIcon color={t.closeColor} />
              </button>
            )}
          </div>
        )}

        {/* Tělo */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            lineHeight: '1.6',
            color: t.bodyText,
          }}
        >
          {children}
        </div>

        {/* Patička */}
        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              padding: '16px 24px 20px',
              flexShrink: 0,
              borderTop: `1px solid ${t.divider}`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';
