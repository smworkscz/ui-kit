import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    backgroundFilled: 'rgba(3,3,3,0.85)',
    border: 'rgba(255,255,255,0.3)',
    borderFocus: 'rgba(255,255,255,0.7)',
    borderError: '#EF3838',
    borderFilled: 'rgba(255,255,255,0.5)',
    text: '#ffffff',
    label: '#ffffff',
    caret: '#FC4F00',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    backgroundFilled: 'rgba(255,255,255,0.95)',
    border: 'rgba(0,0,0,0.2)',
    borderFocus: 'rgba(0,0,0,0.6)',
    borderError: '#EF3838',
    borderFilled: 'rgba(0,0,0,0.35)',
    text: '#1a1a1a',
    label: '#1a1a1a',
    caret: '#FC4F00',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OTPInputProps {
  /** Počet polí (číslic). @default 6 */
  length?: number;
  /** Aktuální hodnota jako řetězec číslic. */
  value: string;
  /** Callback volaný při změně hodnoty. */
  onChange: (value: string) => void;
  /** Při `true` se pole zobrazí jako nevalidní. Při zadání řetězce se zobrazí chybová zpráva. */
  error?: boolean | string;
  /** Zakáže celou komponentu. */
  disabled?: boolean;
  /** Automaticky zaměří první pole při renderování. @default false */
  autoFocus?: boolean;
  /** Popisek zobrazený nad komponentou. Stylizován velkými písmeny dle SM-UI design systému. */
  label?: string;
  /** Vloží oddělovač po každých N polích. Např. `separatorAfter={3}` u 6místného kódu vytvoří skupiny 3-3. */
  separatorAfter?: number;
  /** Obsah oddělovače. @default '-' */
  separator?: React.ReactNode;
  /** Další inline styly pro obalový `<div>`. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obalový `<div>`. */
  className?: string;
}

// ─── OTPInput ────────────────────────────────────────────────────────────────

/**
 * Pole pro zadání jednorázového kódu (OTP) dle SM-UI design systému.
 *
 * Každá číslice má vlastní pole. Automaticky přesouvá fokus
 * na další pole při zadání a na předchozí při smazání.
 * Podporuje vložení celého kódu ze schránky.
 *
 * @example
 * ```tsx
 * <OTPInput value={otp} onChange={setOtp} autoFocus />
 * <OTPInput value={otp} onChange={setOtp} length={4} error="Neplatný kód" />
 * ```
 */
export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = false,
  label,
  separatorAfter,
  separator = '-',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const autoId = useId();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // ── Pad value to length ────────────────────────────────────────────

  const digits = value.padEnd(length, '').slice(0, length).split('');

  // ── Auto-focus first input ─────────────────────────────────────────

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  // ── Handlers ───────────────────────────────────────────────────────

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
    }
  }, [length]);

  const updateValue = useCallback(
    (newDigits: string[]) => {
      const newValue = newDigits.join('').replace(/[^0-9]/g, '');
      onChange(newValue);
    },
    [onChange]
  );

  const handleInput = useCallback(
    (index: number, char: string) => {
      if (!/^[0-9]$/.test(char)) return;

      const newDigits = [...digits];
      newDigits[index] = char;
      updateValue(newDigits);

      // Auto-focus next
      if (index < length - 1) {
        focusInput(index + 1);
      }
    },
    [digits, length, updateValue, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Backspace':
          e.preventDefault();
          if (digits[index]) {
            // Clear current
            const newDigits = [...digits];
            newDigits[index] = '';
            updateValue(newDigits);
          } else if (index > 0) {
            // Move to previous and clear
            const newDigits = [...digits];
            newDigits[index - 1] = '';
            updateValue(newDigits);
            focusInput(index - 1);
          }
          break;
        case 'Delete':
          e.preventDefault();
          {
            const newDigits = [...digits];
            newDigits[index] = '';
            updateValue(newDigits);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (index > 0) focusInput(index - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (index < length - 1) focusInput(index + 1);
          break;
      }
    },
    [digits, length, updateValue, focusInput]
  );

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;
      // Take the last character typed (handles overwrite)
      const char = inputVal.slice(-1);
      if (char && /^[0-9]$/.test(char)) {
        handleInput(index, char);
      }
    },
    [handleInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
      if (!pasted) return;

      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      updateValue(newDigits);

      // Focus the next empty or last field
      const nextIndex = Math.min(pasted.length, length - 1);
      focusInput(nextIndex);
    },
    [digits, length, updateValue, focusInput]
  );

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    // Select content on focus
    inputsRef.current[index]?.select();
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  // ── Styles ─────────────────────────────────────────────────────────

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

  const getBoxStyle = (index: number): React.CSSProperties => {
    const isFocused = focusedIndex === index;
    const hasDig = !!digits[index];

    return {
      width: '44px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Zalando Sans', sans-serif",
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: 'normal',
      color: t.text,
      textAlign: 'center',
      backgroundColor: disabled
        ? t.backgroundDisabled
        : hasDig
          ? t.backgroundFilled
          : t.background,
      border: `1px solid ${
        hasError
          ? t.borderError
          : isFocused
            ? t.borderFocus
            : hasDig
              ? t.borderFilled
              : t.border
      }`,
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.15s ease, background-color 0.15s ease',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
      caretColor: t.caret,
    };
  };

  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
      className={className}
    >
      {label && (
        <label htmlFor={`${autoId}-0`} style={labelStyle}>
          {label}
        </label>
      )}

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onPaste={handlePaste}>
        {Array.from({ length }, (_, i) => (
          <React.Fragment key={i}>
            {separatorAfter && i > 0 && i % separatorAfter === 0 && (
              <span
                style={{
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '20px',
                  fontWeight: 500,
                  color: t.text,
                  userSelect: 'none',
                  lineHeight: 'normal',
                  opacity: disabled ? 0.6 : 0.5,
                  padding: '0 2px',
                }}
              >
                {separator}
              </span>
            )}
            <input
              ref={(el) => { inputsRef.current[i] = el; }}
              id={`${autoId}-${i}`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={2}
              value={digits[i] || ''}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => handleFocus(i)}
              onBlur={handleBlur}
              disabled={disabled}
              aria-label={`Číslice ${i + 1} z ${length}`}
              style={getBoxStyle(i)}
            />
          </React.Fragment>
        ))}
      </div>

      {errorMessage && (
        <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.borderError, lineHeight: 'normal' }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};

OTPInput.displayName = 'OTPInput';
