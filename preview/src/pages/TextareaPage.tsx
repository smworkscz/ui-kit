import React, { useState } from 'react';
import { Textarea } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', prop: 'resize', label: 'Resize', options: ['none', 'vertical', 'both'], defaultValue: 'vertical' },
  { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Popis' },
  { type: 'boolean', prop: 'autoHeight', label: 'Auto height', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'label', type: 'string', description: 'Popisek nad polem.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav.' },
  { name: 'helperText', type: 'string', description: 'Pomocný text pod polem.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'rows', type: 'number', defaultValue: '4', description: 'Počet viditelných řádků.' },
  { name: 'maxLength', type: 'number', description: 'Maximální počet znaků s počítadlem.' },
  { name: 'resize', type: "'none' | 'vertical' | 'both'", defaultValue: "'vertical'", description: 'Režim změny velikosti.' },
  { name: 'autoHeight', type: 'boolean', defaultValue: 'false', description: 'Automatická výška — pole se přizpůsobí obsahu.' },
  { name: 'minRows', type: 'number', defaultValue: '1', description: 'Minimální počet řádků (s autoHeight).' },
  { name: 'maxRows', type: 'number', description: 'Maximální počet řádků (s autoHeight). Po dosažení se scrolluje.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Plná šířka.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže vstup.' },
];

const TextareaDemo: React.FC<{ size: string; resize: string; label: string; autoHeight: boolean; disabled: boolean; error: boolean }> = (props) => {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: 320 }}>
      <Textarea
        size={props.size as any}
        label={props.label}
        resize={props.resize as any}
        autoHeight={props.autoHeight}
        minRows={props.autoHeight ? 2 : undefined}
        maxRows={props.autoHeight ? 8 : undefined}
        disabled={props.disabled}
        error={props.error ? 'Pole je povinné' : false}
        placeholder="Napište popis..."
        maxLength={200}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const TextareaPage: React.FC = () => (
  <PageLayout>
    <H1>Textarea</H1>
    <Paragraph large>Víceřádkový textový vstup s počítadlem znaků a nastavitelnou velikostí.</Paragraph>

    <Playground controls={controls} render={(props) => <TextareaDemo {...props as any} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
