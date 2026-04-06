import React from 'react';
import { ProgressBar, ProgressCircle } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'showValue', label: 'Zobrazit %', defaultValue: false },
  { type: 'boolean', prop: 'striped', label: 'Striped', defaultValue: false },
  { type: 'boolean', prop: 'animated', label: 'Animated', defaultValue: false },
];

const barPropDefs: PropDef[] = [
  { name: 'value', type: 'number', required: true, description: 'Hodnota 0–100.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost.' },
  { name: 'color', type: 'string', defaultValue: "'#E8612D'", description: 'Barva.' },
  { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Zobrazí procenta.' },
  { name: 'label', type: 'string', description: 'Popisek.' },
  { name: 'striped', type: 'boolean', defaultValue: 'false', description: 'Pruhovaný efekt.' },
  { name: 'animated', type: 'boolean', defaultValue: 'false', description: 'Animace pruhů.' },
];

const circlePropDefs: PropDef[] = [
  { name: 'value', type: 'number', required: true, description: 'Hodnota 0–100.' },
  { name: 'size', type: 'number', defaultValue: '64', description: 'Velikost SVG v px.' },
  { name: 'strokeWidth', type: 'number', defaultValue: '4', description: 'Šířka tahu.' },
  { name: 'color', type: 'string', defaultValue: "'#E8612D'", description: 'Barva.' },
  { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Zobrazí % uprostřed.' },
  { name: 'label', type: 'string', description: 'Popisek pod kruhem.' },
];

export const ProgressPage: React.FC = () => (
  <PageLayout>
    <H1>Progress</H1>
    <Paragraph large>Ukazatel průběhu ve formě lišty nebo kruhu.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 300 }}>
          <ProgressBar value={65} size={props.size} showValue={props.showValue} striped={props.striped} animated={props.animated} label="Nahrávání" />
        </div>
      )}
    />

    <H2>ProgressCircle</H2>
    <VariantShowcase label="Ukázky">
      <ProgressCircle value={25} showValue />
      <ProgressCircle value={50} showValue />
      <ProgressCircle value={75} showValue />
      <ProgressCircle value={100} showValue />
    </VariantShowcase>

    <H2>Progress Props</H2>
    <PropsTable props={barPropDefs} />
    <H2>ProgressCircle Props</H2>
    <PropsTable props={circlePropDefs} />
  </PageLayout>
);
