import React, { useState } from 'react';
import { SidebarItem, useTheme } from '../../../src';
import { HouseIcon, GearIcon, UsersIcon, ChartBarIcon, FolderIcon, BellIcon, ShieldIcon, PaletteIcon } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, PropsTable, CodeBlock } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Textový popisek položky.' },
  { name: 'icon', type: 'ReactNode', description: 'Ikona zobrazená před textem.' },
  { name: 'active', type: 'boolean', defaultValue: 'false', description: 'Aktivní (vybraný) stav.' },
  { name: 'defaultExpanded', type: 'boolean', defaultValue: 'false', description: 'Výchozí rozbalení (neřízené).' },
  { name: 'expanded', type: 'boolean', description: 'Řízené rozbalení. Přepíše defaultExpanded.' },
  { name: 'onExpandedChange', type: '(expanded: boolean) => void', description: 'Callback při změně rozbalení.' },
  { name: 'onClick', type: '() => void', description: 'Callback při kliknutí na položku.' },
  { name: 'children', type: 'ReactNode', description: 'Vnořené položky — aktivuje rozbalovací režim.' },
  { name: 'collapsed', type: 'boolean', defaultValue: 'false', description: 'Režim sbalené lišty (jen ikona).' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci.' },
];

const SidebarDemo: React.FC = () => {
  const [activeId, setActiveId] = useState('dashboard');
  const theme = useTheme();

  return (
    <div
      style={{
        width: 240,
        padding: '12px',
        borderRadius: 12,
        backgroundColor: theme === 'dark' ? 'rgba(24,24,24,0.8)' : 'rgba(255,255,255,0.8)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <SidebarItem label="Dashboard" icon={<HouseIcon size={18} />} active={activeId === 'dashboard'} onClick={() => setActiveId('dashboard')} />
      <SidebarItem label="Uživatelé" icon={<UsersIcon size={18} />} active={activeId === 'users'} onClick={() => setActiveId('users')} />
      <SidebarItem label="Statistiky" icon={<ChartBarIcon size={18} />} active={activeId === 'stats'} onClick={() => setActiveId('stats')} />
      <SidebarItem label="Projekty" icon={<FolderIcon size={18} />} defaultExpanded>
        <SidebarItem label="Aktivní" active={activeId === 'active'} onClick={() => setActiveId('active')} />
        <SidebarItem label="Archivované" active={activeId === 'archived'} onClick={() => setActiveId('archived')} />
        <SidebarItem label="Šablony" active={activeId === 'templates'} onClick={() => setActiveId('templates')} />
      </SidebarItem>
      <SidebarItem label="Nastavení" icon={<GearIcon size={18} />}>
        <SidebarItem label="Obecné" active={activeId === 'general'} onClick={() => setActiveId('general')} />
        <SidebarItem label="Zabezpečení" icon={<ShieldIcon size={16} />} active={activeId === 'security'} onClick={() => setActiveId('security')} />
        <SidebarItem label="Notifikace" icon={<BellIcon size={16} />} active={activeId === 'notifications'} onClick={() => setActiveId('notifications')} />
        <SidebarItem label="Vzhled" icon={<PaletteIcon size={16} />} active={activeId === 'appearance'} onClick={() => setActiveId('appearance')} />
      </SidebarItem>
    </div>
  );
};

const CollapsedDemo: React.FC = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: 56,
        padding: '8px',
        borderRadius: 12,
        backgroundColor: theme === 'dark' ? 'rgba(24,24,24,0.8)' : 'rgba(255,255,255,0.8)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <SidebarItem label="Dashboard" icon={<HouseIcon size={18} />} active collapsed />
      <SidebarItem label="Uživatelé" icon={<UsersIcon size={18} />} collapsed />
      <SidebarItem label="Statistiky" icon={<ChartBarIcon size={18} />} collapsed />
      <SidebarItem label="Nastavení" icon={<GearIcon size={18} />} collapsed />
    </div>
  );
};

export const SidebarItemPage: React.FC = () => (
  <PageLayout>
    <H1>SidebarItem</H1>
    <Paragraph large>
      Navigační položka pro AppSidebar. Podporuje ikonu, aktivní stav, hover efekt
      a vnořené položky s animovaným rozbalováním.
    </Paragraph>

    <H2>Ukázka</H2>
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
      <SidebarDemo />
      <CollapsedDemo />
    </div>

    <H2>Použití</H2>
    <CodeBlock>{`import { AppSidebar, SidebarItem } from '@smworks-cz/ui-kit';
import { HouseIcon, GearIcon, FolderIcon } from '@phosphor-icons/react';

function Navigation() {
  const [active, setActive] = useState('dashboard');

  return (
    <AppSidebar>
      <SidebarItem
        label="Dashboard"
        icon={<HouseIcon size={18} />}
        active={active === 'dashboard'}
        onClick={() => setActive('dashboard')}
      />

      {/* S vnořenými položkami */}
      <SidebarItem label="Projekty" icon={<FolderIcon size={18} />} defaultExpanded>
        <SidebarItem label="Aktivní" onClick={() => setActive('active')} />
        <SidebarItem label="Archivované" onClick={() => setActive('archived')} />
      </SidebarItem>

      <SidebarItem label="Nastavení" icon={<GearIcon size={18} />}>
        <SidebarItem label="Obecné" />
        <SidebarItem label="Zabezpečení" />
      </SidebarItem>
    </AppSidebar>
  );
}`}</CodeBlock>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
