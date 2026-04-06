import React, { useState } from 'react';
import { RadioGroup } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoOptions = [
  { value: 'email', label: 'E-mail' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push notifikace' },
];

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', prop: 'direction', label: 'Směr', options: ['vertical', 'horizontal'], defaultValue: 'vertical' },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'string', description: 'Aktuálně vybraná hodnota.' },
  { name: 'onChange', type: '(value: string) => void', description: 'Callback při změně.' },
  { name: 'options', type: 'RadioGroupOption[]', required: true, description: 'Seznam voleb.' },
  { name: 'label', type: 'string', description: 'Popisek skupiny.' },
  { name: 'direction', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Rozložení položek.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost přepínačů.' },
];

const RadioDemo: React.FC<{ size: string; direction: string; error: boolean }> = (props) => {
  const [value, setValue] = useState<string>('');
  return (
    <RadioGroup
      options={demoOptions}
      value={value}
      onChange={setValue}
      size={props.size as any}
      direction={props.direction as any}
      label="Způsob notifikace"
      error={props.error ? 'Vyberte jednu z možností' : false}
    />
  );
};

export const RadioPage: React.FC = () => (
  <PageLayout>
    <H1>Radio</H1>
    <Paragraph large>Přepínací tlačítko ve skupině pro výběr jedné z možností.</Paragraph>

    <Playground controls={controls} render={(props) => <RadioDemo {...props as any} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
