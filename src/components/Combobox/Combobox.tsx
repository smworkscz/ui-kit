import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import {
  MagnifyingGlass as MagnifyingGlassIcon,
  CaretDown as CaretDownIcon,
  Check as CheckIcon,
  X as XIcon,
} from '@phosphor-icons/react';
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

// ─── Design tokens ───────────────────────────────────────────────────────────

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
    divider: 'rgba(255,255,255,0.08)',
    scrollbarThumb: 'rgba(255,255,255,0.15)',
    tagBg: 'rgba(255,255,255,0.12)',
    tagText: '#eaeaea',
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
    divider: 'rgba(0,0,0,0.06)',
    scrollbarThumb: 'rgba(0,0,0,0.15)',
    tagBg: 'rgba(0,0,0,0.08)',
    tagText: '#1a1a1a',
  },
} as const;

// ─── Animation ───────────────────────────────────────────────────────────────

const ANIM_DURATION = 180;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '6px 10px', fontSize: '14px', iconSize: 14, gap: '8px' },
  md: { padding: '8px 12px', fontSize: '16px', iconSize: 16, gap: '10px' },
  lg: { padding: '10px 14px', fontSize: '18px', iconSize: 18, gap: '12px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxOption {
  /** Unikátní hodnota položky. */
  value: string;
  /** Zobrazovaný popisek. Pokud chybí, použije se `value`. */
  label?: string;
}

export interface ComboboxProps {
  /** Dostupné položky k výběru. */
  options: ComboboxOption[];
  /**
   * Aktuální vybraná hodnota.
   * - Jednoduchý výběr: `string`
   * - Vícenásobný výběr: `string[]`
   */
  value: string | string[];
  /**
   * Callback volaný při výběru položky.
   * - Jednoduchý výběr: `(value: string) => void`
   * - Vícenásobný výběr: `(value: string[]) => void`
   */
  onChange: (value: any) => void;
  /** Callback volaný při změně textu ve vyhledávacím poli. Vhodné pro asynchronní filtrování. */
  onInputChange?: (input: string) => void;
  /** Zástupný text zobrazený při prázdném poli. */
  placeholder?: string;
  /** Popisek zobrazený nad polem. Stylizován velkými písmeny dle SM-UI design systému. */
  label?: string;
  /** Při `true` se pole zobrazí jako nevalidní. Při zadání řetězce se zobrazí chybová zpráva. */
  error?: boolean | string;
  /** Zakáže celou komponentu. */
  disabled?: boolean;
  /** Zobrazí spinner místo ikony vyhledávání. Vhodné při načítání položek. */
  loading?: boolean;
  /** Umožní vybrat více položek najednou. @default false */
  multiple?: boolean;
  /** Zobrazí tlačítko pro vymazání výběru. @default false */
  clearable?: boolean;
  /** Voláno při otevření/zavření dropdownu. */
  onOpenChange?: (open: boolean) => void;
  /** Voláno při výběru položky. */
  onSelect?: (value: string, option: ComboboxOption) => void;
  /** Voláno při odebrání položky (multiple). */
  onDeselect?: (value: string, option: ComboboxOption) => void;
  /** Voláno při vymazání výběru (clearable). */
  onClear?: () => void;
  /** Voláno při focus. */
  onFocus?: (event: React.FocusEvent) => void;
  /** Voláno při blur. */
  onBlur?: (event: React.FocusEvent) => void;
  /** Povolí uživateli zadat vlastní hodnotu, která není v seznamu. @default false */
  allowCustom?: boolean;
  /** Callback volaný při vytvoření vlastní hodnoty (Enter při `allowCustom`). */
  onCreate?: (value: string) => void;
  /** Vlastní renderování položky v seznamu. */
  renderOption?: (option: { value: string; label?: string }, highlighted: boolean) => React.ReactNode;
  /**
   * Obsah zobrazený když žádné výsledky neodpovídají.
   * Může být ReactNode nebo funkce `(close: () => void) => ReactNode`
   * pro přístup k zavření dropdownu.
   * @default "Žádné výsledky"
   */
  notFoundContent?: React.ReactNode | ((close: () => void) => React.ReactNode);
  /**
   * Obsah zobrazený pod seznamem položek uvnitř dropdownu.
   * Může být ReactNode nebo funkce `(close: () => void) => ReactNode`
   * pro přístup k zavření dropdownu.
   */
  footer?: React.ReactNode | ((close: () => void) => React.ReactNode);
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: ComboboxSize;
  /** Další inline styly pro obalový `<div>`. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obalový `<div>`. */
  className?: string;
}

