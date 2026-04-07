import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    labelColor: '#eaeaea',
  },
  light: {
    labelColor: '#333333',
  },
} as const;

// ─── Status colors ──────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  online: '#00A205',
  offline: '#888888',
  away: '#F5A623',
  busy: '#EF3838',
};

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { dot: 8, fontSize: '12px', gap: '6px' },
  md: { dot: 10, fontSize: '13px', gap: '8px' },
  lg: { dot: 12, fontSize: '14px', gap: '8px' },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export type StatusBadgeStatus = 'online' | 'offline' | 'away' | 'busy' | (string & {});

export interface StatusBadgeProps {
  /** Stav k zobrazení. Předdefinované: online, offline, away, busy. Lze zadat i vlastní řetězec. */
  status: StatusBadgeStatus;
  /** Volitelný textový popis vedle indikátoru. */
  label?: string;
  /** Velikost indikátoru. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Zapne pulzující animaci. @default false */
  pulse?: boolean;
  /** Vlastní barva indikátoru — přepíše výchozí barvu stavu. */
  color?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Pulse keyframes (injected once) ────────────────────────────────────────

let pulseStyleInjected = false;

const injectPulseStyle = () => {
  if (pulseStyleInjected || typeof document === 'undefined') return;
  const id = 'sm-statusbadge-pulse';
  if (document.getElementById(id)) {
    pulseStyleInjected = true;
    return;
  }
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    @keyframes sm-statusbadge-pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.8); opacity: 0; }
      100% { transform: scale(1.8); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  pulseStyleInjected = true;
};

// ─── StatusBadge ────────────────────────────────────────────────────────────

/**
 * Malý barevný indikátor stavu.
 *
 * Předdefinované stavy: online, offline, away, busy.
 * Lze zadat i vlastní řetězec s vlastní barvou přes prop `color`.
 * Pulzující animace funguje na libovolném stavu.
 *
 * @example
 * ```tsx
 * <StatusBadge status="online" pulse />
 * <StatusBadge status="busy" label="Nerušit" size="lg" />
 * <StatusBadge status="streaming" color="#9C27B0" label="Živě" pulse />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  pulse = false,
  color,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];
  const dotColor = color || statusColors[status] || '#888888';

  if (pulse) {
    injectPulseStyle();
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sc.gap,
        ...style,
      }}
    >
      {/* Tečka indikátoru */}
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${sc.dot}px`,
          height: `${sc.dot}px`,
          flexShrink: 0,
        }}
      >
        {/* Pulzující kruh */}
        {pulse && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: dotColor,
              animation: 'sm-statusbadge-pulse 2s ease-in-out infinite',
            }}
          />
        )}
        {/* Hlavní tečka */}
        <span
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: dotColor,
          }}
        />
      </span>

      {/* Textový popis */}
      {label && (
        <span
          style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: sc.fontSize,
            fontWeight: 400,
            color: t.labelColor,
            lineHeight: 'normal',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
