import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DotsSixVertical as DragHandleIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    insertionLine: '#FC4F00',
    dragOverlay: 'rgba(24,24,24,0.95)',
    dragBorder: 'rgba(255,255,255,0.12)',
    dragShadow: '0 8px 30px rgba(0,0,0,0.5)',
    handleColor: 'rgba(255,255,255,0.3)',
    handleHover: 'rgba(255,255,255,0.6)',
  },
  light: {
    insertionLine: '#FC4F00',
    dragOverlay: 'rgba(255,255,255,0.95)',
    dragBorder: 'rgba(0,0,0,0.1)',
    dragShadow: '0 8px 30px rgba(0,0,0,0.15)',
    handleColor: 'rgba(0,0,0,0.2)',
    handleHover: 'rgba(0,0,0,0.5)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SortableListProps<T> {
  /** Datové položky. */
  items: T[];
  /** Stable key pro React reconciliation + drag tracking. */
  keyExtractor: (item: T) => string | number;
  /** Render každé položky. dragHandle je DOM node co lze umístit kdekoli. */
  renderItem: (item: T, dragHandle: React.ReactNode) => React.ReactNode;
  /** Po dokončení dragu, nové pořadí celého arraye. */
  onReorder: (newOrder: T[]) => void;
  /** Osa řazení. @default 'vertical' */
  direction?: 'vertical' | 'horizontal';
  /** whole = drag celé položky; explicit = jen z handle node. @default 'whole' */
  handle?: 'whole' | 'explicit';
  /** Vypne drag. @default false */
  disabled?: boolean;
  /** Mezera mezi položkami. */
  gap?: number | string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── SortableList ────────────────────────────────────────────────────────────

/**
 * Drag-to-reorder generic list.
 *
 * Podporuje myš i touch, klávesové ovládání (Tab → Space pick → arrows move → Space drop),
 * insertion line indikátor a explicit/whole handle mode.
 *
 * @example
 * ```tsx
 * <SortableList
 *   items={priorities}
 *   keyExtractor={(p) => p.id}
 *   onReorder={savePriorities}
 *   renderItem={(item, dragHandle) => (
 *     <div style={{ display: 'flex', gap: 8 }}>
 *       {dragHandle}
 *       <span>{item.label}</span>
 *     </div>
 *   )}
 *   handle="explicit"
 * />
 * ```
 */
export function SortableList<T>({
  items,
  keyExtractor,
  renderItem,
  onReorder,
  direction = 'vertical',
  handle = 'whole',
  disabled = false,
  gap,
  style,
  className,
}: SortableListProps<T>) {
  const theme = useTheme();
  const t = tokens[theme];
  const isVertical = direction === 'vertical';

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [kbPickedIndex, setKbPickedIndex] = useState<number | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const dragStartPos = useRef({ x: 0, y: 0 });

  // ── Pointer drag ────────────────────────────────────────────────────────

  const startDrag = useCallback((idx: number, e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    dragStartPos.current = pos;
    setDragIndex(idx);
    setOverIndex(idx);
  }, [disabled]);

  useEffect(() => {
    if (dragIndex === null) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

      // Find which item we're over
      let closest = dragIndex;
      let closestDist = Infinity;
      itemRefs.current.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const center = isVertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
        const cursor = isVertical ? pos.y : pos.x;
        const dist = Math.abs(cursor - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = idx;
        }
      });
      setOverIndex(closest);
    };

    const handleEnd = () => {
      if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
        const newItems = [...items];
        const [moved] = newItems.splice(dragIndex, 1);
        newItems.splice(overIndex, 0, moved);
        onReorder(newItems);
      }
      setDragIndex(null);
      setOverIndex(null);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragIndex, overIndex, items, onReorder, isVertical]);

  // ── Keyboard ────────────────────────────────────────────────────────────

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (kbPickedIndex === null) {
        setKbPickedIndex(idx);
      } else {
        // Drop
        if (kbPickedIndex !== idx) {
          const newItems = [...items];
          const [moved] = newItems.splice(kbPickedIndex, 1);
          newItems.splice(idx, 0, moved);
          onReorder(newItems);
        }
        setKbPickedIndex(null);
      }
    } else if (kbPickedIndex !== null) {
      const key = isVertical ? (e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0) : (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0);
      if (key !== 0) {
        e.preventDefault();
        const newIdx = Math.max(0, Math.min(items.length - 1, kbPickedIndex + key));
        if (newIdx !== kbPickedIndex) {
          const newItems = [...items];
          const [moved] = newItems.splice(kbPickedIndex, 1);
          newItems.splice(newIdx, 0, moved);
          onReorder(newItems);
          setKbPickedIndex(newIdx);
        }
      }
      if (e.key === 'Escape') {
        setKbPickedIndex(null);
      }
    }
  }, [disabled, kbPickedIndex, items, onReorder, isVertical]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: gap ?? 0,
        position: 'relative',
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const key = keyExtractor(item);
        const isDragging = dragIndex === idx;
        const isKbPicked = kbPickedIndex === idx;
        const showInsertBefore = dragIndex !== null && overIndex === idx && dragIndex > idx;
        const showInsertAfter = dragIndex !== null && overIndex === idx && dragIndex < idx;

        const dragHandle = handle === 'explicit' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: disabled ? 'default' : 'grab',
              color: t.handleColor,
              transition: 'color 0.12s ease',
              touchAction: 'none',
            }}
            onMouseDown={(e) => startDrag(idx, e)}
            onTouchStart={(e) => startDrag(idx, e)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = t.handleHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = t.handleColor; }}
          >
            <DragHandleIcon size={16} />
          </span>
        ) : null;

        const itemProps = handle === 'whole' ? {
          onMouseDown: (e: React.MouseEvent) => startDrag(idx, e),
          onTouchStart: (e: React.TouchEvent) => startDrag(idx, e),
          style: { cursor: disabled ? 'default' : 'grab', touchAction: 'none' as const },
        } : {};

        return (
          <div
            key={key}
            ref={(el) => { if (el) itemRefs.current.set(idx, el); else itemRefs.current.delete(idx); }}
            tabIndex={disabled ? -1 : 0}
            role="listitem"
            aria-grabbed={isDragging || isKbPicked}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            {...(handle === 'whole' ? itemProps : {})}
            style={{
              position: 'relative',
              opacity: isDragging ? 0.4 : 1,
              outline: isKbPicked ? `2px solid ${t.insertionLine}` : 'none',
              outlineOffset: '2px',
              borderRadius: '4px',
              transition: 'opacity 0.15s ease',
              ...(handle === 'whole' ? (itemProps as any).style : {}),
            }}
          >
            {/* Insertion line */}
            {showInsertBefore && (
              <div style={{
                position: 'absolute',
                [isVertical ? 'top' : 'left']: -1,
                [isVertical ? 'left' : 'top']: 0,
                [isVertical ? 'right' : 'bottom']: 0,
                [isVertical ? 'height' : 'width']: '2px',
                backgroundColor: t.insertionLine,
                borderRadius: '1px',
                zIndex: 10,
              }} />
            )}

            {renderItem(item, dragHandle)}

            {/* Insertion line after */}
            {showInsertAfter && (
              <div style={{
                position: 'absolute',
                [isVertical ? 'bottom' : 'right']: -1,
                [isVertical ? 'left' : 'top']: 0,
                [isVertical ? 'right' : 'bottom']: 0,
                [isVertical ? 'height' : 'width']: '2px',
                backgroundColor: t.insertionLine,
                borderRadius: '1px',
                zIndex: 10,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

(SortableList as any).displayName = 'SortableList';
