import React, { useState, useRef, useEffect, useCallback, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';
import { CaretDown as CaretDownIcon, MagnifyingGlass as SearchIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

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
    helperText: '#ACACAC',
    divider: 'rgba(255,255,255,0.15)',
    dropdownBg: 'rgba(24,24,24,0.95)',
    dropdownBorder: 'rgba(255,255,255,0.12)',
    optionHover: 'rgba(255,255,255,0.06)',
    optionSelected: 'rgba(232,97,45,0.12)',
    optionSelectedText: '#E8612D',
    shadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
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
    helperText: '#888888',
    divider: 'rgba(0,0,0,0.1)',
    dropdownBg: 'rgba(255,255,255,0.95)',
    dropdownBorder: 'rgba(0,0,0,0.1)',
    optionHover: 'rgba(0,0,0,0.04)',
    optionSelected: 'rgba(232,97,45,0.08)',
    optionSelectedText: '#E8612D',
    shadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset',
  },
} as const;

const ANIM_DURATION = 180;

const sizeConfig = {
  sm: { padding: '6px 10px', fontSize: '14px', iconSize: 14, gap: '8px', height: '32px' },
  md: { padding: '8px 12px', fontSize: '16px', iconSize: 16, gap: '10px', height: '38px' },
  lg: { padding: '10px 14px', fontSize: '18px', iconSize: 18, gap: '12px', height: '44px' },
} as const;

// ─── Country data ────────────────────────────────────────────────────────────

export interface Country {
  /** ISO 3166-1 alpha-2 kód. */
  code: string;
  /** Název země. */
  name: string;
  /** Předvolba. */
  dialCode: string;
  /** Vlaječka emoji. */
  flag: string;
}

