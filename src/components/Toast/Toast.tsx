import React from 'react';

// ─── Design tokens ───────────────────────────────────────────────────────────
// Toast is always dark-themed by design (overlays / notification tray).

const variantTokens = {
  info: {
    border: 'rgba(255,255,255,0.7)',
    background: 'rgba(3,3,3,0.75)',
  },
  success: {
    border: '#00A205',
    background: 'rgba(3,21,4,0.75)',
  },
  error: {
    border: '#DE0000',
    background: 'rgba(21,3,3,0.75)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant = 'info' | 'success' | 'error';

export interface ToastProps {
  /**
   * Visual variant that drives the border colour and background tint.
   * - `'info'`    — white/neutral border, dark background
   * - `'success'` — green border (#00A205), dark green-tinted background
   * - `'error'`   — red border (#DE0000), dark red-tinted background
   * @default 'info'
   */
  variant?: ToastVariant;
  /**
   * Bold title line of the toast notification.
   */
  title: string;
  /**
   * Optional secondary description rendered below the title in a smaller font.
   */
  content?: string;
  /**
   * Custom icon rendered on the left side.
   * When omitted a built-in SVG icon matching the `variant` is used.
   */
  icon?: React.ReactNode;
  /**
   * Callback fired when the close (✕) button is clicked.
   * When not provided the close button is hidden.
   */
  onClose?: () => void;
  /**
   * ARIA role for accessibility.
   * Use `'alert'` for urgent messages, `'status'` for non-urgent ones.
   * @default 'alert'
   */
  role?: 'alert' | 'status' | 'log';
  /** Extra inline styles for the root element. */
  style?: React.CSSProperties;
  /** Extra CSS class for the root element. */
  className?: string;
}

// ─── Built-in icons ───────────────────────────────────────────────────────────

const InfoIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 12.5v7M14 9.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11.5" stroke="#00A205" strokeWidth="1.5"/>
    <path d="M9 14.5l3.5 3.5 6.5-7" stroke="#00A205" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11.5" stroke="#DE0000" strokeWidth="1.5"/>
    <path d="M10 10l8 8M18 10l-8 8" stroke="#DE0000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const defaultIcons: Record<ToastVariant, React.ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  error: <ErrorIcon />,
};

const CloseIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Toast notification with three severity levels.
 * Rendered with a backdrop-blur glass effect, always in dark mode.
 *
 * The close button appears only when `onClose` is provided.
 * A custom icon can replace the default variant icon via the `icon` prop.
 *
 * @example
 * ```tsx
 * <Toast variant="success" title="Saved" content="Your changes have been saved." onClose={dismiss} />
 * <Toast variant="error"   title="Error" content="Something went wrong." onClose={dismiss} />
 * <Toast variant="info"    title="Heads up" onClose={dismiss} />
 *
 * // Custom icon
 * <Toast variant="info" title="Update available" icon={<UpdateIcon />} />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  content,
  icon,
  onClose,
  role = 'alert',
  style,
  className,
}) => {
  const { border, background } = variantTokens[variant];
  const resolvedIcon = icon ?? defaultIcons[variant];

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '12px 12px 12px 16px',
        backgroundColor: background,
        border: `2px solid ${border}`,
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
        ...style,
      }}
      className={className}
    >
      {/* Body: icon + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: '#ffffff' }}>
          {resolvedIcon}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 700,
            fontSize: '16px',
            color: '#ffffff',
            lineHeight: 'normal',
          }}>
            {title}
          </span>
          {content && (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              color: '#ffffff',
              lineHeight: 'normal',
            }}>
              {content}
            </span>
          )}
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: '#ffffff',
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
