import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    textInactive: '#ACACAC',
    textDisabled: 'rgba(255,255,255,0.3)',
    border: 'rgba(255,255,255,0.08)',
    activeUnderline: '#E8612D',
    pillBg: '#E8612D',
    pillText: '#ffffff',
    pillInactiveBg: 'transparent',
    hoverBg: 'rgba(255,255,255,0.04)',
  },
  light: {
    text: '#1a1a1a',
    textInactive: '#888888',
    textDisabled: 'rgba(0,0,0,0.25)',
    border: 'rgba(0,0,0,0.08)',
    activeUnderline: '#E8612D',
    pillBg: '#E8612D',
    pillText: '#ffffff',
    pillInactiveBg: 'transparent',
    hoverBg: 'rgba(0,0,0,0.03)',
  },
} as const;

// ─── Size config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '6px 12px', fontSize: '13px' },
  md: { padding: '8px 16px', fontSize: '14px' },
  lg: { padding: '10px 20px', fontSize: '16px' },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TabsProps {
  /** Aktuální aktivní hodnota. */
  value: string;
  /** Voláno při změně aktivní záložky. */
  onChange: (value: string) => void;
  /** Potomci — komponenty `<Tab>` a `<TabPanel>`. */
  children: React.ReactNode;
  /**
   * Vizuální varianta.
   * - `'underline'` — spodní linka na aktivní záložce
   * - `'pills'` — oranžová pilulka na aktivní záložce
   * @default 'underline'
   */
  variant?: 'underline' | 'pills';
  /** Roztáhne záložky na celou šířku. @default false */
  fullWidth?: boolean;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

export interface TabProps {
  /** Unikátní hodnota záložky. */
  value: string;
  /** Text záložky. */
  label: string;
  /** Zakáže záložku. @default false */
  disabled?: boolean;
  /** Ikona zobrazená před textem. */
  icon?: React.ReactNode;
}

export interface TabPanelProps {
  /** Hodnota odpovídající záložce — panel se zobrazí, když je aktivní. */
  value: string;
  /** Obsah panelu. */
  children: React.ReactNode;
}

// ─── Tab ─────────────────────────────────────────────────────────────────────

/**
 * Záložka uvnitř `<Tabs>`. Definuje jednu záložku v navigaci.
 *
 * @example
 * ```tsx
 * <Tab value="general" label="Obecné" />
 * ```
 */
export const Tab: React.FC<TabProps> = () => {
  // Renderování je řízeno rodičem <Tabs>.
  return null;
};

Tab.displayName = 'Tab';

// ─── TabPanel ────────────────────────────────────────────────────────────────

/**
 * Panel obsahu spojený s konkrétní záložkou.
 *
 * @example
 * ```tsx
 * <TabPanel value="general">
 *   Obsah záložky „Obecné".
 * </TabPanel>
 * ```
 */
export const TabPanel: React.FC<TabPanelProps> = () => {
  // Renderování je řízeno rodičem <Tabs>.
  return null;
};

TabPanel.displayName = 'TabPanel';

// ─── Tabs ────────────────────────────────────────────────────────────────────

/**
 * Záložkový komponent dle SM-UI design systému.
 *
 * Podporuje varianty `underline` a `pills`, velikostní presety
 * a tmavý / světlý režim přes `useTheme`.
 *
 * @example
 * ```tsx
 * <Tabs value={active} onChange={setActive} variant="underline">
 *   <Tab value="general" label="Obecné" />
 *   <Tab value="advanced" label="Pokročilé" />
 *   <TabPanel value="general">Obsah 1</TabPanel>
 *   <TabPanel value="advanced">Obsah 2</TabPanel>
 * </Tabs>
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  children,
  variant = 'underline',
  fullWidth = false,
  size = 'md',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const sc = sizeConfig[size];

  const childArray = React.Children.toArray(children);

  const tabs = childArray.filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && (child.type as any)?.displayName === 'Tab'
  );

  const panels = childArray.filter(
    (child): child is React.ReactElement<TabPanelProps> =>
      React.isValidElement(child) && (child.type as any)?.displayName === 'TabPanel'
  );

  const activePanel = panels.find((p) => p.props.value === value);

  return (
    <div className={className} style={style}>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: variant === 'pills' ? '4px' : '0',
          borderBottom: variant === 'underline' ? `1px solid ${t.border}` : 'none',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.props.value === value;
          const isDisabled = tab.props.disabled;

          const tabStyle: React.CSSProperties =
            variant === 'underline'
              ? {
                  padding: sc.padding,
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: sc.fontSize,
                  fontWeight: isActive ? 500 : 400,
                  color: isDisabled
                    ? t.textDisabled
                    : isActive
                      ? t.text
                      : t.textInactive,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? t.activeUnderline : 'transparent'}`,
                  marginBottom: '-1px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  flex: fullWidth ? 1 : undefined,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }
              : {
                  padding: sc.padding,
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: sc.fontSize,
                  fontWeight: isActive ? 500 : 400,
                  color: isDisabled
                    ? t.textDisabled
                    : isActive
                      ? t.pillText
                      : t.textInactive,
                  backgroundColor: isActive ? t.pillBg : t.pillInactiveBg,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  transition:
                    'color 0.15s ease, background-color 0.15s ease',
                  flex: fullWidth ? 1 : undefined,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                };

          return (
            <button
              key={tab.props.value}
              type="button"
              disabled={isDisabled}
              style={tabStyle}
              onClick={() => {
                if (!isDisabled) onChange(tab.props.value);
              }}
              onMouseEnter={(e) => {
                if (!isDisabled && !isActive) {
                  e.currentTarget.style.backgroundColor = variant === 'pills' && !isActive ? t.hoverBg : t.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor =
                    variant === 'pills' && isActive ? t.pillBg : 'transparent';
                }
              }}
            >
              {tab.props.icon && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {tab.props.icon}
                </span>
              )}
              {tab.props.label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      {activePanel && (
        <div style={{ paddingTop: '16px' }}>
          {activePanel.props.children}
        </div>
      )}
    </div>
  );
};

Tabs.displayName = 'Tabs';
