import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AvatarProps {
  /**
   * Iniciály zobrazené uvnitř avataru (např. `"DC"`, `"JN"`).
   * Automaticky převedeny na velká písmena.
   */
  initials: string;
  /**
   * Velikost avataru.
   * - `'2xs'` — 16 px
   * - `'xs'` — 20 px
   * - `'sm'` — 32 px
   * - `'md'` — 40 px  *(výchozí)*
   * - `'lg'` — 64 px
   * - `'xl'` — 96 px
   * - `number` — přesná hodnota v pixelech
   * @default 'md'
   */
  size?: AvatarSize;
  /**
   * Zaoblení rohů kontejneru avataru.
   * @default '8px'
   */
  borderRadius?: React.CSSProperties['borderRadius'];
  /**
   * Přístupný popisek čtený čtečkami obrazovky.
   * Pokud není zadán, použije se `"Avatar {initials}"`.
   */
  'aria-label'?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveSize = (size: AvatarSize): number => {
  if (typeof size === 'number') return size;
  return { '2xs': 16, xs: 20, sm: 32, md: 40, lg: 64, xl: 96 }[size];
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Kruhový / čtvercový avatar zobrazující iniciály uživatele
 * na oranžovém gradientním pozadí.
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
