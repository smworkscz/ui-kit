import React, { useState, useCallback, useMemo } from 'react';
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
    textMuted: '#888888',
    rowHover: 'rgba(255,255,255,0.04)',
    selectedRowBg: 'rgba(252,79,0,0.06)',
    checkboxBorder: 'rgba(255,255,255,0.3)',
    checkboxCheckedBg: '#FC4F00',
    checkboxCheckedBorder: '#FC4F00',
    checkboxCheck: '#ffffff',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    headerBg: 'rgba(0,0,0,0.02)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    textMuted: '#999999',
    rowHover: 'rgba(0,0,0,0.03)',
    selectedRowBg: 'rgba(252,79,0,0.04)',
    checkboxBorder: 'rgba(0,0,0,0.25)',
    checkboxCheckedBg: '#FC4F00',
    checkboxCheckedBorder: '#FC4F00',
    checkboxCheck: '#ffffff',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Definice sloupce pro DataGrid. */
export interface DataGridColumn {
  /** Klíč odpovídající hodnotě v datovém objektu. */
  key: string;
  /** Text záhlaví sloupce. */
  header: string;
  /** Šířka sloupce (CSS hodnota). */
  width?: string | number;
  /** Minimální šířka sloupce v pixelech. */
  minWidth?: number;
  /** Zarovnání obsahu. @default 'left' */
  align?: 'left' | 'center' | 'right';
  /** Povolí řazení podle tohoto sloupce. @default false */
  sortable?: boolean;
  /** Povolí editaci buňky (placeholder pro budoucí implementaci). @default false */
  editable?: boolean;
  /** Vlastní vykreslovací funkce pro buňku. */
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface DataGridProps {
  /** Definice sloupců. */
  columns: DataGridColumn[];
  /** Data k zobrazení — pole objektů. */
  data: any[];
  /** Povolí výběr řádků pomocí zaškrtávacích políček. @default false */
  selectable?: boolean;
  /** Callback při změně výběru řádků. */
  onSelectionChange?: (ids: string[]) => void;
  /** Při `true` se zobrazí skeleton řádky. @default false */
  loading?: boolean;
  /** Klíč pro identifikaci řádků. @default 'id' */
  rowKey?: string;
  /** Callback při kliknutí na řádek. */
  onRowClick?: (row: any) => void;
  /** Fixní záhlaví při scrollování. @default false */
  stickyHeader?: boolean;
  /** Text zobrazený při prázdných datech. @default 'Žádná data' */
  emptyText?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Checkbox ───────────────────────────────────────────────────────────────

interface InternalCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  t: (typeof tokens)['dark'] | (typeof tokens)['light'];
}

const InternalCheckbox: React.FC<InternalCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  t,
}) => {
  const isActive = checked || indeterminate;

  return (
    <span
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange();
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        border: `1.5px solid ${isActive ? t.checkboxCheckedBorder : t.checkboxBorder}`,
        backgroundColor: isActive ? t.checkboxCheckedBg : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.12s ease',
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5L4.2 7.5L8 2.5"
            stroke={t.checkboxCheck}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {indeterminate && !checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <line
            x1="2"
            y1="5"
            x2="8"
            y2="5"
            stroke={t.checkboxCheck}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
};

// ─── DataGrid ───────────────────────────────────────────────────────────────

/**
 * Pokročilá datová mřížka s výběrem řádků, sticky záhlavím a loading stavem.
 *
 * Rozšiřuje vzor Table o zaškrtávací políčka pro výběr,
 * klikání na řádky a skeleton placeholder při načítání.
 *
 * @example
 * ```tsx
 * <DataGrid
 *   columns={[
 *     { key: 'name', header: 'Jméno', minWidth: 200 },
 *     { key: 'email', header: 'E-mail' },
 *     { key: 'role', header: 'Role', align: 'center' },
 *   ]}
 *   data={users}
 *   selectable
 *   stickyHeader
 *   onSelectionChange={(ids) => console.log(ids)}
 *   onRowClick={(row) => console.log(row)}
 * />
 * ```
 */
export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  selectable = false,
  onSelectionChange,
  loading = false,
  rowKey = 'id',
  onRowClick,
  stickyHeader = false,
  emptyText = 'Žádná data',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const allIds = useMemo(() => data.map((row) => String(row[rowKey])), [data, rowKey]);

  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = allIds.some((id) => selectedIds.has(id)) && !allSelected;

  const toggleAll = useCallback(() => {
    const next = allSelected ? new Set<string>() : new Set(allIds);
    setSelectedIds(next);
    onSelectionChange?.(Array.from(next));
  }, [allSelected, allIds, onSelectionChange]);

  const toggleRow = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        onSelectionChange?.(Array.from(next));
        return next;
      });
    },
    [onSelectionChange],
  );

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    color: t.text,
    backgroundColor: t.background,
  };

  const thStyle = (col: DataGridColumn): React.CSSProperties => ({
    padding: '12px 16px',
    textAlign: col.align || 'left',
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontWeight: 500,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: t.textSecondary,
    backgroundColor: t.headerBg,
    borderBottom: `1px solid ${t.border}`,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    width: col.width != null ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : undefined,
    minWidth: col.minWidth != null ? `${col.minWidth}px` : undefined,
    ...(stickyHeader
      ? {
          position: 'sticky' as const,
          top: 0,
          zIndex: 2,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }
      : {}),
  });

  const tdStyle = (col: DataGridColumn): React.CSSProperties => ({
    padding: '10px 16px',
    borderBottom: `1px solid ${t.border}`,
    lineHeight: 'normal',
    textAlign: col.align || 'left',
  });

  const checkboxThStyle: React.CSSProperties = {
    padding: '12px 12px 12px 16px',
    backgroundColor: t.headerBg,
    borderBottom: `1px solid ${t.border}`,
    width: '40px',
    ...(stickyHeader
      ? {
          position: 'sticky' as const,
          top: 0,
          zIndex: 2,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }
      : {}),
  };

  const checkboxTdStyle: React.CSSProperties = {
    padding: '10px 12px 10px 16px',
    borderBottom: `1px solid ${t.border}`,
    width: '40px',
  };

  const skeletonRows = 5;

  return (
    <div
      className={className}
      style={{
        overflow: stickyHeader ? 'auto' : 'hidden',
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        ...style,
      }}
    >
      <table style={tableStyle}>
        <thead>
          <tr>
            {selectable && (
              <th style={checkboxThStyle}>
                <InternalCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  t={t}
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} style={thStyle(col)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                <tr key={`skel-${rowIdx}`}>
                  {selectable && (
                    <td style={checkboxTdStyle}>
                      <Skeleton variant="rect" width={16} height={16} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={tdStyle(col)}>
                      <Skeleton variant="text" width="80%" />
                    </td>
                  ))}
                </tr>
              ))
            : data.length === 0
              ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      style={{
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
              : data.map((row, rowIdx) => {
                  const id = String(row[rowKey]);
                  const isSelected = selectedIds.has(id);
                  const isHovered = hoveredRow === id;
                  const isLastRow = rowIdx === data.length - 1;

                  let rowBg = 'transparent';
                  if (isSelected) rowBg = t.selectedRowBg;
                  else if (isHovered) rowBg = t.rowHover;

                  return (
                    <tr
                      key={id}
                      style={{
                        backgroundColor: rowBg,
                        cursor: onRowClick ? 'pointer' : 'default',
                        transition: 'background-color 0.12s ease',
                      }}
                      onMouseEnter={() => setHoveredRow(id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td
                          style={{
                            ...checkboxTdStyle,
                            borderBottom: isLastRow ? 'none' : checkboxTdStyle.borderBottom,
                          }}
                        >
                          <InternalCheckbox
                            checked={isSelected}
                            onChange={() => toggleRow(id)}
                            t={t}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          style={{
                            ...tdStyle(col),
                            borderBottom: isLastRow ? 'none' : tdStyle(col).borderBottom,
                          }}
                        >
                          {col.render
                            ? col.render(row[col.key], row, rowIdx)
                            : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
        </tbody>
      </table>
    </div>
  );
};

DataGrid.displayName = 'DataGrid';
