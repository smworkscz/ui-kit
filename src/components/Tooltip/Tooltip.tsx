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
   * Prodleva před zobrazením (ms).
   * @default 200
   */
  delay?: number;
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
 * Vykresluje se přes React portál, takže ho neořízne rodičovský kontejner.
 *
 * @example
 * ```tsx
 * <Tooltip content="Uložit změny">
 *   <button>Uložit</button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const ARROW_SIZE = 6;
  const GAP = 8;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const rect = trigger.getBoundingClientRect();
    const tRect = tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tRect.height - GAP;
        left = rect.left + rect.width / 2 - tRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + GAP;
        left = rect.left + rect.width / 2 - tRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tRect.height / 2;
        left = rect.left - tRect.width - GAP;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tRect.height / 2;
        left = rect.right + GAP;
        break;
    }

    setCoords({ top, left });
  }, [position]);

  useEffect(() => {
    if (visible) {
      // Initial position then recalc after render
      requestAnimationFrame(updatePosition);
    }
  }, [visible, updatePosition]);

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const handleLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Arrow styles per position
  const arrowStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: `${ARROW_SIZE}px solid transparent`,
    };
    switch (position) {
      case 'top':
        return {
          ...base,
          bottom: -ARROW_SIZE,
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: t.background,
          borderBottomWidth: 0,
        };
      case 'bottom':
        return {
          ...base,
          top: -ARROW_SIZE,
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: t.background,
          borderTopWidth: 0,
        };
      case 'left':
        return {
          ...base,
          right: -ARROW_SIZE,
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: t.background,
          borderRightWidth: 0,
        };
      case 'right':
        return {
          ...base,
          left: -ARROW_SIZE,
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: t.background,
          borderLeftWidth: 0,
        };
    }
  })();

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
        document.body
      )
    : null;

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: (e: React.MouseEvent) => {
          handleEnter();
          children.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          handleLeave();
          children.props.onMouseLeave?.(e);
        },
      } as any)}
      {tooltipEl}
    </>
  );
};

Tooltip.displayName = 'Tooltip';
