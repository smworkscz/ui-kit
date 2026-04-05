import React, { useCallback, useId, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    trackBg: 'rgba(255,255,255,0.15)',
    trackFill: '#FC4F00',
    thumb: '#ffffff',
    thumbBorder: '#FC4F00',
    text: '#ffffff',
    label: '#ffffff',
    valueBg: 'rgba(3,3,3,0.75)',
  },
  light: {
    trackBg: 'rgba(0,0,0,0.1)',
    trackFill: '#FC4F00',
    thumb: '#ffffff',
    thumbBorder: '#FC4F00',
    text: '#1a1a1a',
    label: '#1a1a1a',
    valueBg: 'rgba(255,255,255,0.85)',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { trackH: 4, thumb: 14, fontSize: '12px' },
  md: { trackH: 6, thumb: 18, fontSize: '14px' },
  lg: { trackH: 8, thumb: 22, fontSize: '16px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps {
  /** Aktuální hodnota. Při `range` je to `[number, number]`. */
  value: number | [number, number];
  /** Callback volaný při změně hodnoty. */
  onChange?: (value: number | [number, number]) => void;
  /**
   * Minimální hodnota.
   * @default 0
   */
  min?: number;
  /**
   * Maximální hodnota.
   * @default 100
   */
  max?: number;
  /**
   * Krok posunu.
   * @default 1
   */
  step?: number;
  /** Popisek nad sliderem. */
  label?: string;
  /** Deaktivuje slider. */
  disabled?: boolean;
  /**
   * Zobrazí aktuální hodnotu vedle slideru.
   * @default false
   */
  showValue?: boolean;
  /**
   * Režim rozsahu — value musí být `[number, number]`.
   * @default false
   */
  range?: boolean;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: SliderSize;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function snapToStep(val: number, min: number, step: number) {
  return Math.round((val - min) / step) * step + min;
}

// ─── Slider ──────────────────────────────────────────────────────────────────

/**
 * Posuvník dle SM-UI design systému.
 *
 * Podporuje jednoduchý i rozsahový režim, zobrazení hodnoty,
 * velikostní presety a tmavý / světlý režim.
 *
 * @example
 * ```tsx
 * <Slider label="Hlasitost" value={volume} onChange={setVolume} showValue />
 * <Slider range value={[20, 80]} onChange={setRange} label="Cenový rozsah" />
 * ```
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  disabled = false,
  showValue = false,
  range = false,
  size = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingThumb = useRef<'start' | 'end' | null>(null);

  const rangeValue = range
    ? (value as [number, number])
    : [min, value as number] as [number, number];

  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const startPct = pct(rangeValue[0]);
  const endPct = pct(rangeValue[1]);

  const getValueFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      return clamp(snapToStep(raw, min, step), min, max);
    },
    [min, max, step]
  );

  const handleTrackMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      const val = getValueFromEvent(e.clientX);

      if (range) {
        const rv = value as [number, number];
        const distStart = Math.abs(val - rv[0]);
        const distEnd = Math.abs(val - rv[1]);
        const which = distStart <= distEnd ? 'start' : 'end';
        draggingThumb.current = which;
        const next: [number, number] =
          which === 'start' ? [Math.min(val, rv[1]), rv[1]] : [rv[0], Math.max(val, rv[0])];
        onChange?.(next);
      } else {
        draggingThumb.current = 'end';
        onChange?.(val);
      }

      const handleMouseMove = (ev: MouseEvent) => {
        const v = getValueFromEvent(ev.clientX);
        if (range) {
          const rv = value as [number, number];
          if (draggingThumb.current === 'start') {
            onChange?.([Math.min(v, rv[1]), rv[1]]);
          } else {
            onChange?.([rv[0], Math.max(v, rv[0])]);
          }
        } else {
          onChange?.(v);
        }
      };

      const handleMouseUp = () => {
        draggingThumb.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, getValueFromEvent, onChange, range, value]
  );

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: t.label,
    userSelect: 'none',
  };

  const valueDisplay = range
    ? `${rangeValue[0]} – ${rangeValue[1]}`
    : `${value}`;

  const thumbCommon: React.CSSProperties = {
    width: sc.thumb,
    height: sc.thumb,
    borderRadius: '50%',
    backgroundColor: t.thumb,
    border: `2px solid ${t.thumbBorder}`,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: disabled ? 'not-allowed' : 'grab',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    boxSizing: 'border-box',
    zIndex: 2,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      className={className}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
          {showValue && (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: sc.fontSize,
              color: t.text,
              userSelect: 'none',
            }}>
              {valueDisplay}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        role="slider"
        id={id}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={range ? undefined : (value as number)}
        aria-disabled={disabled || undefined}
        onMouseDown={handleTrackMouseDown}
        style={{
          position: 'relative',
          width: '100%',
          height: sc.thumb,
          cursor: disabled ? 'not-allowed' : 'pointer',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* Track background */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: sc.trackH,
          transform: 'translateY(-50%)',
          borderRadius: sc.trackH / 2,
          backgroundColor: t.trackBg,
        }} />
        {/* Track fill */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${range ? startPct : 0}%`,
          width: `${endPct - (range ? startPct : 0)}%`,
          height: sc.trackH,
          transform: 'translateY(-50%)',
          borderRadius: sc.trackH / 2,
          backgroundColor: t.trackFill,
        }} />
        {/* Start thumb (range only) */}
        {range && (
          <span style={{ ...thumbCommon, left: `${startPct}%` }} />
        )}
        {/* End thumb */}
        <span style={{ ...thumbCommon, left: `${endPct}%` }} />
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';
