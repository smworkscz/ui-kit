import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Minus as MinusIcon, Plus as PlusIcon, CaretUp as CaretUpIcon, CaretDown as CaretDownIcon } from '@phosphor-icons/react';
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
    buttonBg: 'rgba(255,255,255,0.06)',
    buttonHoverBg: 'rgba(255,255,255,0.12)',
    buttonText: '#ffffff',
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
    buttonBg: 'rgba(0,0,0,0.04)',
    buttonHoverBg: 'rgba(0,0,0,0.08)',
    buttonText: '#1a1a1a',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '6px 10px', fontSize: '14px', iconSize: 14, height: '32px', buttonPadding: '6px' },
  md: { padding: '8px 12px', fontSize: '16px', iconSize: 16, height: '40px', buttonPadding: '8px' },
  lg: { padding: '10px 14px', fontSize: '18px', iconSize: 18, height: '48px', buttonPadding: '10px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type NumberInputSize = 'sm' | 'md' | 'lg';
export type NumberInputVariant = 'default' | 'compact';

export interface NumberInputProps {
  /** Aktuální numerická hodnota. */
  value: number;
  /** Callback volaný při změně hodnoty. */
  onChange: (value: number) => void;
  /** Minimální povolená hodnota. */
  min?: number;
  /** Maximální povolená hodnota. */
  max?: number;
  /** Krok inkrementace / dekrementace. @default 1 */
  step?: number;
  /** Popisek zobrazený nad polem. Stylizován velkými písmeny dle SM-UI design systému. */
  label?: string;
  /** Při `true` se pole zobrazí jako nevalidní. Při zadání řetězce se zobrazí chybová zpráva. */
  error?: boolean | string;
  /** Zakáže celé pole včetně tlačítek. */
  disabled?: boolean;
  /**
   * Velikostní preset.
   * - `'sm'` -- kompaktní
   * - `'md'` -- výchozí
   * - `'lg'` -- velký
   * @default 'md'
   */
  size?: NumberInputSize;
  /**
   * Varianta rozložení.
   * - `'default'` -- tlačítka −/+ po stranách
   * - `'compact'` -- šipky nahoru/dolů vpravo uvnitř pole
   * @default 'default'
   */
  variant?: NumberInputVariant;
  /** Text zobrazený před hodnotou (např. měna). */
  prefix?: string;
  /** Text zobrazený za hodnotou (např. jednotka). */
  suffix?: string;
  /** Další inline styly pro obalový `<div>`. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obalový `<div>`. */
  className?: string;
}

// ─── NumberInput ─────────────────────────────────────────────────────────────

/**
 * Numerické vstupní pole s tlačítky +/− dle SM-UI design systému.
 *
 * Podržením tlačítka se hodnota plynule inkrementuje / dekrementuje.
 * Hodnota je automaticky omezena na rozsah `min`–`max`.
 *
 * @example
 * ```tsx
 * <NumberInput value={count} onChange={setCount} min={0} max={100} step={5} />
 * <NumberInput value={price} onChange={setPrice} prefix="$" suffix="USD" />
 * ```
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      label,
      error,
      disabled = false,
      size = 'md',
      variant = 'default',
      prefix,
      suffix,
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
    const [focused, setFocused] = useState(false);
    const [hoveredBtn, setHoveredBtn] = useState<'minus' | 'plus' | 'up' | 'down' | null>(null);

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // ── Clamp helper ────────────────────────────────────────────────────

    const clamp = useCallback(
      (v: number): number => {
        let result = v;
        if (min !== undefined && result < min) result = min;
        if (max !== undefined && result > max) result = max;
        return result;
      },
      [min, max]
    );

    // ── Increment / Decrement ───────────────────────────────────────────

    const increment = useCallback(() => {
      onChange(clamp(value + step));
    }, [value, step, onChange, clamp]);

    const decrement = useCallback(() => {
      onChange(clamp(value - step));
    }, [value, step, onChange, clamp]);

    // ── Hold to repeat ──────────────────────────────────────────────────

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startHold = useCallback(
      (action: () => void) => {
        if (disabled) return;
        action();
        timeoutRef.current = setTimeout(() => {
          intervalRef.current = setInterval(action, 80);
        }, 400);
      },
      [disabled]
    );

    const stopHold = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    useEffect(() => {
      return () => stopHold();
    }, [stopHold]);

    // ── Direct input handling ───────────────────────────────────────────

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === '' || raw === '-') return;
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        onChange(clamp(parsed));
      }
    };

    const handleBlur = () => {
      setFocused(false);
      onChange(clamp(value));
    };

    // ── Can increment / decrement ───────────────────────────────────────

    const canDecrement = min === undefined || value > min;
    const canIncrement = max === undefined || value < max;

    // ── Styles ───────────────────────────────────────────────────────────

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
      height: sc.height,
    };

    const buttonStyle = (side: 'minus' | 'plus', canClick: boolean): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: sc.buttonPadding,
      border: 'none',
      background: hoveredBtn === side && canClick && !disabled ? t.buttonHoverBg : t.buttonBg,
      color: canClick && !disabled ? t.buttonText : t.placeholder,
      cursor: disabled || !canClick ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      transition: 'background-color 0.12s ease',
      height: '100%',
      minWidth: sc.height,
      userSelect: 'none',
    });

    const nativeStyle: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: "'Zalando Sans', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: sc.fontSize,
      lineHeight: 'normal',
      color: t.text,
      textAlign: 'center',
      cursor: disabled ? 'not-allowed' : 'text',
      MozAppearance: 'textfield',
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

    const affixStyle: React.CSSProperties = {
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: sc.fontSize,
      color: t.placeholder,
      flexShrink: 0,
      userSelect: 'none',
      lineHeight: 'normal',
    };

    // ── Compact chevron button style ──────────────────────────────────

    const chevronBtnStyle = (side: 'up' | 'down', canClick: boolean): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      background: hoveredBtn === side && canClick && !disabled ? t.buttonHoverBg : 'transparent',
      color: canClick && !disabled ? t.buttonText : t.placeholder,
      cursor: disabled || !canClick ? 'not-allowed' : 'pointer',
      padding: '0 6px',
      height: '14px',
      flexShrink: 0,
      transition: 'background-color 0.12s ease',
      userSelect: 'none',
      borderRadius: '2px',
    });

    if (variant === 'compact') {
      return (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            gap: '6px',
            ...style,
          }}
          className={className}
        >
          {label && (
            <label htmlFor={inputId} style={labelStyle}>
              {label}
            </label>
          )}

          <div style={wrapperStyle}>
            {/* Input area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: sc.padding, minWidth: 0 }}>
              {prefix && <span style={affixStyle}>{prefix}</span>}
              <input
                ref={ref}
                id={inputId}
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
                disabled={disabled}
                style={{ ...nativeStyle, textAlign: 'left' }}
              />
              {suffix && <span style={affixStyle}>{suffix}</span>}
            </div>

            {/* Compact chevron buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderLeft: `1px solid ${hasError ? t.borderError : focused ? t.borderFocus : t.border}`,
              transition: 'border-color 0.15s ease',
            }}>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Zvýšit hodnotu"
                disabled={disabled || !canIncrement}
                style={chevronBtnStyle('up', canIncrement)}
                onMouseDown={() => startHold(increment)}
                onMouseUp={stopHold}
                onMouseLeave={() => { stopHold(); setHoveredBtn(null); }}
                onMouseEnter={() => setHoveredBtn('up')}
              >
                <CaretUpIcon size={10} weight="bold" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Snížit hodnotu"
                disabled={disabled || !canDecrement}
                style={chevronBtnStyle('down', canDecrement)}
                onMouseDown={() => startHold(decrement)}
                onMouseUp={stopHold}
                onMouseLeave={() => { stopHold(); setHoveredBtn(null); }}
                onMouseEnter={() => setHoveredBtn('down')}
              >
                <CaretDownIcon size={10} weight="bold" />
              </button>
            </div>
          </div>

          {errorMessage && (
            <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.borderError, lineHeight: 'normal' }}>
              {errorMessage}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          ...style,
        }}
        className={className}
      >
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}

        <div style={wrapperStyle}>
          {/* Minus button */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Snížit hodnotu"
            disabled={disabled || !canDecrement}
            style={buttonStyle('minus', canDecrement)}
            onMouseDown={() => startHold(decrement)}
            onMouseUp={stopHold}
            onMouseLeave={() => {
              stopHold();
              setHoveredBtn(null);
            }}
            onMouseEnter={() => setHoveredBtn('minus')}
          >
            <MinusIcon size={sc.iconSize} />
          </button>

          {/* Input area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0 4px', minWidth: 0 }}>
            {prefix && <span style={affixStyle}>{prefix}</span>}
            <input
              ref={ref}
              id={inputId}
              type="text"
              inputMode="numeric"
              value={value}
              onChange={handleInputChange}
              onFocus={() => setFocused(true)}
              onBlur={handleBlur}
              disabled={disabled}
              style={nativeStyle}
            />
            {suffix && <span style={affixStyle}>{suffix}</span>}
          </div>

          {/* Plus button */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Zvýšit hodnotu"
            disabled={disabled || !canIncrement}
            style={buttonStyle('plus', canIncrement)}
            onMouseDown={() => startHold(increment)}
            onMouseUp={stopHold}
            onMouseLeave={() => {
              stopHold();
              setHoveredBtn(null);
            }}
            onMouseEnter={() => setHoveredBtn('plus')}
          >
            <PlusIcon size={sc.iconSize} />
          </button>
        </div>

        {errorMessage && (
          <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.borderError, lineHeight: 'normal' }}>
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
