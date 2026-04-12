import React, { useState, useMemo, useCallback } from 'react';
import {
  CaretUpDown as CaretUpDownIcon,
  CaretUp as CaretUpIcon,
  CaretDown as CaretDownIcon,
  Check as CheckIcon,
} from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';
import { Skeleton } from '../Skeleton/Skeleton';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    cardBg: 'rgba(3,3,3,0.75)',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    textMuted: '#888888',
    headerBg: 'rgba(255,255,255,0.04)',
    divider: 'rgba(255,255,255,0.08)',
    hover: 'rgba(255,255,255,0.04)',
    selectedBg: 'rgba(252,79,0,0.06)',
    selectedBorder: 'rgba(252,79,0,0.3)',
    checkboxBorder: 'rgba(255,255,255,0.3)',
    checkboxCheckedBg: '#FC4F00',
    checkboxCheckedBorder: '#FC4F00',
    checkboxCheck: '#ffffff',
    sortActive: '#E8612D',
    sortInactive: 'rgba(255,255,255,0.25)',
    sortChipBg: 'rgba(255,255,255,0.06)',
    sortChipActiveBg: 'rgba(232,97,45,0.12)',
    emptyBg: 'rgba(3,3,3,0.75)',
  },
  light: {
    cardBg: 'rgba(255,255,255,0.85)',
    cardBorder: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    textMuted: '#999999',
    headerBg: 'rgba(0,0,0,0.02)',
    divider: 'rgba(0,0,0,0.06)',
    hover: 'rgba(0,0,0,0.03)',
    selectedBg: 'rgba(252,79,0,0.04)',
    selectedBorder: 'rgba(252,79,0,0.25)',
    checkboxBorder: 'rgba(0,0,0,0.25)',
    checkboxCheckedBg: '#FC4F00',
    checkboxCheckedBorder: '#FC4F00',
    checkboxCheck: '#ffffff',
    sortActive: '#E8612D',
    sortInactive: 'rgba(0,0,0,0.2)',
    sortChipBg: 'rgba(0,0,0,0.04)',
    sortChipActiveBg: 'rgba(232,97,45,0.08)',
    emptyBg: 'rgba(255,255,255,0.85)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MobileDataCardColumn {
  /** Klíč dat v řádkovém objektu. */
  key: string;
  /** Zobrazovaný popisek. */
  header: string;
  /** Vlastní renderování hodnoty — stejný podpis jako Table/DataGrid. */
  render?: (value: any, row: any, index: number) => React.ReactNode;
  /** Skrýt tento sloupec z karty. */
  hidden?: boolean;
  /** Zobrazit toto pole jako titulek karty. */
  primary?: boolean;
  /** Povolit řazení podle tohoto sloupce. */
  sortable?: boolean;
}

