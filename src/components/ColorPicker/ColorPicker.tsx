import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { Eyedropper as EyedropperIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    border: 'rgba(255,255,255,0.3)',
    borderFocus: 'rgba(255,255,255,0.7)',
    text: '#ffffff',
    placeholder: '#ACACAC',
    label: '#ffffff',
    popoverBg: 'rgba(24,24,24,0.95)',
    popoverBorder: 'rgba(255,255,255,0.12)',
    swatchBorder: 'rgba(255,255,255,0.2)',
    swatchHover: 'rgba(255,255,255,0.12)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    border: 'rgba(0,0,0,0.2)',
    borderFocus: 'rgba(0,0,0,0.6)',
    text: '#1a1a1a',
    placeholder: '#888888',
    label: '#1a1a1a',
    popoverBg: 'rgba(255,255,255,0.95)',
    popoverBorder: 'rgba(0,0,0,0.1)',
    swatchBorder: 'rgba(0,0,0,0.15)',
    swatchHover: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Animation ───────────────────────────────────────────────────────────────

const ANIM_DURATION = 180;

// ─── Default presets ─────────────────────────────────────────────────────────

const DEFAULT_PRESETS = [
  '#FC4F00', '#FF6D2A', '#EF3838', '#E8612D',
  '#00A205', '#2196F3', '#9C27B0', '#FF9800',
  '#F44336', '#4CAF50', '#03A9F4', '#E91E63',
  '#FFC107', '#8BC34A', '#00BCD4', '#673AB7',
  '#795548', '#607D8B', '#000000', '#ffffff',
];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ColorPickerProps {
  /** Aktuální barva v hexadecimálním formátu (např. `#FC4F00`). */
  value: string;
  /** Callback volaný při změně barvy. */
  onChange: (color: string) => void;
  /** Přednastavené barvy zobrazené v mřížce. Pokud chybí, použije se výchozí paleta. */
  presets?: string[];
  /** Popisek zobrazený nad komponentou. Stylizován velkými písmeny dle SM-UI design systému. */
  label?: string;
  /** Zakáže celou komponentu. */
  disabled?: boolean;
  /** Další inline styly pro obalový `<div>`. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obalový `<div>`. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isValidHex = (hex: string): boolean => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);

const normalizeHex = (hex: string): string => {
  const clean = hex.replace(/[^0-9A-Fa-f#]/g, '');
  if (clean.startsWith('#')) return clean.slice(0, 7);
  return `#${clean.slice(0, 6)}`;
};

/** Zjistí, zda barva je světlá (pro kontrast textu). */
const isLightColor = (hex: string): boolean => {
  const c = hex.replace('#', '');
  const r = parseInt(c.length === 3 ? c[0] + c[0] : c.slice(0, 2), 16);
  const g = parseInt(c.length === 3 ? c[1] + c[1] : c.slice(2, 4), 16);
  const b = parseInt(c.length === 3 ? c[2] + c[2] : c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

// ─── ColorPicker ─────────────────────────────────────────────────────────────

/**
 * Výběr barvy dle SM-UI design systému.
 *
 * Zobrazuje náhled aktuální barvy, hexadecimální vstup
 * a po kliknutí popover s mřížkou přednastavených barev.
 *
 * @example
 * ```tsx
 * <ColorPicker value={color} onChange={setColor} />
 * <ColorPicker value={color} onChange={setColor} presets={['#FF0000', '#00FF00', '#0000FF']} />
 * ```
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  label,
  disabled = false,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const autoId = useId();
  const inputId = autoId;

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [hexInput, setHexInput] = useState(value);
  const [focused, setFocused] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; openAbove: boolean }>({ top: 0, left: 0, openAbove: false });

  // ── Sync hex input with value ──────────────────────────────────────

  useEffect(() => {
    if (!focused) {
      setHexInput(value);
    }
  }, [value, focused]);

  // ── Open / close ───────────────────────────────────────────────────

  const doOpen = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setVisible(true);
    setAnimState('opening');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('open'));
    });
  }, [disabled]);

  const doClose = useCallback(() => {
    setOpen(false);
    setAnimState('closing');
    const timer = setTimeout(() => {
      setVisible(false);
      setAnimState('idle');
    }, ANIM_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ── Position popover ───────────────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const openAbove = spaceBelow < popoverHeight && rect.top > spaceBelow;
    setPopoverPos({
      top: openAbove ? rect.top - 8 : rect.bottom + 8,
      left: rect.left,
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

  // ── Close on outside click ─────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        doClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, doClose]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = normalizeHex(e.target.value);
    setHexInput(val);
    if (isValidHex(val)) {
      onChange(val);
    }
  };

  const handleHexBlur = () => {
    setFocused(false);
    if (isValidHex(hexInput)) {
      onChange(hexInput);
    } else {
      setHexInput(value);
    }
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setHexInput(color);
    doClose();
  };

  // ── Animation styles ───────────────────────────────────────────────

  const getPopoverAnimStyle = (): React.CSSProperties => {
    const above = popoverPos.openAbove;
    const slideIn = above ? 'translateY(8px)' : 'translateY(-8px)';
    const slideOut = above ? 'translateY(6px)' : 'translateY(-6px)';
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    if (animState === 'opening' || animState === 'idle') {
      return { ...base, opacity: 0, transform: `${slideIn} scale(0.97)` };
    }
    if (animState === 'open') {
      return { ...base, opacity: 1, transform: 'translateY(0) scale(1)' };
    }
    return { ...base, opacity: 0, transform: `${slideOut} scale(0.98)`, pointerEvents: 'none' };
  };

  // ── Styles ─────────────────────────────────────────────────────────

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: disabled ? t.backgroundDisabled : t.background,
    border: `1px solid ${focused ? t.borderFocus : t.border}`,
    borderRadius: '8px',
    padding: '8px 12px',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const swatchStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: isValidHex(value) ? value : '#cccccc',
    border: `1px solid ${t.swatchBorder}`,
    flexShrink: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.12s ease',
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

  // ── Popover ────────────────────────────────────────────────────────

  const popover = visible
    ? createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            ...(popoverPos.openAbove
              ? { bottom: window.innerHeight - popoverPos.top, left: popoverPos.left }
              : { top: popoverPos.top, left: popoverPos.left }),
            backgroundColor: t.popoverBg,
            border: `1px solid ${t.popoverBorder}`,
            borderRadius: '12px',
            boxShadow: theme === 'dark'
              ? '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset'
              : '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            padding: '12px',
            boxSizing: 'border-box',
            transformOrigin: popoverPos.openAbove ? 'bottom left' : 'top left',
            ...getPopoverAnimStyle(),
          }}
        >
          {/* Preset grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '6px',
          }}>
            {presets.map((color, idx) => (
              <button
                key={`${color}-${idx}`}
                type="button"
                aria-label={`Vybrat barvu ${color}`}
                onClick={() => handlePresetClick(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: color,
                  border: color === value
                    ? '2px solid #FC4F00'
                    : `1px solid ${t.swatchBorder}`,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'transform 0.12s ease, border-color 0.12s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              />
            ))}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', ...style }}
      className={className}
    >
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      )}

      <div ref={triggerRef} style={wrapperStyle}>
        {/* Color swatch */}
        <div
          style={swatchStyle}
          onClick={() => { if (!disabled) open ? doClose() : doOpen(); }}
        />

        {/* Hex input */}
        <input
          id={inputId}
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          onFocus={() => setFocused(true)}
          onBlur={handleHexBlur}
          disabled={disabled}
          maxLength={7}
          style={{
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
          }}
        />

        {/* Eyedropper icon */}
        <span
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: t.placeholder, cursor: disabled ? 'not-allowed' : 'pointer' }}
          onClick={() => { if (!disabled) open ? doClose() : doOpen(); }}
        >
          <EyedropperIcon
            size={16}
            color={isLightColor(value) && theme === 'light' ? t.placeholder : t.placeholder}
          />
        </span>
      </div>

      {popover}
    </div>
  );
};

ColorPicker.displayName = 'ColorPicker';
