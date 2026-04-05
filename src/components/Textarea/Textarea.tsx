import React, { useId, useState } from 'react';
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
    counter: '#ACACAC',
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
    counter: '#888888',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '6px 10px', fontSize: '14px' },
  md: { padding: '8px 12px', fontSize: '16px' },
  lg: { padding: '10px 14px', fontSize: '18px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'both';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * Popisek zobrazený nad textovým polem.
   * Stylizován velkými písmeny dle SM-UI design systému.
   */
  label?: string;
  /**
   * Při `true` se pole zobrazí jako nevalidní (červený okraj).
   * Při zadání řetězce se pod polem zobrazí chybová zpráva.
   */
  error?: boolean | string;
  /** Nápovědný text zobrazený pod polem. */
  helperText?: string;
  /** Při `true` se pole zobrazí jako neaktivní. */
  disabled?: boolean;
  /**
   * Při `true` se pole zobrazí pouze pro čtení se sníženou opacitou.
   */
  loading?: boolean;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: TextareaSize;
  /**
   * Roztáhne pole na celou šířku kontejneru.
   * @default false
   */
  fullWidth?: boolean;
  /** Povinné pole — zobrazí hvězdičku u popisku. */
  required?: boolean;
  /**
   * Počet řádků.
   * @default 4
   */
  rows?: number;
  /**
   * Maximální počet znaků. Při zadání se zobrazí počítadlo.
   */
  maxLength?: number;
  /**
   * Režim změny velikosti textového pole.
   * @default 'vertical'
   */
  resize?: TextareaResize;
  /** Dodatečná CSS třída pro obalový element. */
  className?: string;
  /**
   * Další inline styly pro **obalový** element.
   */
  style?: React.CSSProperties;
}

// ─── Textarea ────────────────────────────────────────────────────────────────

/**
 * Víceřádkové textové pole dle SM-UI design systému.
 *
 * Sdílí API s komponentou `Input` — podporuje popisek, chybový stav,
 * nápovědný text, počítadlo znaků a velikostní presety.
 *
 * @example
 * ```tsx
 * <Textarea label="Poznámka" placeholder="Napište poznámku…" rows={5} />
 * <Textarea label="Bio" maxLength={200} helperText="Krátký popis" />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      disabled,
      loading = false,
      size = 'md',
      fullWidth = false,
      required,
      rows = 4,
      maxLength,
      resize = 'vertical',
      className,
      style,
      value,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const t = tokens[theme];
    const sc = sizeConfig[size];
    const autoId = useId();
    const textareaId = rest.id ?? autoId;
    const [focused, setFocused] = useState(false);

    const isDisabled = disabled || loading;
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    const currentLength = typeof value === 'string' ? value.length : 0;

    const wrapperStyle: React.CSSProperties = {
      backgroundColor: isDisabled ? t.backgroundDisabled : t.background,
      border: `1px solid ${hasError ? t.borderError : focused ? t.borderFocus : t.border}`,
      borderRadius: '8px',
      padding: sc.padding,
      boxSizing: 'border-box',
      transition: 'border-color 0.15s ease',
      opacity: isDisabled ? 0.6 : 1,
      cursor: isDisabled ? 'not-allowed' : 'text',
    };

    const nativeStyle: React.CSSProperties = {
      width: '100%',
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: "'Zalando Sans', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: sc.fontSize,
      lineHeight: '1.5',
      color: t.text,
      cursor: isDisabled ? 'not-allowed' : 'text',
      resize,
      boxSizing: 'border-box',
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

    const bottomTextStyle: React.CSSProperties = {
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: '12px',
      lineHeight: 'normal',
    };

    return (
      <div
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          width: fullWidth ? '100%' : undefined,
          ...style,
        }}
        className={className}
      >
        {label && (
          <label htmlFor={textareaId} style={labelStyle}>
            {label}
            {required && <span style={{ color: t.borderError, marginLeft: '3px' }}>*</span>}
          </label>
        )}

        <div style={wrapperStyle}>
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            readOnly={loading || rest.readOnly}
            value={value}
            onChange={onChange}
            style={nativeStyle}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            {...rest}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {errorMessage && (
              <span style={{ ...bottomTextStyle, color: t.borderError }}>
                {errorMessage}
              </span>
            )}
            {!errorMessage && helperText && (
              <span style={{ ...bottomTextStyle, color: t.helperText }}>
                {helperText}
              </span>
            )}
          </div>
          {maxLength !== undefined && (
            <span style={{ ...bottomTextStyle, color: currentLength > maxLength ? t.borderError : t.counter, flexShrink: 0 }}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
