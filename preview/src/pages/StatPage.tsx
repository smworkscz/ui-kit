import React from 'react';
import { Stat } from '../../../src';
import { Users, ChartLineUp } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'label', label: 'Popisek', defaultValue: 'Uživatelé' },
  { type: 'text', prop: 'value', label: 'Hodnota', defaultValue: '1,234' },
  { type: 'select', prop: 'trend', label: 'Trend', options: ['up', 'down', 'neutral'], defaultValue: 'up' },
  { type: 'boolean', prop: 'icon', label: 'S ikonou', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Popisek statistiky.' },
  { name: 'value', type: 'string | number', required: true, description: 'Hlavní hodnota.' },
  { name: 'change', type: 'number', description: 'Procentuální změna.' },
  { name: 'changeLabel', type: 'string', description: 'Text ke změně.' },
  { name: 'trend', type: "'up' | 'down' | 'neutral'", defaultValue: "'neutral'", description: 'Směr trendu.' },
  { name: 'icon', type: 'ReactNode', description: 'Ikona.' },
];

export const StatPage: React.FC = () => (
  <PageLayout>
    <H1>Stat</H1>
    <Paragraph large>Statistická hodnota s popisem, trendem a volitelnou ikonou.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Stat
          label={props.label}
          value={props.value}
          change={12.5}
          changeLabel="vs. minulý měsíc"
          trend={props.trend}
          icon={props.icon ? <Users size={20} /> : undefined}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Trendy">
      <Stat label="Příjmy" value="€52,400" change={8.2} trend="up" />
      <Stat label="Odchody" value="23" change={-3.1} trend="down" />
      <Stat label="Projekty" value="12" trend="neutral" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
