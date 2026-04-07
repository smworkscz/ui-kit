import React from 'react';
import { StatusBadge } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'status', label: 'Stav', options: ['online', 'offline', 'away', 'busy'], defaultValue: 'online' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'pulse', label: 'Pulzování', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'status', type: "'online' | 'offline' | 'away' | 'busy' | string", required: true, description: 'Stav k zobrazení. Předdefinované nebo vlastní řetězec.' },
  { name: 'label', type: 'string', description: 'Volitelný textový popis vedle indikátoru.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost indikátoru.' },
  { name: 'pulse', type: 'boolean', defaultValue: 'false', description: 'Zapne pulzující animaci na libovolném stavu.' },
  { name: 'color', type: 'string', description: 'Vlastní barva indikátoru — přepíše výchozí barvu stavu.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

export const StatusBadgePage: React.FC = () => (
  <PageLayout>
    <H1>StatusBadge</H1>
    <Paragraph large>
      Malý barevný indikátor stavu (online, offline, away, busy) s volitelnou pulzující animací a textovým popisem.
      Podporuje i vlastní stavy s vlastní barvou.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <StatusBadge
          status={props.status}
          size={props.size}
          pulse={props.pulse}
          label={props.status.charAt(0).toUpperCase() + props.status.slice(1)}
        />
      )}
    />

    <H2>Všechny stavy</H2>
    <VariantShowcase label="Bez popisku">
      <StatusBadge status="online" />
      <StatusBadge status="offline" />
      <StatusBadge status="away" />
      <StatusBadge status="busy" />
    </VariantShowcase>

    <H2>S popisky</H2>
    <VariantShowcase label="S textovým popisem">
      <StatusBadge status="online" label="Online" />
      <StatusBadge status="offline" label="Offline" />
      <StatusBadge status="away" label="Pryč" />
      <StatusBadge status="busy" label="Nerušit" />
    </VariantShowcase>

    <H2>Velikosti</H2>
    <VariantShowcase label="sm / md / lg">
      <StatusBadge status="online" label="Malý" size="sm" />
      <StatusBadge status="online" label="Střední" size="md" />
      <StatusBadge status="online" label="Velký" size="lg" />
    </VariantShowcase>

    <H2>Pulzující animace</H2>
    <VariantShowcase label="Pulse na různých stavech">
      <StatusBadge status="online" label="Online" pulse />
      <StatusBadge status="busy" label="Nerušit" pulse />
      <StatusBadge status="away" label="Pryč" size="lg" pulse />
    </VariantShowcase>

    <H2>Vlastní stavy</H2>
    <VariantShowcase label="Vlastní stav s barvou">
      <StatusBadge status="streaming" color="#9C27B0" label="Živě" pulse />
      <StatusBadge status="meeting" color="#2196F3" label="Na schůzce" />
      <StatusBadge status="vacation" color="#F5A623" label="Dovolená" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
