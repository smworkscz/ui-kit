import React, { useState, useCallback, useId } from 'react';
import { Star as StarIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    label: '#ffffff',
    starFilled: '#FC4F00',
    starEmpty: 'rgba(255,255,255,0.2)',
    starHover: '#FF6D2A',
  },
  light: {
    text: '#1a1a1a',
    label: '#1a1a1a',
    starFilled: '#FC4F00',
    starEmpty: 'rgba(0,0,0,0.15)',
    starHover: '#FF6D2A',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { starSize: 18, gap: '2px' },
  md: { starSize: 24, gap: '4px' },
  lg: { starSize: 32, gap: '6px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  /** Aktuální hodnota hodnocení (1–max). */
  value: number;
  /** Callback volaný při změně hodnocení. Pokud chybí, komponenta je v režimu pouze pro čtení. */
  onChange?: (value: number) => void;
  /** Maximální počet hvězd. @default 5 */
  max?: number;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: RatingSize;
  /** Přepne komponentu do režimu pouze pro zobrazení. */
  readOnly?: boolean;
  /** Popisek zobrazený nad komponentou. Stylizován velkými písmeny dle SM-UI design systému. */
  label?: string;
  /** Další inline styly pro obalový `<div>`. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obalový `<div>`. */
  className?: string;
}

// ─── Rating ──────────────────────────────────────────────────────────────────

/**
 * Hodnocení hvězdičkami dle SM-UI design systému.
 *
 * Podporuje interaktivní výběr s náhledem při najetí myší
 * a režim pouze pro čtení.
 *
 * @example
 * ```tsx
 * <Rating value={rating} onChange={setRating} />
 * <Rating value={3} max={10} readOnly />
 * <Rating value={4} size="lg" label="Hodnocení" />
 * ```
 */
export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  label,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const autoId = useId();
  const sc = sizeConfig[size];
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isInteractive = !readOnly && !!onChange;

  const handleClick = useCallback(
    (index: number) => {
      if (!isInteractive) return;
      onChange!(index + 1);
    },
    [isInteractive, onChange]
  );

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (!isInteractive) return;
      setHoverIndex(index);
    },
    [isInteractive]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

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

  const stars = Array.from({ length: max }, (_, i) => {
    const displayValue = hoverIndex !== null ? hoverIndex + 1 : value;
    const isFilled = i < displayValue;
    const isHovered = hoverIndex !== null && i <= hoverIndex;

    return (
      <span
        key={i}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={isInteractive ? `Hodnocení ${i + 1} z ${max}` : undefined}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick(i);
          }
        }}
        style={{
          display: 'inline-flex',
          cursor: isInteractive ? 'pointer' : 'default',
          transition: 'transform 0.12s ease, color 0.12s ease',
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          outline: 'none',
        }}
      >
        <StarIcon
          size={sc.starSize}
          weight={isFilled ? 'fill' : 'regular'}
          color={isFilled
            ? (isHovered ? t.starHover : t.starFilled)
            : t.starEmpty
          }
        />
      </span>
    );
  });

  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
      className={className}
      role="group"
      aria-label={label ?? 'Hodnocení'}
    >
      {label && (
        <label htmlFor={autoId} style={labelStyle}>
          {label}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sc.gap,
        }}
        onMouseLeave={handleMouseLeave}
      >
        {stars}
      </div>
    </div>
  );
};

Rating.displayName = 'Rating';
