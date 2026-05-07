import React, { useState } from 'react';
import { TrendUp as TrendUpIcon, TrendDown as TrendDownIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';
import { Skeleton } from '../Skeleton/Skeleton';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    label: '#ACACAC',
    helper: '#888888',
    trendUp: '#34C759',
    trendDown: '#EF3838',
    trendNeutral: '#ACACAC',
    iconColor: 'rgba(255,255,255,0.15)',
    hoverBg: 'rgba(255,255,255,0.04)',
    hoverShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    label: '#888888',
    helper: '#999999',
    trendUp: '#28A745',
    trendDown: '#EF3838',
    trendNeutral: '#888888',
    iconColor: 'rgba(0,0,0,0.08)',
    hoverBg: 'rgba(0,0,0,0.02)',
    hoverShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StatProps {
  /** Popisek statistiky. */
  label: string;
  /** Hodnota statistiky. */
  value?: string | number | React.ReactNode;
  /** Procentuální změna (zobrazí se se znaménkem). */
  change?: number;
  /** Doplňkový text k procentuální změně. */
  changeLabel?: string;
  /** Ikona zobrazená vedle hodnoty. */
  icon?: React.ReactNode;
  /** Směr trendu. @default 'neutral' */
  trend?: 'up' | 'down' | 'neutral';
  /** Skeleton stav. @default false */
  loading?: boolean;
  /** Klikatelná karta s hover efektem. */
  onClick?: () => void;
  /** Sekundární text pod hodnotou. */
  helper?: string | React.ReactNode;
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
 * a volitelnou ikonou. Podporuje loading skeleton a klikatelnost.
 *
 * @example
 * ```tsx
 * <Stat label="Objednávky" value={1284} change={12.5} trend="up" />
 * <Stat label="Aktivní" value={loading ? undefined : 127} loading={loading} onClick={() => navigate('/tasks')} helper="z toho 12 po termínu" />
 * ```
 */
export const Stat: React.FC<StatProps> = ({
  label,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  loading = false,
  onClick,
  helper,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  const trendColor =
    trend === 'up' ? t.trendUp : trend === 'down' ? t.trendDown : t.trendNeutral;

  const formatChange = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(1)} %`;
  };

  const Wrapper = isClickable ? 'button' : 'div';

  return (
    <Wrapper
      className={className}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type={isClickable ? 'button' : undefined}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        backgroundColor: hovered && isClickable ? t.hoverBg : t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
        transform: hovered && isClickable ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && isClickable ? t.hoverShadow : 'none',
        outline: 'none',
        textAlign: 'left',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Zalando Sans', sans-serif",
        ...style,
      } as React.CSSProperties}
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

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
            <Skeleton variant="text" width="60%" height={24} />
            {change !== undefined && <Skeleton variant="text" width="40%" height={14} />}
          </div>
        ) : (
          <>
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

            {helper && (
              <div
                style={{
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '12px',
                  lineHeight: 'normal',
                  color: t.helper,
                  marginTop: '2px',
                }}
              >
                {helper}
              </div>
            )}

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
                {trend === 'up' && <TrendUpIcon size={14} color={trendColor} />}
                {trend === 'down' && <TrendDownIcon size={14} color={trendColor} />}
                <span>{formatChange(change)}</span>
                {changeLabel && (
                  <span style={{ color: t.label, marginLeft: '2px' }}>
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

Stat.displayName = 'Stat';
