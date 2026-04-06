import React, { useState } from 'react';
import { Checkbox } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Souhlasím s podmínkami' },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'indeterminate', label: 'Indeterminate', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'checked', type: 'boolean', defaultValue: 'false', description: 'Stav zaškrtnutí.' },
  { name: 'onChange', type: '(checked: boolean) => void', description: 'Callback při změně.' },
  { name: 'label', type: 'string', description: 'Textový popisek.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav nebo zpráva.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost checkboxu.' },
  { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: 'Neurčitý stav (čárka místo fajfky).' },
];

const CheckboxDemo: React.FC<{ size: string; label: string; disabled: boolean; indeterminate: boolean; error: boolean }> = (props) => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      size={props.size as any}
      label={props.label}
      disabled={props.disabled}
      indeterminate={props.indeterminate}
      error={props.error ? 'Toto pole je povinné' : false}
    />
  );
};

export const CheckboxPage: React.FC = () => (
  <PageLayout>
    <H1>Checkbox</H1>
    <Paragraph large>Zaškrtávací pole s podporou indeterminate stavu, chybových zpráv a různých velikostí.</Paragraph>

    <Playground controls={controls} render={(props) => <CheckboxDemo {...props as any} />} />

    <H2>Varianty</H2>
    <VariantShowcase label="Velikosti">
      <Checkbox size="sm" label="Small" checked />
      <Checkbox size="md" label="Medium" checked />
      <Checkbox size="lg" label="Large" checked />
    </VariantShowcase>
    <VariantShowcase label="Stavy">
      <Checkbox label="Výchozí" />
      <Checkbox label="Zaškrtnutý" checked />
      <Checkbox label="Neurčitý" indeterminate />
      <Checkbox label="Zakázaný" disabled />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
