import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    default: '#ffffff',
    danger: '#EF3838',
    hoverBg: 'rgba(0,0,0,0.7)',
  },
  light: {
    default: '#1a1a1a',
    danger: '#EF3838',
    hoverBg: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type LinkVariant = 'default' | 'danger';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /**
   * Color variant.
   * - `'default'` — white (dark mode) / dark (light mode)
   * - `'danger'`  — red `#EF3838` in both modes
   * @default 'default'
   */
  variant?: LinkVariant;
  /**
   * Icon element rendered next to the label.
   * Typically a 14×14 SVG or icon component.
   */
  icon?: React.ReactNode;
  /**
   * Side on which the icon is placed relative to the text.
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Whether to render the icon.
   * Useful to conditionally hide the icon without removing the prop.
   * @default true
   */
  showIcon?: boolean;
  /** Extra inline styles applied to the `<a>` element. */
  style?: React.CSSProperties;
  /** Extra CSS class applied to the `<a>` element. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Inline link / action trigger following the SM-UI design system.
 * Renders as a native `<a>` element and inherits all anchor attributes
 * (`href`, `target`, `rel`, `onClick`, `aria-*`, …).
 *
 * In `danger` variant it uses red (#EF3838) to indicate destructive actions.
 * Hover state adds a subtle dark background pill.
 *
 * @example
 * ```tsx
 * <Link href="/settings">Settings</Link>
 * <Link variant="danger" onClick={onDelete} icon={<TrashIcon />}>Delete</Link>
 * <Link icon={<ArrowIcon />} iconPosition="right" href="/next">Next step</Link>
 * ```
 */
export const Link: React.FC<LinkProps> = ({
  variant = 'default',
  icon,
  iconPosition = 'left',
  showIcon = true,
  children,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
  ...rest
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const [hovered, setHovered] = useState(false);

  const color = variant === 'danger' ? t.danger : t.default;

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: hovered ? t.hoverBg : 'transparent',
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 'normal',
    color,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.15s ease',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    ...style,
  };

  const iconEl = showIcon && icon
    ? <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
    : null;

  return (
    <a
      style={linkStyle}
      className={className}
      target={target}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      {...rest}
    >
      {iconPosition === 'right' ? (
        <>{children}{iconEl}</>
      ) : (
        <>{iconEl}{children}</>
      )}
    </a>
  );
};
