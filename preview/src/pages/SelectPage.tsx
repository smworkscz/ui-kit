import React, { useState } from 'react';
import { Select } from '../../../src';
import type { SelectOption } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
];

const colorOptions = [
  { value: 'red', label: 'Červená', color: '#EF3838' },
  { value: 'green', label: 'Zelená', color: '#00A205' },
  { value: 'blue', label: 'Modrá', color: '#3B82F6' },
  { value: 'orange', label: 'Oranžová', color: '#FC4F00' },
  { value: 'purple', label: 'Fialová', color: '#8B5CF6' },
];

const SelectDemo: React.FC<{ searchable: boolean; clearable: boolean; multiple: boolean; disabled: boolean; loading: boolean; error: boolean; label: string; creatable: boolean; chipDisplay: string }> = (props) => {
  const [value, setValue] = useState<string | string[] | null>(null);
  return (
    <div style={{ width: 280 }}>
      <Select
        options={demoOptions}
        value={value}
        onChange={setValue}
        searchable={props.searchable}
        clearable={props.clearable}
        multiple={props.multiple}
        disabled={props.disabled}
        loading={props.loading}
        error={props.error ? 'Vyberte alespoň jednu položku' : false}
        label={props.label || undefined}
        placeholder="Vyberte framework..."
        creatable={props.creatable}
        chipDisplay={props.chipDisplay as 'inline' | 'count'}
      />
    </div>
  );
};

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Framework' },
  { type: 'boolean', prop: 'searchable', label: 'Searchable', defaultValue: false },
  { type: 'boolean', prop: 'clearable', label: 'Clearable', defaultValue: false },
  { type: 'boolean', prop: 'multiple', label: 'Multiple', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
  { type: 'boolean', prop: 'creatable', label: 'Creatable', defaultValue: false },
  { type: 'select', prop: 'chipDisplay', label: 'Chip display', options: ['inline', 'count'], defaultValue: 'inline' },
];

const propDefs: PropDef[] = [
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad selectem.' },
  { name: 'options', type: 'SelectOption[]', required: true, description: 'Dostupné položky pro výběr.' },
  { name: 'value', type: 'string | string[] | null', description: 'Aktuální hodnota (string pro single, array pro multiple).' },
  { name: 'onChange', type: '(value: any) => void', description: 'Callback při změně výběru.' },
  { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Povolí vícenásobný výběr.' },
  { name: 'searchable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí vyhledávací pole v dropdown.' },
  { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí tlačítko pro vymazání výběru.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner místo šipky.' },
  { name: 'error', type: 'boolean | string', defaultValue: 'false', description: 'Chybový stav nebo zpráva.' },
  { name: 'placeholder', type: 'string', defaultValue: "'Vyberte…'", description: 'Zástupný text.' },
  { name: 'maxDropdownHeight', type: 'number', defaultValue: '240', description: 'Maximální výška dropdown v px.' },
  { name: 'onSearch', type: '(query: string) => Promise<SelectOption[]>', description: 'Async server-side vyhledávání.' },
  { name: 'creatable', type: 'boolean', defaultValue: 'false', description: 'Povolí uživateli vytvořit novou hodnotu.' },
  { name: 'onCreateOption', type: '(label: string) => void', description: 'Callback při vytvoření nové hodnoty.' },
  { name: 'chipDisplay', type: "'inline' | 'count'", defaultValue: "'inline'", description: 'Způsob zobrazení vybraných v multiple režimu.' },
  { name: 'renderOption', type: '(option, selected) => ReactNode', description: 'Vlastní renderování položky v seznamu.' },
  { name: 'renderValue', type: '(option) => ReactNode', description: 'Vlastní renderování vybrané hodnoty.' },
];

export const SelectPage: React.FC = () => (
  <PageLayout>
    <H1>Select</H1>
    <Paragraph large>Výběr ze seznamu hodnot s podporou vyhledávání, vícenásobného výběru a klávesové navigace.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <SelectDemo label={props.label} searchable={props.searchable as boolean} clearable={props.clearable as boolean} multiple={props.multiple as boolean} disabled={props.disabled as boolean} loading={props.loading as boolean} error={props.error as boolean} creatable={props.creatable as boolean} chipDisplay={props.chipDisplay as string} />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Základní">
      <Select options={demoOptions} placeholder="Výchozí" />
    </VariantShowcase>
    <VariantShowcase label="S vyhledáváním">
      <Select options={demoOptions} searchable placeholder="Hledat..." />
    </VariantShowcase>

    <H2>Creatable</H2>
    <VariantShowcase label="Uživatel může vytvořit vlastní hodnotu — searchable + multiple + creatable">
      <div style={{ width: 320 }}>
        <Select options={demoOptions} searchable multiple creatable placeholder="Vyberte nebo vytvořte..." />
      </div>
    </VariantShowcase>

    <H2>Custom renderOption</H2>
    <VariantShowcase label="Vlastní renderování položky — barevná tečka + label">
      <div style={{ width: 320 }}>
        <Select
          options={colorOptions}
          placeholder="Vyberte barvu..."
          renderOption={(option: SelectOption) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: (option as any).color, flexShrink: 0 }} />
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
