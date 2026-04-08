import React, { useState } from 'react';
import { Select } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
];

const SelectDemo: React.FC<{ searchable: boolean; clearable: boolean; multiple: boolean; disabled: boolean; loading: boolean; error: boolean; label: string }> = (props) => {
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
];

export const SelectPage: React.FC = () => (
  <PageLayout>
    <H1>Select</H1>
    <Paragraph large>Výběr ze seznamu hodnot s podporou vyhledávání, vícenásobného výběru a klávesové navigace.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <SelectDemo label={props.label} searchable={props.searchable} clearable={props.clearable} multiple={props.multiple} disabled={props.disabled} loading={props.loading} error={props.error} />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Základní">
      <Select options={demoOptions} placeholder="Výchozí" />
    </VariantShowcase>
    <VariantShowcase label="S vyhledáváním">
      <Select options={demoOptions} searchable placeholder="Hledat..." />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
