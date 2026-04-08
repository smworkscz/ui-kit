import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: 'rgba(255,255,255,0.7)',
    textHover: '#ffffff',
    textActive: '#ffffff',
    icon: 'rgba(255,255,255,0.4)',
    iconHover: 'rgba(255,255,255,0.8)',
    iconActive: '#FC4F00',
    hoverBg: 'rgba(255,255,255,0.06)',
    activeBg: 'rgba(232,97,45,0.1)',
    chevron: 'rgba(255,255,255,0.3)',
    chevronHover: 'rgba(255,255,255,0.7)',
  },
  light: {
    text: 'rgba(0,0,0,0.6)',
    textHover: '#1a1a1a',
    textActive: '#1a1a1a',
    icon: 'rgba(0,0,0,0.35)',
    iconHover: 'rgba(0,0,0,0.7)',
    iconActive: '#FC4F00',
    hoverBg: 'rgba(0,0,0,0.04)',
    activeBg: 'rgba(232,97,45,0.07)',
    chevron: 'rgba(0,0,0,0.25)',
    chevronHover: 'rgba(0,0,0,0.6)',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SidebarItemProps {
  /** Textový popisek položky. */
  label: string;
  /** Volitelná ikona zobrazená před textem. */
  icon?: React.ReactNode;
  /** Zda je položka aktivní (vybraná). @default false */
  active?: boolean;
  /** Zda je skupina výchozně rozbalená. @default false */
  defaultExpanded?: boolean;
  /** Řízené rozbalení. Pokud zadáno, přepíše defaultExpanded. */
  expanded?: boolean;
  /** Callback při změně rozbalení. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Callback při kliknutí na položku (ne na chevron). */
  onClick?: () => void;
  /** Potomci — vnořené SidebarItem komponenty. Přítomnost aktivuje rozbalovací režim. */
  children?: React.ReactNode;
  /** Zda je sidebar sbalený (jen ikona). @default false */
  collapsed?: boolean;
  /** Zakáže interakci. @default false */
  disabled?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── SidebarItem ────────────────────────────────────────────────────────────

/**
 * Položka navigace pro AppSidebar.
 *
 * Podporuje ikonu, aktivní stav, hover efekt a vnořené položky
 * s animovaným rozbalováním/sbalováním.
 *
 * @example
 * ```tsx
 * <SidebarItem label="Dashboard" icon={<HouseIcon size={18} />} active onClick={...} />
 *
 * <SidebarItem label="Settings" icon={<GearIcon size={18} />} defaultExpanded>
 *   <SidebarItem label="General" onClick={...} />
 *   <SidebarItem label="Security" onClick={...} />
 *   <SidebarItem label="Billing" onClick={...} />
 * </SidebarItem>
 * ```
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
  onClick,
  children,
  collapsed = false,
  disabled = false,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const hasChildren = React.Children.count(children) > 0;
  const isControlled = controlledExpanded !== undefined;

  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const [hovered, setHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // ── Measure children height ──────────────────────────────────────────

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isExpanded]);

  // ── Toggle expand ────────────────────────────────────────────────────

  const toggleExpand = useCallback(() => {
    if (isControlled) {
      onExpandedChange?.(!controlledExpanded);
    } else {
      setInternalExpanded((prev) => {
        const next = !prev;
        onExpandedChange?.(next);
        return next;
      });
    }
  }, [isControlled, controlledExpanded, onExpandedChange]);

  // ── Handle click ─────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (hasChildren) {
      toggleExpand();
    }

    onClick?.();
  }, [disabled, hasChildren, toggleExpand, onClick]);

  // ── Colors ───────────────────────────────────────────────────────────

  const textColor = disabled
    ? `${t.text}66`
    : active
      ? t.textActive
      : hovered
        ? t.textHover
        : t.text;

  const iconColor = disabled
    ? `${t.icon}66`
    : active
      ? t.iconActive
      : hovered
        ? t.iconHover
        : t.icon;

  const bgColor = active
    ? t.activeBg
    : hovered && !disabled
      ? t.hoverBg
      : 'transparent';

  // ── Collapsed mode — icon only ───────────────────────────────────────

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={label}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 40,
          border: '0 none',
          borderStyle: 'none',
          outline: 'none',
          borderRadius: 8,
          backgroundColor: bgColor,
          color: iconColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.12s ease, color 0.12s ease',
          flexShrink: 0,
          ...style,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {icon || <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{label[0]}</span>}
      </button>
    );
  }

  // ── Full mode ────────────────────────────────────────────────────────

  return (
    <div className={className} style={style}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '8px 10px',
          border: '0 none',
          borderStyle: 'none',
          outline: 'none',
          borderRadius: 8,
          backgroundColor: bgColor,
          color: textColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: 13,
          fontWeight: active ? 500 : 400,
          textAlign: 'left',
          transition: 'background-color 0.12s ease, color 0.12s ease',
          lineHeight: 'normal',
          userSelect: 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Icon */}
        {icon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              color: iconColor,
              transition: 'color 0.12s ease',
            }}
          >
            {icon}
          </span>
        )}

        {/* Label */}
        <span
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>

        {/* Chevron for expandable */}
        {hasChildren && (
          <CaretDownIcon
            size={14}
            color={hovered ? t.chevronHover : t.chevron}
            style={{
              flexShrink: 0,
              transition: 'transform 0.2s ease, color 0.12s ease',
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            }}
          />
        )}
      </button>

      {/* Children — collapsible */}
      {hasChildren && (
        <div
          ref={contentRef}
          style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? `${contentHeight}px` : '0px',
            transition: 'max-height 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            paddingLeft: 12,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4, paddingBottom: 4 }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

SidebarItem.displayName = 'SidebarItem';
