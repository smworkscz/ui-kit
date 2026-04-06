import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    textDisabled: 'rgba(255,255,255,0.3)',
    chevron: '#ACACAC',
    chevronDisabled: 'rgba(255,255,255,0.2)',
    hoverBg: 'rgba(255,255,255,0.03)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    border: 'rgba(0,0,0,0.06)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    textDisabled: 'rgba(0,0,0,0.25)',
    chevron: '#888888',
    chevronDisabled: 'rgba(0,0,0,0.15)',
    hoverBg: 'rgba(0,0,0,0.02)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AccordionItemProps {
  /** Titulek položky. */
  title: string;
  /** Obsah zobrazený po rozbalení. */
  children: React.ReactNode;
  /** Při `true` bude položka výchozně rozbalena. @default false */
  defaultOpen?: boolean;
  /** Zakáže interakci s položkou. @default false */
  disabled?: boolean;
}

export interface AccordionProps {
  /**
   * Potomci — typicky komponenty `<AccordionItem>`.
   */
  children: React.ReactNode;
  /** Povolí více současně otevřených položek. @default false */
  multiple?: boolean;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── AccordionItem ───────────────────────────────────────────────────────────

/**
 * Položka akordéonu. Používejte uvnitř `<Accordion>`.
 *
 * @example
 * ```tsx
 * <AccordionItem title="Sekce 1">
 *   Obsah první sekce.
 * </AccordionItem>
 * ```
 */
export const AccordionItem: React.FC<
  AccordionItemProps & {
    /** @internal Řízeno rodičem Accordion. */
    _controlled?: boolean;
    /** @internal */
    _open?: boolean;
    /** @internal */
    _onToggle?: () => void;
  }
> = ({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  _controlled,
  _open,
  _onToggle,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = _controlled ? !!_open : internalOpen;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isOpen]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (_controlled && _onToggle) {
      _onToggle();
    } else {
      setInternalOpen((v) => !v);
    }
  }, [disabled, _controlled, _onToggle]);

  return (
    <div
      style={{
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '14px 16px',
          border: 'none',
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: '15px',
          fontWeight: 500,
          color: disabled ? t.textDisabled : t.text,
          lineHeight: 'normal',
          textAlign: 'left',
          outline: 'none',
          transition: 'background-color 0.12s ease',
        }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = t.hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span>{title}</span>
        <CaretDownIcon size={16} color={disabled ? t.chevronDisabled : t.chevron} style={{ transition: 'transform 0.25s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
      </button>

      <div
        ref={contentRef}
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          transition: 'max-height 0.25s ease',
        }}
      >
        <div
          style={{
            padding: '10px 16px 16px',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            lineHeight: '1.5',
            color: t.textSecondary,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

AccordionItem.displayName = 'AccordionItem';

// ─── Accordion ───────────────────────────────────────────────────────────────

/**
 * Akordéon dle SM-UI design systému.
 *
 * Obalí skupinu `<AccordionItem>` a řídí jejich otevírání.
 * Ve výchozím stavu se otevře vždy pouze jedna položka najednou.
 * Pro více současně otevřených položek nastavte `multiple`.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem title="Sekce 1">Obsah 1</AccordionItem>
 *   <AccordionItem title="Sekce 2">Obsah 2</AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion: React.FC<AccordionProps> = ({
  children,
  multiple = false,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<AccordionItemProps> =>
      React.isValidElement(child)
  );

  const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
    const defaults = new Set<number>();
    items.forEach((item, idx) => {
      if (item.props.defaultOpen) defaults.add(idx);
    });
    return defaults;
  });

  const handleToggle = useCallback(
    (idx: number) => {
      setOpenIndices((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) {
          next.delete(idx);
        } else {
          if (!multiple) next.clear();
          next.add(idx);
        }
        return next;
      });
    },
    [multiple]
  );

  return (
    <div
      className={className}
      style={{
        backgroundColor: t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {items.map((item, idx) =>
        React.cloneElement(item, {
          key: idx,
          _controlled: true,
          _open: openIndices.has(idx),
          _onToggle: () => handleToggle(idx),
        } as any)
      )}
    </div>
  );
};

Accordion.displayName = 'Accordion';
