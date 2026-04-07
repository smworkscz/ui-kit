import React, { useState, useCallback, useRef } from 'react';
import { CopySimpleIcon, CheckIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    iconColor: '#ACACAC',
    iconHover: '#ffffff',
    successColor: '#00A205',
    buttonBg: 'transparent',
    buttonHover: 'rgba(255,255,255,0.08)',
    buttonBorder: 'rgba(255,255,255,0.15)',
    buttonText: '#eaeaea',
  },
  light: {
    iconColor: '#888888',
    iconHover: '#1a1a1a',
    successColor: '#00A205',
    buttonBg: 'transparent',
    buttonHover: 'rgba(0,0,0,0.05)',
    buttonBorder: 'rgba(0,0,0,0.12)',
    buttonText: '#333333',
  },
} as const;

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { iconSize: 14, buttonPadding: '4px 10px', iconPadding: '4px', fontSize: '12px' },
  md: { iconSize: 16, buttonPadding: '6px 14px', iconPadding: '6px', fontSize: '13px' },
  lg: { iconSize: 18, buttonPadding: '8px 16px', iconPadding: '8px', fontSize: '14px' },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CopyButtonProps {
  /** Text ke zkopírování do schránky. */
  text: string;
  /** Vlastní obsah tlačítka (nahrazuje výchozí ikonu/text). */
  children?: React.ReactNode;
  /** Velikost tlačítka. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Varianta zobrazení. @default 'icon' */
  variant?: 'icon' | 'button';
  /** Popisek tlačítka ve variantě 'button'. @default 'Kopírovat' */
  label?: string;
  /** Popisek po úspěšném zkopírování. @default 'Zkopírováno' */
  successLabel?: string;
  /** Callback volaný po úspěšném zkopírování do schránky. */
  onCopy?: () => void;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Clipboard helper ───────────────────────────────────────────────────────

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  // Fallback: textarea + execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch {
    return false;
  }
};

// ─── CopyButton ─────────────────────────────────────────────────────────────

/**
 * Tlačítko pro zkopírování textu do schránky.
 *
 * Podporuje dvě varianty: minimální ikonovou (jen ikona kopírování)
 * a plnou tlačítkovou (s textem). Po úspěšném zkopírování se na 2 sekundy
 * zobrazí ikona zaškrtnutí.
 *
 * @example
 * ```tsx
 * <CopyButton text="npm install sm-ui" variant="button" label="Kopírovat příkaz" />
 * <CopyButton text={code} />
 * ```
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  children,
  size = 'md',
  variant = 'icon',
  label = 'Kopírovat',
  successLabel = 'Zkopírováno',
  onCopy,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];

  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      onCopy?.();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 2000);
    }
  }, [text, onCopy]);

  const iconColor = copied ? t.successColor : hovered ? t.iconHover : t.iconColor;

  const CurrentIcon = copied ? CheckIcon : CopySimpleIcon;

  if (children) {
    return (
      <button
        type="button"
        aria-label={copied ? successLabel : label}
        onClick={handleCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: sc.iconPadding,
          background: hovered ? t.buttonHover : t.buttonBg,
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.12s ease',
          color: iconColor,
          ...style,
        }}
      >
        {children}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        aria-label={copied ? successLabel : label}
        onClick={handleCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: sc.iconPadding,
          background: hovered ? t.buttonHover : t.buttonBg,
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.12s ease, color 0.12s ease',
          color: iconColor,
          ...style,
        }}
      >
        <CurrentIcon size={sc.iconSize} color={iconColor} />
      </button>
    );
  }

  // Varianta 'button'
  return (
    <button
      type="button"
      aria-label={copied ? successLabel : label}
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: sc.buttonPadding,
        background: hovered ? t.buttonHover : t.buttonBg,
        border: `1px solid ${t.buttonBorder}`,
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.12s ease',
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: sc.fontSize,
        fontWeight: 500,
        color: copied ? t.successColor : t.buttonText,
        lineHeight: 'normal',
        ...style,
      }}
    >
      <CurrentIcon size={sc.iconSize} color={copied ? t.successColor : t.buttonText} />
      {copied ? successLabel : label}
    </button>
  );
};

CopyButton.displayName = 'CopyButton';
