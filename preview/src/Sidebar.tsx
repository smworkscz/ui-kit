import React from 'react';
import { useTheme } from '../../src';

// ─── Types ──────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  label: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuCategory {
  heading: string;
  groups: MenuGroup[];
}

// ─── Menu data ──────────────────────────────────────────────────────────────

const menu: MenuCategory[] = [
  {
    heading: 'Začínáme',
    groups: [
      {
        title: '',
        items: [
          { id: 'introduction', label: 'Úvod' },
          { id: 'installation', label: 'Instalace' },
          { id: 'usage', label: 'Použití' },
          { id: 'theming', label: 'Témování' },
          { id: 'design-tokens', label: 'Design tokeny' },
        ],
      },
    ],
  },
  {
    heading: 'Komponenty',
    groups: [
      {
        title: 'Formuláře',
        items: [
          { id: 'button', label: 'Button' },
          { id: 'checkbox', label: 'Checkbox' },
          { id: 'colorpicker', label: 'ColorPicker' },
          { id: 'combobox', label: 'Combobox' },
          { id: 'datepicker', label: 'DatePicker' },
          { id: 'fileupload', label: 'FileUpload' },
          { id: 'input', label: 'Input' },
          { id: 'numberinput', label: 'NumberInput' },
          { id: 'otpinput', label: 'OTPInput' },
          { id: 'radio', label: 'Radio' },
          { id: 'rating', label: 'Rating' },
          { id: 'segmentedcontrol', label: 'SegmentedControl' },
          { id: 'select', label: 'Select' },
          { id: 'slider', label: 'Slider' },
          { id: 'switch', label: 'Switch' },
          { id: 'textarea', label: 'Textarea' },
        ],
      },
      {
        title: 'Zobrazení dat',
        items: [
          { id: 'accordion', label: 'Accordion' },
          { id: 'avatar', label: 'Avatar' },
          { id: 'calendar', label: 'Calendar' },
          { id: 'card', label: 'Card' },
          { id: 'datagrid', label: 'DataGrid' },
          { id: 'datalist', label: 'DataList' },
          { id: 'emptystate', label: 'EmptyState' },
          { id: 'popover', label: 'Popover' },
          { id: 'skeleton', label: 'Skeleton' },
          { id: 'stat', label: 'Stat' },
          { id: 'statusbadge', label: 'StatusBadge' },
          { id: 'table', label: 'Table' },
          { id: 'tabs', label: 'Tabs' },
          { id: 'tag', label: 'Tag / Badge' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'tooltip', label: 'Tooltip' },
          { id: 'tree', label: 'Tree' },
        ],
      },
      {
        title: 'Navigace & Layout',
        items: [
          { id: 'appsidebar', label: 'AppSidebar' },
          { id: 'breadcrumb', label: 'Breadcrumb' },
          { id: 'commandmenu', label: 'CommandMenu' },
          { id: 'drawer', label: 'Drawer' },
          { id: 'dropdownmenu', label: 'DropdownMenu' },
          { id: 'link', label: 'Link' },
          { id: 'modal', label: 'Modal' },
          { id: 'navbar', label: 'Navbar' },
          { id: 'pagination', label: 'Pagination' },
          { id: 'sheet', label: 'Sheet' },
          { id: 'spotlight', label: 'Spotlight' },
          { id: 'stepper', label: 'Stepper' },
        ],
      },
      {
        title: 'Feedback',
        items: [
          { id: 'alert', label: 'Alert' },
          { id: 'confirmdialog', label: 'ConfirmDialog' },
          { id: 'copybutton', label: 'CopyButton' },
          { id: 'notification', label: 'Notification' },
          { id: 'progress', label: 'Progress' },
          { id: 'spinner', label: 'Spinner' },
          { id: 'toast', label: 'Toast' },
        ],
      },
      {
        title: 'Utility',
        items: [
          { id: 'container', label: 'Container' },
          { id: 'divider', label: 'Divider' },
          { id: 'draglist', label: 'DragList' },
          { id: 'stack', label: 'Stack' },
        ],
      },
    ],
  },
  {
    heading: 'Hooks',
    groups: [
      {
        title: '',
        items: [
          { id: 'useTheme', label: 'useTheme' },
          { id: 'useToast', label: 'useToast' },
        ],
      },
    ],
  },
  {
    heading: 'Zdroje',
    groups: [
      {
        title: '',
        items: [
          { id: '__llm_docs', label: 'LLM dokumentace' },
        ],
      },
    ],
  },
];

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    bg: 'rgba(26,26,26,0.5)',
    headingText: 'rgba(255,255,255,0.92)',
    groupTitle: 'rgba(255,255,255,0.3)',
    text: 'rgba(255,255,255,0.6)',
    textHover: 'rgba(255,255,255,0.85)',
    hoverBg: 'rgba(255,255,255,0.04)',
    selectedBg: 'rgba(232,97,45,0.1)',
    selectedText: '#E8612D',
    divider: 'rgba(255,255,255,0.06)',
  },
  light: {
    bg: 'rgba(255,255,255,0.5)',
    headingText: 'rgba(0,0,0,0.85)',
    groupTitle: 'rgba(0,0,0,0.3)',
    text: 'rgba(0,0,0,0.5)',
    textHover: 'rgba(0,0,0,0.8)',
    hoverBg: 'rgba(0,0,0,0.03)',
    selectedBg: 'rgba(232,97,45,0.07)',
    selectedText: '#E8612D',
    divider: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onSelect }) => {
  const theme = useTheme();
  const t = tokens[theme];

  return (
    <nav
      style={{
        width: 230,
        flexShrink: 0,
        borderRight: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        backgroundColor: t.bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none' as any,
        padding: '20px 12px 32px',
        minHeight: 0,
      }}
    >
      {menu.map((category, catIdx) => (
        <div key={category.heading}>
          {/* Divider between categories */}
          {catIdx > 0 && (
            <div
              style={{
                height: 1,
                backgroundColor: t.divider,
                margin: '16px 8px 18px',
              }}
            />
          )}

          {/* Category heading */}
          <div
            style={{
              padding: '0 8px 14px',
              fontFamily: "'Zalando Sans Expanded', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: t.headingText,
              userSelect: 'none',
            }}
          >
            {category.heading}
          </div>

          {/* Groups within category */}
          {category.groups.map((group, grpIdx) => (
            <div key={group.title || '__root'} style={{ marginBottom: group.title ? 12 : 0 }}>
              {/* Group subtitle */}
              {group.title && (
                <div
                  style={{
                    padding: `${grpIdx > 0 ? '16px' : '0px'} 8px 6px`,
                    fontFamily: "'Zalando Sans Expanded', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: t.groupTitle,
                    userSelect: 'none',
                  }}
                >
                  {group.title}
                </div>
              )}

              {/* Items */}
              {group.items.map((item) => {
                const isActive = item.id === activeId;

                // Special handling for external links
                if (item.id === '__llm_docs') {
                  return (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      isActive={false}
                      tokens={t}
                      onClick={() => window.open('/llm/all.md', '_blank')}
                    />
                  );
                }

                return (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    tokens={t}
                    onClick={() => onSelect(item.id)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
};

// ─── Sidebar item ───────────────────────────────────────────────────────────

const SidebarItem: React.FC<{
  item: MenuItem;
  isActive: boolean;
  tokens: (typeof tokens)['dark'];
  onClick: () => void;
}> = ({ item, isActive, tokens: t, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '5px 8px',
        border: '0 none',
        borderStyle: 'none',
        outline: 'none',
        borderRadius: 6,
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: 13,
        fontWeight: isActive ? 500 : 400,
        lineHeight: '1.4',
        color: isActive ? t.selectedText : t.text,
        backgroundColor: isActive ? t.selectedBg : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.12s ease, color 0.12s ease',
        userSelect: 'none',
        marginBottom: 2,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = t.hoverBg;
          e.currentTarget.style.color = t.textHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = t.text;
        }
      }}
    >
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.label}
      </span>
    </button>
  );
};
