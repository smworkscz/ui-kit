import React from 'react';
import { EmptyState, Button } from '../../../src';
import { Tray } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Žádná data' },
  { type: 'text', prop: 'description', label: 'Popis', defaultValue: 'Zatím zde nejsou žádné položky.' },
  { type: 'boolean', prop: 'action', label: 'S akcí', defaultValue: false },
  { type: 'boolean', prop: 'icon', label: 'S ikonou', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Hlavní nadpis.' },
  { name: 'description', type: 'string', description: 'Volitelný popis.' },
  { name: 'icon', type: 'ReactNode', description: 'Ilustrační ikona.' },
  { name: 'action', type: 'ReactNode', description: 'Akční prvek (tlačítko).' },
];

export const EmptyStatePage: React.FC = () => (
  <PageLayout>
    <H1>EmptyState</H1>
    <Paragraph large>Stav bez dat s ilustrací, popisem a volitelnou akcí.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <EmptyState
          title={props.title}
          description={props.description}
          icon={props.icon ? <Tray size={48} /> : undefined}
          action={props.action ? <Button size="sm">Přidat položku</Button> : undefined}
        />
      )}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
