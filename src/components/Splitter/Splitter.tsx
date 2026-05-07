import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    dividerBg: 'rgba(255,255,255,0.06)',
    dividerHover: 'rgba(255,255,255,0.15)',
    dividerActive: '#FC4F00',
  },
  light: {
    dividerBg: 'rgba(0,0,0,0.06)',
    dividerHover: 'rgba(0,0,0,0.12)',
    dividerActive: '#FC4F00',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SplitterProps {
  /** Směr rozdělení. horizontal = vertikální separátor. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Dva nebo více panelů. */
  children: React.ReactNode[];
  /** Iniciální velikosti v procentech. @default rovnoměrně */
  defaultSizes?: number[];
  /** Min velikost per panel v px. */
  minSizes?: number[];
  /** Max velikost per panel v px. */
  maxSizes?: number[];
  /** Callback s aktuálními velikostmi (px) během dragu. */
  onResize?: (sizes: number[]) => void;
  /** localStorage key — uloží + obnoví velikosti. */
  persistKey?: string;
  /** Šířka separátoru v px. @default 4 */
  dividerSize?: number;
  /** Vypne resize. @default false */
  disabled?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Splitter ────────────────────────────────────────────────────────────────

/**
 * Draggable separator mezi panely.
 *
 * Podporuje horizontální i vertikální dělení, min/max constraints,
 * persist do localStorage a touch ovládání.
 *
 * @example
 * ```tsx
 * <Splitter defaultSizes={[30, 70]} minSizes={[200, 400]} persistKey="main-split">
 *   <div>Sidebar</div>
 *   <div>Content</div>
 * </Splitter>
 * ```
 */
export const Splitter: React.FC<SplitterProps> = ({
  orientation = 'horizontal',
  children,
  defaultSizes,
  minSizes,
  maxSizes,
  onResize,
  persistKey,
  dividerSize = 4,
  disabled = false,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const containerRef = useRef<HTMLDivElement>(null);
  const panelCount = React.Children.count(children);
  const isHorizontal = orientation === 'horizontal';

  // ── Initial sizes ───────────────────────────────────────────────────────

  const getInitialSizes = (): number[] => {
    // Try localStorage
    if (persistKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`splitter-${persistKey}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === panelCount) return parsed;
        } catch {}
      }
    }
    // Default percentages
    if (defaultSizes && defaultSizes.length === panelCount) return defaultSizes;
    return Array.from({ length: panelCount }, () => 100 / panelCount);
  };

  const [sizes, setSizes] = useState<number[]>(getInitialSizes);
  const [dragging, setDragging] = useState<number | null>(null);
  const [hoveredDivider, setHoveredDivider] = useState<number | null>(null);
  const dragStartRef = useRef<{ pos: number; sizes: number[] } | null>(null);

  // ── Persist ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (persistKey && typeof window !== 'undefined' && dragging === null) {
      localStorage.setItem(`splitter-${persistKey}`, JSON.stringify(sizes));
    }
  }, [sizes, persistKey, dragging]);

  // ── Drag logic ──────────────────────────────────────────────────────────

  const getContainerSize = useCallback(() => {
    if (!containerRef.current) return 0;
    return isHorizontal ? containerRef.current.clientWidth : containerRef.current.clientHeight;
  }, [isHorizontal]);

  const handleDragStart = useCallback((dividerIndex: number, clientPos: number) => {
    if (disabled) return;
    setDragging(dividerIndex);
    dragStartRef.current = { pos: clientPos, sizes: [...sizes] };
  }, [disabled, sizes]);

  useEffect(() => {
    if (dragging === null) return;

    const cursor = isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.cursor = cursor;
    document.body.style.userSelect = 'none';

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragStartRef.current || dragging === null) return;
      const clientPos = 'touches' in e ? e.touches[0][isHorizontal ? 'clientX' : 'clientY'] : e[isHorizontal ? 'clientX' : 'clientY'];
      const containerSize = getContainerSize();
      if (!containerSize) return;

      const delta = clientPos - dragStartRef.current.pos;
      const deltaPercent = (delta / containerSize) * 100;

      const newSizes = [...dragStartRef.current.sizes];
      const a = dragging;
      const b = dragging + 1;

      newSizes[a] = dragStartRef.current.sizes[a] + deltaPercent;
      newSizes[b] = dragStartRef.current.sizes[b] - deltaPercent;

      // Min/max clamping
      const pxPerPercent = containerSize / 100;
      if (minSizes) {
        const minA = (minSizes[a] ?? 0) / pxPerPercent;
        const minB = (minSizes[b] ?? 0) / pxPerPercent;
        if (newSizes[a] < minA) { newSizes[b] += newSizes[a] - minA; newSizes[a] = minA; }
        if (newSizes[b] < minB) { newSizes[a] += newSizes[b] - minB; newSizes[b] = minB; }
      }
      if (maxSizes) {
        const maxA = maxSizes[a] ? maxSizes[a]! / pxPerPercent : 100;
        const maxB = maxSizes[b] ? maxSizes[b]! / pxPerPercent : 100;
        if (newSizes[a] > maxA) { newSizes[b] += newSizes[a] - maxA; newSizes[a] = maxA; }
        if (newSizes[b] > maxB) { newSizes[a] += newSizes[b] - maxB; newSizes[b] = maxB; }
      }

      // Ensure non-negative
      if (newSizes[a] < 0 || newSizes[b] < 0) return;

      setSizes(newSizes);
      if (onResize) {
        onResize(newSizes.map((s) => Math.round(s * pxPerPercent)));
      }
    };

    const handleEnd = () => {
      setDragging(null);
      dragStartRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, isHorizontal, getContainerSize, minSizes, maxSizes, onResize]);

  // ── Render ──────────────────────────────────────────────────────────────

  const items = React.Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {items.map((child, idx) => (
        <React.Fragment key={idx}>
          {/* Panel */}
          <div
            style={{
              flex: `0 0 calc(${sizes[idx] ?? (100 / panelCount)}% - ${((panelCount - 1) * dividerSize) / panelCount}px)`,
              overflow: 'auto',
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {child}
          </div>

          {/* Divider (between panels) */}
          {idx < items.length - 1 && (
            <div
              style={{
                flex: `0 0 ${dividerSize}px`,
                backgroundColor: dragging === idx ? t.dividerActive : hoveredDivider === idx ? t.dividerHover : t.dividerBg,
                cursor: disabled ? 'default' : isHorizontal ? 'col-resize' : 'row-resize',
                transition: dragging === idx ? 'none' : 'background-color 0.15s ease',
                touchAction: 'none',
              }}
              onMouseDown={(e) => handleDragStart(idx, isHorizontal ? e.clientX : e.clientY)}
              onTouchStart={(e) => handleDragStart(idx, isHorizontal ? e.touches[0].clientX : e.touches[0].clientY)}
              onMouseEnter={() => !disabled && setHoveredDivider(idx)}
              onMouseLeave={() => setHoveredDivider(null)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

Splitter.displayName = 'Splitter';
