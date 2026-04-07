import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'transparent',
    text: '#ffffff',
    textMuted: '#888888',
    border: 'rgba(255,255,255,0.08)',
    stripedBg: 'rgba(255,255,255,0.04)',
  },
  light: {
    background: 'transparent',
    text: '#1a1a1a',
    textMuted: '#999999',
    border: 'rgba(0,0,0,0.06)',
    stripedBg: 'rgba(0,0,0,0.02)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Položka klíč-hodnota v seznamu. */
export interface DataListItem {
  /** Popisek (klíč). */
  label: string;
  /** Hodnota — řetězec nebo libovolný React uzel. */
  value: React.ReactNode;
}

export interface DataListProps {
  /** Položky k zobrazení. */
  items: DataListItem[];
  /** Počet sloupců. @default 1 */
  columns?: number;
  /** Střídání barvy řádků. @default false */
  striped?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── DataList ───────────────────────────────────────────────────────────────

/**
 * Seznam klíč-hodnota pro detailní zobrazení dat.
 *
 * Zobrazuje popisek vlevo (ztlumený) a hodnotu vpravo.
 * Podporuje rozložení do libovolného počtu sloupců a střídání barvy řádků.
 *
 * @example
 * ```tsx
 * <DataList
 *   items={[
 *     { label: 'Jméno', value: 'Jan Novák' },
 *     { label: 'E-mail', value: 'jan@example.com' },
 *     { label: 'Stav', value: <Tag>Aktivní</Tag> },
 *   ]}
 *   columns={2}
 *   striped
 * />
 * ```
 */
export const DataList: React.FC<DataListProps> = ({
  items,
  columns = 1,
  striped = false,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const cols = Math.max(1, Math.round(columns));

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    color: t.text,
    display: cols > 1 ? 'grid' : 'block',
    gridTemplateColumns: cols > 1 ? `repeat(${cols}, 1fr)` : undefined,
    gap: cols > 1 ? '0 24px' : undefined,
    ...style,
  };

  // For striped with multiple columns, we stripe based on visual row index
  const getStripedIndex = (idx: number): number => {
    if (cols <= 1) return idx;
    return Math.floor(idx / cols);
  };

  const rowStyle = (idx: number): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '16px',
    padding: '10px 12px',
    borderBottom: `1px solid ${t.border}`,
    backgroundColor: striped && getStripedIndex(idx) % 2 === 1 ? t.stripedBg : t.background,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    color: t.textMuted,
    flexShrink: 0,
    letterSpacing: '0.01em',
  };

  const valueStyle: React.CSSProperties = {
    textAlign: 'right',
    lineHeight: '20px',
    wordBreak: 'break-word',
  };

  return (
    <div className={className} style={containerStyle}>
      {items.map((item, idx) => (
        <div key={idx} style={rowStyle(idx)}>
          <span style={labelStyle}>{item.label}</span>
          <span style={valueStyle}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

DataList.displayName = 'DataList';
