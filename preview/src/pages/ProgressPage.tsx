import React from 'react';
import { ProgressBar, ProgressCircle } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['xs', 'sm', 'md'], defaultValue: 'md' },
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['default', 'success', 'warning', 'danger'], defaultValue: 'default' },
  { type: 'boolean', prop: 'showValue', label: 'Zobrazit %', defaultValue: false },
  { type: 'boolean', prop: 'striped', label: 'Striped', defaultValue: false },
  { type: 'boolean', prop: 'animated', label: 'Animated', defaultValue: false },
  { type: 'boolean', prop: 'indeterminate', label: 'Indeterminate', defaultValue: false },
];

const barPropDefs: PropDef[] = [
  { name: 'value', type: 'number', required: true, description: 'Hodnota 0–max.' },
  { name: 'max', type: 'number', defaultValue: '100', description: 'Maximální hodnota.' },
  { name: 'size', type: "'xs' | 'sm' | 'md'", defaultValue: "'md'", description: 'Velikost.' },
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger'", defaultValue: "'default'", description: 'Barevná varianta.' },
  { name: 'color', type: 'string', defaultValue: "'#E8612D'", description: 'Barva (přepíše variantu).' },
  { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Zobrazí procenta.' },
  { name: 'label', type: 'string', description: 'Popisek.' },
  { name: 'striped', type: 'boolean', defaultValue: 'false', description: 'Pruhovaný efekt.' },
  { name: 'animated', type: 'boolean', defaultValue: 'false', description: 'Animace pruhů.' },
  { name: 'thresholds', type: 'Array<{ value: number; variant: string }>', description: 'Prahy pro automatickou změnu varianty dle hodnoty.' },
  { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: 'Nekonečná animace bez konkrétní hodnoty.' },
];

const circlePropDefs: PropDef[] = [
  { name: 'value', type: 'number', required: true, description: 'Hodnota 0–max.' },
  { name: 'max', type: 'number', defaultValue: '100', description: 'Maximální hodnota.' },
  { name: 'size', type: 'number', defaultValue: '64', description: 'Velikost SVG v px.' },
  { name: 'strokeWidth', type: 'number', defaultValue: '4', description: 'Šířka tahu.' },
  { name: 'thickness', type: 'number', description: 'Alias pro strokeWidth — tloušťka kruhu.' },
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger'", defaultValue: "'default'", description: 'Barevná varianta.' },
  { name: 'color', type: 'string', defaultValue: "'#E8612D'", description: 'Barva (přepíše variantu).' },
  { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Zobrazí % uprostřed.' },
  { name: 'valueLabel', type: 'string | ((value: number) => string)', description: 'Vlastní label uprostřed kruhu.' },
  { name: 'label', type: 'string', description: 'Popisek pod kruhem.' },
  { name: 'thresholds', type: 'Array<{ value: number; variant: string }>', description: 'Prahy pro automatickou změnu varianty dle hodnoty.' },
];

export const ProgressPage: React.FC = () => (
  <PageLayout>
    <H1>Progress</H1>
    <Paragraph large>Ukazatel průběhu ve formě lišty nebo kruhu.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 300 }}>
          <ProgressBar value={65} size={props.size} variant={props.variant} showValue={props.showValue} striped={props.striped} animated={props.animated} indeterminate={props.indeterminate} label="Nahrávání" />
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

    <H2>Thresholds</H2>
    <VariantShowcase label="Automatická změna varianty dle hodnoty">
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ProgressBar value={20} showValue thresholds={[{ value: 30, variant: 'danger' }, { value: 60, variant: 'warning' }, { value: 100, variant: 'success' }]} label="Nízká" />
        <ProgressBar value={50} showValue thresholds={[{ value: 30, variant: 'danger' }, { value: 60, variant: 'warning' }, { value: 100, variant: 'success' }]} label="Střední" />
        <ProgressBar value={85} showValue thresholds={[{ value: 30, variant: 'danger' }, { value: 60, variant: 'warning' }, { value: 100, variant: 'success' }]} label="Vysoká" />
      </div>
    </VariantShowcase>

    <H2>Indeterminate</H2>
    <VariantShowcase label="Nekonečná animace bez konkrétní hodnoty">
      <div style={{ width: 300 }}>
        <ProgressBar indeterminate label="Načítání..." />
      </div>
    </VariantShowcase>

    <H2>Progress Props</H2>
    <PropsTable props={barPropDefs} />
    <H2>ProgressCircle Props</H2>
    <PropsTable props={circlePropDefs} />
  </PageLayout>
);
