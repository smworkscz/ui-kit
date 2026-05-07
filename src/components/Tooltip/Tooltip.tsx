import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(255,255,255,0.92)',
    text: '#1a1a1a',
  },
  light: {
    background: 'rgba(30,30,30,0.92)',
    text: '#ffffff',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TooltipProps {
  /** Obsah tooltipu — text nebo ReactNode. */
  content: string | React.ReactNode;
  /** Trigger element obalený tooltipem. */
  children: React.ReactElement;
  /**
   * Pozice tooltipu vůči triggeru.
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Režim pozicování.
   * - `'anchor'` — klasický, tooltip u středu triggeru (výchozí)
   * - `'cursor'` — tooltip sleduje kurzor myši
   * @default 'anchor'
   */
  mode?: 'anchor' | 'cursor';
  /**
   * Automaticky otočí pozici když tooltip vyjede za viewport.
   * @default true
   */
  autoFlip?: boolean;
  /**
   * Posun od triggeru (anchor) nebo kurzoru (cursor) v px: [x, y].
   * @default [0, 0]
   */
  offset?: [number, number];
  /**
   * Prodleva před zobrazením (ms).
   * @default 0
   */
  delay?: number;
  /**
   * Prodleva před zobrazením (ms). Přepíše `delay` pro otevření.
   */
  openDelay?: number;
  /**
   * Prodleva před skrytím (ms). Umožňuje hover-out grace period.
   * @default 0
   */
  closeDelay?: number;
  /** Dodatečná CSS třída pro tooltip. */
  className?: string;
  /** Další inline styly pro tooltip. */
  style?: React.CSSProperties;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

/**
 * Tooltip dle SM-UI design systému.
 *
 * Zobrazí se po najetí myší na trigger element s volitelnou prodlevou.
 * Vykresluje se přes React portál. Podporuje sledování kurzoru (`mode="cursor"`)
 * pro široké elementy a automatické otočení pozice při přetečení viewportu.
 *
 * @example
 * ```tsx
 * <Tooltip content="Uložit změny">
 *   <button>Uložit</button>
 * </Tooltip>
 *
 * // Cursor-following pro široké elementy (Gantt bary):
 * <Tooltip content={<TaskDetail />} mode="cursor" position="bottom">
 *   <div className="gantt-bar" />
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  mode = 'anchor',
  autoFlip = true,
  offset = [0, 0],
  delay = 0,
  openDelay,
  closeDelay = 0,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [resolvedPosition, setResolvedPosition] = useState(position);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });

  const ARROW_SIZE = 6;
  const GAP = 8;

  const effectiveOpenDelay = openDelay ?? delay;

  // ── Flip logic ──────────────────────────────────────────────────────────

  const getFlippedPosition = useCallback(
    (pos: typeof position, triggerRect: DOMRect, tooltipRect: DOMRect): typeof position => {
      if (!autoFlip) return pos;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      switch (pos) {
        case 'top':
          if (triggerRect.top - tooltipRect.height - GAP < 0) return 'bottom';
          break;
        case 'bottom':
          if (triggerRect.bottom + tooltipRect.height + GAP > vh) return 'top';
          break;
        case 'left':
          if (triggerRect.left - tooltipRect.width - GAP < 0) return 'right';
          break;
        case 'right':
          if (triggerRect.right + tooltipRect.width + GAP > vw) return 'left';
          break;
      }
      return pos;
    },
    [autoFlip],
  );

  // ── Anchor positioning ──────────────────────────────────────────────────

  const updateAnchorPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const rect = trigger.getBoundingClientRect();
    const tRect = tooltip.getBoundingClientRect();
    const pos = getFlippedPosition(position, rect, tRect);
    setResolvedPosition(pos);

    let top = 0;
    let left = 0;
    const [ox, oy] = offset;

    switch (pos) {
      case 'top':
        top = rect.top - tRect.height - GAP + oy;
        left = rect.left + rect.width / 2 - tRect.width / 2 + ox;
        break;
      case 'bottom':
        top = rect.bottom + GAP + oy;
        left = rect.left + rect.width / 2 - tRect.width / 2 + ox;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tRect.height / 2 + oy;
        left = rect.left - tRect.width - GAP + ox;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tRect.height / 2 + oy;
        left = rect.right + GAP + ox;
        break;
    }

    // Clamp to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(4, Math.min(left, vw - tRect.width - 4));
    top = Math.max(4, Math.min(top, vh - tRect.height - 4));

    setCoords({ top, left });
  }, [position, offset, getFlippedPosition]);

  // ── Cursor positioning ──────────────────────────────────────────────────

  const updateCursorPosition = useCallback(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tRect = tooltip.getBoundingClientRect();
    const [ox, oy] = offset;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    let top = 0;
    let left = 0;

    // Position relative to cursor
    switch (position) {
      case 'top':
        top = my - tRect.height - GAP + oy;
        left = mx - tRect.width / 2 + ox;
        break;
      case 'bottom':
        top = my + GAP + 16 + oy; // 16 = approx cursor height
        left = mx - tRect.width / 2 + ox;
        break;
      case 'left':
        top = my - tRect.height / 2 + oy;
        left = mx - tRect.width - GAP + ox;
        break;
      case 'right':
        top = my - tRect.height / 2 + oy;
        left = mx + GAP + ox;
        break;
    }

    // Clamp to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(4, Math.min(left, vw - tRect.width - 4));
    top = Math.max(4, Math.min(top, vh - tRect.height - 4));

    setCoords({ top, left });
    setResolvedPosition(position);
  }, [position, offset]);

  // ── Update on visible ───────────────────────────────────────────────────

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        if (mode === 'cursor') updateCursorPosition();
        else updateAnchorPosition();
      });
    }
  }, [visible, mode, updateAnchorPosition, updateCursorPosition]);

  // ── Mouse tracking for cursor mode ──────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (mode === 'cursor' && visible) {
        updateCursorPosition();
      }
    },
    [mode, visible, updateCursorPosition],
  );

  // ── Open / close ────────────────────────────────────────────────────────

  const handleEnter = useCallback(
    (e: React.MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = undefined;
      }
      openTimerRef.current = setTimeout(() => setVisible(true), effectiveOpenDelay);
    },
    [effectiveOpenDelay],
  );

  const handleLeave = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
    if (closeDelay > 0) {
      closeTimerRef.current = setTimeout(() => setVisible(false), closeDelay);
    } else {
      setVisible(false);
    }
  }, [closeDelay]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // ── Arrow styles ────────────────────────────────────────────────────────

  const arrowStyle: React.CSSProperties = (() => {
    // No arrow in cursor mode
    if (mode === 'cursor') return { display: 'none' };

    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: `${ARROW_SIZE}px solid transparent`,
    };
    switch (resolvedPosition) {
      case 'top':
        return { ...base, bottom: -ARROW_SIZE, left: '50%', transform: 'translateX(-50%)', borderTopColor: t.background, borderBottomWidth: 0 };
      case 'bottom':
        return { ...base, top: -ARROW_SIZE, left: '50%', transform: 'translateX(-50%)', borderBottomColor: t.background, borderTopWidth: 0 };
      case 'left':
        return { ...base, right: -ARROW_SIZE, top: '50%', transform: 'translateY(-50%)', borderLeftColor: t.background, borderRightWidth: 0 };
      case 'right':
        return { ...base, left: -ARROW_SIZE, top: '50%', transform: 'translateY(-50%)', borderRightColor: t.background, borderLeftWidth: 0 };
    }
  })();

  // ── Render ──────────────────────────────────────────────────────────────

  const tooltipEl = visible
    ? createPortal(
        <div
          ref={tooltipRef}
          className={className}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            zIndex: 99999,
            padding: '6px 12px',
            backgroundColor: t.background,
            color: t.text,
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '13px',
            lineHeight: 'normal',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: 1,
            transition: 'opacity 0.12s ease',
            ...style,
          }}
        >
          {content}
          <div style={arrowStyle} />
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: (e: React.MouseEvent) => {
          handleEnter(e);
          children.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          handleLeave();
          children.props.onMouseLeave?.(e);
        },
        onMouseMove: (e: React.MouseEvent) => {
          handleMouseMove(e);
          children.props.onMouseMove?.(e);
        },
      } as any)}
      {tooltipEl}
    </>
  );
};

Tooltip.displayName = 'Tooltip';
