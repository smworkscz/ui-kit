import React, { useEffect, useId, useRef, useState } from 'react';
import { X as XIcon, Eye as EyeIcon, EyeSlash as EyeSlashIcon } from '@phosphor-icons/react';
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
    helperText: '#ACACAC',
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
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '6px 10px', fontSize: '14px', iconSize: 14, gap: '8px' },
  md: { padding: '8px 12px', fontSize: '16px', iconSize: 16, gap: '10px' },
  lg: { padding: '10px 14px', fontSize: '18px', iconSize: 18, gap: '12px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Popisek zobrazený nad vstupním polem.
   * Stylizován velkými písmeny dle SM-UI design systému.
   * Pokud je `required`, zobrazí se hvězdička.
   */
  label?: string;
  /**
   * Ikona vykreslená uvnitř vstupního pole.
   * Typicky SVG nebo komponenta ikony.
   */
  icon?: React.ReactNode;
  /**
   * Na které straně se ikona zobrazí.
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Při `true` se pole zobrazí jako nevalidní (červený okraj).
   * Při zadání řetězce se pod polem zobrazí chybová zpráva.
   */
  error?: boolean | string;
  /**
   * Nápovědný text zobrazený pod vstupním polem.
   * Nezobrazí se pokud je aktivní chybová zpráva.
   */
  helperText?: string;
  /**
   * Při `true` se zobrazí spinner a pole přejde do režimu pouze pro čtení.
   * Vhodné pro asynchronní validaci nebo načítání dat.
   */
  loading?: boolean;
  /**
   * Zobrazí tlačítko pro vymazání obsahu pole (✕).
   * Funguje pouze pokud pole obsahuje hodnotu.
   * @default false
   */
  clearable?: boolean;
  /**
   * Zobrazí tlačítko pro přepínání viditelnosti hesla (oko).
   * Při `type="password"` se aktivuje automaticky.
   * Nastavte na `false` pro vypnutí.
   */
  passwordToggle?: boolean;
  /**
   * Velikostní preset.
   * - `'sm'` — kompaktní (padding 6px, font 14px)
   * - `'md'` — výchozí (padding 8px, font 16px)
   * - `'lg'` — velký (padding 10px, font 18px)
   * @default 'md'
   */
  size?: InputSize;
  /**
   * Roztáhne pole na celou šířku kontejneru.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Další inline styly pro **obalový** `<div>` (ne pro nativní input).
   * Pro stylování nativního `<input>` použijte `inputStyle`.
   */
  style?: React.CSSProperties;
  /**
   * Dodatečná CSS třída pro **obalový** `<div>`.
   */
  className?: string;
  /**
   * Další inline styly aplikované přímo na nativní `<input>` element.
   */
  inputStyle?: React.CSSProperties;
}

export interface InputGroupProps {
  /**
   * Text popisku vykreslený nad vstupním polem.
   * Zobrazuje se velkými písmeny dle SM-UI design systému.
   */
  label: string;
  /**
   * Hodnota `htmlFor` propojující `<label>` s potomkem `<input>`.
   * Automaticky generováno, pokud není zadáno.
   */
  htmlFor?: string;
  /**
   * Vstupní element(y) vykreslené uvnitř skupiny.
   * Při vynechání se vykreslí výchozí `<Input />`.
   */
  children?: React.ReactNode;
  /** Další inline styly pro obalový `<div>`. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obalový `<div>`. */
  className?: string;
}

// ─── Input ───────────────────────────────────────────────────────────────────

