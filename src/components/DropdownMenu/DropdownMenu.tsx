import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    dropdownBg: 'rgba(24,24,24,0.95)',
    dropdownBorder: 'rgba(255,255,255,0.12)',
    text: '#eaeaea',
    textDisabled: '#666666',
    hoverBg: 'rgba(255,255,255,0.06)',
    dangerText: '#EF3838',
    dangerHover: 'rgba(239,56,56,0.08)',
    divider: 'rgba(255,255,255,0.08)',
    shadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
  },
  light: {
    dropdownBg: 'rgba(255,255,255,0.95)',
    dropdownBorder: 'rgba(0,0,0,0.1)',
    text: '#1a1a1a',
    textDisabled: '#bbbbbb',
    hoverBg: 'rgba(0,0,0,0.04)',
    dangerText: '#EF3838',
    dangerHover: 'rgba(239,56,56,0.06)',
    divider: 'rgba(0,0,0,0.06)',
    shadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset',
  },
} as const;

// ─── Animation duration ─────────────────────────────────────────────────────

const ANIM_DURATION = 180; // ms

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DropdownMenuItem {
  /** Zobrazovaný popisek položky. */
  label: string;
  /** Volitelná ikona vykreslená před textem. */
  icon?: React.ReactNode;
  /** Voláno při kliknutí na položku. */
  onClick?: () => void;
  /** Při `true` nelze položku vybrat. @default false */
  disabled?: boolean;
  /** Při `true` se položka zobrazí červeně (nebezpečná akce). @default false */
  danger?: boolean;
  /** Při `true` se místo položky vykreslí oddělovací čára. @default false */
  divider?: boolean;
}

export interface DropdownMenuProps {
  /** Spouštěcí element (tlačítko apod.). */
  trigger: React.ReactNode;
  /** Seznam položek nabídky. */
  items: DropdownMenuItem[];
  /** Pozice rozbalovací nabídky vůči triggeru. @default 'bottom-left' */
  position?: 'bottom-left' | 'bottom-right';
  /** Dodatečná CSS třída pro obalový element. */
  className?: string;
  /** Další inline styly pro obalový element. */
  style?: React.CSSProperties;
}

// ─── DropdownMenu ───────────────────────────────────────────────────────────

