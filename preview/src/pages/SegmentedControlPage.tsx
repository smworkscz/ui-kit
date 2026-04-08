import React, { useState } from 'react';
import { SegmentedControl } from '../../../src';
import { ListIcon, GridFourIcon, TableIcon, SunIcon, MoonIcon, DesktopIcon } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', prop: 'orientation', label: 'Orientace', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
  { type: 'boolean', prop: 'fullWidth', label: 'Full width', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'data', type: "(string | { value, label?, icon?, disabled? })[]", required: true, description: 'Data segmentů. Může obsahovat ikonu, text nebo obojí.' },
  { name: 'value', type: 'string', required: true, description: 'Aktuálně vybraná hodnota.' },
  { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback při změně výběru.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Roztáhne na celou šířku kontejneru.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Orientace segmentů.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže celou komponentu.' },
];

const SegmentedDemo: React.FC<{ size: string; orientation: string; fullWidth: boolean; disabled: boolean }> = (props) => {
  const [value, setValue] = useState('react');
  return (
    <SegmentedControl
      data={['React', 'Angular', 'Vue', 'Svelte']}
      value={value}
      onChange={setValue}
      size={props.size as any}
      orientation={props.orientation as any}
      fullWidth={props.fullWidth}
      disabled={props.disabled}
    />
  );
};

export const SegmentedControlPage: React.FC = () => {
  const [view, setView] = useState('list');
  const [period, setPeriod] = useState('month');

  return (
    <PageLayout>
      <H1>SegmentedControl</H1>
      <Paragraph large>
        Segmentovaný přepínač pro výběr jedné z několika možností.
        Podobný záložkám, ale v kompaktnějším inline formátu s animovaným indikátorem.
      </Paragraph>

      <Playground controls={controls} render={(props) => <SegmentedDemo {...props as any} />} />

      <H2>Varianty</H2>
      <VariantShowcase label="Velikosti">
        <SegmentedControl data={['Small', 'Preset']} value="Small" onChange={() => {}} size="sm" />
        <SegmentedControl data={['Medium', 'Preset']} value="Medium" onChange={() => {}} size="md" />
        <SegmentedControl data={['Large', 'Preset']} value="Large" onChange={() => {}} size="lg" />
      </VariantShowcase>

      <VariantShowcase label="Příklady použití">
        <SegmentedControl
          data={['Seznam', 'Mřížka', 'Tabulka']}
          value={view}
          onChange={setView}
        />
        <SegmentedControl
          data={[
            { value: 'week', label: 'Týden' },
            { value: 'month', label: 'Měsíc' },
            { value: 'year', label: 'Rok' },
          ]}
          value={period}
          onChange={setPeriod}
        />
      </VariantShowcase>

      <VariantShowcase label="Pouze ikony">
        <SegmentedControl
          data={[
            { value: 'list', icon: <ListIcon size={16} /> },
            { value: 'grid', icon: <GridFourIcon size={16} /> },
            { value: 'table', icon: <TableIcon size={16} /> },
          ]}
          value="list"
          onChange={() => {}}
        />
      </VariantShowcase>

      <VariantShowcase label="Ikona + text">
        <SegmentedControl
          data={[
            { value: 'light', label: 'Light', icon: <SunIcon size={14} /> },
            { value: 'dark', label: 'Dark', icon: <MoonIcon size={14} /> },
            { value: 'system', label: 'System', icon: <DesktopIcon size={14} /> },
          ]}
          value="dark"
          onChange={() => {}}
        />
      </VariantShowcase>

      <VariantShowcase label="S disabled segmentem">
        <SegmentedControl
          data={[
            { value: 'free', label: 'Zdarma' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise', disabled: true },
          ]}
          value="pro"
          onChange={() => {}}
        />
      </VariantShowcase>

      <H2>Props</H2>
      <PropsTable props={propDefs} />
    </PageLayout>
  );
};
