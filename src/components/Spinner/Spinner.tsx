import React, { useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /**
   * Velikost spinneru.
   * - `'sm'` — 16 px
   * - `'md'` — 24 px
   * - `'lg'` — 40 px
   * - `number` — vlastní velikost v pixelech
   * @default 'md'
   */
  size?: SpinnerSize | number;
  /**
   * Barva spinneru. Pokud není zadána, dědí `currentColor`.
   */
  color?: string;
  /**
   * Text pro přístupnost (screen reader). Vykreslí se jako `aria-label`.
   * @default 'Načítání'
   */
  label?: string;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

// ─── Size map ────────────────────────────────────────────────────────────────

const sizeMap: Record<string, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Animovaný spinner (indikátor načítání) využívající requestAnimationFrame.
 *
 * Jedná se o samostatnou verzi interního spinneru používaného
 * v komponentách Input, Select a Button. Rotace je řízena pomocí
 * rAF pro plynulou animaci bez CSS keyframes.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="#E8612D" />
 * <Spinner size={32} label="Ukládání dat" />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color,
  label = 'Načítání',
  className,
  style,
}) => {
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === undefined) startRef.current = ts;
      setAngle(((ts - startRef.current) / 800 * 360) % 360);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const resolvedSize = typeof size === 'number' ? size : (sizeMap[size] ?? 24);
  const strokeColor = color ?? 'currentColor';

  return (
    <span
      role="status"
      aria-label={label}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        width={resolvedSize}
        height={resolvedSize}
        viewBox="0 0 16 16"
        fill="none"
        style={{ transform: `rotate(${angle}deg)`, flexShrink: 0, display: 'block' }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke={strokeColor}
          strokeWidth="2"
          strokeOpacity="0.25"
        />
        <path
          d="M8 2a6 6 0 0 1 6 6"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};