export interface MobileDataCardProps {
  /** Definice sloupců — stejný tvar jako Table/DataGrid. */
  columns: MobileDataCardColumn[];
  /** Pole dat. */
  data: any[];
  /** Klíč v řádkovém objektu pro titulek karty. Alternativa k `primary` na sloupci. */
  primaryKey?: string;
  /** Klíč identifikátoru řádku. @default 'id' */
  rowKey?: string;
  /** Povolit výběr karet. @default false */
  selectable?: boolean;
  /** Řízené vybrané ID. */
  selectedIds?: string[];
  /** Callback při změně výběru. */
  onSelectionChange?: (ids: string[]) => void;
  /** Callback při kliknutí na kartu. */
  onCardClick?: (row: any) => void;
  /** Callback při řazení. */
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  /** Aktuální klíč řazení. */
  sortKey?: string;
  /** Aktuální směr řazení. */
  sortDirection?: 'asc' | 'desc';
  /** Zobrazit skeleton karty. @default false */
  loading?: boolean;
  /** Počet skeleton karet. @default 3 */
  skeletonCount?: number;
  /** Text prázdného stavu. @default 'Žádná data' */
  emptyText?: string;
  /** Vlastní obsah prázdného stavu. */
  emptyContent?: React.ReactNode;
  /** Mezera mezi kartami v px. @default 12 */
  gap?: number;
  /** Vykreslení akčních tlačítek v patičce karty. */
  cardActions?: (row: any, index: number) => React.ReactNode;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Internal Checkbox ──────────────────────────────────────────────────────

const InternalCheckbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  t: (typeof tokens)[keyof typeof tokens];
}> = ({ checked, indeterminate, onChange, t }) => (
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
        e.stopPropagation();
        onChange();
      }
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      border: `1.5px solid ${checked || indeterminate ? t.checkboxCheckedBorder : t.checkboxBorder}`,
      backgroundColor: checked || indeterminate ? t.checkboxCheckedBg : 'transparent',
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'all 0.12s ease',
    }}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke={t.checkboxCheck} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {indeterminate && !checked && (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 6H9" stroke={t.checkboxCheck} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )}
  </span>
);

// ─── MobileDataCard ─────────────────────────────────────────────────────────

/**
 * Mobilní zobrazení dat ve formě karet.
 *
 * Každý datový řádek se zobrazí jako karta s páry popisek-hodnota.
 * Kombinuje funkce Table (řazení, custom render) a DataGrid
 * (výběr, kliknutí na řádek, skeleton).
 *
 * @example
 * ```tsx
 * <MobileDataCard
 *   columns={[
 *     { key: 'name', header: 'Jméno', primary: true },
 *     { key: 'email', header: 'Email' },
 *     { key: 'role', header: 'Role' },
 *   ]}
 *   data={users}
 *   selectable
 *   onCardClick={(row) => openDetail(row)}
 *   cardActions={(row) => (
 *     <>
 *       <Button size="sm" variant="outline" onClick={() => edit(row)}>Upravit</Button>
 *       <Button size="sm" variant="destructive" onClick={() => del(row)}>Smazat</Button>
 *     </>
 *   )}
 * />
 * ```
 */
export const MobileDataCard: React.FC<MobileDataCardProps> = ({
  columns,
  data,
  primaryKey,
  rowKey = 'id',
  selectable = false,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  onCardClick,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  skeletonCount = 3,
  emptyText = 'Žádná data',
  emptyContent,
  gap = 12,
  cardActions,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const isControlled = controlledSelectedIds !== undefined;
  const selectedSet = useMemo(
    () => isControlled ? new Set(controlledSelectedIds) : internalSelected,
    [isControlled, controlledSelectedIds, internalSelected],
  );

  // ── Column helpers ─────────────────────────────────────────────────────

  const primaryCol = useMemo(
    () => columns.find((c) => c.primary) || (primaryKey ? columns.find((c) => c.key === primaryKey) : undefined),
    [columns, primaryKey],
  );

  const visibleColumns = useMemo(
    () => columns.filter((c) => !c.hidden && c !== primaryCol),
    [columns, primaryCol],
  );

  const sortableColumns = useMemo(
    () => columns.filter((c) => c.sortable),
    [columns],
  );

  // ── Selection ──────────────────────────────────────────────────────────

  const toggleSelection = useCallback(
    (id: string) => {
      const next = new Set(selectedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (isControlled) {
        onSelectionChange?.(Array.from(next));
      } else {
        setInternalSelected(next);
        onSelectionChange?.(Array.from(next));
      }
    },
    [selectedSet, isControlled, onSelectionChange],
  );

  const toggleAll = useCallback(() => {
    const allIds = data.map((row) => String(row[rowKey]));
    const allSelected = allIds.every((id) => selectedSet.has(id));
    const next = allSelected ? new Set<string>() : new Set(allIds);
    if (isControlled) {
      onSelectionChange?.(Array.from(next));
    } else {
      setInternalSelected(next);
      onSelectionChange?.(Array.from(next));
    }
  }, [data, rowKey, selectedSet, isControlled, onSelectionChange]);

  const allSelected = data.length > 0 && data.every((row) => selectedSet.has(String(row[rowKey])));
  const someSelected = data.some((row) => selectedSet.has(String(row[rowKey]))) && !allSelected;

  // ── Sort handler ───────────────────────────────────────────────────────

  const handleSort = useCallback(
    (key: string) => {
      if (!onSort) return;
      const newDir = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(key, newDir);
    },
    [onSort, sortKey, sortDirection],
  );

  // ── Skeleton cards ─────────────────────────────────────────────────────

  if (loading) {
    const skeletonRows = visibleColumns.length > 0 ? visibleColumns.length : 3;

    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, ...style }}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '12px',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Skeleton header */}
            {(primaryCol || selectable) && (
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.divider}`, backgroundColor: t.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectable && <Skeleton variant="rect" width={18} height={18} />}
                <Skeleton variant="text" width="45%" height={18} />
              </div>
            )}
            {/* Skeleton rows */}
            {Array.from({ length: skeletonRows }).map((_, r) => (
              <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: r < skeletonRows - 1 ? `1px solid ${t.divider}` : 'none' }}>
                <Skeleton variant="text" width={70} height={12} />
                <Skeleton variant="text" width={100} height={14} />
              </div>
            ))}
            {/* Skeleton actions */}
            {cardActions && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderTop: `1px solid ${t.divider}` }}>
                <Skeleton variant="rect" width={64} height={30} />
                <Skeleton variant="rect" width={64} height={30} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────

  if (data.length === 0) {
    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, ...style }}>
        <div
          style={{
            backgroundColor: t.emptyBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '12px',
            padding: '32px 16px',
            textAlign: 'center',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            color: t.textSecondary,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {emptyContent ?? emptyText}
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        fontFamily: "'Zalando Sans', sans-serif",
        ...style,
      }}
    >
      {/* Toolbar: select all + sort chips */}
      {(selectable || sortableColumns.length > 0) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '4px 0',
          }}
        >
          {selectable && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginRight: '4px',
              }}
            >
              <InternalCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                t={t}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: t.textSecondary,
                  fontFamily: "'Zalando Sans Expanded', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {selectedSet.size > 0 ? `${selectedSet.size} vybráno` : 'Vybrat vše'}
              </span>
            </div>
          )}

          {sortableColumns.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: selectable ? 'auto' : 0 }}>
              {sortableColumns.map((col) => {
                const isActive = sortKey === col.key;
                return (
                  <button
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isActive ? t.sortChipActiveBg : t.sortChipBg,
                      color: isActive ? t.sortActive : t.textSecondary,
                      fontFamily: "'Zalando Sans', sans-serif",
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {col.header}
                    {isActive ? (
                      sortDirection === 'asc'
                        ? <CaretUpIcon size={12} weight="bold" />
                        : <CaretDownIcon size={12} weight="bold" />
                    ) : (
                      <CaretUpDownIcon size={12} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Cards */}
      {data.map((row, rowIdx) => {
        const id = String(row[rowKey]);
        const isSelected = selectedSet.has(id);
        const isHovered = hoveredCard === id;

        const primaryValue = primaryCol
          ? (primaryCol.render
            ? primaryCol.render(row[primaryCol.key], row, rowIdx)
            : row[primaryCol.key])
          : null;

        return (
          <div
            key={id ?? rowIdx}
            style={{
              backgroundColor: isSelected ? t.selectedBg : isHovered ? t.hover : t.cardBg,
              border: `1px solid ${isSelected ? t.selectedBorder : t.cardBorder}`,
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: onCardClick ? 'pointer' : 'default',
              transition: 'background-color 0.12s ease, border-color 0.12s ease',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={() => onCardClick?.(row)}
            onMouseEnter={() => setHoveredCard(id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Card header */}
            {(primaryValue !== null || selectable) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  backgroundColor: t.headerBg,
                  borderBottom: `1px solid ${t.divider}`,
                }}
              >
                {selectable && (
                  <InternalCheckbox
                    checked={isSelected}
                    onChange={() => toggleSelection(id)}
                    t={t}
                  />
                )}
                {primaryValue !== null && (
                  <span
                    style={{
                      flex: 1,
                      fontWeight: 600,
                      fontSize: '15px',
                      color: t.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {primaryValue}
                  </span>
                )}
              </div>
            )}

            {/* Card body — label:value pairs */}
            <div>
              {visibleColumns.map((col, colIdx) => {
                const value = col.render
                  ? col.render(row[col.key], row, rowIdx)
                  : row[col.key];

                return (
                  <div
                    key={col.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '10px 16px',
                      borderBottom: colIdx < visibleColumns.length - 1 ? `1px solid ${t.divider}` : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Zalando Sans Expanded', sans-serif",
                        fontSize: '11px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        color: t.textSecondary,
                        flexShrink: 0,
                        paddingTop: '2px',
                      }}
                    >
                      {col.header}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: t.text,
                        textAlign: 'right',
                        wordBreak: 'break-word',
                      }}
                    >
                      {value ?? '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Card actions footer */}
            {cardActions && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  padding: '12px 16px',
                  borderTop: `1px solid ${t.divider}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {cardActions(row, rowIdx)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

MobileDataCard.displayName = 'MobileDataCard';
