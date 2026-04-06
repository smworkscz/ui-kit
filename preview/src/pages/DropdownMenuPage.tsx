import React from 'react';
import { DropdownMenu, Button } from '../../../src';
import { PencilSimple, Copy, Trash } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'position', label: 'Pozice', options: ['bottom-left', 'bottom-right'], defaultValue: 'bottom-left' },
];

const propDefs: PropDef[] = [
  { name: 'trigger', type: 'ReactNode', required: true, description: 'Spouštěcí element.' },
  { name: 'items', type: 'DropdownMenuItem[]', required: true, description: 'Seznam položek nabídky.' },
  { name: 'position', type: "'bottom-left' | 'bottom-right'", defaultValue: "'bottom-left'", description: 'Pozice nabídky.' },
];

const itemPropDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Popisek položky.' },
  { name: 'icon', type: 'ReactNode', description: 'Ikona před textem.' },
  { name: 'onClick', type: '() => void', description: 'Callback kliknutí.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže výběr.' },
  { name: 'danger', type: 'boolean', defaultValue: 'false', description: 'Červený styl (destruktivní).' },
  { name: 'divider', type: 'boolean', defaultValue: 'false', description: 'Oddělovací čára.' },
];

const demoItems = [
  { label: 'Upravit', icon: <PencilSimple size={16} />, onClick: () => {} },
  { label: 'Duplikovat', icon: <Copy size={16} />, onClick: () => {} },
  { divider: true, label: '' },
  { label: 'Smazat', icon: <Trash size={16} />, danger: true, onClick: () => {} },
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

    <H2>DropdownMenu Props</H2>
    <PropsTable props={propDefs} />
    <H2>DropdownMenuItem Props</H2>
    <PropsTable props={itemPropDefs} />
  </PageLayout>
);
