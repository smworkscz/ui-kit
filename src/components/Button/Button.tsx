import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const colors = {
  primary: '#FC4F00',
  primaryHover: '#FF6D2A',
  secondaryHoverDark: 'rgba(0,0,0,0.7)',
  secondaryHoverLight: 'rgba(0,0,0,0.05)',
  borderDark: 'rgba(255,255,255,0.3)',
  borderLight: 'rgba(0,0,0,0.2)',
  white: '#ffffff',
  black: '#1a1a1a',
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { paddingText: '6px 12px', paddingSquare: '6px', fontSize: '12px', gap: '6px' },
  md: { paddingText: '8px 16px', paddingSquare: '8px', fontSize: '14px', gap: '8px' },
  lg: { paddingText: '12px 20px', paddingSquare: '12px', fontSize: '16px', gap: '10px' },
} as const;

// ─── Spinner (no CSS required — rAF-driven rotation) ─────────────────────────

const Spinner: React.FC<{ size?: number }> = ({ size = 14 }) => {
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
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'left' | 'right';

/** Sdílené props pro režim `<button>` i `<a>`. */
interface ButtonBaseProps {
  /**
   * Vizuální varianta tlačítka.
   * - `primary`   — oranžové vyplnění (#FC4F00)
   * - `secondary` — průhledné, bez okraje
   * - `outline`   — průhledné s bílým okrajem
   * - `danger`    — červené vyplnění (#EF3838)
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Volitelná ikona — libovolný React uzel (SVG, komponenta…).
   * Při použití bez `children` se tlačítko vykreslí jako čtverec.
   */
  icon?: React.ReactNode;
  /**
   * Na které straně se ikona zobrazí vzhledem k textu.
   * @default 'left'
   */
  iconPosition?: ButtonIconPosition;
  /**
   * Při `true` je tlačítko neaktivní a místo ikony se zobrazí spinner
   * (nebo samotný spinner, pokud ikona chybí).
   * Ukazatel myši je blokován; `onClick` se nevyvolá.
   */
  loading?: boolean;
  /**
   * Roztáhne tlačítko na celou šířku kontejneru.
   */
  fullWidth?: boolean;
  /**
   * Další inline styly aplikované na kořenový element (`<button>` nebo `<a>`).
   * Sloučeny za všechny variantní / velikostní styly — pro jednorázové přepsání.
   */
  style?: React.CSSProperties;
  /**
   * Dodatečná CSS třída pro kořenový element.
   */
  className?: string;
  /**
   * Textový obsah tlačítka.
   * Při vynechání (pokud je zadána `icon`) se tlačítko vykreslí jako čtverec.
   */
  children?: React.ReactNode;
}

/** Vykreslení jako nativní `<button>` (výchozí). Dědí všechny standardní atributy — včetně `onClick`, `type`, `form`, `name`, `value`, `aria-*` apod. */
export interface ButtonAsButtonProps
  extends ButtonBaseProps,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  /** Při vynechání se komponenta vykreslí jako `<button>`. */
  href?: undefined;
}

/** Vykreslení jako `<a>` odkaz, pokud je zadáno `href`. Vhodné pro navigační tlačítka. */
export interface ButtonAsAnchorProps
  extends ButtonBaseProps,
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      children,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);
    const theme = useTheme();
    const isDark = theme === 'dark';

    const isAnchor = typeof (rest as ButtonAsAnchorProps).href === 'string';
    const isDisabled =
      loading || (isAnchor ? false : !!(rest as ButtonAsButtonProps).disabled);

    const hasText = children !== undefined && children !== null && children !== '';
    const hasIcon = icon !== undefined && icon !== null;
    const isSquare = (hasIcon || loading) && !hasText;

    const { paddingText, paddingSquare, fontSize, gap } = sizeConfig[size];

    // ── Base styles ──────────────────────────────────────────────────────────
    const base: React.CSSProperties = {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      gap: hasText && (hasIcon || loading) ? gap : undefined,
      padding: isSquare ? paddingSquare : paddingText,
      borderRadius: '8px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      outline: 'none',
      textDecoration: 'none',
      fontFamily: "'Zalando Sans Expanded', sans-serif",
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize,
      lineHeight: '1',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.15s ease, border-color 0.15s ease',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      boxSizing: 'border-box',
      pointerEvents: isDisabled ? 'none' : undefined,
    };

    // ── Variant styles ────────────────────────────────────────────────────────
    const variantStyle = ((): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: hovered ? colors.primaryHover : colors.primary,
            color: colors.white,
            border: '1px solid transparent',
          };
        case 'secondary':
          return {
            backgroundColor: hovered
              ? (isDark ? colors.secondaryHoverDark : colors.secondaryHoverLight)
              : 'transparent',
            color: isDark ? colors.white : colors.black,
            border: '1px solid transparent',
          };
        case 'outline':
          return {
            backgroundColor: hovered
              ? (isDark ? colors.secondaryHoverDark : colors.secondaryHoverLight)
              : 'transparent',
            color: isDark ? colors.white : colors.black,
            border: `1px solid ${hovered
                ? (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)')
                : (isDark ? colors.borderDark : colors.borderLight)
              }`,
          };
        case 'danger':
          return {
            backgroundColor: hovered ? '#FF5252' : '#EF3838',
            color: colors.white,
            border: '1px solid transparent',
          };
      }
    })();

    // ── Icon / spinner slot ───────────────────────────────────────────────────
    const iconSlot = (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {loading ? <Spinner size={parseInt(fontSize) - 1} /> : icon}
      </span>
    );
    const showIconSlot = loading || hasIcon;

    // ── Content layout ────────────────────────────────────────────────────────
    const content =
      iconPosition === 'right' ? (
        <>
          {hasText && <span>{children}</span>}
          {showIconSlot && iconSlot}
        </>
      ) : (
        <>
          {showIconSlot && iconSlot}
          {hasText && <span>{children}</span>}
        </>
      );

    const sharedProps = {
      style: { ...base, ...variantStyle, ...style },
      className,
      onMouseEnter: (e: React.MouseEvent) => {
        setHovered(true);
        (rest as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(
          e as React.MouseEvent<HTMLElement>
        );
      },
      onMouseLeave: (e: React.MouseEvent) => {
        setHovered(false);
        (rest as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(
          e as React.MouseEvent<HTMLElement>
        );
      },
    };

    if (isAnchor) {
      const { href, target, rel, ...anchorRest } = rest as ButtonAsAnchorProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          aria-disabled={isDisabled || undefined}
          {...(anchorRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          {...sharedProps}
        >
          {content}
        </a>
      );
    }

    const { disabled, type = 'button', ...buttonRest } = rest as ButtonAsButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...(buttonRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        {...sharedProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
