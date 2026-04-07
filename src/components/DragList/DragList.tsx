import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DotsSixVertical as DotsSixVerticalIcon, CaretRight as CaretRightIcon, ArrowBendDownRight as ArrowBendDownRightIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    itemBg: 'rgba(255,255,255,0.04)',
    itemBorder: 'rgba(255,255,255,0.08)',
    itemHoverBg: 'rgba(255,255,255,0.07)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    gripColor: 'rgba(255,255,255,0.2)',
    gripHover: 'rgba(255,255,255,0.5)',
    dropIndicator: '#E8612D',
    nestHighlight: 'rgba(232,97,45,0.10)',
    nestBorder: 'rgba(232,97,45,0.4)',
    chevron: 'rgba(255,255,255,0.4)',
    chevronHover: '#ffffff',
    treeLine: 'rgba(255,255,255,0.08)',
  },
  light: {
    itemBg: 'rgba(0,0,0,0.02)',
    itemBorder: 'rgba(0,0,0,0.07)',
    itemHoverBg: 'rgba(0,0,0,0.04)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    gripColor: 'rgba(0,0,0,0.15)',
    gripHover: 'rgba(0,0,0,0.4)',
    dropIndicator: '#FC4F00',
    nestHighlight: 'rgba(252,79,0,0.06)',
    nestBorder: 'rgba(252,79,0,0.35)',
    chevron: 'rgba(0,0,0,0.3)',
    chevronHover: '#1a1a1a',
    treeLine: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Keyframes ──────────────────────────────────────────────────────────────

const ANIM_NAME = 'smDragListPulse';
const KEYFRAMES_CSS = `@keyframes ${ANIM_NAME}{0%,100%{opacity:1}50%{opacity:0.5}}`;


// ─── Types ───────────────────────────────────────────────────────────────────

export interface DragListItem {
  /** Unikátní identifikátor položky. */
  id: string;
  /** Textový popisek položky. */
  label: string;
  /** Volitelná ikona zobrazená před popiskem. */
  icon?: React.ReactNode;
  /** Potomci položky (pro stromový režim). */
  children?: DragListItem[];
  /** Zda je položka rozbalena (pro stromový režim). @default false */
  expanded?: boolean;
  /** Libovolná uživatelská data. */
  data?: any;
}

type DropPosition = 'before' | 'after' | 'inside';

interface DragState {
  targetId: string;
  position: DropPosition;
}

/** Props předané do `renderItem` funkce pro ovládání drag handlu. */
export interface DragHandleProps {
  /** Spread na element, který má sloužit jako drag handle. */
  handleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
    'aria-label': string;
  };
  /** Zda je položka právě přetahována. */
  isDragging: boolean;
  /** Hloubka vnoření (0 = root). */
  depth: number;
  /** Zda je položka rozbalena (stromový režim). */
  isExpanded: boolean;
  /** Přepne rozbalení/sbalení potomků. */
  toggleExpand: () => void;
  /** Zda má položka potomky. */
  hasChildren: boolean;
}

export interface DragListProps {
  /** Seznam položek k zobrazení. */
  items: DragListItem[];
  /** Callback volaný při změně pořadí položek. */
  onReorder: (items: DragListItem[]) => void;
  /**
   * Vlastní vykreslovací funkce pro položku.
   * Přijímá `item`, `dragHandleProps` a další metadata.
   * Pokud není zadána, použije se výchozí vykreslení s gripem a textem.
   *
   * @example
   * ```tsx
   * renderItem={(item, { handleProps, isDragging }) => (
   *   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
   *     <span {...handleProps}>⠿</span>
   *     <span>{item.label}</span>
   *   </div>
   * )}
   * ```
   */
  renderItem?: (item: DragListItem, props: DragHandleProps) => React.ReactNode;
  /** Povolí vnořování položek (stromový režim). @default false */
  allowNesting?: boolean;
  /** Maximální hloubka vnoření. @default 3 */
  maxDepth?: number;
  /**
   * Zda je celá karta přetahovatelná, nebo jen grip handle.
   * Při `'handle'` je karta přetahovatelná jen za grip/handle element.
   * @default 'full'
   */
  dragMode?: 'full' | 'handle';
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function findItem(items: DragListItem[], id: string): DragListItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function isDescendant(items: DragListItem[], ancestorId: string, descendantId: string): boolean {
  const ancestor = findItem(items, ancestorId);
  if (!ancestor || !ancestor.children) return false;
  for (const child of ancestor.children) {
    if (child.id === descendantId) return true;
    if (isDescendant([child], child.id, descendantId)) return true;
  }
  return false;
}

function removeItem(items: DragListItem[], id: string): [DragListItem[], DragListItem | null] {
  let removed: DragListItem | null = null;
  const result = items.reduce<DragListItem[]>((acc, item) => {
    if (item.id === id) {
      removed = item;
      return acc;
    }
    if (item.children) {
      const [newChildren, found] = removeItem(item.children, id);
      if (found) removed = found;
      acc.push({ ...item, children: newChildren.length > 0 ? newChildren : undefined });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
  return [result, removed];
}

function insertItem(
  items: DragListItem[],
  targetId: string,
  position: DropPosition,
  itemToInsert: DragListItem,
): DragListItem[] {
  if (position === 'inside') {
    return items.map((item) => {
      if (item.id === targetId) {
        return {
          ...item,
          children: [...(item.children || []), itemToInsert],
          expanded: true,
        };
      }
      if (item.children) {
        return { ...item, children: insertItem(item.children, targetId, position, itemToInsert) };
      }
      return item;
    });
  }

  const result: DragListItem[] = [];
  for (const item of items) {
    if (item.id === targetId) {
      if (position === 'before') {
        result.push(itemToInsert);
        result.push(item);
      } else {
        result.push(item);
        result.push(itemToInsert);
      }
    } else {
      if (item.children) {
        result.push({ ...item, children: insertItem(item.children, targetId, position, itemToInsert) });
      } else {
        result.push(item);
      }
    }
  }
  return result;
}

function toggleExpanded(items: DragListItem[], id: string): DragListItem[] {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, expanded: !item.expanded };
    }
    if (item.children) {
      return { ...item, children: toggleExpanded(item.children, id) };
    }
    return item;
  });
}

