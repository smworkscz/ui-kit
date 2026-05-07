import React from 'react';
import {
  Tray as InboxIcon,
  MagnifyingGlass as SearchIcon,
  Lock as LockIcon,
  WarningCircle as WarningIcon,
  Rocket as RocketIcon,
} from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    textSecondary: '#ACACAC',
    iconColor: 'rgba(255,255,255,0.2)',
  },
  light: {
    text: '#1a1a1a',
    textSecondary: '#888888',
    iconColor: 'rgba(0,0,0,0.15)',
  },
} as const;

// ─── Presets ────────────────────────────────────────────────────────────────

export type EmptyStatePreset = 'no-data' | 'no-results' | 'no-permission' | 'error' | 'coming-soon';

const presetConfig: Record<EmptyStatePreset, { icon: React.ReactNode; title: string; description: string }> = {
  'no-data': {
    icon: <InboxIcon size={48} />,
    title: 'Žádná data',
    description: 'Zatím zde nejsou žádné záznamy.',
  },
  'no-results': {
    icon: <SearchIcon size={48} />,
    title: 'Žádné výsledky',
    description: 'Zkuste upravit filtr nebo hledaný výraz.',
  },
  'no-permission': {
    icon: <LockIcon size={48} />,
    title: 'Nemáte oprávnění',
    description: 'Pro přístup kontaktujte administrátora.',
  },
  'error': {
    icon: <WarningIcon size={48} />,
    title: 'Něco se pokazilo',
    description: 'Nepodařilo se načíst data. Zkuste to znovu.',
  },
  'coming-soon': {
    icon: <RocketIcon size={48} />,
    title: 'Již brzy',
    description: 'Tato funkce je ve vývoji.',
  },
};

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '24px 16px', iconSize: 32, titleSize: '14px', descSize: '12px', maxWidth: '280px' },
  md: { padding: '48px 24px', iconSize: 48, titleSize: '18px', descSize: '14px', maxWidth: '360px' },
  lg: { padding: '64px 32px', iconSize: 64, titleSize: '22px', descSize: '15px', maxWidth: '440px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Ikona zobrazená nad titulkem. */
  icon?: React.ReactNode;
  /** Hlavní titulek prázdného stavu. */
  title?: string;
  /** Doplňkový popis. */
  description?: string;
  /** Akční prvky — typicky tlačítka. */
  action?: React.ReactNode;
  /**
   * Přednastavený prázdný stav s ikonou, titulkem a popisem.
   * Vlastní `icon`, `title`, `description` přepíší preset hodnoty.
   */
  preset?: EmptyStatePreset;
  /** Velikost. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

/**
 * Prázdný stav dle SM-UI design systému.
 *
 * Centrovaný layout s volitelnou ikonou, titulkem,
 * popisem a akčními tlačítky. Podporuje presety pro běžné scénáře.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   preset="no-results"
 *   action={<Button>Vytvořit záznam</Button>}
 * />
 *
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="Žádné výsledky"
 *   description="Zkuste upravit filtr."
 *   action={<Button>Reset</Button>}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  preset,
  size = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];

  const p = preset ? presetConfig[preset] : undefined;
  const resolvedIcon = icon ?? p?.icon;
  const resolvedTitle = title ?? p?.title ?? '';
  const resolvedDesc = description ?? p?.description;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: sc.padding,
        gap: '12px',
        ...style,
      }}
    >
      {resolvedIcon && (
        <div
          style={{
            lineHeight: 1,
            color: t.iconColor,
            marginBottom: '4px',
          }}
        >
          {resolvedIcon}
        </div>
      )}

      {resolvedTitle && (
        <div
          style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 500,
            fontSize: sc.titleSize,
            lineHeight: 'normal',
            color: t.text,
          }}
        >
          {resolvedTitle}
        </div>
      )}

      {resolvedDesc && (
        <div
          style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: sc.descSize,
            lineHeight: '1.5',
            color: t.textSecondary,
            maxWidth: sc.maxWidth,
          }}
        >
          {resolvedDesc}
        </div>
      )}

      {action && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
