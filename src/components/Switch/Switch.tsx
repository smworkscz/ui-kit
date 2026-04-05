import React, { useId } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    trackOff: 'rgba(255,255,255,0.15)',
    trackOffBorder: 'rgba(255,255,255,0.3)',
    trackOn: '#FC4F00',
    trackOnBorder: '#FC4F00',
    thumb: '#ffffff',
    text: '#ffffff',
  },
  light: {
    trackOff: 'rgba(0,0,0,0.08)',
    trackOffBorder: 'rgba(0,0,0,0.2)',
    trackOn: '#FC4F00',
    trackOnBorder: '#FC4F00',
    thumb: '#ffffff',
    text: '#1a1a1a',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { trackW: 32, trackH: 18, thumb: 14, offset: 2, fontSize: '14px', gap: '8px' },
  md: { trackW: 40, trackH: 22, thumb: 18, offset: 2, fontSize: '16px', gap: '10px' },
  lg: { trackW: 48, trackH: 26, thumb: 22, offset: 2, fontSize: '18px', gap: '12px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /** Stav přepínače. */
  checked?: boolean;
  /** Callback volaný při změně stavu. */
  onChange?: (checked: boolean) => void;
  /** Textový popisek zobrazený napravo od přepínače. */
  label?: string;
  /** Deaktivuje přepínač. */
  disabled?: boolean;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: SwitchSize;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Switch ──────────────────────────────────────────────────────────────────

/**
 * Přepínač (switch/toggle) dle SM-UI design systému.
 *
 * Pilulkový tvar s plynulou animací posunu.
 * Oranžový ve stavu zapnuto, jemný okraj ve stavu vypnuto.
 *
 * @example
 * ```tsx
 * <Switch label="Noční režim" checked={dark} onChange={setDark} />
 * ```
 */
export const Switch: React.FC<SwitchProps> = ({
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
    onChange?.(!checked);
  };

  const borderW = 1.5;
  // Inner dimensions after border
  const innerW = sc.trackW - borderW * 2;
  const innerH = sc.trackH - borderW * 2;
  // Center the thumb vertically & horizontally within the inner space
  const thumbPad = (innerH - sc.thumb) / 2;
  const thumbTravel = innerW - sc.thumb - thumbPad * 2;
  const thumbTranslate = checked ? thumbTravel : 0;

  const trackStyle: React.CSSProperties = {
    width: sc.trackW,
    height: sc.trackH,
    borderRadius: sc.trackH / 2,
    backgroundColor: checked ? t.trackOn : t.trackOff,
    border: `${borderW}px solid ${checked ? t.trackOnBorder : t.trackOffBorder}`,
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    flexShrink: 0,
    opacity: disabled ? 0.5 : 1,
    boxSizing: 'border-box',
  };

  const thumbStyle: React.CSSProperties = {
    width: sc.thumb,
    height: sc.thumb,
    borderRadius: '50%',
    backgroundColor: t.thumb,
    position: 'absolute',
    top: thumbPad,
    left: thumbPad,
    transform: `translateX(${thumbTranslate}px)`,
    transition: 'transform 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: sc.fontSize,
    color: t.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    lineHeight: `${sc.trackH}px`,
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }} className={className}>
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
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.(!checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
          aria-checked={checked}
        />
        <span style={trackStyle}>
          <span style={thumbStyle} />
        </span>
        {label && <span style={labelStyle}>{label}</span>}
      </label>
    </div>
  );
};

Switch.displayName = 'Switch';
