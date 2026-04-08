import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { CaretDown as CaretDownIcon, X as XIcon, Check as CheckIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Spinner ─────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => {
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

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: `rotate(${angle}deg)`, flexShrink: 0, display: 'block' }}
    >
      <circle cx="8" cy="8" r="6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// ─── Design tokens (mirroring Input) ────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    border: 'rgba(255,255,255,0.3)',
    borderFocus: 'rgba(255,255,255,0.7)',
    borderError: '#EF3838',
    text: '#ffffff',
    placeholder: '#ACACAC',
    label: '#ffffff',
    dropdownBg: 'rgba(24,24,24,0.95)',
    dropdownBorder: 'rgba(255,255,255,0.12)',
    optionHover: 'rgba(255,255,255,0.06)',
    optionSelected: 'rgba(232,97,45,0.12)',
    optionSelectedText: '#E8612D',
    tagBg: 'rgba(255,255,255,0.12)',
    tagText: '#eaeaea',
    divider: 'rgba(255,255,255,0.08)',
    scrollbarThumb: 'rgba(255,255,255,0.15)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    border: 'rgba(0,0,0,0.2)',
    borderFocus: 'rgba(0,0,0,0.6)',
    borderError: '#EF3838',
    text: '#1a1a1a',
    placeholder: '#888888',
    label: '#1a1a1a',
    dropdownBg: 'rgba(255,255,255,0.95)',
    dropdownBorder: 'rgba(0,0,0,0.1)',
    optionHover: 'rgba(0,0,0,0.04)',
    optionSelected: 'rgba(232,97,45,0.08)',
    optionSelectedText: '#E8612D',
    tagBg: 'rgba(0,0,0,0.08)',
    tagText: '#1a1a1a',
    divider: 'rgba(0,0,0,0.06)',
    scrollbarThumb: 'rgba(0,0,0,0.15)',
  },
} as const;

// ─── Animation duration ──────────────────────────────────────────────────────

const ANIM_DURATION = 180; // ms

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  /** Unikátní hodnota položky. */
  value: string;
  /** Zobrazovaný popisek. Pokud chybí, použije se `value`. */
  label?: string;
  /** Při `true` nelze položku vybrat. */
  disabled?: boolean;
}

export interface SelectProps {
  /** Dostupné položky k výběru. */
  options: SelectOption[];

  // ── Hodnota ────────────────────────────────────────────────────────────

  /**
   * Aktuální hodnota.
   * - Jednoduchý výběr: `string | null`
   * - Vícenásobný výběr: `string[]`
   */
  value?: string | string[] | null;
  /**
   * Voláno při změně výběru.
   * - Jednoduchý výběr: `(value: string | null) => void`
   * - Vícenásobný výběr: `(value: string[]) => void`
   */
  onChange?: (value: any) => void;

  // ── Chování ────────────────────────────────────────────────────────────

  /** Umožní vybrat více položek najednou. @default false */
  multiple?: boolean;
  /** Zobrazí textové pole pro filtrování položek. @default false */
  searchable?: boolean;
  /** Zobrazí tlačítko pro vymazání výběru. @default false */
  clearable?: boolean;
  /** Zakáže celý select. @default false */
  disabled?: boolean;
  /**
   * Při `true` je select neinteraktivní a místo šipky se zobrazí spinner.
   * Vhodné při asynchronním načítání položek.
   * @default false
   */
  loading?: boolean;
  /** Označí select jako nevalidní — přijímá `true` nebo textovou chybovou zprávu. */
  error?: boolean | string;

  // ── Zobrazení ──────────────────────────────────────────────────────────

  /**
   * Popisek zobrazený nad selectem.
   * Stylizován velkými písmeny dle SM-UI design systému.
   */
  label?: string;
  /** Zástupný text zobrazený při prázdném výběru. */
  placeholder?: string;
  /** Maximální výška (px) rozbalovacího seznamu před scrollováním. @default 240 */
  maxDropdownHeight?: number;
  /** Další inline styly pro kořenový obal. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový obal. */
  className?: string;
}

