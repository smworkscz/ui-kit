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
  { type: 'boolean', prop: 'multiple', label: 'Multiple', defaultValue: false },
  { type: 'boolean', prop: 'clearable', label: 'Clearable', defaultValue: false },
  { type: 'boolean', prop: 'allowCustom', label: 'Allow custom', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'options', type: 'ComboboxOption[]', description: 'Dostupné položky k výběru.', required: true },
  { name: 'value', type: 'string | string[]', description: 'Aktuální vybraná hodnota. Při multiple: string[].', required: true },
  { name: 'onChange', type: '(value: any) => void', description: 'Callback volaný při výběru. Při multiple vrací string[].', required: true },
  { name: 'onInputChange', type: '(input: string) => void', description: 'Callback při změně textu. Vhodné pro asynchronní filtrování.' },
  { name: 'placeholder', type: 'string', defaultValue: "'Hledat…'", description: 'Zástupný text zobrazený při prázdném poli.' },
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad polem.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav nebo chybová zpráva.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže celou komponentu.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner místo ikony vyhledávání.' },
  { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Umožní vybrat více položek najednou.' },
  { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí tlačítko pro vymazání výběru.' },
  { name: 'allowCustom', type: 'boolean', defaultValue: 'false', description: 'Povolí uživateli zadat vlastní hodnotu mimo seznam.' },
  { name: 'onCreate', type: '(value: string) => void', description: 'Callback volaný při vytvoření vlastní hodnoty (Enter při allowCustom).' },
  { name: 'renderOption', type: '(option, highlighted) => ReactNode', description: 'Vlastní renderování položky v seznamu.' },
  { name: 'notFoundContent', type: 'ReactNode', defaultValue: "'Žádné výsledky'", description: 'Obsah zobrazený když žádné výsledky neodpovídají.' },
  { name: 'footer', type: 'ReactNode | ((close) => ReactNode)', description: 'Obsah pod seznamem. Funkce dostane close() pro zavření dropdownu.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Voláno při otevření/zavření dropdownu.' },
  { name: 'onSelect', type: '(value, option) => void', description: 'Voláno při výběru položky.' },
  { name: 'onDeselect', type: '(value, option) => void', description: 'Voláno při odebrání položky (multiple).' },
  { name: 'onClear', type: '() => void', description: 'Voláno při vymazání výběru.' },
  { name: 'onFocus', type: '(event) => void', description: 'Voláno při focus.' },
  { name: 'onBlur', type: '(event) => void', description: 'Voláno při blur.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly pro obalový element.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const ComboboxDemo: React.FC<{ size: any; multiple: boolean; clearable: boolean; allowCustom: boolean }> = ({
  size,
  multiple,
  clearable,
  allowCustom,
}) => {
  const [value, setValue] = useState<string>('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  return (
    <Combobox
      options={demoOptions}
      value={multiple ? multiValue : value}
      onChange={multiple ? setMultiValue : setValue}
      multiple={multiple}
      clearable={clearable}
      size={size}
      allowCustom={allowCustom}
      placeholder="Vyberte zemi…"
      label="Země"
      style={{ width: 300 }}
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

const MultiDemo: React.FC = () => {
  const [val, setVal] = useState<string[]>([]);
  return (
    <Combobox
      multiple
      options={demoOptions}
      value={val}
      onChange={setVal}
      placeholder="Vyberte země…"
      label="Vícenásobný výběr"
      style={{ width: 300 }}
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
          multiple={props.multiple as boolean}
          clearable={props.clearable as boolean}
          allowCustom={props.allowCustom as boolean}
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

    <VariantShowcase label="Vícenásobný výběr">
      <MultiDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
