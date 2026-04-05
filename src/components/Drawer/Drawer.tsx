import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    overlay: 'rgba(0,0,0,0.6)',
    panelBg: 'rgba(24,24,24,0.97)',
    panelBorder: 'rgba(255,255,255,0.1)',
    titleText: '#ffffff',
    bodyText: '#eaeaea',
    closeHover: 'rgba(255,255,255,0.08)',
    closeColor: '#ACACAC',
    divider: 'rgba(255,255,255,0.08)',
    shadow: '0 0 60px rgba(0,0,0,0.5)',
  },
  light: {
    overlay: 'rgba(0,0,0,0.35)',
    panelBg: 'rgba(255,255,255,0.98)',
    panelBorder: 'rgba(0,0,0,0.08)',
    titleText: '#1a1a1a',
    bodyText: '#333333',
    closeHover: 'rgba(0,0,0,0.05)',
    closeColor: '#888888',
    divider: 'rgba(0,0,0,0.06)',
    shadow: '0 0 60px rgba(0,0,0,0.12)',
  },
} as const;

// ─── Animation duration ─────────────────────────────────────────────────────

const ANIM_DURATION = 220; // ms — lehce delší pro slide

// ─── Close icon ─────────────────────────────────────────────────────────────

const CloseIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DrawerProps {
  /** Řídí zobrazení šuplíku. */
  open: boolean;
  /** Voláno při zavření šuplíku. */
  onClose: () => void;
  /** Strana, ze které se šuplík vysune. @default 'right' */
  position?: 'left' | 'right';
  /** Titulek zobrazený v záhlaví šuplíku. */
  title?: string;
  /** Obsah těla šuplíku. */
  children: React.ReactNode;
  /** Obsah patičky šuplíku. */
  footer?: React.ReactNode;
  /** Šířka panelu (px nebo CSS řetězec). @default 400 */
  width?: string | number;
  /** Zobrazí zavírací tlačítko (×). @default true */
  showClose?: boolean;
  /** Zavře šuplík kliknutím na překryvnou vrstvu. @default true */
  closeOnOverlay?: boolean;
  /** Dodatečná CSS třída pro panel šuplíku. */
  className?: string;
  /** Další inline styly pro panel šuplíku. */
  style?: React.CSSProperties;
}

// ─── Drawer ─────────────────────────────────────────────────────────────────

/**
 * Vysuvný panel (Drawer) dle SM-UI design systému.
 *
 * Vykresluje se přes React portál, vysune se z levé nebo pravé strany
 * s překryvnou vrstvou a plynulou animací.
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onClose={() => setOpen(false)} title="Nastavení">
 *   <p>Obsah šuplíku</p>
 * </Drawer>
 * ```
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  position = 'right',
  title,
  children,
  footer,
  width = 400,
  showClose = true,
  closeOnOverlay = true,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const panelRef = useRef<HTMLDivElement>(null);

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;

  // ── Open / close animation ──────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimState('opening');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState('open'));
      });
      document.body.style.overflow = 'hidden';
    } else if (visible) {
      setAnimState('closing');
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
        document.body.style.overflow = '';
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Escape key ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, onClose]);

  // ── Animation styles ────────────────────────────────────────────────────

  const getTranslateX = (state: typeof animState) => {
    const offscreen = position === 'right' ? '100%' : '-100%';
    if (state === 'opening' || state === 'idle') return offscreen;
    if (state === 'open') return '0%';
    return offscreen;
  };

  const getOverlayOpacity = () => {
    if (animState === 'open') return 1;
    return 0;
  };

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        display: 'flex',
      }}
    >
      {/* Překryvná vrstva */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: t.overlay,
          opacity: getOverlayOpacity(),
          transition: `opacity ${ANIM_DURATION}ms ease`,
          ...(animState === 'closing' ? { pointerEvents: 'none' as const } : {}),
        }}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [position]: 0,
          width: resolvedWidth,
          maxWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: t.panelBg,
          borderLeft: position === 'right' ? `1px solid ${t.panelBorder}` : 'none',
          borderRight: position === 'left' ? `1px solid ${t.panelBorder}` : 'none',
          boxShadow: t.shadow,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transform: `translateX(${getTranslateX(animState)})`,
          transition: `transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          boxSizing: 'border-box',
          outline: 'none',
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

Drawer.displayName = 'Drawer';
