import React, { useState } from 'react';
import { OTPInput } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'length', label: 'Délka', defaultValue: '6' },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Error', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'string', description: 'Aktuální hodnota jako řetězec číslic.', required: true },
  { name: 'onChange', type: '(value: string) => void', description: 'Callback volaný při změně hodnoty.', required: true },
  { name: 'length', type: 'number', defaultValue: '6', description: 'Počet polí (číslic).' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav nebo chybová zpráva.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže celou komponentu.' },
  { name: 'autoFocus', type: 'boolean', defaultValue: 'false', description: 'Automaticky zaměří první pole při renderování.' },
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad komponentou.' },
  { name: 'separatorAfter', type: 'number', description: 'Vloží oddělovač po každých N polích.' },
  { name: 'separator', type: 'ReactNode', defaultValue: "'-'", description: 'Obsah oddělovače mezi skupinami číslic.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly pro obalový element.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const OTPDemo: React.FC<{ length: string; disabled: boolean; error: boolean }> = ({ length, disabled, error }) => {
  const [value, setValue] = useState('');
  return (
    <OTPInput
      value={value}
      onChange={setValue}
      length={Number(length) || 6}
      disabled={disabled}
      error={error ? 'Neplatný kód' : undefined}
      label="Ověřovací kód"
    />
  );
};

const FourDigitDemo: React.FC = () => {
  const [val, setVal] = useState('');
  return <OTPInput value={val} onChange={setVal} length={4} label="4místný kód" />;
};

const SeparatorDemo: React.FC = () => {
  const [val, setVal] = useState('');
  return <OTPInput value={val} onChange={setVal} length={6} separatorAfter={3} label="Kód s oddělovačem" />;
};

const CustomSeparatorDemo: React.FC = () => {
  const [val, setVal] = useState('');
  return (
    <OTPInput
      value={val}
      onChange={setVal}
      length={8}
      separatorAfter={4}
      separator={<span style={{ fontSize: '14px' }}>&bull;</span>}
      label="8místný kód se skupinami"
    />
  );
};

export const OTPInputPage: React.FC = () => (
  <PageLayout>
    <H1>OTPInput</H1>
    <Paragraph large>
      Pole pro zadání jednorázového ověřovacího kódu (OTP). Každá číslice má vlastní pole
      s automatickým přesunem fokusu. Podporuje vložení celého kódu ze schránky.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <OTPDemo length={props.length} disabled={props.disabled} error={props.error} />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="4místný kód">
      <FourDigitDemo />
    </VariantShowcase>

    <VariantShowcase label="S oddělovačem (po 3 číslicích)">
      <SeparatorDemo />
    </VariantShowcase>

    <VariantShowcase label="Vlastní oddělovač (po 4 číslicích)">
      <CustomSeparatorDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
