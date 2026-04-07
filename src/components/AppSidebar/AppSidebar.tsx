import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(24,24,24,0.8)',
    border: 'rgba(255,255,255,0.1)',
  },
  light: {
    background: 'rgba(255,255,255,0.8)',
    border: 'rgba(0,0,0,0.08)',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AppSidebarProps {
  /** Obsah postranního panelu (navigace, menu apod.). */
  children: React.ReactNode;
  /** Zda je panel sbalený. @default false */
  collapsed?: boolean;
  /** Voláno při změně stavu sbalení. */
  onCollapse?: (collapsed: boolean) => void;
  /** Šířka rozbalené postranní lišty v px. @default 260 */
  width?: number;
  /** Šířka sbalené postranní lišty v px. @default 64 */
  collapsedWidth?: number;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── AppSidebar ─────────────────────────────────────────────────────────────

/**
 * Sbaletelný postranní panel pro navigaci aplikace.
 *
 * Používá glass efekt a plynulou animaci šířky. Tlačítko pro sbalení/rozbalení
 * si řeší konzument sám — komponenta je plně řízená přes `collapsed` a `onCollapse`.
 *
 * @example
 * ```tsx
 * const [collapsed, setCollapsed] = useState(false);
 * <AppSidebar collapsed={collapsed} onCollapse={setCollapsed}>
 *   <button onClick={() => setCollapsed(c => !c)}>Toggle</button>
 *   <nav>...</nav>
 * </AppSidebar>
 * ```
 */
export const AppSidebar: React.FC<AppSidebarProps> = ({
  children,
  collapsed = false,
  onCollapse,
  width = 260,
  collapsedWidth = 64,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const currentWidth = collapsed ? collapsedWidth : width;

  return (
    <aside
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: `${currentWidth}px`,
        minWidth: `${currentWidth}px`,
        height: '100%',
        backgroundColor: t.background,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: `1px solid ${t.border}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'width 180ms cubic-bezier(0.16, 1, 0.3, 1), min-width 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {/* Obsah */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '8px 8px' : '8px 12px',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: collapsed ? 'center' : 'stretch',
          transition: 'padding 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </aside>
  );
};

AppSidebar.displayName = 'AppSidebar';
