import React, { useState } from 'react';
import { Drawer, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'position', label: 'Strana', options: ['left', 'right'], defaultValue: 'right' },
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Detail' },
  { type: 'boolean', prop: 'showClose', label: 'Zavírací tlačítko', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Callback zavření.' },
  { name: 'position', type: "'left' | 'right'", defaultValue: "'right'", description: 'Strana vysunutí.' },
  { name: 'title', type: 'string', description: 'Titulek záhlaví.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Obsah.' },
  { name: 'footer', type: 'ReactNode', description: 'Patička.' },
  { name: 'width', type: 'string | number', defaultValue: '400', description: 'Šířka panelu.' },
  { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Zavírací tlačítko.' },
  { name: 'closeOnOverlay', type: 'boolean', defaultValue: 'true', description: 'Zavřít kliknutím na overlay.' },
];

const DrawerDemo: React.FC<{ position: string; title: string; showClose: boolean }> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} position={props.position as any} title={props.title} showClose={props.showClose}>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>Obsah postranního panelu s detaily nebo formulářem.</p>
      </Drawer>
    </>
  );
};

export const DrawerPage: React.FC = () => (
  <PageLayout>
    <H1>Drawer</H1>
    <Paragraph large>Postranní vysouvací panel s glass efektem a animací.</Paragraph>

    <Playground controls={controls} render={(props) => <DrawerDemo position={props.position} title={props.title} showClose={props.showClose} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
