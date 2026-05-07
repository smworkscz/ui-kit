import React from 'react';
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

const variantColors = {
  default: '#E8612D',
  success: '#00A205',
  warning: '#F5A623',
  danger: '#EF3838',
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const barSizeConfig = {
  xs: { height: 4, fontSize: '10px' },
  sm: { height: 6, fontSize: '11px' },
  md: { height: 10, fontSize: '12px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProgressBarSize = 'xs' | 'sm' | 'md';
export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ProgressThreshold {
  /** Hodnota (0-max) od které se aktivuje varianta. */
  value: number;
  /** Varianta použitá od této hodnoty. */
  variant: ProgressVariant;
}

export interface ProgressBarProps {
  /** Aktuální hodnota. */
  value: number;
  /** Maximální hodnota. @default 100 */
  max?: number;
  /** Label: true = "X%", string = custom. @default false */
  label?: string | boolean;
  /** Barevný preset. @default 'default' */
  variant?: ProgressVariant;
  /** Auto-switch variant podle thresholds. */
  thresholds?: ProgressThreshold[];
  /** Velikost (výška). @default 'sm' */
  size?: ProgressBarSize;
  /** Pruhovaný vzor. @default false */
  striped?: boolean;
  /** Animované pruhy. @default false */
  animated?: boolean;
  /** Neznámý progress — animovaný shimmer. @default false */
  indeterminate?: boolean;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

export interface ProgressCircleProps {
  /** Aktuální hodnota. */
  value: number;
  /** Maximální hodnota. @default 100 */
  max?: number;
  /** Barevný preset. @default 'default' */
  variant?: ProgressVariant;
  /** Auto-switch variant podle thresholds. */
  thresholds?: ProgressThreshold[];
  /** Diameter v px. @default 48 */
  size?: number;
  /** Tloušťka stroke. @default 4 */
  thickness?: number;
  /** Zobrazí "X%" uprostřed. @default false */
  showValue?: boolean;
  /** Custom render obsahu uprostřed (override showValue). */
  valueLabel?: (value: number, max: number) => React.ReactNode;
  /** Volitelný popisek pod kruhem. */
  label?: string;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stripeKeyframesId = 'sm-ui-progress-stripes';
const indeterminateKeyframesId = 'sm-ui-progress-indeterminate';

const ensureStripeKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(stripeKeyframesId)) return;
  const s = document.createElement('style');
  s.id = stripeKeyframesId;
  s.textContent = `@keyframes sm-ui-progress-stripes { 0% { background-position: 1rem 0; } 100% { background-position: 0 0; } }`;
  document.head.appendChild(s);
};

const ensureIndeterminateKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(indeterminateKeyframesId)) return;
  const s = document.createElement('style');
  s.id = indeterminateKeyframesId;
  s.textContent = `@keyframes sm-ui-progress-indeterminate { 0% { left: -40%; width: 40%; } 50% { left: 20%; width: 60%; } 100% { left: 100%; width: 40%; } }`;
  document.head.appendChild(s);
};

function resolveVariant(variant: ProgressVariant, value: number, thresholds?: ProgressThreshold[]): ProgressVariant {
  if (!thresholds || thresholds.length === 0) return variant;
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  let resolved = variant;
  for (const th of sorted) {
    if (value >= th.value) resolved = th.variant;
  }
  return resolved;
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

/**
 * Horizontální progress indikátor.
 *
 * Podporuje varianty, thresholds, pruhy, indeterminate stav a a11y.
 *
 * @example
 * ```tsx
 * <ProgressBar value={45} label />
 * <ProgressBar value={80} variant="success" size="md" striped animated />
 * <ProgressBar indeterminate />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label = false,
  variant = 'default',
  thresholds,
  size = 'sm',
  striped = false,
  animated = false,
  indeterminate = false,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = barSizeConfig[size];
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const resolvedVariant = resolveVariant(variant, value, thresholds);
  const color = variantColors[resolvedVariant];

  if (striped && animated) ensureStripeKeyframes();
  if (indeterminate) ensureIndeterminateKeyframes();

  const stripeStyle: React.CSSProperties = striped
    ? {
        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
        backgroundSize: '1rem 1rem',
        ...(animated ? { animation: 'sm-ui-progress-stripes 1s linear infinite' } : {}),
      }
    : {};

  const labelText = typeof label === 'string' ? label : label ? `${Math.round(percent)}%` : null;

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', ...style }}
      className={className}
    >
      {labelText && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontWeight: 400,
            fontSize: sc.fontSize,
            color: t.text,
            userSelect: 'none',
          }}>
            {labelText}
          </span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: sc.height,
        backgroundColor: t.trackBg,
        borderRadius: sc.height / 2,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {indeterminate ? (
          <div style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: color,
            borderRadius: sc.height / 2,
            animation: 'sm-ui-progress-indeterminate 1.5s ease-in-out infinite',
            ...stripeStyle,
          }} />
        ) : (
          <div style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: sc.height / 2,
            transition: 'width 0.3s ease, background-color 0.3s ease',
            ...stripeStyle,
          }} />
        )}
      </div>
    </div>
  );
};

// ─── ProgressCircle ──────────────────────────────────────────────────────────

/**
 * Kruhový progress indikátor (SVG).
 *
 * Podporuje varianty, thresholds, custom obsah uprostřed a a11y.
 *
 * @example
 * ```tsx
 * <ProgressCircle value={75} showValue />
 * <ProgressCircle value={45} max={60} variant="warning" valueLabel={(v, m) => `${v}/${m}`} />
 * ```
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  max = 100,
  variant = 'default',
  thresholds,
  size = 48,
  thickness = 4,
  showValue = false,
  valueLabel,
  label,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const resolvedVariant = resolveVariant(variant, value, thresholds);
  const color = variantColors[resolvedVariant];

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const centerContent = valueLabel
    ? valueLabel(value, max)
    : showValue
      ? `${Math.round(percent)}%`
      : null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px', ...style }}
      className={className}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={t.trackBg} strokeWidth={thickness} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={thickness} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
          />
        </svg>
        {centerContent != null && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Zalando Sans', sans-serif",
            fontWeight: 700,
            fontSize: `${Math.max(10, size * 0.22)}px`,
            color: t.text,
            userSelect: 'none',
          }}>
            {centerContent}
          </div>
        )}
      </div>
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
