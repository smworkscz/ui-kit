import React, { useState } from 'react';
import { AppSidebar, Button } from '../../../src';
import { HouseIcon, GearIcon, UsersIcon, ChartBarIcon, FolderIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'collapsed', label: 'Sbalený', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'Obsah postranního panelu (navigace, menu).' },
  { name: 'collapsed', type: 'boolean', defaultValue: 'false', description: 'Zda je panel sbalený.' },
  { name: 'onCollapse', type: '(collapsed: boolean) => void', description: 'Voláno při změně stavu sbalení.' },
  { name: 'width', type: 'number', defaultValue: '260', description: 'Šířka rozbalené postranní lišty v px.' },
  { name: 'collapsedWidth', type: 'number', defaultValue: '64', description: 'Šířka sbalené postranní lišty v px.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const navItemStyle = (isActive: boolean, collapsed: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: collapsed ? 'center' : 'flex-start',
  gap: 10,
  padding: collapsed ? '8px' : '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: isActive ? 500 : 400,
  fontFamily: "'Zalando Sans', sans-serif",
  backgroundColor: isActive ? 'rgba(252,79,0,0.1)' : 'transparent',
  color: isActive ? '#FC4F00' : 'inherit',
  transition: 'background-color 0.12s ease',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden' as const,
});

const SidebarDemo: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const [col, setCol] = useState(collapsed);
  const [active, setActive] = useState('dashboard');

  // Sync from playground
  React.useEffect(() => { setCol(collapsed); }, [collapsed]);

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <HouseIcon size={18} /> },
    { id: 'analytics', label: 'Analytika', icon: <ChartBarIcon size={18} /> },
    { id: 'users', label: 'Uživatelé', icon: <UsersIcon size={18} /> },
    { id: 'files', label: 'Soubory', icon: <FolderIcon size={18} /> },
    { id: 'settings', label: 'Nastavení', icon: <GearIcon size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', height: 380, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(128,128,128,0.15)' }}>
      <AppSidebar collapsed={col} onCollapse={setCol}>
        {/* Vlastní tlačítko pro sbalení/rozbalení */}
        <div style={{ display: 'flex', justifyContent: col ? 'center' : 'flex-end', marginBottom: 8 }}>
          <Button
            variant="ghost"
            size="sm"
            style={{ padding: 6 }}
            onClick={() => setCol((c) => !c)}
            aria-label={col ? 'Rozbalit panel' : 'Sbalit panel'}
          >
            {col ? <CaretRightIcon size={16} /> : <CaretLeftIcon size={16} />}
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={navItemStyle(active === item.id, col)}
              onClick={() => setActive(item.id)}
            >
              {item.icon}
              {!col && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </AppSidebar>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4, fontSize: 14 }}>
        Obsah stránky
      </div>
    </div>
  );
};

export const AppSidebarPage: React.FC = () => (
  <PageLayout>
    <H1>AppSidebar</H1>
    <Paragraph large>
      Sbaletelný postranní panel s glass efektem pro navigaci aplikace. Komponenta neobsahuje
      vestavěné tlačítko pro sbalení — konzument si umístí vlastní toggle kamkoli potřebuje.
    </Paragraph>

    <Playground controls={controls} render={(props) => <SidebarDemo collapsed={props.collapsed} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
