import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    tagBg: '#1e1e1e',
    tagBorder: 'rgba(255,255,255,0.3)',
    tagText: '#ffffff',
    itemBg: 'rgba(3,3,3,0.6)',
    itemBorder: 'rgba(255,255,255,0.3)',
    itemText: '#ffffff',
    actionColor: 'rgba(255,255,255,0.5)',
  },
  light: {
    tagBg: '#f0f0f0',
    tagBorder: 'rgba(0,0,0,0.15)',
    tagText: '#1a1a1a',
    itemBg: 'rgba(255,255,255,0.85)',
    itemBorder: 'rgba(0,0,0,0.15)',
    itemText: '#1a1a1a',
    actionColor: 'rgba(0,0,0,0.4)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TagProps {
  /**
   * Text label displayed inside the tag.
   */
  label: string;
  /**
   * Callback fired when the remove (✕) button is clicked.
   * When not provided the remove button is hidden.
   */
  onRemove?: () => void;
  /** Extra inline styles for the root element. */
  style?: React.CSSProperties;
  /** Extra CSS class for the root element. */
  className?: string;
}

export interface BadgeProps {
  /**
   * Text displayed inside the badge.
   * Rendered uppercase per the SM-UI design system.
   */
  label: string;
  /** Extra inline styles for the root element. */
  style?: React.CSSProperties;
  /** Extra CSS class for the root element. */
  className?: string;
}

export interface TagItemProps {
  /**
   * Primary label / name shown in the list row.
   */
  label: string;
  /**
   * Callback fired when the **filter** icon button is clicked.
   * When not provided the button is hidden.
   */
  onFilter?: () => void;
  /**
   * Callback fired when the **edit** (pencil) icon button is clicked.
   * When not provided the button is hidden.
   */
  onEdit?: () => void;
  /**
   * Callback fired when the **delete** (trash) icon button is clicked.
   * When not provided the button is hidden.
   */
  onDelete?: () => void;
  /**
   * Whether to show the actions column at all.
   * Set to `false` to render a read-only row.
   * @default true
   */
  showActions?: boolean;
  /** Extra inline styles for the root element. */
  style?: React.CSSProperties;
  /** Extra CSS class for the root element. */
  className?: string;
}

// ─── Internal icon button ─────────────────────────────────────────────────────

interface ActionBtnProps {
  onClick?: () => void;
  title: string;
  color: string;
  children: React.ReactNode;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ onClick, title, color, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      color,
      width: 16,
      height: 16,
      flexShrink: 0,
      transition: 'opacity 0.15s ease',
    }}
  >
    {children}
  </button>
);

// ─── Tag ─────────────────────────────────────────────────────────────────────

/**
 * Small removable pill label used to categorise or mark items.
 * The remove button (✕) is shown only when `onRemove` is provided.
 *
 * @example
 * ```tsx
 * <Tag label="React" />
 * <Tag label="TypeScript" onRemove={() => removeTag('ts')} />
 * ```
 */
export const Tag: React.FC<TagProps> = ({ label, onRemove, style, className }) => {
  const t = tokens[useTheme()];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        backgroundColor: t.tagBg,
        border: `1px solid ${t.tagBorder}`,
        borderRadius: '4px',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontWeight: 400,
        fontSize: '10px',
        color: t.tagText,
        whiteSpace: 'nowrap',
        lineHeight: 'normal',
      }}>
        {label}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: t.tagText,
            opacity: 0.6,
            fontSize: '8px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────

/**
 * Small status badge rendered as an orange pill.
 * Text is automatically uppercased.
 *
 * @example
 * ```tsx
 * <Badge label="New" />
 * <Badge label="Beta" />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({ label, style, className }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px 16px',
      backgroundColor: 'rgba(246,84,14,0.8)',
      borderRadius: '12px',
      fontFamily: "'Zalando Sans Expanded', sans-serif",
      fontWeight: 400,
      fontSize: '10px',
      color: '#ffffff',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      lineHeight: 'normal',
      ...style,
    }}
    className={className}
  >
    {label}
  </div>
);

// ─── TagItem ──────────────────────────────────────────────────────────────────

/**
 * List row used to display a named tag with optional action buttons
 * (filter, edit, delete).
 *
 * Buttons are hidden individually when their callback props are omitted.
 * Set `showActions={false}` to hide the whole actions column at once.
 *
 * @example
 * ```tsx
 * <TagItem label="Homepage" onEdit={editTag} onDelete={deleteTag} />
 * <TagItem label="Blog" showActions={false} />
 * ```
 */
export const TagItem: React.FC<TagItemProps> = ({
  label,
  onFilter,
  onEdit,
  onDelete,
  showActions = true,
  style,
  className,
}) => {
  const t = tokens[useTheme()];
  const hasAnyAction = onFilter || onEdit || onDelete;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        backgroundColor: t.itemBg,
        border: `1px solid ${t.itemBorder}`,
        borderRadius: '8px',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontFamily: "'Zalando Sans', sans-serif",
        fontWeight: 400,
        fontSize: '16px',
        color: t.itemText,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        minWidth: 0,
        lineHeight: 'normal',
      }}>
        {label}
      </span>

      {showActions && hasAnyAction && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', flexShrink: 0 }}>
          {onFilter && (
            <ActionBtn onClick={onFilter} title="Filter" color={t.actionColor}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1.75 3.5h10.5M3.5 7h7M5.25 10.5h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ActionBtn>
          )}
          {onEdit && (
            <ActionBtn onClick={onEdit} title="Edit" color={t.actionColor}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.625 1.75l2.625 2.625M1.75 12.25l.875-3.5L9.625 1.75l2.625 2.625-7 6.875-3.5.875z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ActionBtn>
          )}
          {onDelete && (
            <ActionBtn onClick={onDelete} title="Delete" color={t.actionColor}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1.75 3.5h10.5M5.25 3.5V2.333a.583.583 0 01.583-.583h2.334a.583.583 0 01.583.583V3.5M11.667 3.5l-.584 7.583a1.167 1.167 0 01-1.166 1.084H4.083a1.167 1.167 0 01-1.166-1.084L2.333 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ActionBtn>
          )}
        </div>
      )}
    </div>
  );
};
