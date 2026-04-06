import React, { useState } from 'react';
import { Tabs, Tab, TabPanel } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['underline', 'pills'], defaultValue: 'underline' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'fullWidth', label: 'Full width', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'string', required: true, description: 'Aktivní záložka.' },
  { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback při přepnutí.' },
  { name: 'variant', type: "'underline' | 'pills'", defaultValue: "'underline'", description: 'Vizuální styl záložek.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Roztáhne záložky na plnou šířku.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
];

const TabsPlayground: React.FC<{ variant: string; size: string; fullWidth: boolean }> = (props) => {
  const [tab, setTab] = useState('tab1');
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Tabs value={tab} onChange={setTab} variant={props.variant as any} size={props.size as any} fullWidth={props.fullWidth}>
        <Tab value="tab1" label="Přehled" />
        <Tab value="tab2" label="Nastavení" />
        <Tab value="tab3" label="Aktivita" />
        <TabPanel value="tab1">Obsah záložky Přehled.</TabPanel>
        <TabPanel value="tab2">Obsah záložky Nastavení.</TabPanel>
        <TabPanel value="tab3">Obsah záložky Aktivita.</TabPanel>
      </Tabs>
    </div>
  );
};

export const TabsPage: React.FC = () => (
  <PageLayout>
    <H1>Tabs</H1>
    <Paragraph large>Záložkové přepínání obsahu s variantami underline a pills.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => <TabsPlayground variant={props.variant} size={props.size} fullWidth={props.fullWidth} />}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
