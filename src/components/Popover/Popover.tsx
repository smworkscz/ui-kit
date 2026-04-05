import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(24,24,24,0.95)',
    border: 'rgba(255,255,255,0.12)',
    text: '#ffffff',
    shadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
  },
  light: {
    background: 'rgba(255,255,255,0.95)',
    border: 'rgba(0,0,0,0.1)',
    text: '#1a1a1a',
    shadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset',
  },
} as const;

const ANIM_DURATION = 180;
const GAP = 8;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PopoverProps {
  /** Obsah popoveru. */
  content: React.ReactNode;
  /** Trigger element. */
  children: React.ReactElement;
  /**
   * Pozice popoveru vůči triggeru.
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Způsob otevření.
   * @default 'click'
   */
  trigger?: 'click' | 'hover';
  /** Dodatečná CSS třída pro popover. */
  className?: string;
  /** Další inline styly pro popover. */
  style?: React.CSSProperties;
}

// ─── Popover ─────────────────────────────────────────────────────────────────

/**
 * Popover dle SM-UI design systému.
 *
 * Podobný Tooltipu, ale větší, s kartovým stylem.
 * Otevírá se kliknutím nebo hoverem, zavírá kliknutím mimo nebo Escape.
 * Vykresluje se přes React portál.
 *
 * @example
 * ```tsx
 * <Popover content={<div>Obsah popoveru</div>} trigger="click">
 *   <button>Klikni</button>
 * </Popover>
 * ```
 */
export const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  position = 'bottom',
  trigger = 'click',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Open / close with animation ────────────────────────────────────────

  const doOpen = useCallback(() => {
    setOpen(true);
    setVisible(true);
    setAnimState('opening');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('open'));
    });
  }, []);

  const doClose = useCallback(() => {
    setOpen(false);
    setAnimState('closing');
    const timer = setTimeout(() => {
      setVisible(false);
      setAnimState('idle');
    }, ANIM_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ── Position ───────────────────────────────────────────────────────────

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    const pop = popoverRef.current;
    if (!el || !pop) return;

    const rect = el.getBoundingClientRect();
    const pRect = pop.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - pRect.height - GAP;
        left = rect.left + rect.width / 2 - pRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + GAP;
        left = rect.left + rect.width / 2 - pRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - pRect.height / 2;
        left = rect.left - pRect.width - GAP;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - pRect.height / 2;
        left = rect.right + GAP;
        break;
    }

    setCoords({ top, left });
  }, [position]);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, updatePosition]);

  // ── Outside click ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        doClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, doClose]);

  // ── Escape ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') doClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, doClose]);

  // ── Animation style ────────────────────────────────────────────────────

  const getAnimStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    const slideMap = { top: '8px', bottom: '-8px', left: '8px', right: '-8px' };
    const axis = position === 'top' || position === 'bottom' ? 'Y' : 'X';

    if (animState === 'opening' || animState === 'idle') {
      return { ...base, opacity: 0, transform: `translate${axis}(${slideMap[position]}) scale(0.97)` };
    }
    if (animState === 'open') {
      return { ...base, opacity: 1, transform: 'translateY(0) scale(1)' };
    }
    return { ...base, opacity: 0, transform: `translate${axis}(${slideMap[position]}) scale(0.98)`, pointerEvents: 'none' };
  };

  // ── Trigger handlers ───────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (trigger !== 'click') return;
    if (open) doClose();
    else doOpen();
  }, [trigger, open, doClose, doOpen]);

  const handleMouseEnter = useCallback(() => {
    if (trigger !== 'hover') return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (!open) doOpen();
  }, [trigger, open, doOpen]);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== 'hover') return;
    hoverTimerRef.current = setTimeout(() => {
      doClose();
    }, 150);
  }, [trigger, doClose]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // ── Portal ─────────────────────────────────────────────────────────────

  const popoverEl = visible
    ? createPortal(
        <div
          ref={popoverRef}
          className={className}
          onMouseEnter={() => {
            if (trigger === 'hover' && hoverTimerRef.current) {
              clearTimeout(hoverTimerRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            zIndex: 99999,
            padding: '16px',
            backgroundColor: t.background,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            color: t.text,
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            lineHeight: 'normal',
            boxShadow: t.shadow,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            minWidth: '120px',
            ...getAnimStyle(),
            ...style,
          }}
        >
          {content}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onClick: (e: React.MouseEvent) => {
          handleClick();
          children.props.onClick?.(e);
        },
        onMouseEnter: (e: React.MouseEvent) => {
          handleMouseEnter();
          children.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          handleMouseLeave();
          children.props.onMouseLeave?.(e);
        },
      } as any)}
      {popoverEl}
    </>
  );
};

Popover.displayName = 'Popover';
