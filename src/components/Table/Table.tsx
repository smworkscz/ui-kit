import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Skeleton } from '../Skeleton/Skeleton';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    headerBg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    rowHover: 'rgba(255,255,255,0.04)',
    stripedBg: 'rgba(255,255,255,0.06)',
    sortActive: '#E8612D',
    sortInactive: 'rgba(255,255,255,0.25)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    headerBg: 'rgba(0,0,0,0.02)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    rowHover: 'rgba(0,0,0,0.03)',
    stripedBg: 'rgba(0,0,0,0.04)',
    sortActive: '#E8612D',
    sortInactive: 'rgba(0,0,0,0.2)',
  },
} as const;

// ─── Sort icon ───────────────────────────────────────────────────────────────

const SortIcon: React.FC<{ direction?: 'asc' | 'desc'; active: boolean; activeColor: string; inactiveColor: string }> = ({
  direction,
  active,
  activeColor,
  inactiveColor,
}) => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, marginLeft: '4px' }}>
    <path
      d="M6 1.5L9.5 5.5H2.5L6 1.5Z"
      fill={active && direction === 'asc' ? activeColor : inactiveColor}
    />
    <path
      d="M6 12.5L2.5 8.5H9.5L6 12.5Z"
      fill={active && direction === 'desc' ? activeColor : inactiveColor}
    />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TableColumn {
  /** Klíč odpovídající hodnotě v datovém objektu. */
  key: string;
  /** Text záhlaví sloupce. */
  header: string;
  /** Povolí řazení podle tohoto sloupce. @default false */
  sortable?: boolean;
  /** Šířka sloupce (CSS hodnota). */
  width?: string | number;
  /** Vlastní vykreslovací funkce pro buňku. */
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface TableProps {
  /** Definice sloupců tabulky. */
  columns: TableColumn[];
  /** Data k zobrazení — pole objektů. */
  data: any[];
  /** Při `true` se místo dat zobrazí skeleton řádky. @default false */
  loading?: boolean;
  /** Text zobrazený při prázdných datech. @default 'Žádná data' */
  emptyText?: string;
  /** Voláno při kliknutí na řaditelný sloupec. Řazení dat je na straně uživatele — komponenta pouze informuje o zvoleném klíči a směru. */
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  /** Aktuální klíč řazení (pouze vizuální indikátor, samotné řazení provádí uživatel). */
  sortKey?: string;
  /** Aktuální směr řazení (pouze vizuální indikátor). */
  sortDirection?: 'asc' | 'desc';
  /** Střídání barvy řádků. @default false */
  striped?: boolean;
  /** Zvýraznění řádku při najetí myší. @default true */
  hoverable?: boolean;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Table ───────────────────────────────────────────────────────────────────

/**
 * Datová tabulka dle SM-UI design systému.
 *
 * Podporuje řazení, loading stav se Skeleton řádky,
 * prázdný stav, střídání barev řádků a tmavý / světlý režim.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Jméno', sortable: true },
 *     { key: 'email', header: 'E-mail' },
 *   ]}
 *   data={users}
 *   onSort={handleSort}
 *   sortKey="name"
 *   sortDirection="asc"
 *   striped
 * />
 * ```
 */
export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyText = 'Žádná data',
  onSort,
  sortKey,
  sortDirection,
  striped = false,
  hoverable = true,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const handleSort = (col: TableColumn) => {
    if (!col.sortable || !onSort) return;
    const nextDir: 'asc' | 'desc' =
      sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(col.key, nextDir);
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    color: t.text,
    backgroundColor: t.background,
    border: `1px solid ${t.border}`,
    borderRadius: '12px',
    overflow: 'hidden',
    ...style,
  };

  const thStyle = (col: TableColumn): React.CSSProperties => ({
    padding: '12px 16px',
    textAlign: 'left',
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontWeight: 500,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: t.textSecondary,
    backgroundColor: t.headerBg,
    borderBottom: `1px solid ${t.border}`,
    whiteSpace: 'nowrap',
    cursor: col.sortable ? 'pointer' : 'default',
    userSelect: 'none',
    width: col.width != null ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : undefined,
  });

  const tdStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderBottom: `1px solid ${t.border}`,
    lineHeight: 'normal',
  };

  const skeletonRows = 5;

  return (
    <table className={className} style={tableStyle}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={thStyle(col)}
              onClick={() => handleSort(col)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {col.header}
                {col.sortable && (
                  <SortIcon
                    direction={sortDirection}
                    active={sortKey === col.key}
                    activeColor={t.sortActive}
                    inactiveColor={t.sortInactive}
                  />
                )}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr key={`skel-${rowIdx}`}>
                {columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    <Skeleton variant="text" width="80%" />
                  </td>
                ))}
              </tr>
            ))
          : data.length === 0
            ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      ...tdStyle,
                      textAlign: 'center',
                      padding: '32px 16px',
                      color: t.textSecondary,
                      borderBottom: 'none',
                    }}
                  >
                    {emptyText}
                  </td>
                </tr>
              )
            : data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    backgroundColor:
                      striped && rowIdx % 2 === 1 ? t.stripedBg : 'transparent',
                    transition: 'background-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (hoverable) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = t.rowHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hoverable) {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        striped && rowIdx % 2 === 1 ? t.stripedBg : 'transparent';
                    }
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        ...tdStyle,
                        borderBottom:
                          rowIdx === data.length - 1 ? 'none' : tdStyle.borderBottom,
                      }}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIdx)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
      </tbody>
    </table>
  );
};

Table.displayName = 'Table';
