import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.08)',
    text: 'rgba(255,255,255,0.55)',
    textHover: 'rgba(255,255,255,0.8)',
    textActive: '#ffffff',  // white on orange indicator
    textDisabled: 'rgba(255,255,255,0.25)',
    indicator: '#FC4F00',
    indicatorBorder: 'rgba(255,255,255,0.05)',
    indicatorShadow: '0 1px 6px rgba(252,79,0,0.3)',
  },
  light: {
    bg: 'rgba(0,0,0,0.04)',
    border: 'rgba(0,0,0,0.06)',
    text: 'rgba(0,0,0,0.45)',
    textHover: 'rgba(0,0,0,0.7)',
    textActive: '#ffffff',  // white on orange indicator
    textDisabled: 'rgba(0,0,0,0.2)',
    indicator: '#FC4F00',
    indicatorBorder: 'rgba(0,0,0,0.03)',
    indicatorShadow: '0 1px 6px rgba(252,79,0,0.2)',
  },
} as const;

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '4px', itemPadding: '4px 10px', fontSize: '12px', borderRadius: '6px', itemRadius: '4px' },
  md: { padding: '4px', itemPadding: '6px 14px', fontSize: '13px', borderRadius: '8px', itemRadius: '6px' },
  lg: { padding: '5px', itemPadding: '8px 18px', fontSize: '14px', borderRadius: '10px', itemRadius: '7px' },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export interface SegmentedControlItem {
  /** Unikátní hodnota segmentu. */
  value: string;
  /** Zobrazovaný text. Výchozí: `value`. */
  label?: string;
  /** Ikona zobrazená v segmentu. Může být samostatně nebo s label. */
  icon?: React.ReactNode;
  /** Zakáže tento segment. */
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /**
   * Data — pole řetězců nebo objektů `{ value, label?, disabled? }`.
   * Řetězce jsou automaticky převedeny na objekty s `value === label`.
   */
  data: (string | SegmentedControlItem)[];
  /** Aktuálně vybraná hodnota (řízená komponenta). */
  value: string;
  /** Callback volaný při změně výběru. */
  onChange: (value: string) => void;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: SegmentedControlSize;
  /**
   * Roztáhne komponentu na celou šířku kontejneru.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Orientace segmentů.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Zakáže celou komponentu.
   * @default false
   */
  disabled?: boolean;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── SegmentedControl ───────────────────────────────────────────────────────

/**
 * Segmentovaný přepínač dle SM-UI design systému.
 *
 * Podobný záložkám, ale v kompaktnějším inline formátu
 * s animovaným indikátorem posuvným mezi segmenty.
 *
 * @example
 * ```tsx
 * const [view, setView] = useState('list');
 *
 * <SegmentedControl
 *   data={['list', 'grid', 'table']}
 *   value={view}
 *   onChange={setView}
 * />
 * ```
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  data,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  disabled = false,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];

  const isVertical = orientation === 'vertical';

  // Normalize data
  const items: SegmentedControlItem[] = data.map((d) =>
    typeof d === 'string' ? { value: d, label: d } : d,
  );

  const activeIndex = items.findIndex((item) => item.value === value);

  // ── Refs for measuring segment positions ────────────────────────────────

  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [indicator, setIndicator] = useState<{
    offset: number;
    size: number;
  }>({ offset: 0, size: 0 });

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeEl = segmentRefs.current[activeIndex];
    if (!container || !activeEl || activeIndex < 0) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    if (isVertical) {
      setIndicator({
        offset: activeRect.top - containerRect.top,
        size: activeRect.height,
      });
    } else {
      setIndicator({
        offset: activeRect.left - containerRect.left,
        size: activeRect.width,
      });
    }
  }, [activeIndex, isVertical]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator, value, data, size]);

  // Update on resize
  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        flexDirection: isVertical ? 'column' : 'row',
        backgroundColor: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: sc.borderRadius,
        padding: sc.padding,
        boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : undefined,
        ...style,
      }}
    >
      {/* Sliding indicator */}
      {activeIndex >= 0 && indicator.size > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            borderRadius: sc.itemRadius,
            backgroundColor: t.indicator,
            border: `1px solid ${t.indicatorBorder}`,
            boxShadow: t.indicatorShadow,
            transition: `all 180ms cubic-bezier(0.16, 1, 0.3, 1)`,
            pointerEvents: 'none',
            zIndex: 0,
            ...(isVertical
              ? {
                  left: sc.padding,
                  right: sc.padding,
                  top: indicator.offset,
                  height: indicator.size,
                }
              : {
                  top: sc.padding,
                  bottom: sc.padding,
                  left: indicator.offset,
                  width: indicator.size,
                }),
          }}
        />
      )}

      {/* Segments */}
      {items.map((item, idx) => {
        const isActive = item.value === value;
        const isItemDisabled = disabled || item.disabled;

        return (
          <button
            key={item.value}
            ref={(el) => { segmentRefs.current[idx] = el; }}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={isItemDisabled}
            onClick={() => {
              if (!isItemDisabled) onChange(item.value);
            }}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flex: fullWidth ? 1 : undefined,
              padding: sc.itemPadding,
              border: '0 none',
              borderStyle: 'none',
              outline: 'none',
              borderRadius: sc.itemRadius,
              backgroundColor: 'transparent',
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: sc.fontSize,
              fontWeight: isActive ? 500 : 400,
              color: isItemDisabled
                ? t.textDisabled
                : isActive
                  ? t.textActive
                  : t.text,
              cursor: isItemDisabled ? 'not-allowed' : 'pointer',
              transition: 'color 180ms ease',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              lineHeight: 'normal',
            }}
            onMouseEnter={(e) => {
              if (!isItemDisabled && !isActive) {
                e.currentTarget.style.color = t.textHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isItemDisabled && !isActive) {
                e.currentTarget.style.color = t.text;
              }
            }}
          >
            {item.icon && <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>}
            {(item.label || (!item.icon && item.value)) && <span>{item.label ?? item.value}</span>}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = 'SegmentedControl';