/**
 * Rozbalovací nabídka dle SM-UI design systému.
 *
 * Otevírá se kliknutím na trigger element, zavírá se kliknutím
 * mimo nebo klávesou Escape. Používá React portál
 * s chytrým pozicováním (otevře se nad triggerem, pokud pod ním není místo).
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   trigger={<Button>Akce</Button>}
 *   items={[
 *     { label: 'Upravit', onClick: () => {} },
 *     { label: 'Duplikovat', onClick: () => {} },
 *     { divider: true, label: '' },
 *     { label: 'Smazat', danger: true, onClick: () => {} },
 *   ]}
 * />
 * ```
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  position = 'bottom-left',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    openAbove: boolean;
  }>({ top: 0, left: 0, openAbove: false });
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // ── Open / close with animation ─────────────────────────────────────────

  const doOpen = useCallback(() => {
    setOpen(true);
    setVisible(true);
    setAnimState('opening');
    setHighlightIndex(-1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('open'));
    });
  }, []);

  const doClose = useCallback(() => {
    setOpen(false);
    setAnimState('closing');
    const timer = setTimeout(() => {
      setVisible(false);
      setAnimState('idle');
    }, ANIM_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ── Position the portal dropdown ────────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.offsetHeight ?? 200;
    const dropdownWidth = dropdownRef.current?.offsetWidth ?? 200;
    const spaceBelow = window.innerHeight - rect.bottom - 6;
    const spaceAbove = rect.top - 6;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    let left: number;
    if (position === 'bottom-right') {
      left = rect.right - dropdownWidth;
      // Zajistit, aby nepřesáhl levý okraj
      if (left < 4) left = 4;
    } else {
      left = rect.left;
      // Zajistit, aby nepřesáhl pravý okraj
      if (left + dropdownWidth > window.innerWidth - 4) {
        left = window.innerWidth - dropdownWidth - 4;
      }
    }

    setDropdownPos({
      top: openAbove ? rect.top - 6 : rect.bottom + 6,
      left,
      openAbove,
    });
  }, [position]);

  useEffect(() => {
    if (!visible) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [visible, updatePosition]);

  // ── Close on outside click ──────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) doClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, doClose]);

  // ── Keyboard ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const actionableItems = items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => !item.divider && !item.disabled);

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          doClose();
          break;
        case 'ArrowDown': {
          e.preventDefault();
          const currentActionIdx = actionableItems.findIndex(({ idx }) => idx === highlightIndex);
          const next = currentActionIdx < actionableItems.length - 1 ? currentActionIdx + 1 : 0;
          setHighlightIndex(actionableItems[next]?.idx ?? -1);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const currentActionIdx = actionableItems.findIndex(({ idx }) => idx === highlightIndex);
          const prev = currentActionIdx > 0 ? currentActionIdx - 1 : actionableItems.length - 1;
          setHighlightIndex(actionableItems[prev]?.idx ?? -1);
          break;
        }
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (highlightIndex >= 0) {
            const item = items[highlightIndex];
            if (item && !item.divider && !item.disabled) {
              item.onClick?.();
              doClose();
            }
          }
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, highlightIndex, items, doClose]);

  // ── Animation styles ────────────────────────────────────────────────────

  const getDropdownAnimStyle = (): React.CSSProperties => {
    const above = dropdownPos.openAbove;
    const slideIn = above ? 'translateY(8px)' : 'translateY(-8px)';
    const slideOut = above ? 'translateY(6px)' : 'translateY(-6px)';
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    if (animState === 'opening' || animState === 'idle') {
      return { ...base, opacity: 0, transform: `${slideIn} scale(0.97)` };
    }
    if (animState === 'open') {
      return { ...base, opacity: 1, transform: 'translateY(0) scale(1)' };
    }
    return { ...base, opacity: 0, transform: `${slideOut} scale(0.98)`, pointerEvents: 'none' };
  };

  // ── Dropdown portal ─────────────────────────────────────────────────────

  const dropdown = visible
    ? createPortal(
        <div
          ref={dropdownRef}
          role="menu"
          style={{
            position: 'fixed',
            ...(dropdownPos.openAbove
              ? { bottom: window.innerHeight - dropdownPos.top, left: dropdownPos.left }
              : { top: dropdownPos.top, left: dropdownPos.left }),
            minWidth: '180px',
            backgroundColor: t.dropdownBg,
            border: `1px solid ${t.dropdownBorder}`,
            borderRadius: '12px',
            boxShadow: t.shadow,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: '6px',
            transformOrigin: dropdownPos.openAbove ? 'bottom center' : 'top center',
            ...getDropdownAnimStyle(),
          }}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return (
                <div
                  key={idx}
                  role="separator"
                  style={{
                    height: '1px',
                    backgroundColor: t.divider,
                    margin: '4px 6px',
                  }}
                />
              );
            }

            const isDanger = item.danger;
            const isDisabled = item.disabled;
            const isHighlighted = idx === highlightIndex;
            const textColor = isDisabled
              ? t.textDisabled
              : isDanger
                ? t.dangerText
                : t.text;
            const hoverBg = isDanger ? t.dangerHover : t.hoverBg;

            return (
              <div
                key={idx}
                role="menuitem"
                aria-disabled={isDisabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                  color: textColor,
                  backgroundColor: isHighlighted ? hoverBg : 'transparent',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'background-color 0.12s ease',
                  userSelect: 'none',
                }}
                onClick={() => {
                  if (isDisabled) return;
                  item.onClick?.();
                  doClose();
                }}
                onMouseEnter={() => {
                  if (!isDisabled) setHighlightIndex(idx);
                }}
                onMouseLeave={() => setHighlightIndex(-1)}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>,
        document.body
      )
    : null;

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', position: 'relative', ...style }}
    >
      <div
        ref={triggerRef}
        onClick={() => {
          if (open) doClose();
          else doOpen();
        }}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
      >
        {trigger}
      </div>
      {dropdown}
    </div>
  );
};

DropdownMenu.displayName = 'DropdownMenu';
