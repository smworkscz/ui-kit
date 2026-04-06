import React from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ACACAC',
    activeText: '#ffffff',
    activeBg: '#E8612D',
    hoverBg: 'rgba(255,255,255,0.08)',
    disabledText: 'rgba(255,255,255,0.2)',
    border: 'rgba(255,255,255,0.12)',
  },
  light: {
    text: '#666666',
    activeText: '#ffffff',
    activeBg: '#E8612D',
    hoverBg: 'rgba(0,0,0,0.05)',
    disabledText: 'rgba(0,0,0,0.15)',
    border: 'rgba(0,0,0,0.08)',
  },
} as const;

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { size: 28, fontSize: '12px', iconSize: 14 },
  md: { size: 36, fontSize: '14px', iconSize: 16 },
  lg: { size: 44, fontSize: '16px', iconSize: 18 },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PaginationProps {
  /** Aktuální číslo stránky (1-indexed). */
  page: number;
  /** Celkový počet stránek. */
  totalPages: number;
  /** Voláno při změně stránky. */
  onChange: (page: number) => void;
  /** Počet stránek zobrazených kolem aktuální. @default 1 */
  siblings?: number;
  /** Zobrazí tlačítko pro první stránku. @default true */
  showFirst?: boolean;
  /** Zobrazí tlačítko pro poslední stránku. @default true */
  showLast?: boolean;
  /** Velikostní preset. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Dodatečná CSS třída pro obalový element. */
  className?: string;
  /** Další inline styly pro obalový element. */
  style?: React.CSSProperties;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Vygeneruje pole stránek s trojtečkami pro mezerné úseky.
 */
function getPageRange(
  page: number,
  totalPages: number,
  siblings: number,
  showFirst: boolean,
  showLast: boolean,
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const range: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];

  const start = Math.max(2, page - siblings);
  const end = Math.min(totalPages - 1, page + siblings);

  // Vždy první stránka
  if (showFirst || page - siblings <= 1) {
    range.push(1);
  }

  // Trojtečka vlevo
  if (start > 2) {
    if (showFirst && !range.includes(1)) range.push(1);
    range.push('ellipsis-start');
  }

  // Středové stránky
  for (let i = start; i <= end; i++) {
    if (!range.includes(i)) range.push(i);
  }

  // Trojtečka vpravo
  if (end < totalPages - 1) {
    range.push('ellipsis-end');
  }

  // Vždy poslední stránka
  if ((showLast || page + siblings >= totalPages) && totalPages > 1) {
    if (!range.includes(totalPages)) range.push(totalPages);
  }

  return range;
}

// ─── Pagination ─────────────────────────────────────────────────────────────

/**
 * Stránkovací komponenta dle SM-UI design systému.
 *
 * Zobrazuje číselné tlačítka stránek s trojtečkami pro velké rozsahy,
 * tlačítka Předchozí / Další a volitelně první / poslední stránku.
 *
 * @example
 * ```tsx
 * <Pagination page={3} totalPages={20} onChange={setPage} />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  siblings = 1,
  showFirst = true,
  showLast = true,
  size = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];

  if (totalPages <= 0) return null;

  const pages = getPageRange(page, totalPages, siblings, showFirst, showLast);

  const buttonBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sc.size,
    height: sc.size,
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: sc.fontSize,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.12s ease, color 0.12s ease',
    flexShrink: 0,
    padding: 0,
    lineHeight: 'normal',
  };

  return (
    <nav
      aria-label="Stránkování"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        ...style,
      }}
    >
      {/* Předchozí */}
      <button
        type="button"
        aria-label="Předchozí stránka"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        style={{
          ...buttonBase,
          color: page <= 1 ? t.disabledText : t.text,
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (page > 1) e.currentTarget.style.backgroundColor = t.hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <CaretLeftIcon size={sc.iconSize} color={page <= 1 ? t.disabledText : t.text} />
      </button>

      {/* Stránky */}
      {pages.map((item, idx) => {
        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
          return (
            <span
              key={item}
              style={{
                ...buttonBase,
                cursor: 'default',
                color: t.text,
              }}
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const isActive = item === page;

        return (
          <button
            key={item}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Stránka ${item}`}
            onClick={() => onChange(item)}
            style={{
              ...buttonBase,
              color: isActive ? t.activeText : t.text,
              backgroundColor: isActive ? t.activeBg : 'transparent',
              fontWeight: isActive ? 600 : 500,
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = t.hoverBg;
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {item}
          </button>
        );
      })}

      {/* Další */}
      <button
        type="button"
        aria-label="Další stránka"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        style={{
          ...buttonBase,
          color: page >= totalPages ? t.disabledText : t.text,
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (page < totalPages) e.currentTarget.style.backgroundColor = t.hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <CaretRightIcon size={sc.iconSize} color={page >= totalPages ? t.disabledText : t.text} />
      </button>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