/**
 * Řízené / neřízené textové pole dle SM-UI design systému.
 *
 * Podporuje popisek, ikonu, chybový stav, nápovědný text,
 * vymazání hodnoty, velikostní presety a tmavý / světlý režim.
 *
 * Všechny nativní atributy `<input>` (`value`, `onChange`, `onBlur`, `placeholder`,
 * `type`, `autoComplete`, `maxLength`, `readOnly`, `disabled`, …) jsou přesměrovány.
 *
 * @example
 * ```tsx
 * <Input label="E-mail" placeholder="jmeno@priklad.cz" required />
 * <Input icon={<SearchIcon />} placeholder="Hledat…" clearable />
 * <Input error="Toto pole je povinné" value="" />
 * <Input label="Heslo" type="password" helperText="Min. 8 znaků" />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      iconPosition = 'left',
      error,
      helperText,
      loading = false,
      clearable = false,
      passwordToggle,
      size = 'md',
      fullWidth = false,
      style,
      className,
      inputStyle,
      disabled,
      required,
      value,
      onChange,
      onFocus,
      onBlur,
      type,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const t = tokens[theme];
    const autoId = useId();
    const inputId = rest.id ?? autoId;
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isPassword = type === 'password';
    const showPasswordToggle = passwordToggle ?? isPassword;
    const resolvedType = isPassword && passwordVisible ? 'text' : type;

    const isDisabled = disabled || loading;
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const hasValue = value !== undefined && value !== null && value !== '';
    const showClear = clearable && hasValue && !isDisabled && !showPasswordToggle;
    const sc = sizeConfig[size];

    const handleClear = () => {
      if (!onChange) return;
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    };

    // ── Icon slot ────────────────────────────────────────────────────────

    const iconEl = icon ? (
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: t.placeholder,
      }}>
        {icon}
      </span>
    ) : null;

    // ── Right-side slot (loading > password toggle > clear > icon-right)

    const passwordToggleEl = showPasswordToggle && !isDisabled ? (
      <span
        role="button"
        tabIndex={-1}
        aria-label={passwordVisible ? 'Skrýt heslo' : 'Zobrazit heslo'}
        onClick={() => setPasswordVisible((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          color: t.placeholder,
          padding: '2px',
        }}
      >
        {passwordVisible
          ? <EyeSlashIcon color={t.placeholder} size={sc.iconSize} />
          : <EyeIcon color={t.placeholder} size={sc.iconSize} />
        }
      </span>
    ) : null;

    const rightSlot = loading ? (
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: t.placeholder }}>
        <Spinner size={sc.iconSize} color={t.placeholder} />
      </span>
    ) : passwordToggleEl ? passwordToggleEl
    : showClear ? (
      <span
        role="button"
        tabIndex={-1}
        aria-label="Vymazat pole"
        onClick={handleClear}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          color: t.placeholder,
          padding: '2px',
        }}
      >
        <XIcon size={sc.iconSize - 2} color={t.placeholder} />
      </span>
    ) : (iconPosition === 'right' && iconEl) ? iconEl : null;

    const leftSlot = iconPosition === 'left' ? iconEl : null;

    // ── Styles ───────────────────────────────────────────────────────────

    const wrapperStyle: React.CSSProperties = {
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
    };

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
      cursor: isDisabled ? 'not-allowed' : 'text',
      ...inputStyle,
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
          <label htmlFor={inputId} style={labelStyle}>
            {label}
            {required && <span style={{ color: t.borderError, marginLeft: '3px' }}>*</span>}
          </label>
        )}

        <div style={wrapperStyle}>
          {leftSlot}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
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
          {rightSlot}
        </div>

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
    );
  }
);

Input.displayName = 'Input';

// ─── InputGroup ──────────────────────────────────────────────────────────────

/**
 * Obalí `<Input>` (nebo jiný formulářový prvek) skupinou s popiskem.
 * Popisek je stylizován velkými písmeny dle SM-UI design systému.
 *
 * Pro jednoduché případy lze použít přímo `<Input label="..." />`.
 * `InputGroup` je vhodný pro kompozici více prvků pod jedním popiskem.
 *
 * @example
 * ```tsx
 * <InputGroup label="Adresa">
 *   <Input placeholder="Ulice" />
 *   <Input placeholder="Město" />
 * </InputGroup>
 * ```
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  htmlFor,
  children,
  style,
  className,
}) => {
  const theme = useTheme();
  const autoId = useId();
  const labelFor = htmlFor ?? autoId;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: tokens[theme].label,
    userSelect: 'none',
  };

  return (
    <div style={containerStyle} className={className}>
      <label htmlFor={labelFor} style={labelStyle}>{label}</label>
      {children ?? <Input id={labelFor} />}
    </div>
  );
};
