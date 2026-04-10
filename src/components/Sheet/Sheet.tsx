import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    overlay: 'rgba(0,0,0,0.4)',
    panelBg: 'rgba(24,24,24,0.65)',
    panelBorder: 'rgba(255,255,255,0.1)',
    titleText: '#ffffff',
    bodyText: '#eaeaea',
    closeHover: 'rgba(255,255,255,0.08)',
    closeColor: '#ACACAC',
    divider: 'rgba(255,255,255,0.08)',
    shadow: '0 0 60px rgba(0,0,0,0.5)',
    handleBg: 'rgba(255,255,255,0.2)',
  },
  light: {
    overlay: 'rgba(0,0,0,0.18)',
    panelBg: 'rgba(255,255,255,0.65)',
    panelBorder: 'rgba(0,0,0,0.08)',
    titleText: '#1a1a1a',
    bodyText: '#333333',
    closeHover: 'rgba(0,0,0,0.05)',
    closeColor: '#888888',
    divider: 'rgba(0,0,0,0.06)',
    shadow: '0 0 60px rgba(0,0,0,0.12)',
    handleBg: 'rgba(0,0,0,0.15)',
  },
} as const;

// ─── Animation duration ─────────────────────────────────────────────────────

const ANIM_DURATION = 180; // ms

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SheetProps {
  /** Řídí zobrazení sheetu. */
  open: boolean;
  /** Voláno při zavření sheetu. */
  onClose: () => void;
  /** Obsah sheetu. */
  children: React.ReactNode;
  /** Strana, ze které se sheet vysune. @default 'bottom' */
  side?: 'bottom' | 'right' | 'left' | 'top';
  /** Titulek zobrazený v záhlaví. */
  title?: string;
  /** Zobrazí zavírací tlačítko. @default true */
  showClose?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Sheet ──────────────────────────────────────────────────────────────────

/**
 * Lehký vysuvný panel, který může přijít z libovolné strany.
 *
 * Na rozdíl od Draweru je Sheet odlehčený a výchozí pozice je zdola
 * (vhodné pro mobilní rozhraní). Používá glass efekt a portálové vykreslení.
 *
 * @example
 * ```tsx
 * <Sheet open={isOpen} onClose={() => setOpen(false)} title="Filtry">
 *   <p>Obsah sheetu</p>
 * </Sheet>
 * ```
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  children,
  side = 'bottom',
  title,
  showClose = true,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const panelRef = useRef<HTMLDivElement>(null);

  const isVertical = side === 'left' || side === 'right';
  const isHorizontal = side === 'top' || side === 'bottom';

  // ── Open / close animation ─────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimState('opening');
      const timer = setTimeout(() => {
        setAnimState('open');
      }, 10);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
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

  // ── Escape key ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, onClose]);

  // ── Animation styles ───────────────────────────────────────────────────

  const getTranslate = (state: typeof animState) => {
    const offscreenMap = {
      bottom: 'translateY(100%)',
      top: 'translateY(-100%)',
      right: 'translateX(100%)',
      left: 'translateX(-100%)',
    };
    if (state === 'opening' || state === 'idle') return offscreenMap[side];
    if (state === 'open') return 'translate(0, 0)';
    return offscreenMap[side];
  };

  const getOverlayOpacity = () => (animState === 'open' ? 1 : 0);

  // ── Panel positioning ──────────────────────────────────────────────────

  const panelPosition: React.CSSProperties = {};
  if (side === 'bottom') {
    panelPosition.bottom = 0;
    panelPosition.left = 0;
    panelPosition.right = 0;
    panelPosition.maxHeight = '85vh';
    panelPosition.borderTopLeftRadius = '16px';
    panelPosition.borderTopRightRadius = '16px';
  } else if (side === 'top') {
    panelPosition.top = 0;
    panelPosition.left = 0;
    panelPosition.right = 0;
    panelPosition.maxHeight = '85vh';
    panelPosition.borderBottomLeftRadius = '16px';
    panelPosition.borderBottomRightRadius = '16px';
  } else if (side === 'right') {
    panelPosition.top = 0;
    panelPosition.bottom = 0;
    panelPosition.right = 0;
    panelPosition.width = '400px';
    panelPosition.maxWidth = '100vw';
  } else if (side === 'left') {
    panelPosition.top = 0;
    panelPosition.bottom = 0;
    panelPosition.left = 0;
    panelPosition.width = '400px';
    panelPosition.maxWidth = '100vw';
  }

  // ── Border per side ────────────────────────────────────────────────────

  const borderStyle: React.CSSProperties = {};
  if (side === 'bottom') borderStyle.borderTop = `1px solid ${t.panelBorder}`;
  else if (side === 'top') borderStyle.borderBottom = `1px solid ${t.panelBorder}`;
  else if (side === 'right') borderStyle.borderLeft = `1px solid ${t.panelBorder}`;
  else if (side === 'left') borderStyle.borderRight = `1px solid ${t.panelBorder}`;

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
      }}
    >
      {/* Překryvná vrstva */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: t.overlay,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: getOverlayOpacity(),
          transition: `opacity ${ANIM_DURATION}ms ease`,
          ...(animState === 'closing' ? { pointerEvents: 'none' as const } : {}),
        }}
        onClick={onClose}
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
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: t.panelBg,
          boxShadow: t.shadow,
          backdropFilter: 'blur(32px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
          transform: getTranslate(animState),
          transition: `transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          boxSizing: 'border-box',
          outline: 'none',
          ...panelPosition,
          ...borderStyle,
          ...style,
        }}
      >
        {/* Drag handle pro bottom sheet */}
        {side === 'bottom' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '10px 0 4px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: t.handleBg,
              }}
            />
          </div>
        )}

        {/* Záhlaví */}
        {(title || showClose) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: side === 'bottom' ? '8px 24px 16px' : '20px 24px 16px',
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
                <XIcon size={16} color={t.closeColor} />
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
      </div>
    </div>,
    document.body,
  );
};

Sheet.displayName = 'Sheet';
