import React, { useState } from 'react';
import { CommandMenu, Button } from '../../../src';
import type { CommandGroup } from '../../../src';
import {
  MagnifyingGlassIcon,
  GearIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  DownloadIcon,
  SignOutIcon,
} from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, PropsTable } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení command menu.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Voláno při zavření.' },
  { name: 'groups', type: 'CommandGroup[]', required: true, description: 'Skupiny příkazů k zobrazení.' },
  { name: 'placeholder', type: 'string', defaultValue: "'Zadejte příkaz...'", description: 'Placeholder vyhledávacího pole.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly pro kartu.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const groupPropDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Název skupiny příkazů (zobrazený jako záhlaví sekce).' },
  { name: 'items', type: 'CommandItem[]', required: true, description: 'Pole příkazů ve skupině.' },
];

const itemPropDefs: PropDef[] = [
  { name: 'id', type: 'string', required: true, description: 'Unikátní identifikátor příkazu.' },
  { name: 'label', type: 'string', required: true, description: 'Hlavní text příkazu.' },
  { name: 'description', type: 'string', description: 'Volitelný popis příkazu.' },
  { name: 'icon', type: 'ReactNode', description: 'Volitelná ikona příkazu.' },
  { name: 'shortcut', type: 'string', description: 'Klávesová zkratka (zobrazena jako badge).' },
  { name: 'onSelect', type: '() => void', required: true, description: 'Voláno při výběru příkazu.' },
];

const CommandMenuDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const groups: CommandGroup[] = [
    {
      label: 'Akce',
      items: [
        { id: 'new', label: 'Nový dokument', description: 'Vytvořit prázdný dokument', icon: <PlusIcon size={16} />, shortcut: '⌘N', onSelect: () => {} },
        { id: 'edit', label: 'Upravit', description: 'Upravit aktuální položku', icon: <PencilIcon size={16} />, shortcut: '⌘E', onSelect: () => {} },
        { id: 'delete', label: 'Smazat', description: 'Smazat vybranou položku', icon: <TrashIcon size={16} />, shortcut: '⌘⌫', onSelect: () => {} },
        { id: 'export', label: 'Exportovat', description: 'Stáhnout jako soubor', icon: <DownloadIcon size={16} />, onSelect: () => {} },
      ],
    },
    {
      label: 'Navigace',
      items: [
        { id: 'search', label: 'Hledat', description: 'Fulltextové vyhledávání', icon: <MagnifyingGlassIcon size={16} />, shortcut: '⌘K', onSelect: () => {} },
        { id: 'profile', label: 'Profil', description: 'Zobrazit profil uživatele', icon: <UserIcon size={16} />, onSelect: () => {} },
        { id: 'settings', label: 'Nastavení', description: 'Konfigurace aplikace', icon: <GearIcon size={16} />, onSelect: () => {} },
      ],
    },
    {
      label: 'Účet',
      items: [
        { id: 'logout', label: 'Odhlásit se', icon: <SignOutIcon size={16} />, onSelect: () => {} },
      ],
    },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít Command Menu</Button>
      <CommandMenu open={open} onClose={() => setOpen(false)} groups={groups} />
    </>
  );
};

export const CommandMenuPage: React.FC = () => (
  <PageLayout>
    <H1>CommandMenu</H1>
    <Paragraph large>
      Rozšířený command palette s podporou skupin příkazů, klávesových zkratek a fulltextového
      filtrování. Ovládání klávesnicí (šipky, Enter, Escape).
    </Paragraph>

    <H2>Demo</H2>
    <Paragraph>Klikněte na tlačítko pro otevření command menu. Začněte psát pro filtrování příkazů.</Paragraph>
    <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
      <CommandMenuDemo />
    </div>

    <H2>Props — CommandMenu</H2>
    <PropsTable props={propDefs} />

    <H2>Props — CommandGroup</H2>
    <Paragraph>Typ skupiny příkazů předávaný v poli <code>groups</code>.</Paragraph>
    <PropsTable props={groupPropDefs} />

    <H2>Props — CommandItem</H2>
    <Paragraph>Typ jednotlivého příkazu uvnitř skupiny.</Paragraph>
    <PropsTable props={itemPropDefs} />
  </PageLayout>
);
