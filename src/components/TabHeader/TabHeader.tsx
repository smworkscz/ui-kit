import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    border: 'rgba(255,255,255,0.3)',
    text: '#ffffff',
    icon: '#ffffff',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    border: 'rgba(0,0,0,0.15)',
    text: '#1a1a1a',
    icon: '#1a1a1a',
  },
} as const;

// ─── Shared types ─────────────────────────────────────────────────────────────

/** Props shared by all four tab-header variants. */
interface TabHeaderBaseProps {
  /**
   * Title text displayed in the header.
   * Rendered uppercase per the SM-UI design system.
   */
  title: string;
  /**
   * Callback fired when the close (✕) button is clicked.
   * When not provided the close button is hidden.
   */
  onClose?: () => void;
  /** Extra inline styles for the root element. */
  style?: React.CSSProperties;
  /** Extra CSS class for the root element. */
  className?: string;
}

export interface TabHeaderProps extends TabHeaderBaseProps {
  /**
   * Large panel header with a prominent `SemiBold 20px` title and a close button.
   * Border-radius: `20px 20px 0 0` (top-left + top-right rounded).
   */
  variant?: never; // used only as discriminator in union scenarios
}

export interface TabSubheaderProps extends TabHeaderBaseProps {
  /**
   * Smaller panel subheader (`Medium 16px` title) with a close button.
   * Border-radius: `20px 20px 0 0`.
   */
  variant?: never;
}

export interface TabHeaderButtonProps extends TabHeaderBaseProps {
  /**
   * Panel header with both an **add** (+) and a **close** (✕) button.
   * Useful for tabs where new items can be created.
   *
   * Callback fired when the add (+) button is clicked.
   * When not provided the add button is hidden.
   */
  onAdd?: () => void;
}

export interface SubtabHeaderProps extends TabHeaderBaseProps {
  /**
   * Compact subtab header (`Medium 16px`) with a single top-left radius.
   * Border-radius: `16px 0 0 0`.
   */
  variant?: never;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const CloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

interface IconBtnProps {
  onClick?: () => void;
  label: string;
  color: string;
  children: React.ReactNode;
}

const IconBtn: React.FC<IconBtnProps> = ({ onClick, label, color, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      color,
      opacity: 0.8,
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

// ─── TabHeader ────────────────────────────────────────────────────────────────

/**
 * Primary panel header — large title (`SemiBold 20px`, uppercase) with an
 * optional close button. Rounded top corners (`20px 20px 0 0`).
 *
 * @example
 * ```tsx
 * <TabHeader title="Settings" onClose={closePanel} />
 * <TabHeader title="Preview" />          {/* no close button *\/}
 * ```
 */
export const TabHeader: React.FC<TabHeaderProps> = ({ title, onClose, style, className }) => {
  const t = tokens[useTheme()];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px',
        backgroundColor: t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '20px 20px 0 0',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontWeight: 600,
        fontSize: '20px',
        color: t.text,
        textTransform: 'uppercase',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
      {onClose && <IconBtn onClick={onClose} label="Close" color={t.icon}><CloseIcon /></IconBtn>}
    </div>
  );
};

// ─── TabSubheader ─────────────────────────────────────────────────────────────

/**
 * Secondary panel header — smaller title (`Medium 16px`, uppercase) with an
 * optional close button. Same rounded corners as `TabHeader`.
 *
 * @example
 * ```tsx
 * <TabSubheader title="Filters" onClose={closePanel} />
 * ```
 */
export const TabSubheader: React.FC<TabSubheaderProps> = ({ title, onClose, style, className }) => {
  const t = tokens[useTheme()];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '20px 20px 0 0',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontWeight: 500,
        fontSize: '16px',
        color: t.text,
        textTransform: 'uppercase',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
      {onClose && <IconBtn onClick={onClose} label="Close" color={t.icon}><CloseIcon /></IconBtn>}
    </div>
  );
};

// ─── TabHeaderButton ──────────────────────────────────────────────────────────

/**
 * Panel header with **two action buttons** — add (+) and close (✕).
 * Both are optional; omit the callback to hide the corresponding button.
 *
 * @example
 * ```tsx
 * <TabHeaderButton title="Sections" onAdd={addSection} onClose={closePanel} />
 * <TabHeaderButton title="Tags"     onAdd={addTag} />
 * ```
 */
export const TabHeaderButton: React.FC<TabHeaderButtonProps> = ({
  title,
  onAdd,
  onClose,
  style,
  className,
}) => {
  const t = tokens[useTheme()];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px',
        backgroundColor: t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '20px 20px 0 0',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontWeight: 600,
        fontSize: '20px',
        color: t.text,
        textTransform: 'uppercase',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
      {(onAdd || onClose) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onAdd && <IconBtn onClick={onAdd} label="Add" color={t.icon}><PlusIcon /></IconBtn>}
          {onClose && <IconBtn onClick={onClose} label="Close" color={t.icon}><CloseIcon /></IconBtn>}
        </div>
      )}
    </div>
  );
};

// ─── SubtabHeader ─────────────────────────────────────────────────────────────

/**
 * Compact subtab header used for nested panels.
 * Has a single top-left radius (`16px 0 0 0`) and a `Medium 16px` title.
 *
 * @example
 * ```tsx
 * <SubtabHeader title="Details" onClose={closeSubtab} />
 * ```
 */
export const SubtabHeader: React.FC<SubtabHeaderProps> = ({ title, onClose, style, className }) => {
  const t = tokens[useTheme()];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: t.background,
        border: `1px solid ${t.border}`,
        borderRadius: '16px 0 0 0',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontWeight: 500,
        fontSize: '16px',
        color: t.text,
        textTransform: 'uppercase',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
      {onClose && <IconBtn onClick={onClose} label="Close" color={t.icon}><CloseIcon /></IconBtn>}
    </div>
  );
};
