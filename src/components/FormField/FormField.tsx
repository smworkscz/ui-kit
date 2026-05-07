import React, { useId } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    label: '#ffffff',
    helperText: '#ACACAC',
    errorText: '#EF3838',
    required: '#EF3838',
  },
  light: {
    label: '#1a1a1a',
    helperText: '#888888',
    errorText: '#EF3838',
    required: '#EF3838',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  /** Popisek pole. */
  label?: string | React.ReactNode;
  /** Povinné pole — zobrazí hvězdičku. @default false */
  required?: boolean;
  /** Nápovědný text pod polem. */
  helperText?: string | React.ReactNode;
  /** Chybová zpráva — zobrazí se červeně pod polem. */
  error?: string | React.ReactNode;
  /** Formulářový prvek (input, select, atd.). */
  children: React.ReactNode;
  /** Vodorovný layout (label vlevo, field vpravo). @default false */
  inline?: boolean;
  /** Šířka labelu v inline režimu. @default '120px' */
  labelWidth?: number | string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── FormField ───────────────────────────────────────────────────────────────

/**
 * Konzistentní obal pro formulářový prvek.
 *
 * Sjednocuje label, required indikátor, helper text a error message
 * do jednoho komponenty. Podporuje vertikální i inline layout.
 *
 * @example
 * ```tsx
 * <FormField label="Email" required error={errors.email} helperText="Pracovní email">
 *   <Input value={email} onChange={setEmail} />
 * </FormField>
 *
 * <FormField label="Jméno" inline labelWidth={140}>
 *   <Input value={name} onChange={setName} />
 * </FormField>
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  helperText,
  error,
  children,
  inline = false,
  labelWidth = '120px',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const autoId = useId();
  const resolvedLabelWidth = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;

  const labelEl = label ? (
    <label
      htmlFor={autoId}
      style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontWeight: 400,
        fontSize: '10px',
        lineHeight: 'normal',
        textTransform: 'uppercase',
        color: t.label,
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        ...(inline ? { width: resolvedLabelWidth, flexShrink: 0, paddingTop: '10px' } : {}),
      }}
    >
      {label}
      {required && <span style={{ color: t.required, marginLeft: '2px' }}>*</span>}
    </label>
  ) : null;

  const bottomText = error || helperText;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: inline ? 'row' : 'column',
        gap: inline ? '12px' : '6px',
        ...style,
      }}
    >
      {labelEl}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        {children}
        {bottomText && (
          <span
            style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '12px',
              lineHeight: 'normal',
              color: error ? t.errorText : t.helperText,
            }}
          >
            {error || helperText}
          </span>
        )}
      </div>
    </div>
  );
};

FormField.displayName = 'FormField';
