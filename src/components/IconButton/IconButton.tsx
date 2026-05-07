import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Tooltip } from '../Tooltip/Tooltip';

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
    return () => { if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ transform: `rotate(${angle}deg)`, display: 'block' }}>
      <circle cx="8" cy="8" r="6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    defaultBg: 'transparent',
    defaultHover: 'rgba(255,255,255,0.08)',
    defaultColor: '#ffffff',
    ghostBg: 'transparent',
    ghostHover: 'rgba(255,255,255,0.06)',
    ghostColor: '#ACACAC',
    outlineBg: 'transparent',
    outlineHover: 'rgba(255,255,255,0.06)',
    outlineColor: '#ffffff',
    outlineBorder: 'rgba(255,255,255,0.3)',
    dangerBg: 'transparent',
    dangerHover: 'rgba(239,56,56,0.12)',
    dangerColor: '#EF3838',
  },
  light: {
    defaultBg: 'transparent',
    defaultHover: 'rgba(0,0,0,0.06)',
    defaultColor: '#1a1a1a',
    ghostBg: 'transparent',
    ghostHover: 'rgba(0,0,0,0.04)',
    ghostColor: '#888888',
    outlineBg: 'transparent',
    outlineHover: 'rgba(0,0,0,0.04)',
    outlineColor: '#1a1a1a',
    outlineBorder: 'rgba(0,0,0,0.2)',
    dangerBg: 'transparent',
    dangerHover: 'rgba(239,56,56,0.08)',
    dangerColor: '#EF3838',
  },
} as const;

const sizeConfig = {
  xs: { size: 24, iconSize: 12, radius: '4px' },
  sm: { size: 28, iconSize: 14, radius: '6px' },
  md: { size: 36, iconSize: 16, radius: '8px' },
  lg: { size: 44, iconSize: 20, radius: '8px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IconButtonProps {
  /** Ikona. */
  icon: React.ReactNode;
  /** Callback při kliknutí. */
  onClick?: (e: React.MouseEvent) => void;
  /** Povinný aria-label pro přístupnost. */
  label: string;
  /** Varianta. @default 'default' */
  variant?: 'default' | 'ghost' | 'outline' | 'danger';
  /** Velikost. @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Zakáže tlačítko. @default false */
  disabled?: boolean;
  /** Zobrazí spinner. @default false */
  loading?: boolean;
  /** Automaticky obalí tooltipem. */
  tooltip?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── IconButton ──────────────────────────────────────────────────────────────

/**
 * Čtvercové tlačítko pro ikonu.
 *
 * Optimalizované pro akce bez textu — klikací plocha je čtvercová,
 * varianta a velikost se řídí samostatně.
 *
 * @example
 * ```tsx
 * <IconButton icon={<TrashIcon />} label="Smazat" variant="danger" onClick={handleDelete} />
 * <IconButton icon={<PencilIcon />} label="Upravit" tooltip="Upravit záznam" />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  label,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  tooltip,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];
  const [hovered, setHovered] = useState(false);

  const variantStyles = {
    default: { bg: hovered ? t.defaultHover : t.defaultBg, color: t.defaultColor, border: 'none' },
    ghost: { bg: hovered ? t.ghostHover : t.ghostBg, color: t.ghostColor, border: 'none' },
    outline: { bg: hovered ? t.outlineHover : t.outlineBg, color: t.outlineColor, border: `1px solid ${t.outlineBorder}` },
    danger: { bg: hovered ? t.dangerHover : t.dangerBg, color: t.dangerColor, border: 'none' },
  }[variant];

  const btn = (
    <button
      type="button"
      aria-label={label}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sc.size,
        height: sc.size,
        borderRadius: sc.radius,
        backgroundColor: variantStyles.bg,
        color: variantStyles.color,
        border: variantStyles.border,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.12s ease',
        outline: 'none',
        padding: 0,
        flexShrink: 0,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {loading ? <Spinner size={sc.iconSize} /> : icon}
    </button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{btn}</Tooltip>;
  }
  return btn;
};

IconButton.displayName = 'IconButton';
