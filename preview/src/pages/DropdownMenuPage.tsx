import React from 'react';
import { DropdownMenu, Button, Input } from '../../../src';
import { PencilSimple, Copy, Trash, UserCircle, Gear, SignOut } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'position', label: 'Pozice', options: ['bottom-left', 'bottom-right'], defaultValue: 'bottom-left' },
];

const propDefs: PropDef[] = [
  { name: 'trigger', type: 'ReactNode', required: true, description: 'Spouštěcí element.' },
  { name: 'items', type: 'DropdownMenuItem[]', required: true, description: 'Seznam položek nabídky.' },
  { name: 'position', type: "'bottom-left' | 'bottom-right'", defaultValue: "'bottom-left'", description: 'Pozice nabídky.' },
  { name: 'triggerOnRightClick', type: 'boolean', defaultValue: 'false', description: 'Otevře nabídku pravým kliknutím.' },
];

const itemPropDefs: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: true, description: 'Popisek položky. String nebo ReactNode pro vlastní obsah.' },
  { name: 'icon', type: 'ReactNode', description: 'Ikona před textem.' },
  { name: 'onClick', type: '() => void', description: 'Callback kliknutí. Bez onClick u ReactNode labelu: žádný hover ani zavření.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže výběr.' },
  { name: 'danger', type: 'boolean', defaultValue: 'false', description: 'Červený styl (destruktivní).' },
  { name: 'divider', type: 'boolean', defaultValue: 'false', description: 'Oddělovací čára.' },
  { name: 'category', type: 'string', description: 'Text kategorie — uppercase nadpis sekce pro seskupení položek.' },
  { name: 'shortcut', type: 'string', description: 'Klávesová zkratka zobrazená vpravo (např. "⌘S").' },
  { name: 'keepOpenOnClick', type: 'boolean', defaultValue: 'false', description: 'Nezavře dropdown po kliknutí. Pro toggle položky.' },
  { name: 'subItems', type: 'DropdownMenuItem[]', description: 'Vnořené položky pro kaskádové podmenu.' },
];

const demoItems = [
  { label: 'Upravit', icon: <PencilSimple size={16} />, onClick: () => {}, shortcut: '⌘E' },
  { label: 'Duplikovat', icon: <Copy size={16} />, onClick: () => {} },
  { divider: true, label: '' },
  { label: 'Smazat', icon: <Trash size={16} />, danger: true, onClick: () => {}, shortcut: '⌘⌫' },
];

const categoryItems = [
  { category: 'Účet', label: '' },
  { label: 'Profil', icon: <UserCircle size={16} />, onClick: () => {} },
  { label: 'Nastavení', icon: <Gear size={16} />, onClick: () => {} },
  { category: 'Nebezpečné', label: '' },
  { label: 'Odhlásit se', icon: <SignOut size={16} />, danger: true, onClick: () => {} },
];

const customNodeItems = [
  {
    label: (
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>Jan Novák</div>
        <div style={{ fontSize: '12px', opacity: 0.6 }}>jan@example.com</div>
      </div>
    ),
  },
  { divider: true, label: '' },
  { label: 'Profil', icon: <UserCircle size={16} />, onClick: () => {} },
  { label: 'Nastavení', icon: <Gear size={16} />, onClick: () => {} },
  { divider: true, label: '' },
  { label: 'Odhlásit se', icon: <SignOut size={16} />, danger: true, onClick: () => {} },
];

export const DropdownMenuPage: React.FC = () => (
  <PageLayout>
    <H1>DropdownMenu</H1>
    <Paragraph large>Rozbalovací nabídka akcí s klávesovou navigací a chytrým pozicováním.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <DropdownMenu trigger={<Button variant="outline">Akce</Button>} items={demoItems} position={props.position} />
      )}
    />

    <H2>S kategoriemi</H2>
    <VariantShowcase label="Sekce seskupené pomocí category">
      <DropdownMenu trigger={<Button variant="outline">Účet</Button>} items={categoryItems} />
    </VariantShowcase>

    <H2>Vlastní ReactNode label</H2>
    <VariantShowcase label="Header karty uživatele bez onClick — žádný hover, žádné zavření">
      <DropdownMenu trigger={<Button variant="outline">Uživatel</Button>} items={customNodeItems} />
    </VariantShowcase>

    <H2>Right-click context menu</H2>
    <VariantShowcase label="Otevře se pravým kliknutím — triggerOnRightClick">
      <DropdownMenu
        trigger={<div style={{ padding: '16px 24px', background: 'rgba(252,79,0,0.1)', borderRadius: 8, fontFamily: "'Zalando Sans', sans-serif", fontSize: 14, cursor: 'context-menu' }}>Klikněte pravým tlačítkem</div>}
        items={demoItems}
        triggerOnRightClick
      />
    </VariantShowcase>

    <H2>Keep open on click</H2>
    <VariantShowcase label="Položka s keepOpenOnClick — dropdown se nezavře po kliknutí">
      <DropdownMenu
        trigger={<Button variant="outline">Nastavení</Button>}
        items={[
          { label: 'Tmavý režim', icon: <Gear size={16} />, onClick: () => {}, keepOpenOnClick: true },
          { label: 'Zvuk', icon: <Gear size={16} />, onClick: () => {}, keepOpenOnClick: true },
          { divider: true, label: '' },
          { label: 'Uložit', onClick: () => {} },
        ]}
      />
    </VariantShowcase>

    <H2>Kaskádové podmenu</H2>
    <VariantShowcase label="Položky s vnořenými subItems">
      <DropdownMenu
        trigger={<Button variant="outline">S podmenu</Button>}
        items={[
          {
            label: 'Exportovat', icon: <Copy size={16} />, subItems: [
              { label: 'CSV', onClick: () => {} },
              { label: 'Excel', onClick: () => {} },
              { label: 'PDF', onClick: () => {} },
            ],
          },
          { divider: true, label: '' },
          { label: 'Smazat', icon: <Trash size={16} />, danger: true, onClick: () => {} },
        ]}
      />
    </VariantShowcase>

    <H2>DropdownMenu Props</H2>
    <PropsTable props={propDefs} />
    <H2>DropdownMenuItem Props</H2>
    <PropsTable props={itemPropDefs} />
  </PageLayout>
);
