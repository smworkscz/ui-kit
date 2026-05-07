import React from 'react';
import { EmptyState, Button } from '../../../src';
import { Tray } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Žádná data' },
  { type: 'text', prop: 'description', label: 'Popis', defaultValue: 'Zatím zde nejsou žádné položky.' },
  { type: 'boolean', prop: 'action', label: 'S akcí', defaultValue: false },
  { type: 'boolean', prop: 'icon', label: 'S ikonou', defaultValue: true },
  { type: 'select', prop: 'preset', label: 'Preset', options: ['', 'no-data', 'no-results', 'no-permission', 'error', 'coming-soon'], defaultValue: '' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
];

const propDefs: PropDef[] = [
  { name: 'title', type: 'string', description: 'Hlavní nadpis. Preset poskytuje výchozí hodnotu.' },
  { name: 'description', type: 'string', description: 'Volitelný popis.' },
  { name: 'icon', type: 'ReactNode', description: 'Ilustrační ikona.' },
  { name: 'action', type: 'ReactNode', description: 'Akční prvek (tlačítko).' },
  { name: 'preset', type: "'no-data' | 'no-results' | 'no-permission' | 'error' | 'coming-soon'", description: 'Přednastavený stav s výchozí ikonou, titulkem a popisem.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost.' },
];

export const EmptyStatePage: React.FC = () => (
  <PageLayout>
    <H1>EmptyState</H1>
    <Paragraph large>Stav bez dat s ilustrací, popisem a volitelnou akcí.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <EmptyState
          title={props.preset ? undefined : props.title}
          description={props.preset ? undefined : props.description}
          icon={!props.preset && props.icon ? <Tray size={48} /> : undefined}
          action={props.action ? <Button size="sm">Přidat položku</Button> : undefined}
          preset={props.preset || undefined}
          size={props.size as 'sm' | 'md' | 'lg'}
        />
      )}
    />

    <H2>Presety</H2>
    <VariantShowcase label="no-data">
      <EmptyState preset="no-data" />
    </VariantShowcase>
    <VariantShowcase label="no-results">
      <EmptyState preset="no-results" />
    </VariantShowcase>
    <VariantShowcase label="no-permission">
      <EmptyState preset="no-permission" />
    </VariantShowcase>
    <VariantShowcase label="error">
      <EmptyState preset="error" />
    </VariantShowcase>
    <VariantShowcase label="coming-soon">
      <EmptyState preset="coming-soon" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