// ─── Combobox ────────────────────────────────────────────────────────────────

/**
 * Kombinované vyhledávací pole se seznamem dle SM-UI design systému.
 *
 * Uživatel zadává text pro filtrování položek. Dropdown se vykresluje
 * přes React portál. Podporuje navigaci klávesami, vlastní hodnoty,
 * vícenásobný výběr a asynchronní filtrování přes `onInputChange`.
 *
 * @example
 * ```tsx
 * // Jednoduchý výběr
 * <Combobox
 *   options={[{ value: 'cz', label: 'Česko' }, { value: 'sk', label: 'Slovensko' }]}
 *   value={zeme}
 *   onChange={setZeme}
 *   placeholder="Hledat zemi…"
 * />
 *
 * // Vícenásobný výběr
 * <Combobox
 *   multiple
 *   options={options}
 *   value={selectedCountries}
 *   onChange={setSelectedCountries}
 *   placeholder="Vyberte země…"
 * />
 * ```
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      onInputChange,
      placeholder = 'Hledat…',
      label,
      error,
      disabled = false,
      loading = false,
      multiple = false,
      clearable = false,
      onOpenChange,
      onSelect,
      onDeselect,
      onClear,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      allowCustom = false,
      onCreate,
      renderOption,
      notFoundContent,
      footer,
      size = 'md',
      style,
      className,
    },
    ref
  ) => {
    const theme = useTheme();
    const t = tokens[theme];
    const autoId = useId();
    const inputId = autoId;
    const sc = sizeConfig[size];

    const triggerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
    const [inputValue, setInputValue] = useState('');
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [focused, setFocused] = useState(false);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; openAbove: boolean }>({ top: 0, left: 0, width: 0, openAbove: false });

    const isDisabled = disabled || loading;
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const showClear = clearable && !isDisabled;

    // ── Derived selected values ──────────────────────────────────────────

    const selectedValues: string[] = multiple
      ? (Array.isArray(value) ? value : value ? [value] : [])
      : (typeof value === 'string' && value ? [value] : []);

    const isSelected = (optValue: string) => selectedValues.includes(optValue);

    const getLabel = (optValue: string) => {
      const opt = options.find((o) => o.value === optValue);
      return opt ? (opt.label ?? opt.value) : optValue;
    };

    // ── Sync input value with selected value (single mode only) ─────────

    useEffect(() => {
      if (multiple) return;
      if (!focused) {
        const selectedOpt = options.find((o) => o.value === value);
        setInputValue(selectedOpt ? (selectedOpt.label ?? selectedOpt.value) : (typeof value === 'string' ? value : '') || '');
      }
    }, [value, options, focused, multiple]);

    // ── Filtered options ─────────────────────────────────────────────────

    const filteredOptions = inputValue
      ? options.filter((o) =>
          (o.label ?? o.value).toLowerCase().includes(inputValue.toLowerCase())
        )
      : options;

    // ── Open / close ─────────────────────────────────────────────────────

    const doOpen = useCallback(() => {
      setOpen(true);
      setVisible(true);
      setAnimState('opening');
      onOpenChange?.(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState('open'));
      });
    }, [onOpenChange]);

    const doClose = useCallback(() => {
      setOpen(false);
      setAnimState('closing');
      onOpenChange?.(false);
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }, [onOpenChange]);

    // ── Position dropdown ────────────────────────────────────────────────

    const updatePosition = useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current?.offsetHeight ?? 240;
      const spaceBelow = window.innerHeight - rect.bottom - 6;
      const spaceAbove = rect.top - 6;
      const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      setDropdownPos({
        top: openAbove ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        openAbove,
      });
    }, []);

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

    // ── Close on outside click ───────────────────────────────────────────

    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (!triggerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
          doClose();
          if (multiple) {
            setInputValue('');
          } else {
            const selectedOpt = options.find((o) => o.value === value);
            if (!allowCustom) {
              setInputValue(selectedOpt ? (selectedOpt.label ?? selectedOpt.value) : '');
            }
          }
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [open, doClose, value, options, allowCustom, multiple]);

    // ── Scroll highlighted into view ─────────────────────────────────────

    useEffect(() => {
      if (highlightIndex >= 0 && listRef.current) {
        const child = listRef.current.children[highlightIndex] as HTMLElement | undefined;
        child?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightIndex]);

    // ── Handlers ─────────────────────────────────────────────────────────

    const handleInputChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      onInputChange?.(val);
      setHighlightIndex(0);
      if (!open) doOpen();
    };

    const selectOption = useCallback(
      (optValue: string) => {
        const opt = options.find((o) => o.value === optValue) || { value: optValue };
        if (multiple) {
          if (isSelected(optValue)) {
            const next = selectedValues.filter((v) => v !== optValue);
            onChange(next);
            onDeselect?.(optValue, opt);
          } else {
            const next = [...selectedValues, optValue];
            onChange(next);
            onSelect?.(optValue, opt);
          }
          setInputValue('');
          // Keep dropdown open in multi mode
        } else {
          onChange(optValue);
          onSelect?.(optValue, opt);
          setInputValue(opt.label ?? opt.value);
          doClose();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange, options, doClose, multiple, selectedValues, onSelect, onDeselect]
    );

    const removeTag = useCallback(
      (optValue: string) => {
        if (!multiple) return;
        const opt = options.find((o) => o.value === optValue) || { value: optValue };
        const next = selectedValues.filter((v) => v !== optValue);
        onChange(next);
        onDeselect?.(optValue, opt);
      },
      [multiple, selectedValues, onChange, options, onDeselect]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(multiple ? [] : '');
        setInputValue('');
        onClear?.();
      },
      [multiple, onChange, onClear]
    );

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
          e.preventDefault();
          if (open && highlightIndex >= 0 && filteredOptions[highlightIndex]) {
            selectOption(filteredOptions[highlightIndex].value);
          } else if (allowCustom && inputValue) {
            if (multiple) {
              onChange([...selectedValues, inputValue]);
              onCreate?.(inputValue);
              setInputValue('');
            } else {
              onChange(inputValue);
              onCreate?.(inputValue);
              doClose();
            }
          }
          break;
        case 'Backspace':
          // In multi mode, remove last tag when input is empty
          if (multiple && inputValue === '' && selectedValues.length > 0) {
            const next = selectedValues.slice(0, -1);
            onChange(next);
          }
          break;
        case 'Escape':
          doClose();
          break;
        case 'Tab':
          if (open) doClose();
          break;
      }
    };

    const handleFocus = (e: React.FocusEvent) => {
      setFocused(true);
      onFocusProp?.(e);
      if (!open && !isDisabled) {
        doOpen();
      }
    };

    const handleBlur = (e: React.FocusEvent) => {
      // If focus moves to an element inside the dropdown (e.g. a button in
      // notFoundContent or footer), don't treat it as a real blur.
      const related = e.relatedTarget as Node | null;
      if (related && (dropdownRef.current?.contains(related) || triggerRef.current?.contains(related))) {
        return;
      }
      setFocused(false);
      onBlurProp?.(e);
      if (!multiple && allowCustom && inputValue) {
        onChange(inputValue);
      }
      if (multiple) {
        setInputValue('');
      }
    };

    // ── Animation styles ─────────────────────────────────────────────────

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

    // ── Styles ───────────────────────────────────────────────────────────

    const triggerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: sc.gap,
      backgroundColor: isDisabled ? t.backgroundDisabled : t.background,
      border: `1px solid ${hasError ? t.borderError : focused ? t.borderFocus : t.border}`,
      borderRadius: '8px',
      padding: sc.padding,
      boxSizing: 'border-box',
      transition: 'border-color 0.15s ease',
      opacity: isDisabled ? 0.6 : 1,
      cursor: isDisabled ? 'not-allowed' : 'text',
      flexWrap: 'nowrap',
    };

    const nativeStyle: React.CSSProperties = {
      flex: 1,
      minWidth: multiple ? '60px' : 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: "'Zalando Sans', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: sc.fontSize,
      lineHeight: 'normal',
      color: t.text,
      cursor: isDisabled ? 'not-allowed' : 'text',
    };

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

    // ── Dropdown ─────────────────────────────────────────────────────────

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
            onMouseDown={(e) => {
              // Prevent input blur so buttons inside the dropdown
              // (notFoundContent, footer) receive their click events.
              e.preventDefault();
            }}
          >
            <div
              ref={listRef}
              role="listbox"
              aria-multiselectable={multiple}
              style={{
                maxHeight: 240,
                overflowY: 'auto',
                padding: '6px',
              }}
            >
              {filteredOptions.length === 0 && (
                <div style={{
                  padding: '16px',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '13px',
                  color: t.placeholder,
                  textAlign: 'center',
                }}>
                  {allowCustom && inputValue
                    ? 'Stiskněte Enter pro potvrzení'
                    : (typeof notFoundContent === 'function' ? notFoundContent(doClose) : (notFoundContent ?? 'Žádné výsledky'))}
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
                      color: selected ? t.optionSelectedText : t.text,
                      backgroundColor: highlighted
                        ? t.optionHover
                        : selected
                          ? t.optionSelected
                          : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s ease, color 0.12s ease',
                      userSelect: 'none',
                      marginBottom: idx < filteredOptions.length - 1 ? '2px' : 0,
                    }}
                    onClick={() => selectOption(opt.value)}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onMouseLeave={() => setHighlightIndex(-1)}
                  >
                    {renderOption ? (
                      renderOption(opt, highlighted)
                    ) : (
                      <>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {opt.label ?? opt.value}
                        </span>
                        {selected && <CheckIcon size={16} color={t.optionSelectedText} />}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {footer && (
              <div style={{
                borderTop: `1px solid ${t.divider}`,
                padding: '8px 6px',
              }}>
                {typeof footer === 'function' ? footer(doClose) : footer}
              </div>
            )}
          </div>,
          document.body
        )
      : null;

    return (
      <div
        style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
        className={className}
      >
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}

        <div ref={triggerRef} style={triggerStyle} onClick={() => inputRef.current?.focus()}>
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: t.placeholder }}>
            {loading ? <Spinner size={sc.iconSize} color={t.placeholder} /> : <MagnifyingGlassIcon size={sc.iconSize} color={t.placeholder} />}
          </span>

          {/* Scrollable tags + input area */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'nowrap', gap: '4px', alignItems: 'center', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none' }}>
            {/* Multi-select tags */}
            {multiple && selectedValues.map((v) => (
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
                      removeTag(v);
                    }}
                  >
                    <XIcon size={14} color={t.tagText} />
                  </span>
                )}
              </span>
            ))}

            <input
              ref={(node) => {
                (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }}
              id={inputId}
              type="text"
              value={inputValue}
              onChange={handleInputChangeInternal}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={multiple && selectedValues.length > 0 ? '' : placeholder}
              disabled={disabled}
              readOnly={loading}
              style={nativeStyle}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {showClear && selectedValues.length > 0 && (
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
            <CaretDownIcon
              size={sc.iconSize}
              color={t.placeholder}
              style={{
                transition: 'transform 0.2s ease',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        </div>

        {errorMessage && (
          <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.borderError, lineHeight: 'normal' }}>
            {errorMessage}
          </span>
        )}

        {dropdown}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';
