import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AvatarSize = 'sm' | 'md' | 'lg' | number;

export interface AvatarProps {
  /**
   * Initials displayed inside the avatar (e.g. `"DC"`, `"JN"`).
   * Automatically rendered in uppercase.
   */
  initials: string;
  /**
   * Size of the avatar.
   * - `'sm'` — 40 px
   * - `'md'` — 70 px  *(default)*
   * - `'lg'` — 96 px
   * - `number` — exact pixel value
   * @default 'md'
   */
  size?: AvatarSize;
  /**
   * Border-radius of the avatar container.
   * @default '8px'
   */
  borderRadius?: React.CSSProperties['borderRadius'];
  /**
   * Accessible label read by screen readers.
   * Falls back to `"Avatar {initials}"` when not provided.
   */
  'aria-label'?: string;
  /** Extra inline styles applied to the root element. */
  style?: React.CSSProperties;
  /** Extra CSS class applied to the root element. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveSize = (size: AvatarSize): number => {
  if (typeof size === 'number') return size;
  return { sm: 40, md: 70, lg: 96 }[size];
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Circular/square avatar that displays user initials over a branded
 * orange gradient background.
 *
 * @example
 * ```tsx
 * <Avatar initials="DC" />
 * <Avatar initials="JN" size="lg" />
 * <Avatar initials="AB" size={56} borderRadius="50%" />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = 'md',
  borderRadius = '8px',
  style,
  className,
  'aria-label': ariaLabel,
}) => {
  const px = resolveSize(size);

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: px,
    height: px,
    borderRadius,
    backgroundImage: 'linear-gradient(128deg, #EC6608 0%, #F6540E 100%)',
    flexShrink: 0,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    ...style,
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
    // Scale font roughly to 34 % of the container size
    fontSize: Math.round(px * 0.34),
    color: '#ffffff',
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={containerStyle}
      className={className}
      role="img"
      aria-label={ariaLabel ?? `Avatar ${initials.toUpperCase()}`}
    >
      <span style={textStyle}>{initials.toUpperCase()}</span>
    </div>
  );
};