function setExpanded(items: DragListItem[], id: string, expanded: boolean): DragListItem[] {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, expanded };
    }
    if (item.children) {
      return { ...item, children: setExpanded(item.children, id, expanded) };
    }
    return item;
  });
}

// ─── Drop indicator ─────────────────────────────────────────────────────────

const DropIndicator: React.FC<{ color: string }> = ({ color }) => (
  <div style={{
    height: '2px',
    backgroundColor: color,
    borderRadius: '1px',
    position: 'relative',
    animation: `${ANIM_NAME} 1.2s ease-in-out infinite`,
    width: '100%',
  }}>
    <div style={{
      position: 'absolute',
      left: '-3px',
      top: '-3px',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: color,
    }} />
  </div>
);

// ─── DragListRow ────────────────────────────────────────────────────────────

interface DragListRowProps {
  item: DragListItem;
  depth: number;
  allowNesting: boolean;
  maxDepth: number;
  draggedId: string | null;
  dropState: DragState | null;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string, depth: number) => void;
  onDragLeave: (e: React.DragEvent, cardEl: HTMLElement) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleExpand: (id: string) => void;
  renderItem?: (item: DragListItem, props: DragHandleProps) => React.ReactNode;
  dragMode: 'full' | 'handle';
  tokens: (typeof tokens)['dark'] | (typeof tokens)['light'];
}

