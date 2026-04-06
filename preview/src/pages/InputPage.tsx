import React, { useState } from 'react';
import { Input } from '../../../src';
import { MagnifyingGlass, EnvelopeSimple, Lock } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'label', label: 'Label', defaultValue: 'E-mail' },
  { type: 'text', prop: 'placeholder', label: 'Placeholder', defaultValue: 'vas@email.cz' },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'clearable', label: 'Clearable', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'icon', label: 'S ikonou', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'label', type: 'string', description: 'Popisek nad vstupním polem.' },
  { name: 'icon', type: 'ReactNode', description: 'Ikona uvnitř pole.' },
  { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Pozice ikony.' },
  { name: 'error', type: 'boolean | string', defaultValue: 'false', description: 'Chybový stav. String zobrazí chybovou zprávu.' },
  { name: 'helperText', type: 'string', description: 'Pomocný text pod polem.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner a pole je read-only.' },
  { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí tlačítko pro vymazání obsahu.' },
  { name: 'passwordToggle', type: 'boolean', description: 'Zobrazí přepínač viditelnosti hesla. Auto pro type="password".' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Roztáhne na celou šířku.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže vstup.' },
  { name: 'inputStyle', type: 'CSSProperties', description: 'Inline styly pro nativní <input> element.' },
];

const InputDemo: React.FC<{ size: string; label: string; placeholder: string; error: boolean; loading: boolean; clearable: boolean; disabled: boolean; icon: boolean }> = (props) => {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: 280 }}>
      <Input
        size={props.size as any}
        label={props.label}
        placeholder={props.placeholder}
        error={props.error ? 'Toto pole je povinné' : false}
        loading={props.loading}
        clearable={props.clearable}
        disabled={props.disabled}
        icon={props.icon ? <EnvelopeSimple size={16} /> : undefined}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const InputPage: React.FC = () => (
  <PageLayout>
    <H1>Input</H1>
    <Paragraph large>Textový vstup s podporou ikon, loading stavu, validace a mazání obsahu. Automatický toggle viditelnosti pro hesla.</Paragraph>

    <Playground controls={controls} render={(props) => <InputDemo {...props as any} />} />

    <H2>Varianty</H2>
    <VariantShowcase label="Velikosti">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </VariantShowcase>
    <VariantShowcase label="S ikonou">
      <Input icon={<MagnifyingGlass size={16} />} placeholder="Hledat..." />
      <Input icon={<Lock size={16} />} type="password" placeholder="Heslo" />
    </VariantShowcase>
    <VariantShowcase label="Stavy">
      <Input placeholder="Výchozí" />
      <Input error="Chyba" placeholder="S chybou" />
      <Input loading placeholder="Načítání" />
      <Input disabled placeholder="Zakázáno" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
