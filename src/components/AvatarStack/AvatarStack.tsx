import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Tooltip } from '../Tooltip/Tooltip';
import type { AvatarSize } from '../Avatar/Avatar';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    overflowBg: 'rgba(60,60,60,0.95)',
    overflowText: '#ffffff',
    overflowBorder: 'rgba(3,3,3,1)',
    ringColor: 'rgba(3,3,3,1)',
  },
  light: {
    overflowBg: 'rgba(220,220,220,0.95)',
    overflowText: '#1a1a1a',
    overflowBorder: 'rgba(255,255,255,1)',
    ringColor: 'rgba(255,255,255,1)',
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveSize = (size: AvatarSize): number => {
  if (typeof size === 'number') return size;
  return { '2xs': 16, xs: 20, sm: 32, md: 40, lg: 64, xl: 96 }[size];
};

const spacingConfig = {
  tight: -0.4,
  normal: -0.3,
  loose: -0.15,
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AvatarStackProps {
  /** Avatar elementy. Každý dostane forced consistent size a circular shape. */
  children: React.ReactNode;
  /** Max viditelných avatarů. Ostatní se sbalí do „+N" badge. @default 3 */
  max?: number;
  /** Forced size pro všechny avatary uvnitř. @default 'sm' */
  size?: AvatarSize;
  /** Mezera mezi avatary (negative margin). @default 'normal' */
  spacing?: 'tight' | 'normal' | 'loose';
  /** Z-stacking směr — který avatar je nahoře. @default 'ltr' */
  direction?: 'ltr' | 'rtl';
  /** Tooltip nad „+N" badge. String nebo funkce (hiddenCount) => string. */
  overflowTooltip?: string | ((hiddenCount: number) => string);
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── AvatarStack ─────────────────────────────────────────────────────────────

/**
 * Overlap pattern pro více avatarů.
 *
 * Zobrazí max N avatarů s překrytím + „+N" badge pro zbytek.
 * Children avatary se forced-resize na zadaný size a kruhový tvar.
 *
 * @example
 * ```tsx
 * <AvatarStack max={3} size="sm">
 *   <Avatar initials="JD" />
 *   <Avatar initials="AB" />
 *   <Avatar initials="MK" />
 *   <Avatar initials="PV" />
 * </AvatarStack>
 * ```
 */
export const AvatarStack: React.FC<AvatarStackProps> = ({
  children,
  max = 3,
  size = 'sm',
  spacing = 'normal',
  direction = 'ltr',
  overflowTooltip,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const px = resolveSize(size);
  const overlap = Math.round(px * spacingConfig[spacing]);
  const ringWidth = Math.max(2, Math.round(px * 0.06));

  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, max);
  const hiddenCount = Math.max(0, items.length - max);

  const overflowBadge = hiddenCount > 0 ? (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        backgroundColor: t.overflowBg,
        border: `${ringWidth}px solid ${t.overflowBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Zalando Sans', sans-serif",
        fontWeight: 600,
        fontSize: Math.max(9, Math.round(px * 0.3)),
        color: t.overflowText,
        flexShrink: 0,
        boxSizing: 'border-box',
        marginLeft: visibleItems.length > 0 ? overlap : 0,
        zIndex: direction === 'ltr' ? 0 : items.length + 1,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      +{hiddenCount}
    </div>
  ) : null;

  const wrappedOverflow = overflowBadge && overflowTooltip ? (
    <Tooltip content={typeof overflowTooltip === 'function' ? overflowTooltip(hiddenCount) : overflowTooltip}>
      {overflowBadge}
    </Tooltip>
  ) : overflowBadge;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
        ...style,
      }}
    >
      {visibleItems.map((child, idx) => {
        const isElement = React.isValidElement(child);
        const zIndex = direction === 'ltr' ? visibleItems.length - idx : idx + 1;

        // Force size and circular shape on Avatar children
        const cloned = isElement
          ? React.cloneElement(child as React.ReactElement<any>, {
              size,
              borderRadius: '50%',
              style: {
                ...((child as React.ReactElement<any>).props.style || {}),
                border: `${ringWidth}px solid ${t.ringColor}`,
                boxSizing: 'border-box',
              },
            })
          : child;

        return (
          <div
            key={idx}
            style={{
              position: 'relative',
              zIndex,
              marginLeft: idx > 0 ? overlap : 0,
              flexShrink: 0,
              lineHeight: 0,
            }}
          >
            {cloned}
          </div>
        );
      })}
      {wrappedOverflow}
    </div>
  );
};

AvatarStack.displayName = 'AvatarStack';