const DEFAULT_COUNTRIES: Country[] = [
  { code: 'CZ', name: 'Česko', dialCode: '+420', flag: '🇨🇿' },
  { code: 'SK', name: 'Slovensko', dialCode: '+421', flag: '🇸🇰' },
  { code: 'DE', name: 'Německo', dialCode: '+49', flag: '🇩🇪' },
  { code: 'AT', name: 'Rakousko', dialCode: '+43', flag: '🇦🇹' },
  { code: 'PL', name: 'Polsko', dialCode: '+48', flag: '🇵🇱' },
  { code: 'HU', name: 'Maďarsko', dialCode: '+36', flag: '🇭🇺' },
  { code: 'GB', name: 'Velká Británie', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'USA', dialCode: '+1', flag: '🇺🇸' },
  { code: 'FR', name: 'Francie', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Itálie', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Španělsko', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Nizozemsko', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgie', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Švýcarsko', dialCode: '+41', flag: '🇨🇭' },
  { code: 'SE', name: 'Švédsko', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norsko', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Dánsko', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finsko', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PT', name: 'Portugalsko', dialCode: '+351', flag: '🇵🇹' },
  { code: 'IE', name: 'Irsko', dialCode: '+353', flag: '🇮🇪' },
  { code: 'RO', name: 'Rumunsko', dialCode: '+40', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulharsko', dialCode: '+359', flag: '🇧🇬' },
  { code: 'HR', name: 'Chorvatsko', dialCode: '+385', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovinsko', dialCode: '+386', flag: '🇸🇮' },
  { code: 'UA', name: 'Ukrajina', dialCode: '+380', flag: '🇺🇦' },
  { code: 'RU', name: 'Rusko', dialCode: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turecko', dialCode: '+90', flag: '🇹🇷' },
  { code: 'JP', name: 'Japonsko', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'Čína', dialCode: '+86', flag: '🇨🇳' },
  { code: 'AU', name: 'Austrálie', dialCode: '+61', flag: '🇦🇺' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

export type PhoneInputSize = 'sm' | 'md' | 'lg';

export interface PhoneInputProps {
  /** Plná mezinárodní hodnota, např. "+420123456789". */
  value?: string;
  /** Callback s plnou mezinárodní hodnotou. */
  onChange?: (value: string) => void;
  /** Výchozí kód země. @default 'CZ' */
  defaultCountry?: string;
  /** Vlastní seznam zemí. */
  countries?: Country[];
  /** Popisek. */
  label?: string;
  /** Chybový stav nebo zpráva. */
  error?: boolean | string;
  /** Nápovědný text. */
  helperText?: string;
  /** Zakáže komponentu. @default false */
  disabled?: boolean;
  /** Velikost. @default 'md' */
  size?: PhoneInputSize;
  /** Placeholder pro číslo. */
  placeholder?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findCountryByDialCode(phone: string, countries: Country[]): Country | undefined {
  // Sort by dial code length descending for longest prefix match
  const sorted = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
  return sorted.find((c) => phone.startsWith(c.dialCode));
}

// ─── PhoneInput ──────────────────────────────────────────────────────────────

/**
 * Telefonní vstup s výběrem předvolby země.
 *
 * Obsahuje rozbalovací seznam zemí s vlajkami a předvolbami.
 * Hodnota je plné mezinárodní číslo (např. "+420123456789").
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   value={phone}
 *   onChange={setPhone}
 *   defaultCountry="CZ"
 *   label="Telefon"
 * />
 * ```
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  defaultCountry = 'CZ',
  countries: countriesProp,
  label,
  error,
  helperText,
  disabled = false,
  size = 'md',
  placeholder = '123 456 789',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];
  const autoId = useId();
  const countries = countriesProp || DEFAULT_COUNTRIES;

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; openAbove: boolean }>({ top: 0, left: 0, width: 0, openAbove: false });

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // ── Country / number parsing ────────────────────────────────────────────

  const selectedCountry = useMemo(() => {
    if (value) {
      const found = findCountryByDialCode(value, countries);
      if (found) return found;
    }
    return countries.find((c) => c.code === defaultCountry) || countries[0];
  }, [value, countries, defaultCountry]);

  const localNumber = useMemo(() => {
    if (!value || !selectedCountry) return '';
    if (value.startsWith(selectedCountry.dialCode)) {
      return value.slice(selectedCountry.dialCode.length);
    }
    return value.replace(/^\+\d+/, '');
  }, [value, selectedCountry]);

  // ── Filtered countries ──────────────────────────────────────────────────

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  }, [countries, search]);

  // ── Open / close ────────────────────────────────────────────────────────

  const doOpen = useCallback(() => {
    setOpen(true);
    setVisible(true);
    setAnimState('opening');
    setSearch('');
    setHighlightIndex(-1);
    const timer = setTimeout(() => {
      setAnimState('open');
      searchRef.current?.focus();
    }, 10);
    return () => clearTimeout(timer);
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

  // ── Position ────────────────────────────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.offsetHeight ?? 300;
    const spaceBelow = window.innerHeight - rect.bottom - 6;
    const spaceAbove = rect.top - 6;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    setDropdownPos({
      top: openAbove ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 280),
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

  // ── Outside click ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        doClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, doClose]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const selectCountry = useCallback((country: Country) => {
    const newValue = country.dialCode + localNumber;
    onChange?.(newValue);
    doClose();
    inputRef.current?.focus();
  }, [localNumber, onChange, doClose]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/[^0-9\s]/g, '');
    onChange?.(selectedCountry.dialCode + num);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').trim();
    if (pasted.startsWith('+')) {
      e.preventDefault();
      onChange?.(pasted.replace(/[^0-9+]/g, ''));
    }
  };

  // ── Keyboard in dropdown ────────────────────────────────────────────────

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, filteredCountries.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && filteredCountries[highlightIndex]) {
          selectCountry(filteredCountries[highlightIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        doClose();
        inputRef.current?.focus();
        break;
    }
  };

  // ── Animation styles ────────────────────────────────────────────────────

  const getDropdownAnimStyle = (): React.CSSProperties => {
    const above = dropdownPos.openAbove;
    const slideIn = above ? 'translateY(8px)' : 'translateY(-8px)';
    const slideOut = above ? 'translateY(6px)' : 'translateY(-6px)';
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    if (animState === 'opening' || animState === 'idle') return { ...base, opacity: 0, transform: `${slideIn} scale(0.97)` };
    if (animState === 'open') return { ...base, opacity: 1, transform: 'translateY(0) scale(1)' };
    return { ...base, opacity: 0, transform: `${slideOut} scale(0.98)`, pointerEvents: 'none' };
  };

  // ── Styles ──────────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: t.label,
    userSelect: 'none',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: disabled ? t.backgroundDisabled : t.background,
    border: `1px solid ${hasError ? t.borderError : focused ? t.borderFocus : t.border}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
    opacity: disabled ? 0.6 : 1,
    overflow: 'hidden',
  };

  // ── Dropdown ────────────────────────────────────────────────────────────

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
            boxShadow: t.shadow,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            overflow: 'hidden',
            boxSizing: 'border-box',
            transformOrigin: dropdownPos.openAbove ? 'bottom center' : 'top center',
            ...getDropdownAnimStyle(),
          }}
          onKeyDown={handleDropdownKeyDown}
        >
          {/* Search */}
          <div style={{ padding: '8px', borderBottom: `1px solid ${t.divider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
              <SearchIcon size={14} color={t.placeholder} />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setHighlightIndex(0); }}
                placeholder="Hledat..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '13px',
                  color: t.text,
                }}
              />
            </div>
          </div>
          {/* Country list */}
          <div style={{ maxHeight: 240, overflowY: 'auto', padding: '4px' }}>
            {filteredCountries.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: t.placeholder, fontFamily: "'Zalando Sans', sans-serif" }}>
                Žádné výsledky
              </div>
            )}
            {filteredCountries.map((country, idx) => {
              const isSelected = country.code === selectedCountry.code;
              const isHighlighted = idx === highlightIndex;
              return (
                <div
                  key={country.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: isHighlighted ? t.optionHover : isSelected ? t.optionSelected : 'transparent',
                    transition: 'background-color 0.12s ease',
                    marginBottom: '1px',
                  }}
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  onMouseLeave={() => setHighlightIndex(-1)}
                >
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{country.flag}</span>
                  <span style={{ flex: 1, fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', color: isSelected ? t.optionSelectedText : t.text, fontWeight: isSelected ? 500 : 400 }}>
                    {country.name}
                  </span>
                  <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '13px', color: t.placeholder, flexShrink: 0 }}>
                    {country.dialCode}
                  </span>
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
      className={className}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
    >
      {label && <label htmlFor={autoId} style={labelStyle}>{label}</label>}

      <div ref={triggerRef} style={wrapperStyle}>
        {/* Country selector */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => { if (!disabled) { open ? doClose() : doOpen(); } }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: sc.padding,
            paddingRight: '8px',
            border: 'none',
            background: 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: sc.fontSize,
            color: t.text,
            flexShrink: 0,
            outline: 'none',
          }}
        >
          <span style={{ fontSize: size === 'sm' ? '14px' : '18px' }}>{selectedCountry.flag}</span>
          <span style={{ fontSize: '13px', color: t.placeholder }}>{selectedCountry.dialCode}</span>
          <CaretDownIcon
            size={12}
            color={t.placeholder}
            style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '60%', backgroundColor: t.divider, flexShrink: 0 }} />

        {/* Phone input */}
        <input
          ref={inputRef}
          id={autoId}
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          onPaste={handlePaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: sc.fontSize,
            color: t.text,
            padding: sc.padding,
            paddingLeft: '8px',
          }}
        />
      </div>

      {errorMessage && (
        <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.borderError, lineHeight: 'normal' }}>
          {errorMessage}
        </span>
      )}
      {!errorMessage && helperText && (
        <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.helperText, lineHeight: 'normal' }}>
          {helperText}
        </span>
      )}

      {dropdown}
    </div>
  );
};

PhoneInput.displayName = 'PhoneInput';
