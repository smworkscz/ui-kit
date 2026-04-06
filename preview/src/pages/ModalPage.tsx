import React, { useState } from 'react';
import { Modal, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg', 'fullscreen'], defaultValue: 'md' },
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Potvrzení' },
  { type: 'boolean', prop: 'showClose', label: 'Zavírací tlačítko', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Callback zavření.' },
  { name: 'title', type: 'string', description: 'Titulek záhlaví.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Obsah těla.' },
  { name: 'footer', type: 'ReactNode', description: 'Patička (tlačítka).' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'fullscreen'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'closeOnOverlay', type: 'boolean', defaultValue: 'true', description: 'Zavřít kliknutím na overlay.' },
  { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Zavřít klávesou Escape.' },
  { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Zobrazí zavírací tlačítko (×).' },
];

const ModalDemo: React.FC<{ size: string; title: string; showClose: boolean }> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} size={props.size as any} title={props.title} showClose={props.showClose}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Zrušit</Button><Button onClick={() => setOpen(false)}>Potvrdit</Button></>}>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>Opravdu chcete pokračovat? Tato akce je nevratná.</p>
      </Modal>
    </>
  );
};

export const ModalPage: React.FC = () => (
  <PageLayout>
    <H1>Modal</H1>
    <Paragraph large>Modální dialog s překryvem, focus trapem a glass efektem.</Paragraph>

    <Playground controls={controls} render={(props) => <ModalDemo size={props.size} title={props.title} showClose={props.showClose} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
