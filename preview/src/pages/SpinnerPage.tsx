import React from 'react';
import { Spinner } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
];

const propDefs: PropDef[] = [
  { name: 'size', type: "'sm' | 'md' | 'lg' | number", defaultValue: "'md'", description: 'Velikost (sm: 16px, md: 24px, lg: 40px).' },
  { name: 'color', type: 'string', description: 'Barva (výchozí: currentColor).' },
  { name: 'label', type: 'string', defaultValue: "'Načítání'", description: 'ARIA label.' },
];

export const SpinnerPage: React.FC = () => (
  <PageLayout>
    <H1>Spinner</H1>
    <Paragraph large>Rotující indikátor načítání.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => <Spinner size={props.size} />}
    />

    <H2>Velikosti</H2>
    <VariantShowcase label="Preset">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
