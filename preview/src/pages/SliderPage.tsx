import React, { useState } from 'react';
import { Slider } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'showValue', label: 'Zobrazit hodnotu', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'range', label: 'Rozsah', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'number | [number, number]', required: true, description: 'Aktuální hodnota.' },
  { name: 'onChange', type: '(value) => void', description: 'Callback při změně.' },
  { name: 'min', type: 'number', defaultValue: '0', description: 'Minimální hodnota.' },
  { name: 'max', type: 'number', defaultValue: '100', description: 'Maximální hodnota.' },
  { name: 'step', type: 'number', defaultValue: '1', description: 'Velikost kroku.' },
  { name: 'label', type: 'string', description: 'Popisek.' },
  { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Zobrazí aktuální hodnotu.' },
  { name: 'range', type: 'boolean', defaultValue: 'false', description: 'Režim rozsahu (min-max).' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci.' },
];

const SliderDemo: React.FC<{ size: string; showValue: boolean; disabled: boolean; range: boolean }> = (props) => {
  const [single, setSingle] = useState(50);
  const [rangeVal, setRangeVal] = useState<[number, number]>([20, 80]);
  return (
    <div style={{ width: 300 }}>
      <Slider
        value={props.range ? rangeVal : single}
        onChange={props.range ? (v: any) => setRangeVal(v) : (v: any) => setSingle(v)}
        size={props.size as any}
        showValue={props.showValue}
        disabled={props.disabled}
        range={props.range}
        label="Hlasitost"
      />
    </div>
  );
};

export const SliderPage: React.FC = () => (
  <PageLayout>
    <H1>Slider</H1>
    <Paragraph large>Posuvný výběr hodnoty s podporou rozsahu a zobrazení aktuální hodnoty.</Paragraph>

    <Playground controls={controls} render={(props) => <SliderDemo {...props as any} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
