import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    border: 'rgba(255,255,255,0.15)',
    labelColor: 'rgba(255,255,255,0.5)',
    labelBg: '#1a1a1a',
  },
  light: {
    border: 'rgba(0,0,0,0.12)',
    labelColor: 'rgba(0,0,0,0.4)',
    labelBg: '#ffffff',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /**
   * Orientace oddělovače.
   * - `'horizontal'` — plná šířka, horizontální čára
   * - `'vertical'`   — plná výška, vertikální čára
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * Volitelný text zobrazený uprostřed oddělovače.
   * Podporováno pouze pro horizontální orientaci.
   */
  label?: string;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Vizuální oddělovač obsahu — horizontální nebo vertikální čára.
 *
 * V horizontálním režimu zabírá celou šířku kontejneru a volitelně
 * zobrazí text uprostřed. Ve vertikálním režimu zabírá celou výšku.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="nebo" />
 * <Divider orientation="vertical" />
 * ```
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={className}
        style={{
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: t.border,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  // Horizontální bez textu
  if (!label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={className}
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: t.border,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  // Horizontální s textem
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '12px',
        ...style,
      }}
    >
      <div style={{ flex: 1, height: '1px', backgroundColor: t.border }} />
      <span style={{
        fontFamily: "'Zalando Sans', sans-serif",
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: 'normal',
        color: t.labelColor,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', backgroundColor: t.border }} />
    </div>
  );
};