const DragListRow: React.FC<DragListRowProps> = ({
  item,
  depth,
  allowNesting,
  maxDepth,
  draggedId,
  dropState,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onToggleExpand,
  renderItem,
  dragMode,
  tokens: t,
}) => {
  const [gripHover, setGripHover] = useState(false);
  const [rowHover, setRowHover] = useState(false);
  const [chevronHover, setChevronHover] = useState(false);
  const handleActiveRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = item.expanded ?? false;
  const isDragged = draggedId === item.id;
  const isDragging = draggedId !== null;
  const isHandleMode = dragMode === 'handle';
  const isDropTarget = dropState?.targetId === item.id;

  const showIndicatorBefore = isDropTarget && dropState?.position === 'before';
  const showIndicatorAfter = isDropTarget && dropState?.position === 'after';
  const showNestHighlight = isDropTarget && dropState?.position === 'inside';

  // Barva pozadí karty
  const cardBg = isDragged
    ? 'transparent'
    : showNestHighlight
      ? t.nestHighlight
      : rowHover && !isDragging
        ? t.itemHoverBg
        : t.itemBg;

  const cardBorder = showNestHighlight ? t.nestBorder : isDragged ? 'transparent' : t.itemBorder;

  return (
    <div style={{
      paddingLeft: depth > 0 ? `${depth * 28}px` : 0,
      position: 'relative',
    }}>
      {/* Indikátor PŘED */}
      {showIndicatorBefore && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          left: depth > 0 ? `${depth * 28 + 4}px` : '4px',
          right: '4px',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <DropIndicator color={t.dropIndicator} />
        </div>
      )}

      {/* Karta položky */}
      <div
        ref={cardRef}
        draggable
        onDragStart={(e) => {
          if (isHandleMode && !handleActiveRef.current) {
            e.preventDefault();
            return;
          }
          handleActiveRef.current = false;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', item.id);
          if (cardRef.current) {
            const ghost = cardRef.current.cloneNode(true) as HTMLElement;
            ghost.style.width = `${cardRef.current.offsetWidth}px`;
            ghost.style.opacity = '0.85';
            ghost.style.transform = 'rotate(1.5deg) scale(1.02)';
            ghost.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
            ghost.style.position = 'fixed';
            ghost.style.top = '-1000px';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            requestAnimationFrame(() => document.body.removeChild(ghost));
          }
          onDragStart(item.id);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDragOver(e, item.id, depth);
        }}
        onDragLeave={(e) => {
          const related = e.relatedTarget as Node | null;
          if (cardRef.current && related && cardRef.current.contains(related)) return;
          e.stopPropagation();
          onDragLeave(e, cardRef.current!);
          setRowHover(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(e);
        }}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setRowHover(true)}
        onMouseLeave={() => setRowHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: '14px',
          color: isDragged ? 'transparent' : t.text,
          cursor: isDragging ? 'grabbing' : isHandleMode ? 'default' : 'grab',
          opacity: isDragged ? 0.35 : 1,
          backgroundColor: cardBg,
          borderWidth: '1px',
          borderColor: cardBorder,
          borderStyle: isDragged ? 'dashed' : 'solid',
          borderRadius: '10px',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
          userSelect: 'none',
          gap: '10px',
          minHeight: '44px',
          boxSizing: 'border-box',
          boxShadow: showNestHighlight
            ? `inset 0 0 0 1px ${t.nestBorder}`
            : rowHover && !isDragging
              ? '0 2px 8px rgba(0,0,0,0.08)'
              : 'none',
          transform: showNestHighlight ? 'scale(1.01)' : 'scale(1)',
        }}
      >
        {/* Grip handle (výchozí — skrytý při custom renderItem) */}
        {!renderItem && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: isDragging ? 'grabbing' : 'grab',
              padding: '4px 2px',
              borderRadius: '4px',
              visibility: isDragged ? 'hidden' : 'visible',
            }}
            onMouseEnter={() => setGripHover(true)}
            onMouseLeave={() => setGripHover(false)}
            onMouseDown={() => { handleActiveRef.current = true; }}
          >
            <DotsSixVerticalIcon size={14} color={gripHover ? t.gripHover : t.gripColor} />
          </span>
        )}

        {/* Nest indikátor — šipka "vnoření" místo before/after */}
        {showNestHighlight && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            position: 'absolute',
            right: '14px',
            opacity: 0.6,
          }}>
            <ArrowBendDownRightIcon size={16} color={t.dropIndicator} />
          </span>
        )}

        {/* Chevron pro expand/collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(item.id);
            }}
            onMouseEnter={() => setChevronHover(true)}
            onMouseLeave={() => setChevronHover(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
              borderRadius: '4px',
              visibility: isDragged ? 'hidden' : 'visible',
            }}
          >
            <CaretRightIcon size={16} color={chevronHover ? t.chevronHover : t.chevron} style={{ transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }} />
          </button>
        ) : null}

        {/* Obsah */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0, visibility: isDragged ? 'hidden' : 'visible' }}>
          {renderItem ? (
            renderItem(item, {
              handleProps: {
                onMouseDown: () => { handleActiveRef.current = true; },
                style: { cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' as const },
                'aria-label': 'Přetáhnout položku',
              },
              isDragging: isDragged,
              depth,
              isExpanded,
              toggleExpand: () => onToggleExpand(item.id),
              hasChildren: !!hasChildren,
            })
          ) : (
            <>
              {item.icon && (
                <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, opacity: 0.7 }}>
                  {item.icon}
                </span>
              )}
              <span style={{
                flex: 1,
                lineHeight: 'normal',
                fontWeight: depth === 0 ? 500 : 400,
                fontSize: depth === 0 ? '14px' : '13px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Indikátor ZA */}
      {showIndicatorAfter && (
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: depth > 0 ? `${depth * 28 + 4}px` : '4px',
          right: '4px',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <DropIndicator color={t.dropIndicator} />
        </div>
      )}

      {/* Potomci */}
      {hasChildren && isExpanded && (
        <div style={{
          marginTop: '6px',
          paddingLeft: '4px',
          borderLeft: `2px solid ${t.treeLine}`,
          marginLeft: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {item.children!.map((child) => (
            <DragListRow
              key={child.id}
              item={child}
              depth={depth + 1}
              allowNesting={allowNesting}
              maxDepth={maxDepth}
              draggedId={draggedId}
              dropState={dropState}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onToggleExpand={onToggleExpand}
              renderItem={renderItem}
              dragMode={dragMode}
              tokens={t}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── DragList ───────────────────────────────────────────────────────────────

/**
 * Přetahovací seznam dle SM-UI design systému.
 *
 * Umožňuje řazení položek přetažením (drag & drop).
 * Volitelně podporuje stromovou strukturu s vnořováním.
 * Využívá nativní HTML5 Drag and Drop API bez externích závislostí.
 *
 * Při přetahování na střed karty se položka vnoří jako potomek.
 * Při podržení nad sbaleným uzlem se uzel automaticky rozbalí.
 *
 * @example
 * ```tsx
 * <DragList
 *   items={[
 *     { id: '1', label: 'Položka 1' },
 *     { id: '2', label: 'Položka 2' },
 *     { id: '3', label: 'Položka 3' },
 *   ]}
 *   onReorder={setItems}
 * />
 * ```
 */
export const DragList: React.FC<DragListProps> = ({
  items,
  onReorder,
  renderItem,
  allowNesting = false,
  maxDepth = 3,
  dragMode = 'full',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropState, setDropState] = useState<DragState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastPosRef = useRef<DragState | null>(null);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string, targetDepth: number) => {
      if (!draggedId || draggedId === targetId) return;
      if (isDescendant(items, draggedId, targetId)) return;

      // Zrušit pending leave
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = undefined;
      }

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;

      let position: DropPosition;

      if (allowNesting && targetDepth < maxDepth) {
        // Tři zóny: horní 25% = before, dolní 25% = after, střed 50% = inside
        if (y < height * 0.25) {
          position = 'before';
        } else if (y > height * 0.75) {
          position = 'after';
        } else {
          position = 'inside';
        }
      } else {
        // Bez nestingu: horní/dolní polovina s mrtvou zónou
        if (y < height * 0.35) {
          position = 'before';
        } else if (y > height * 0.65) {
          position = 'after';
        } else if (lastPosRef.current?.targetId === targetId) {
          position = lastPosRef.current.position;
        } else {
          position = y < height / 2 ? 'before' : 'after';
        }
      }

      const newState: DragState = { targetId, position };

      // Auto-expand: při podržení na 'inside' nad sbaleným uzlem po 600ms rozbalíme
      const target = findItem(items, targetId);
      if (
        position === 'inside' &&
        target?.children &&
        target.children.length > 0 &&
        !target.expanded
      ) {
        if (lastPosRef.current?.targetId !== targetId || lastPosRef.current?.position !== 'inside') {
          // Začátek hoveru na inside → nastartovat timer
          if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
          expandTimerRef.current = setTimeout(() => {
            onReorder(setExpanded(items, targetId, true));
          }, 600);
        }
      } else {
        // Jiná pozice nebo jiný target → zrušit expand timer
        if (expandTimerRef.current) {
          clearTimeout(expandTimerRef.current);
          expandTimerRef.current = undefined;
        }
      }

      lastPosRef.current = newState;
      setDropState(newState);
    },
    [draggedId, items, allowNesting, maxDepth, onReorder],
  );

  const handleDragLeave = useCallback((_e: React.DragEvent, _cardEl: HTMLElement) => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setDropState(null);
      lastPosRef.current = null;
    }, 60);
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = undefined;
    }
  }, []);

  const handleDrop = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = undefined;
    }
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = undefined;
    }

    if (!draggedId || !dropState) return;
    const { targetId, position } = dropState;
    if (draggedId === targetId) return;
    if (isDescendant(items, draggedId, targetId)) return;

    const [withoutDragged, draggedItem] = removeItem(items, draggedId);
    if (!draggedItem) return;

    const newItems = insertItem(withoutDragged, targetId, position, draggedItem);
    onReorder(newItems);

    setDraggedId(null);
    setDropState(null);
    lastPosRef.current = null;
  }, [draggedId, dropState, items, onReorder]);

  const handleDragEnd = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = undefined;
    }
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = undefined;
    }
    setDraggedId(null);
    setDropState(null);
    lastPosRef.current = null;
  }, []);

  const handleToggleExpand = useCallback(
    (id: string) => {
      onReorder(toggleExpanded(items, id));
    },
    [items, onReorder],
  );

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        ...style,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} />
      {items.length === 0 ? (
        <div
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            color: t.textSecondary,
            backgroundColor: t.itemBg,
            borderRadius: '10px',
            border: `1px solid ${t.itemBorder}`,
          }}
        >
          Žádné položky
        </div>
      ) : (
        items.map((item) => (
          <DragListRow
            key={item.id}
            item={item}
            depth={0}
            allowNesting={allowNesting}
            maxDepth={maxDepth}
            draggedId={draggedId}
            dropState={dropState}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onToggleExpand={handleToggleExpand}
            renderItem={renderItem}
            dragMode={dragMode}
            tokens={t}
          />
        ))
      )}
    </div>
  );
};

DragList.displayName = 'DragList';
