import React, { useEffect, useId, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    border: 'rgba(255,255,255,0.3)',
    borderHover: 'rgba(255,255,255,0.5)',
    borderError: '#EF3838',
    background: 'rgba(3,3,3,0.75)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    text: '#ffffff',
    label: '#ffffff',
    helperText: '#ACACAC',
    checkBg: '#FC4F00',
    checkMark: '#ffffff',
  },
  light: {
    border: 'rgba(0,0,0,0.2)',
    borderHover: 'rgba(0,0,0,0.5)',
    borderError: '#EF3838',
    background: 'rgba(255,255,255,0.85)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    text: '#1a1a1a',
    label: '#1a1a1a',
    helperText: '#888888',
    checkBg: '#FC4F00',
    checkMark: '#ffffff',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { box: 16, fontSize: '14px', gap: '6px', radius: 3, strokeWidth: 2 },
  md: { box: 20, fontSize: '16px', gap: '8px', radius: 4, strokeWidth: 2 },
  lg: { box: 24, fontSize: '18px', gap: '10px', radius: 5, strokeWidth: 2.5 },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  /** Stav zaškrtnutí. */
  checked?: boolean;
  /** Callback volaný při změně stavu. */
  onChange?: (checked: boolean) => void;
  /** Textový popisek zobrazený vedle zaškrtávacího pole. */
  label?: string;
  /** Deaktivuje zaškrtávací pole. */
  disabled?: boolean;
  /**
   * Chybový stav. Při `true` se zobrazí červený okraj.
   * Při zadání řetězce se pod polem zobrazí chybová zpráva.
   */
  error?: boolean | string;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: CheckboxSize;
  /** Neurčitý stav — zobrazí pomlčku místo zaškrtnutí. */
  indeterminate?: boolean;
  /** Dodatečná CSS třída pro obalový element. */
  className?: string;
  /** Další inline styly pro obalový element. */
  style?: React.CSSProperties;
}

export interface CheckboxGroupProps {
  /** Popisek skupiny. */
  label?: string;
  /** Potomci — typicky komponenty `<Checkbox>`. */
  children: React.ReactNode;
  /** Chybový stav skupiny. Při řetězci se zobrazí chybová zpráva. */
  error?: boolean | string;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

/**
 * Zaškrtávací pole dle SM-UI design systému.
 *
 * Podporuje vlastní SVG zaškrtnutí, neurčitý stav,
 * chybový stav, velikostní presety a tmavý / světlý režim.
 *
 * @example
 * ```tsx
 * <Checkbox label="Souhlasím s podmínkami" checked={agreed} onChange={setAgreed} />
 * <Checkbox indeterminate label="Vybrat vše" />
 * ```
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  error,
  size = 'md',
  indeterminate = false,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const borderColor = hasError ? t.borderError : checked || indeterminate ? t.checkBg : t.border;
  const bg = checked || indeterminate ? t.checkBg : disabled ? t.backgroundDisabled : t.background;

  const boxStyle: React.CSSProperties = {
    width: sc.box,
    height: sc.box,
    borderRadius: sc.radius,
    border: `1.5px solid ${borderColor}`,
    backgroundColor: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: sc.fontSize,
    color: t.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    lineHeight: 'normal',
  };

  const bottomTextStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '12px',
    lineHeight: 'normal',
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        ...style,
      }}
      className={className}
    >
      <label
        htmlFor={id}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: sc.gap,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.(!checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
          aria-invalid={hasError || undefined}
        />
        <span style={boxStyle}>
          {checked && !indeterminate && (
            <svg width={sc.box - 6} height={sc.box - 6} viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke={t.checkMark}
                strokeWidth={sc.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {indeterminate && (
            <svg width={sc.box - 6} height={sc.box - 6} viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6h7"
                stroke={t.checkMark}
                strokeWidth={sc.strokeWidth}
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
        {label && <span style={labelStyle}>{label}</span>}
      </label>

      {errorMessage && (
        <span style={{ ...bottomTextStyle, color: t.borderError, marginLeft: `${sc.box + parseInt(sc.gap)}px` }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};

Checkbox.displayName = 'Checkbox';

// ─── CheckboxGroup ───────────────────────────────────────────────────────────

/**
 * Skupina zaškrtávacích polí s volitelným popiskem.
 *
 * @example
 * ```tsx
 * <CheckboxGroup label="Zájmy">
 *   <Checkbox label="Sport" checked={...} onChange={...} />
 *   <Checkbox label="Hudba" checked={...} onChange={...} />
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  children,
  error,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const errorMessage = typeof error === 'string' ? error : undefined;

  const groupLabelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: t.label,
    userSelect: 'none',
  };

  const bottomTextStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '12px',
    lineHeight: 'normal',
  };

  return (
    <div
      role="group"
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...style,
      }}
      className={className}
    >
      {label && <span style={groupLabelStyle}>{label}</span>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {children}
      </div>
      {errorMessage && (
        <span style={{ ...bottomTextStyle, color: t.borderError }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';
