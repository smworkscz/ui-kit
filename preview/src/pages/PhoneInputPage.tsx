import React, { useState } from 'react';
import { PhoneInput } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'string', description: 'Plná mezinárodní hodnota, např. "+420123456789".' },
  { name: 'onChange', type: '(value: string) => void', description: 'Callback s plnou hodnotou.' },
  { name: 'defaultCountry', type: 'string', defaultValue: "'CZ'", description: 'Výchozí ISO kód země.' },
  { name: 'countries', type: 'Country[]', description: 'Vlastní seznam zemí ({ code, name, dialCode, flag }).' },
  { name: 'label', type: 'string', description: 'Popisek.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav.' },
  { name: 'helperText', type: 'string', description: 'Nápovědný text.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže komponentu.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost.' },
  { name: 'placeholder', type: 'string', description: 'Placeholder.' },
];

const PhoneDemo: React.FC<{ size: any; disabled: boolean }> = ({ size, disabled }) => {
  const [phone, setPhone] = useState('+420');
  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      size={size}
      disabled={disabled}
      label="Telefon"
      style={{ width: 280 }}
    />
  );
};

const ErrorDemo: React.FC = () => {
  const [phone, setPhone] = useState('+420');
  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      label="Telefon"
      error="Neplatné telefonní číslo"
      style={{ width: 280 }}
    />
  );
};

export const PhoneInputPage: React.FC = () => (
  <PageLayout>
    <H1>PhoneInput</H1>
    <Paragraph large>
      Telefonní vstup s výběrem země a předvolby. Obsahuje rozbalovací seznam
      zemí s vlajkami, vyhledáváním a klávesovou navigací.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => <PhoneDemo size={props.size} disabled={props.disabled as boolean} />}
    />

    <H2>Chybový stav</H2>
    <VariantShowcase label="S chybovou zprávou">
      <ErrorDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
