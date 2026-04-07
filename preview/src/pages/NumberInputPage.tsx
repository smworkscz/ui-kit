import React, { useState } from 'react';
import { NumberInput } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['default', 'compact'], defaultValue: 'default' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'step', label: 'Krok', defaultValue: '1' },
  { type: 'boolean', prop: 'hasMin', label: 'Min (0)', defaultValue: false },
  { type: 'boolean', prop: 'hasMax', label: 'Max (100)', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'number', description: 'Aktuální numerická hodnota.', required: true },
  { name: 'onChange', type: '(value: number) => void', description: 'Callback volaný při změně hodnoty.', required: true },
  { name: 'min', type: 'number', description: 'Minimální povolená hodnota.' },
  { name: 'max', type: 'number', description: 'Maximální povolená hodnota.' },
  { name: 'step', type: 'number', defaultValue: '1', description: 'Krok inkrementace / dekrementace.' },
  { name: 'variant', type: "'default' | 'compact'", defaultValue: "'default'", description: 'Varianta rozložení — výchozí s tlačítky po stranách, nebo kompaktní se šipkami vpravo.' },
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad polem.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav nebo chybová zpráva.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže celé pole včetně tlačítek.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'prefix', type: 'string', description: 'Text zobrazený před hodnotou (např. měna).' },
  { name: 'suffix', type: 'string', description: 'Text zobrazený za hodnotou (např. jednotka).' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly pro obalový element.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const NumberInputDemo: React.FC<{ variant: any; size: any; step: string; hasMin: boolean; hasMax: boolean; disabled: boolean }> = ({
  variant,
  size,
  step,
  hasMin,
  hasMax,
  disabled,
}) => {
  const [value, setValue] = useState(5);
  return (
    <NumberInput
      value={value}
      onChange={setValue}
      variant={variant}
      size={size}
      step={Number(step) || 1}
      min={hasMin ? 0 : undefined}
      max={hasMax ? 100 : undefined}
      disabled={disabled}
      label="Množství"
    />
  );
};

const SizesDemo: React.FC = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  return (
    <>
      <NumberInput value={a} onChange={setA} size="sm" label="Small" />
      <NumberInput value={b} onChange={setB} size="md" label="Medium" />
      <NumberInput value={c} onChange={setC} size="lg" label="Large" />
    </>
  );
};

const CompactDemo: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(10);
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <NumberInput value={a} onChange={setA} variant="compact" label="Počet" style={{ width: 120 }} />
      <NumberInput value={b} onChange={setB} variant="compact" suffix="ks" label="Položky" style={{ width: 140 }} />
    </div>
  );
};

export const NumberInputPage: React.FC = () => (
  <PageLayout>
    <H1>NumberInput</H1>
    <Paragraph large>
      Numerické vstupní pole s tlačítky +/− pro inkrementaci a dekrementaci.
      Podporuje rozsah min/max, krok, prefix/suffix a podržení tlačítka pro plynulou změnu hodnoty.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <NumberInputDemo
          variant={props.variant}
          size={props.size}
          step={props.step}
          hasMin={props.hasMin}
          hasMax={props.hasMax}
          disabled={props.disabled}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Velikosti">
      <SizesDemo />
    </VariantShowcase>

    <VariantShowcase label="Kompaktní varianta">
      <CompactDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
