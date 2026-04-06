import React, { useState } from 'react';
import { DatePicker } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'mode', label: 'Režim', options: ['single', 'range'], defaultValue: 'single' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'showTime', label: 'Čas', defaultValue: false },
  { type: 'boolean', prop: 'clearable', label: 'Clearable', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'mode', type: "'single' | 'range'", defaultValue: "'single'", description: 'Režim výběru data.' },
  { name: 'showTime', type: 'boolean', defaultValue: 'false', description: 'Přidá výběr času.' },
  { name: 'value', type: 'Date | null | [Date, Date]', description: 'Aktuální hodnota.' },
  { name: 'onChange', type: '(value: any) => void', description: 'Callback při změně.' },
  { name: 'label', type: 'string', description: 'Popisek pole.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci.' },
  { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Tlačítko vymazání.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'minDate', type: 'Date', description: 'Minimální povolené datum.' },
  { name: 'maxDate', type: 'Date', description: 'Maximální povolené datum.' },
];

const DatePickerDemo: React.FC<{ mode: string; size: string; showTime: boolean; clearable: boolean; disabled: boolean; error: boolean }> = (props) => {
  const [value, setValue] = useState<any>(null);
  return (
    <div style={{ width: 280 }}>
      <DatePicker
        mode={props.mode as any}
        size={props.size as any}
        showTime={props.showTime}
        clearable={props.clearable}
        disabled={props.disabled}
        error={props.error ? 'Vyberte datum' : false}
        label="Datum"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export const DatePickerPage: React.FC = () => (
  <PageLayout>
    <H1>DatePicker</H1>
    <Paragraph large>Výběr data s kalendářem. Podporuje single i range režim a volitelný výběr času.</Paragraph>

    <Playground controls={controls} render={(props) => <DatePickerDemo {...props as any} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
