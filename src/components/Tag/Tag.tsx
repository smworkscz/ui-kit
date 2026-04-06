import React from 'react';
import { Funnel as FunnelIcon, PencilSimple as PencilSimpleIcon, Trash as TrashIcon } from '@phosphor-icons/react';
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
   * Textový popisek zobrazený uvnitř tagu.
   */
  label: string;
  /**
   * Callback volaný při kliknutí na tlačítko odebrání (✕).
   * Pokud není zadán, tlačítko se nezobrazí.
   */
  onRemove?: () => void;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
}

export interface BadgeProps {
  /**
   * Text zobrazený uvnitř badge.
   * Automaticky převeden na velká písmena dle SM-UI design systému.
   */
  label: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
}

export interface TagItemProps {
  /**
   * Hlavní popisek / název zobrazený v řádku seznamu.
   */
  label: string;
  /**
   * Callback volaný při kliknutí na tlačítko **filtrování**.
   * Pokud není zadán, tlačítko se nezobrazí.
   */
  onFilter?: () => void;
  /**
   * Callback volaný při kliknutí na tlačítko **úpravy** (tužka).
   * Pokud není zadán, tlačítko se nezobrazí.
   */
  onEdit?: () => void;
  /**
   * Callback volaný při kliknutí na tlačítko **smazání** (koš).
   * Pokud není zadán, tlačítko se nezobrazí.
   */
  onDelete?: () => void;
  /**
   * Zda zobrazit sloupec s akcemi.
   * Nastavte na `false` pro řádek pouze ke čtení.
   * @default true
   */
  showActions?: boolean;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový element. */
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
 * Malý odebíratelný štítek pro kategorizaci nebo označení položek.
 * Tlačítko odebrání (✕) se zobrazí pouze pokud je zadáno `onRemove`.
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
          aria-label={`Odebrat ${label}`}
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
 * Malý stavový badge vykreslený jako oranžová pilulka.
 * Text je automaticky převeden na velká písmena.
 *
 * @example
 * ```tsx
 * <Badge label="Novinka" />
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
 * Řádek seznamu zobrazující pojmenovaný tag s volitelnými akčními tlačítky
 * (filtrování, úprava, smazání).
 *
 * Tlačítka se jednotlivě skryjí, pokud nejsou zadány příslušné callbacky.
 * Nastavte `showActions={false}` pro skrytí celého sloupce akcí.
 *
 * @example
 * ```tsx
 * <TagItem label="Domovská stránka" onEdit={editTag} onDelete={deleteTag} />
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
            <ActionBtn onClick={onFilter} title="Filtrovat" color={t.actionColor}>
              <FunnelIcon size={14} color="currentColor" />
            </ActionBtn>
          )}
          {onEdit && (
            <ActionBtn onClick={onEdit} title="Upravit" color={t.actionColor}>
              <PencilSimpleIcon size={14} color="currentColor" />
            </ActionBtn>
          )}
          {onDelete && (
            <ActionBtn onClick={onDelete} title="Smazat" color={t.actionColor}>
              <TrashIcon size={14} color="currentColor" />
            </ActionBtn>
          )}
        </div>
      )}
    </div>
  );
};
