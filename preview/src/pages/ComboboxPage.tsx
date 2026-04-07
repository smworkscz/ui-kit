import React, { useState } from 'react';
import { Combobox } from '../../../src';
import type { ComboboxOption } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoOptions: ComboboxOption[] = [
  { value: 'cz', label: 'Česko' },
  { value: 'sk', label: 'Slovensko' },
  { value: 'de', label: 'Německo' },
  { value: 'at', label: 'Rakousko' },
  { value: 'pl', label: 'Polsko' },
  { value: 'hu', label: 'Maďarsko' },
];

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'allowCustom', label: 'Allow custom', defaultValue: false },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'options', type: 'ComboboxOption[]', description: 'Dostupné položky k výběru.', required: true },
  { name: 'value', type: 'string', description: 'Aktuální vybraná hodnota.', required: true },
  { name: 'onChange', type: '(value: string) => void', description: 'Callback volaný při výběru položky.', required: true },
  { name: 'onInputChange', type: '(input: string) => void', description: 'Callback při změně textu. Vhodné pro asynchronní filtrování.' },
  { name: 'placeholder', type: 'string', defaultValue: "'Hledat…'", description: 'Zástupný text zobrazený při prázdném poli.' },
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad polem.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav nebo chybová zpráva.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže celou komponentu.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner místo ikony vyhledávání.' },
  { name: 'allowCustom', type: 'boolean', defaultValue: 'false', description: 'Povolí uživateli zadat vlastní hodnotu mimo seznam.' },
  { name: 'onCreate', type: '(value: string) => void', description: 'Callback volaný při vytvoření vlastní hodnoty (Enter při allowCustom).' },
  { name: 'renderOption', type: '(option, highlighted) => ReactNode', description: 'Vlastní renderování položky v seznamu.' },
  { name: 'notFoundContent', type: 'ReactNode', defaultValue: "'Žádné výsledky'", description: 'Obsah zobrazený když žádné výsledky neodpovídají.' },
  { name: 'footer', type: 'ReactNode', description: 'Obsah zobrazený pod seznamem položek uvnitř dropdownu.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly pro obalový element.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const ComboboxDemo: React.FC<{ size: any; allowCustom: boolean; loading: boolean; disabled: boolean }> = ({
  size,
  allowCustom,
  loading,
  disabled,
}) => {
  const [value, setValue] = useState('');
  return (
    <Combobox
      options={demoOptions}
      value={value}
      onChange={setValue}
      size={size}
      allowCustom={allowCustom}
      loading={loading}
      disabled={disabled}
      placeholder="Vyberte zemi…"
      label="Země"
      style={{ width: 260 }}
    />
  );
};

const BasicDemo: React.FC = () => {
  const [val, setVal] = useState('');
  return (
    <Combobox
      options={demoOptions}
      value={val}
      onChange={setVal}
      placeholder="Hledat zemi…"
      label="Základní"
      style={{ width: 240 }}
    />
  );
};

const CustomDemo: React.FC = () => {
  const [val, setVal] = useState('');
  return (
    <Combobox
      options={demoOptions}
      value={val}
      onChange={setVal}
      allowCustom
      placeholder="Zadejte nebo vyberte…"
      label="Vlastní hodnoty"
      style={{ width: 240 }}
    />
  );
};

export const ComboboxPage: React.FC = () => (
  <PageLayout>
    <H1>Combobox</H1>
    <Paragraph large>
      Kombinované vyhledávací pole se seznamem položek. Uživatel zadává text pro filtrování,
      podporuje navigaci klávesami a volitelně povoluje vlastní hodnoty mimo seznam.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <ComboboxDemo
          size={props.size}
          allowCustom={props.allowCustom}
          loading={props.loading}
          disabled={props.disabled}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Základní výběr">
      <BasicDemo />
    </VariantShowcase>

    <VariantShowcase label="S vlastními hodnotami">
      <CustomDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
