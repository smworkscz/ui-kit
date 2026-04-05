import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    trackBg: 'rgba(255,255,255,0.1)',
    text: '#ffffff',
    label: '#ffffff',
  },
  light: {
    trackBg: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    label: '#1a1a1a',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const barSizeConfig = {
  sm: { height: 6, fontSize: '11px' },
  md: { height: 10, fontSize: '12px' },
  lg: { height: 16, fontSize: '14px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  /**
   * Aktuální hodnota průběhu v rozsahu 0–100.
   */
  value: number;
  /**
   * Velikostní preset určující výšku lišty.
   * - `'sm'` — 6 px
   * - `'md'` — 10 px
   * - `'lg'` — 16 px
   * @default 'md'
   */
  size?: ProgressBarSize;
  /**
   * Barva vyplněné části lišty.
   * @default '#E8612D'
   */
  color?: string;
  /**
   * Zobrazí procentuální hodnotu vedle lišty.
   * @default false
   */
  showValue?: boolean;
  /**
   * Volitelný popisek zobrazený nad lištou.
   */
  label?: string;
  /**
   * Zobrazí pruhovaný vzor na vyplněné části.
   * @default false
   */
  striped?: boolean;
  /**
   * Animuje pruhovaný vzor (vyžaduje `striped`).
   * @default false
   */
  animated?: boolean;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

export interface ProgressCircleProps {
  /**
   * Aktuální hodnota průběhu v rozsahu 0–100.
   */
  value: number;
  /**
   * Velikost SVG v pixelech (šířka i výška).
   * @default 64
   */
  size?: number;
  /**
   * Šířka tahu (stroke) kruhu.
   * @default 4
   */
  strokeWidth?: number;
  /**
   * Barva vyplněné části kruhu.
   * @default '#E8612D'
   */
  color?: string;
  /**
   * Zobrazí procentuální hodnotu uprostřed kruhu.
   * @default false
   */
  showValue?: boolean;
  /**
   * Volitelný popisek zobrazený pod kruhem.
   */
  label?: string;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

// ─── Stripe animation ────────────────────────────────────────────────────────

const stripeKeyframesId = 'sm-ui-progress-stripes';

const ensureStripeKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(stripeKeyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = stripeKeyframesId;
  styleEl.textContent = `@keyframes sm-ui-progress-stripes { 0% { background-position: 1rem 0; } 100% { background-position: 0 0; } }`;
  document.head.appendChild(styleEl);
};

// ─── ProgressBar ─────────────────────────────────────────────────────────────

/**
 * Horizontální lišta zobrazující průběh operace.
 *
 * Podporuje tři velikosti, volitelné pruhy (s animací),
 * zobrazení procentuální hodnoty a popisek.
 *
 * @example
 * ```tsx
 * <ProgressBar value={45} showValue />
 * <ProgressBar value={70} size="lg" striped animated label="Nahrávání" />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  color = '#E8612D',
  showValue = false,
  label,
  striped = false,
  animated = false,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = barSizeConfig[size];
  const clampedValue = Math.max(0, Math.min(100, value));

  if (striped && animated) ensureStripeKeyframes();

  const stripeStyle: React.CSSProperties = striped
    ? {
        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
        backgroundSize: '1rem 1rem',
        ...(animated ? { animation: 'sm-ui-progress-stripes 1s linear infinite' } : {}),
      }
    : {};

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        ...style,
      }}
      className={className}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{
              fontFamily: "'Zalando Sans Expanded', sans-serif",
              fontWeight: 400,
              fontSize: '10px',
              lineHeight: 'normal',
              textTransform: 'uppercase',
              color: t.label,
              userSelect: 'none',
            }}>
              {label}
            </span>
          )}
          {showValue && (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontWeight: 400,
              fontSize: sc.fontSize,
              color: t.text,
              userSelect: 'none',
              marginLeft: 'auto',
            }}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div style={{
        width: '100%',
        height: sc.height,
        backgroundColor: t.trackBg,
        borderRadius: sc.height / 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${clampedValue}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: sc.height / 2,
          transition: 'width 0.3s ease',
          ...stripeStyle,
        }} />
      </div>
    </div>
  );
};

// ─── ProgressCircle ──────────────────────────────────────────────────────────

/**
 * Kruhový indikátor průběhu pomocí SVG.
 *
 * Hodnota 0–100 se vykresluje jako oblouk kolem kruhu pomocí
 * `stroke-dasharray` / `stroke-dashoffset`. Volitelně zobrazí
 * procentuální hodnotu uprostřed a popisek pod kruhem.
 *
 * @example
 * ```tsx
 * <ProgressCircle value={75} showValue />
 * <ProgressCircle value={50} size={80} strokeWidth={6} color="#00A205" label="Stahování" />
 * ```
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 64,
  strokeWidth = 4,
  color = '#E8612D',
  showValue = false,
  label,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const clampedValue = Math.max(0, Math.min(100, value));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        ...style,
      }}
      className={className}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Pozadí kruhu */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={t.trackBg}
          strokeWidth={strokeWidth}
        />
        {/* Vyplněný oblouk */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      {showValue && (
        <span style={{
          position: 'relative',
          marginTop: -size / 2 - 6,
          marginBottom: size / 2 - 6,
          fontFamily: "'Zalando Sans', sans-serif",
          fontWeight: 700,
          fontSize: `${Math.max(11, size * 0.22)}px`,
          color: t.text,
          userSelect: 'none',
          transform: 'translateY(-50%)',
          top: '50%',
          display: 'block',
          textAlign: 'center',
        }}>
          {Math.round(clampedValue)}%
        </span>
      )}
      {label && (
        <span style={{
          fontFamily: "'Zalando Sans Expanded', sans-serif",
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: 'normal',
          textTransform: 'uppercase',
          color: t.label,
          userSelect: 'none',
        }}>
          {label}
        </span>
      )}
    </div>
  );
};
