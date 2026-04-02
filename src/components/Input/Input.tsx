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
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Icon rendered on the **left** side inside the input field.
   * Typically a 16×16 SVG or icon component.
   */
  iconLeft?: React.ReactNode;
  /**
   * Icon rendered on the **right** side inside the input field.
   * Commonly used for clear/search triggers.
   */
  iconRight?: React.ReactNode;
  /**
   * When `true` the field is styled as invalid (red border).
   * Pass a string to also render an error message below the field.
   */
  error?: boolean | string;
  /**
   * Extra inline styles for the **wrapper** `<div>` (not the native input).
   * Use `inputStyle` to style the native `<input>` element itself.
   */
  style?: React.CSSProperties;
  /**
   * Extra CSS class applied to the **wrapper** `<div>`.
   */
  className?: string;
  /**
   * Extra inline styles applied directly to the native `<input>` element.
   */
  inputStyle?: React.CSSProperties;
}

export interface InputGroupProps {
  /**
   * Label text rendered above the input.
   * Rendered uppercase per the SM-UI design system.
   */
  label: string;
  /**
   * `htmlFor` value that links the `<label>` to a child `<input>`.
   * Auto-generated when not provided.
   */
  htmlFor?: string;
  /**
   * The input element(s) to render inside the group.
   * When omitted a default `<Input />` is rendered.
   */
  children?: React.ReactNode;
  /** Extra inline styles for the wrapper `<div>`. */
  style?: React.CSSProperties;
  /** Extra CSS class applied to the wrapper `<div>`. */
  className?: string;
}

// ─── Input ───────────────────────────────────────────────────────────────────

/**
 * Controlled / uncontrolled text input following the SM-UI design system.
 *
 * Supports optional icons on either side, error state with optional message,
 * and both `dark` / `light` themes (auto-detected via `useTheme`).
 *
 * All native `<input>` attributes (`value`, `onChange`, `onBlur`, `placeholder`,
 * `type`, `autoComplete`, `maxLength`, `readOnly`, `disabled`, …) are forwarded.
 *
 * @example
 * ```tsx
 * // Bare input
 * <Input placeholder="Search…" />
 *
 * // With icons
 * <Input iconLeft={<SearchIcon />} iconRight={<ClearIcon />} />
 *
 * // Error state
 * <Input error="This field is required" value="" />
 *
 * // Inside a labelled group
 * <InputGroup label="E-mail">
 *   <Input type="email" placeholder="name@example.com" />
 * </InputGroup>
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      iconLeft,
      iconRight,
      error,
      style,
      className,
      inputStyle,
      disabled,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const t = tokens[theme];
    const [focused, setFocused] = useState(false);

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: disabled ? t.backgroundDisabled : t.background,
      border: `1px solid ${hasError ? t.borderError : focused ? t.borderFocus : t.border}`,
      borderRadius: '8px',
      padding: '8px 12px',
      boxSizing: 'border-box',
      transition: 'border-color 0.15s ease',
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
      ...style,
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
      fontSize: '16px',
      lineHeight: 'normal',
      color: t.text,
      cursor: disabled ? 'not-allowed' : 'text',
      ...inputStyle,
    };

    const iconStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: t.placeholder,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={wrapperStyle} className={className}>
          {iconLeft && <span style={iconStyle}>{iconLeft}</span>}
          <input
            ref={ref}
            disabled={disabled}
            style={nativeStyle}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            {...rest}
          />
          {iconRight && <span style={iconStyle}>{iconRight}</span>}
        </div>
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
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─── InputGroup ──────────────────────────────────────────────────────────────

/**
 * Wraps an `<Input>` (or any other form control) with a labelled group.
 * The label is styled uppercase per the SM-UI design system.
 *
 * @example
 * ```tsx
 * <InputGroup label="Username">
 *   <Input placeholder="Enter username" />
 * </InputGroup>
 *
 * // With an icon input inside
 * <InputGroup label="Search">
 *   <Input iconLeft={<SearchIcon />} placeholder="Type to search…" />
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
