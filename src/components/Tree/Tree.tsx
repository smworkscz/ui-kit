import React, { useState, useCallback } from 'react';
import { CaretRightIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    textMuted: '#888888',
    border: 'rgba(255,255,255,0.08)',
    line: 'rgba(255,255,255,0.1)',
    hover: 'rgba(255,255,255,0.06)',
    selectedBg: 'rgba(252,79,0,0.12)',
    selectedBorder: '#FC4F00',
    selectedText: '#ffffff',
    iconColor: 'rgba(255,255,255,0.4)',
    iconExpanded: '#FC4F00',
  },
  light: {
    text: '#1a1a1a',
    textMuted: '#999999',
    border: 'rgba(0,0,0,0.06)',
    line: 'rgba(0,0,0,0.08)',
    hover: 'rgba(0,0,0,0.04)',
    selectedBg: 'rgba(252,79,0,0.08)',
    selectedBorder: '#FC4F00',
    selectedText: '#1a1a1a',
    iconColor: 'rgba(0,0,0,0.3)',
    iconExpanded: '#FC4F00',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Uzel stromové struktury. */
export interface TreeNode {
  /** Unikátní identifikátor uzlu. */
  id: string;
  /** Zobrazený text uzlu. */
  label: string;
  /** Volitelná ikona vedle popisku. */
  icon?: React.ReactNode;
  /** Podřízené uzly. */
  children?: TreeNode[];
}

export interface TreeProps {
  /** Stromová data k zobrazení. */
  data: TreeNode[];
  /** Callback při výběru uzlu. */
  onSelect?: (node: TreeNode) => void;
  /** ID aktuálně vybraného uzlu. */
  selectedId?: string;
  /** ID uzlů, které jsou ve výchozím stavu rozbalené. */
  defaultExpanded?: string[];
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── TreeNodeRow ────────────────────────────────────────────────────────────

interface TreeNodeRowProps {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  selectedId?: string;
  onToggle: (id: string) => void;
  onSelect?: (node: TreeNode) => void;
  t: (typeof tokens)['dark'] | (typeof tokens)['light'];
}

const TreeNodeRow: React.FC<TreeNodeRowProps> = ({
  node,
  depth,
  expanded,
  selectedId,
  onToggle,
  onSelect,
  t,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selectedId === node.id;
  const [isHovered, setIsHovered] = useState(false);

  let bg = 'transparent';
  if (isSelected) bg = t.selectedBg;
  else if (isHovered) bg = t.hover;

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          paddingLeft: `${depth * 20 + 8}px`,
          borderRadius: '6px',
          backgroundColor: bg,
          borderLeft: isSelected ? `2px solid ${t.selectedBorder}` : '2px solid transparent',
          cursor: 'pointer',
          transition: 'background-color 0.12s ease',
          userSelect: 'none',
          minHeight: '32px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect?.(node)}
      >
        {/* Expand/collapse chevron */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            flexShrink: 0,
            marginRight: '4px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
        >
          {hasChildren && (
            <CaretRightIcon
              size={14}
              color={isExpanded ? t.iconExpanded : t.iconColor}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          )}
        </span>

        {/* Icon */}
        {node.icon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '6px',
              color: isSelected ? t.selectedBorder : t.textMuted,
              flexShrink: 0,
            }}
          >
            {node.icon}
          </span>
        )}

        {/* Label */}
        <span
          style={{
            fontSize: '13px',
            fontWeight: isSelected ? 500 : 400,
            color: isSelected ? t.selectedText : t.text,
            lineHeight: '20px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {node.label}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div style={{ position: 'relative' }}>
          {/* Tree line */}
          <div
            style={{
              position: 'absolute',
              left: `${depth * 20 + 18}px`,
              top: 0,
              bottom: '16px',
              width: '1px',
              backgroundColor: t.line,
            }}
          />
          {node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
              t={t}
            />
          ))}
        </div>
      )}
    </>
  );
};

// ─── Tree ───────────────────────────────────────────────────────────────────

/**
 * Stromový seznam s rozbalitelnými uzly.
 *
 * Podporuje ikony, výběr uzlu, animovanou šipku při rozbalení
 * a spojovací čáry mezi rodičem a potomky.
 *
 * @example
 * ```tsx
 * <Tree
 *   data={[
 *     { id: '1', label: 'Složka', children: [
 *       { id: '1-1', label: 'Soubor A' },
 *       { id: '1-2', label: 'Soubor B' },
 *     ]},
 *   ]}
 *   selectedId="1-1"
 *   onSelect={(node) => console.log(node.id)}
 * />
 * ```
 */
export const Tree: React.FC<TreeProps> = ({
  data,
  onSelect,
  selectedId,
  defaultExpanded = [],
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    color: t.text,
    ...style,
  };

  return (
    <div className={className} style={containerStyle} role="tree">
      {data.map((node) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          expanded={expanded}
          selectedId={selectedId}
          onToggle={handleToggle}
          onSelect={onSelect}
          t={t}
        />
      ))}
    </div>
  );
};

Tree.displayName = 'Tree';
