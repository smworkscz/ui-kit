import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    base: 'rgba(255,255,255,0.06)',
    shimmer: 'rgba(255,255,255,0.13)',
  },
  light: {
    base: 'rgba(0,0,0,0.06)',
    shimmer: 'rgba(0,0,0,0.11)',
  },
} as const;

// ─── Keyframes CSS ───────────────────────────────────────────────────────────

const ANIM_NAME = 'smSkeletonShimmer';
const KEYFRAMES_CSS = `@keyframes ${ANIM_NAME}{0%{background-position:100% 0}100%{background-position:-100% 0}}`;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SkeletonProps {
  /**
   * Tvar skeletonu.
   * - `'text'` — obdélník s malou výškou, může vykreslovat více řádků
   * - `'circle'` — kruh
   * - `'rect'` — obdélník
   * @default 'text'
   */
  variant?: 'text' | 'circle' | 'rect';
  /** Šířka skeletonu. Přijímá číslo (px) nebo CSS řetězec. @default '100%' */
  width?: number | string;
  /** Výška skeletonu. Přijímá číslo (px) nebo CSS řetězec. */
  height?: number | string;
  /** Počet řádků pro variantu `'text'`. @default 1 */
  lines?: number;
  /** Zapne/vypne shimmer animaci. @default true */
  animate?: boolean;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

/**
 * Zástupný prvek zobrazený při načítání obsahu.
 *
 * Podporuje tři varianty (`text`, `circle`, `rect`), shimmer animaci
 * a tmavý / světlý režim přes `useTheme`.
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circle" width={48} height={48} />
 * <Skeleton variant="rect" width="100%" height={200} />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  animate = true,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const resolveWidth = width ?? (variant === 'circle' ? 40 : '100%');
  const resolveHeight =
    height ?? (variant === 'circle' ? 40 : variant === 'text' ? '1em' : 100);

  const baseStyle: React.CSSProperties = {
    backgroundColor: t.base,
    backgroundImage: animate
      ? `linear-gradient(90deg, ${t.base} 25%, ${t.shimmer} 50%, ${t.base} 75%)`
      : undefined,
    backgroundSize: animate ? '200% 100%' : undefined,
    animation: animate ? `${ANIM_NAME} 1.5s ease-in-out infinite` : undefined,
    borderRadius: variant === 'circle' ? '50%' : '6px',
    width: typeof resolveWidth === 'number' ? `${resolveWidth}px` : resolveWidth,
    height: typeof resolveHeight === 'number' ? `${resolveHeight}px` : resolveHeight,
  };

  const styleTag = animate ? <style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} /> : null;

  if (variant === 'text' && lines > 1) {
    return (
      <div
        className={className}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}
      >
        {styleTag}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            style={{
              ...baseStyle,
              width: i === lines - 1 ? '75%' : baseStyle.width,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {styleTag}
      <div className={className} style={{ ...baseStyle, ...style }} />
    </>
  );
};

Skeleton.displayName = 'Skeleton';
