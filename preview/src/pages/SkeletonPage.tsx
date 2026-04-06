import React from 'react';
import { Skeleton } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['text', 'circle', 'rect'], defaultValue: 'text' },
  { type: 'boolean', prop: 'animate', label: 'Animace', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'text' | 'circle' | 'rect'", defaultValue: "'text'", description: 'Tvar skeletonu.' },
  { name: 'width', type: 'number | string', defaultValue: "'100%'", description: 'Šířka.' },
  { name: 'height', type: 'number | string', description: 'Výška.' },
  { name: 'lines', type: 'number', defaultValue: '1', description: 'Počet řádků (pouze text).' },
  { name: 'animate', type: 'boolean', defaultValue: 'true', description: 'Shimmer animace.' },
];

export const SkeletonPage: React.FC = () => (
  <PageLayout>
    <H1>Skeleton</H1>
    <Paragraph large>Placeholder pro načítání obsahu se shimmer animací.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 300 }}>
          <Skeleton variant={props.variant} animate={props.animate} width={props.variant === 'circle' ? 60 : '100%'} height={props.variant === 'circle' ? 60 : props.variant === 'rect' ? 120 : undefined} lines={props.variant === 'text' ? 3 : 1} />
        </div>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Tvary">
      <Skeleton variant="text" width={200} lines={3} />
      <Skeleton variant="circle" width={48} height={48} />
      <Skeleton variant="rect" width={200} height={100} />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