export interface SelectGroupProps {
  /** Text popisku nad selectem, velkými písmeny dle SM-UI design systému. */
  label: string;
  /** `htmlFor` propojující `<label>` se selectem. Automaticky generováno, pokud chybí. */
  htmlFor?: string;
  /** Select element(y) vykreslené uvnitř skupiny. */
  children?: React.ReactNode;
  /** Další inline styly pro obal. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obal. */
  className?: string;
}

// ─── Select ──────────────────────────────────────────────────────────────────

/**
 * Vlastní rozbalovací výběr dle SM-UI design systému.
 *
 * Podporuje jednoduchý / vícenásobný výběr, fulltextové vyhledávání,
 * vymazání hodnoty, chybový stav a tmavý / světlý režim přes `useTheme`.
 *
 * Dropdown se vykresluje přes React portál, takže ho neořízne
 * rodičovský kontejner s `overflow: hidden`.
 *
 * @example
 * ```tsx
 * // Jednoduchý výběr
 * <Select
 *   options={[{ value: 'cz', label: 'Česko' }, { value: 'sk', label: 'Slovensko' }]}
 *   value={zeme}
 *   onChange={setZeme}
 *   placeholder="Vyberte zemi"
 *   clearable
 * />
 *
 * // Vícenásobný výběr s vyhledáváním
 * <Select
 *   options={tagy}
 *   value={vybraneTaxy}
 *   onChange={setVybraneTaxy}
 *   multiple
 *   searchable
 *   placeholder="Vyberte tagy…"
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  loading = false,
  error,
  label,
  placeholder = 'Vyberte…',
  maxDropdownHeight = 240,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const selectId = useId();

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // controls portal mount
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; openAbove: boolean }>({ top: 0, left: 0, width: 0, openAbove: false });

  const isDisabled = disabled || loading;
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // ── Open / close with animation ────────────────────────────────────────

  const doOpen = useCallback(() => {
    setOpen(true);
    setVisible(true);
    setAnimState('opening');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('open'));
    });
  }, []);

  const doClose = useCallback(() => {
    setOpen(false);
    setAnimState('closing');
    setSearch('');
    const timer = setTimeout(() => {
      setVisible(false);
      setAnimState('idle');
    }, ANIM_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ── Normalise value ────────────────────────────────────────────────────

  const selectedValues: string[] = multiple
    ? Array.isArray(value) ? value : []
    : value != null && value !== '' ? [value as string] : [];

  const isSelected = (v: string) => selectedValues.includes(v);

  // ── Filtered options ───────────────────────────────────────────────────

  const filteredOptions = search
    ? options.filter((o) =>
        (o.label ?? o.value).toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // ── Position the portal dropdown ───────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.offsetHeight ?? maxDropdownHeight + 60;
    const spaceBelow = window.innerHeight - rect.bottom - 6;
    const spaceAbove = rect.top - 6;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    setDropdownPos({
      top: openAbove ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      openAbove,
    });
  }, [maxDropdownHeight]);

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

  // ── Handlers ───────────────────────────────────────────────────────────

  const toggleOption = useCallback(
    (optValue: string) => {
      if (!onChange) return;
      if (multiple) {
        const next = isSelected(optValue)
          ? selectedValues.filter((v) => v !== optValue)
          : [...selectedValues, optValue];
        onChange(next);
      } else {
        onChange(optValue);
        doClose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiple, onChange, selectedValues, doClose]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onChange) return;
      onChange(multiple ? [] : null);
      setSearch('');
    },
    [multiple, onChange]
  );

  const handleTriggerClick = () => {
    if (isDisabled) return;
    if (open) {
      doClose();
    } else {
      doOpen();
    }
    setHighlightIndex(-1);
  };

  // ── Keyboard navigation ────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          doOpen();
          setHighlightIndex(0);
        } else {
          setHighlightIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open && highlightIndex >= 0 && filteredOptions[highlightIndex] && !filteredOptions[highlightIndex].disabled) {
          toggleOption(filteredOptions[highlightIndex].value);
        } else if (!open) {
          doOpen();
          setHighlightIndex(0);
        }
        break;
      case 'Escape':
        doClose();
        break;
      case 'Tab':
        doClose();
        break;
    }
  };

  // ── Scroll highlighted option into view ────────────────────────────────

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const child = listRef.current.children[highlightIndex] as HTMLElement | undefined;
      child?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  // ── Close on outside click ─────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) {
        doClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, doClose]);

  // ── Focus search on open ───────────────────────────────────────────────

  useEffect(() => {
    if (open && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open, searchable]);

  // ── Display value ──────────────────────────────────────────────────────

  const getLabel = (v: string) => {
    const opt = options.find((o) => o.value === v);
    return opt?.label ?? v;
  };

  const showClear = clearable && selectedValues.length > 0 && !isDisabled;

  // ── Animation styles ───────────────────────────────────────────────────

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
    // closing
    return { ...base, opacity: 0, transform: `${slideOut} scale(0.98)`, pointerEvents: 'none' };
  };

  // ── Styles ─────────────────────────────────────────────────────────────

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: isDisabled ? t.backgroundDisabled : t.background,
    border: `1px solid ${hasError ? t.borderError : open ? t.borderFocus : t.border}`,
    borderRadius: '8px',
    padding: '8px 12px',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
    opacity: isDisabled ? 0.6 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
  };

  // ── Dropdown (rendered via portal) ─────────────────────────────────────

  const dropdown = visible
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            ...(dropdownPos.openAbove
              ? { bottom: window.innerHeight - dropdownPos.top, left: dropdownPos.left }
              : { top: dropdownPos.top, left: dropdownPos.left }),
            width: dropdownPos.width,
            backgroundColor: t.dropdownBg,
            border: `1px solid ${t.dropdownBorder}`,
            borderRadius: '12px',
            boxShadow: theme === 'dark'
              ? '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset'
              : '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            overflow: 'hidden',
            boxSizing: 'border-box',
            transformOrigin: dropdownPos.openAbove ? 'bottom center' : 'top center',
            ...getDropdownAnimStyle(),
          }}
        >
          {/* Search */}
          {searchable && (
            <div style={{
              padding: '10px 12px',
              borderBottom: `1px solid ${t.divider}`,
            }}>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setHighlightIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Hledat…"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '14px',
                  color: t.text,
                  boxSizing: 'border-box',
                  padding: 0,
                }}
              />
            </div>
          )}

          {/* Options list */}
          <div
            ref={listRef}
            role="listbox"
            aria-multiselectable={multiple}
            className={`sm-select-list-${selectId}`}
            style={{
              maxHeight: maxDropdownHeight,
              overflowY: 'auto',
              padding: '6px',
            }}
          >
            {/* Custom scrollbar styles */}
            <style>{`
              .sm-select-list-${selectId}::-webkit-scrollbar {
                width: 6px;
              }
              .sm-select-list-${selectId}::-webkit-scrollbar-track {
                background: transparent;
              }
              .sm-select-list-${selectId}::-webkit-scrollbar-thumb {
                background: ${t.scrollbarThumb};
                border-radius: 3px;
              }
            `}</style>

            {filteredOptions.length === 0 && (
              <div style={{
                padding: '16px',
                fontFamily: "'Zalando Sans', sans-serif",
                fontSize: '13px',
                color: t.placeholder,
                textAlign: 'center',
              }}>
                Nic nenalezeno
              </div>
            )}

            {filteredOptions.map((opt, idx) => {
              const selected = isSelected(opt.value);
              const highlighted = idx === highlightIndex;

              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={opt.disabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '9px 10px',
                    borderRadius: '6px',
                    fontFamily: "'Zalando Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: selected ? 500 : 400,
                    lineHeight: 'normal',
                    color: selected ? t.optionSelectedText : opt.disabled ? t.placeholder : t.text,
                    backgroundColor: highlighted
                      ? t.optionHover
                      : selected
                        ? t.optionSelected
                        : 'transparent',
                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                    opacity: opt.disabled ? 0.45 : 1,
                    transition: 'background-color 0.12s ease, color 0.12s ease',
                    userSelect: 'none',
                    marginBottom: idx < filteredOptions.length - 1 ? '2px' : 0,
                  }}
                  onClick={() => {
                    if (!opt.disabled) toggleOption(opt.value);
                  }}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  onMouseLeave={() => setHighlightIndex(-1)}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label ?? opt.value}
                  </span>
                  {selected && <CheckIcon size={16} color={t.optionSelectedText} />}
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px', ...style }}
      className={className}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '10px',
            lineHeight: 'normal',
            textTransform: 'uppercase',
            color: t.text,
            userSelect: 'none',
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={isDisabled ? -1 : 0}
        style={triggerStyle}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
      >
        {/* Value area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'nowrap', gap: '4px', alignItems: 'center', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none' }}>
          {selectedValues.length === 0 && (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '16px',
              color: t.placeholder,
              lineHeight: 'normal',
            }}>
              {placeholder}
            </span>
          )}

          {multiple
            ? selectedValues.map((v) => (
                <span
                  key={v}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: t.tagBg,
                    color: t.tagText,
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontFamily: "'Zalando Sans', sans-serif",
                    fontSize: '13px',
                    lineHeight: 'normal',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getLabel(v)}
                  </span>
                  {!isDisabled && (
                    <span
                      role="button"
                      tabIndex={-1}
                      style={{ cursor: 'pointer', display: 'flex', opacity: 0.7 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(v);
                      }}
                    >
                      <XIcon size={14} color={t.tagText} />
                    </span>
                  )}
                </span>
              ))
            : selectedValues.length > 0 && (
                <span style={{
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '16px',
                  color: t.text,
                  lineHeight: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {getLabel(selectedValues[0])}
                </span>
              )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {showClear && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Vymazat výběr"
              style={{ cursor: 'pointer', display: 'flex', padding: '2px' }}
              onClick={handleClear}
            >
              <XIcon size={14} color={t.placeholder} />
            </span>
          )}
          {loading
            ? <Spinner size={16} color={t.placeholder} />
            : <CaretDownIcon size={16} color={t.placeholder} style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
          }
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <span style={{
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: '12px',
          color: t.borderError,
          lineHeight: 'normal',
        }}>
          {errorMessage}
        </span>
      )}

      {/* Portal dropdown */}
      {dropdown}
    </div>
  );
};

Select.displayName = 'Select';

// ─── SelectGroup ─────────────────────────────────────────────────────────────

/**
 * Obalí `<Select>` skupinou s popiskem, vizuálně odpovídá `InputGroup`.
 *
 * @example
 * ```tsx
 * <SelectGroup label="Země">
 *   <Select options={zeme} value={zeme} onChange={setZeme} />
 * </SelectGroup>
 * ```
 */
export const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  htmlFor,
  children,
  style,
  className,
}) => {
  const theme = useTheme();
  const autoId = useId();
  const labelFor = htmlFor ?? autoId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }} className={className}>
      <label
        htmlFor={labelFor}
        style={{
          fontFamily: "'Zalando Sans Expanded', sans-serif",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: 'normal',
          textTransform: 'uppercase',
          color: tokens[theme].label,
          userSelect: 'none',
        }}
      >
        {label}
      </label>
      {children ?? <Select options={[]} />}
    </div>
  );
};

SelectGroup.displayName = 'SelectGroup';
