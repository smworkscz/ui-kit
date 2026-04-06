import React, { useState } from 'react';
import { Switch } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Noční režim' },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Stav přepínače.' },
  { name: 'onChange', type: '(checked: boolean) => void', description: 'Callback při změně.' },
  { name: 'label', type: 'string', description: 'Textový popisek.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
];

const SwitchDemo: React.FC<{ size: string; label: string; disabled: boolean }> = (props) => {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onChange={setChecked} size={props.size as any} label={props.label} disabled={props.disabled} />;
};

export const SwitchPage: React.FC = () => (
  <PageLayout>
    <H1>Switch</H1>
    <Paragraph large>Přepínač zapnuto/vypnuto s plynulou animací posunu.</Paragraph>

    <Playground controls={controls} render={(props) => <SwitchDemo {...props as any} />} />

    <H2>Varianty</H2>
    <VariantShowcase label="Velikosti">
      <Switch size="sm" label="Small" checked />
      <Switch size="md" label="Medium" checked />
      <Switch size="lg" label="Large" checked />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
