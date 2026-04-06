import React from 'react';
import { Divider } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'orientation', label: 'Orientace', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
  { type: 'text', prop: 'label', label: 'Label', defaultValue: '' },
];

const propDefs: PropDef[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Orientace čáry.' },
  { name: 'label', type: 'string', description: 'Volitelný text (jen horizontal).' },
];

export const DividerPage: React.FC = () => (
  <PageLayout>
    <H1>Divider</H1>
    <Paragraph large>Oddělovací čára s volitelným textem.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 300, height: props.orientation === 'vertical' ? 80 : 'auto' }}>
          <Divider orientation={props.orientation} label={props.label || undefined} />
        </div>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="S textem">
      <div style={{ width: 300 }}><Divider label="nebo" /></div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
