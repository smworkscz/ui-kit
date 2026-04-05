import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    label: '#ACACAC',
    trendUp: '#34C759',
    trendDown: '#EF3838',
    trendNeutral: '#ACACAC',
    iconColor: 'rgba(255,255,255,0.15)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    label: '#888888',
    trendUp: '#28A745',
    trendDown: '#EF3838',
    trendNeutral: '#888888',
    iconColor: 'rgba(0,0,0,0.08)',
  },
} as const;

// ─── Trend icons ─────────────────────────────────────────────────────────────

const TrendUpIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 10L7 5.5L9 7.5L12.5 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 4H12.5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrendDownIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 4L7 8.5L9 6.5L12.5 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 10H12.5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StatProps {
  /** Popisek statistiky. */
  label: string;
  /** Hodnota statistiky. */
  value: string | number;
  /** Procentuální změna (zobrazí se se znaménkem). */
  change?: number;
  /** Doplňkový text k procentuální změně. */
  changeLabel?: string;
  /** Ikona zobrazená vedle hodnoty. */
  icon?: React.ReactNode;
  /**
   * Směr trendu — ovlivňuje barvu a ikonu šipky.
   * @default 'neutral'
   */
  trend?: 'up' | 'down' | 'neutral';
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Stat ────────────────────────────────────────────────────────────────────

/**
 * Statistický ukazatel dle SM-UI design systému.
 *
 * Kompaktní kartička s popiskem, hodnotou, procentuální změnou
 * a volitelnou ikonou. Barva trendu se řídí hodnotou `trend`.
 *
 * @example
 * ```tsx
 * <Stat label="Objednávky" value={1284} change={12.5} trend="up" />
 * <Stat label="Náklady" value="€ 45 320" change={-3.2} trend="down" />
 * ```
 */
export const Stat: React.FC<StatProps> = ({
  label,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const trendColor =
    trend === 'up' ? t.trendUp : trend === 'down' ? t.trendDown : t.trendNeutral;

  const formatChange = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(1)} %`;
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        backgroundColor: t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: t.iconColor,
            flexShrink: 0,
            color: t.text,
          }}
        >
          {icon}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 400,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            color: t.label,
            lineHeight: 'normal',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 'normal',
            color: t.text,
          }}
        >
          {value}
        </div>

        {change !== undefined && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '13px',
              lineHeight: 'normal',
              color: trendColor,
            }}
          >
            {trend === 'up' && <TrendUpIcon color={trendColor} />}
            {trend === 'down' && <TrendDownIcon color={trendColor} />}
            <span>{formatChange(change)}</span>
            {changeLabel && (
              <span style={{ color: t.label, marginLeft: '2px' }}>
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Stat.displayName = 'Stat';
