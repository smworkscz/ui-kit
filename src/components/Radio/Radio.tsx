import React, { useId } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    border: 'rgba(255,255,255,0.3)',
    borderError: '#EF3838',
    background: 'rgba(3,3,3,0.75)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    text: '#ffffff',
    label: '#ffffff',
    helperText: '#ACACAC',
    dot: '#FC4F00',
    dotRing: '#FC4F00',
  },
  light: {
    border: 'rgba(0,0,0,0.2)',
    borderError: '#EF3838',
    background: 'rgba(255,255,255,0.85)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    text: '#1a1a1a',
    label: '#1a1a1a',
    helperText: '#888888',
    dot: '#FC4F00',
    dotRing: '#FC4F00',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { box: 16, dot: 6, fontSize: '14px', gap: '6px' },
  md: { box: 20, dot: 8, fontSize: '16px', gap: '8px' },
  lg: { box: 24, dot: 10, fontSize: '18px', gap: '10px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps {
  /** Hodnota tohoto přepínače. */
  value: string;
  /** Zda je tento přepínač vybrán. */
  checked?: boolean;
  /** Callback volaný při výběru. */
  onChange?: (value: string) => void;
  /** Textový popisek. */
  label?: string;
  /** Deaktivuje přepínač. */
  disabled?: boolean;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: RadioSize;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

export interface RadioGroupOption {
  /** Hodnota volby. */
  value: string;
  /** Zobrazený popisek. */
  label: string;
  /** Deaktivuje tuto volbu. */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Aktuálně vybraná hodnota. */
  value?: string;
  /** Callback volaný při změně výběru. */
  onChange?: (value: string) => void;
  /** Popisek skupiny. */
  label?: string;
  /** Seznam voleb. */
  options: RadioGroupOption[];
  /**
   * Směr rozložení voleb.
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Chybový stav. Při řetězci se zobrazí chybová zpráva.
   */
  error?: boolean | string;
  /** Nápovědný text pod skupinou. */
  helperText?: string;
  /**
   * Velikostní preset pro všechny přepínače ve skupině.
   * @default 'md'
   */
  size?: RadioSize;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Radio ───────────────────────────────────────────────────────────────────

/**
 * Přepínací tlačítko (radio) dle SM-UI design systému.
 *
 * Používá vlastní SVG kruh s oranžovou tečkou při výběru.
 * Podporuje velikostní presety a tmavý / světlý režim.
 *
 * @example
 * ```tsx
 * <Radio value="a" label="Volba A" checked={selected === 'a'} onChange={setSelected} />
 * ```
 */
export const Radio: React.FC<RadioProps> = ({
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];
  const id = useId();

  const handleClick = () => {
    if (disabled) return;
    onChange?.(value);
  };

  const borderColor = checked ? t.dotRing : t.border;
  const bg = disabled ? t.backgroundDisabled : t.background;

  const circleStyle: React.CSSProperties = {
    width: sc.box,
    height: sc.box,
    borderRadius: '50%',
    border: `1.5px solid ${borderColor}`,
    backgroundColor: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.15s ease',
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

  return (
    <div style={{ display: 'inline-flex', ...style }} className={className}>
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
          id={id}
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.(value)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        />
        <span style={circleStyle}>
          {checked && (
            <span
              style={{
                width: sc.dot,
                height: sc.dot,
                borderRadius: '50%',
                backgroundColor: t.dot,
                transition: 'transform 0.15s ease',
              }}
            />
          )}
        </span>
        {label && <span style={labelStyle}>{label}</span>}
      </label>
    </div>
  );
};

Radio.displayName = 'Radio';

// ─── RadioGroup ──────────────────────────────────────────────────────────────

/**
 * Skupina přepínačů s popiskem, chybovým stavem a nápovědným textem.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   label="Pohlaví"
 *   value={gender}
 *   onChange={setGender}
 *   options={[
 *     { value: 'male', label: 'Muž' },
 *     { value: 'female', label: 'Žena' },
 *   ]}
 * />
 * ```
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  label,
  options,
  direction = 'vertical',
  error,
  helperText,
  size = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const hasError = Boolean(error);
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
      role="radiogroup"
      aria-label={label}
      aria-invalid={hasError || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...style,
      }}
      className={className}
    >
      {label && <span style={groupLabelStyle}>{label}</span>}
      <div
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap: direction === 'horizontal' ? '16px' : '6px',
        }}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            value={opt.value}
            label={opt.label}
            checked={value === opt.value}
            onChange={onChange}
            disabled={opt.disabled}
            size={size}
          />
        ))}
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
};

RadioGroup.displayName = 'RadioGroup';
