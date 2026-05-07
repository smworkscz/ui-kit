import React, { useState } from 'react';
import { Modal, Button, Tag } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg', 'fullscreen'], defaultValue: 'md' },
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Potvrzení' },
  { type: 'boolean', prop: 'showClose', label: 'Zavírací tlačítko', defaultValue: true },
  { type: 'boolean', prop: 'showHeaderDivider', label: 'Header divider', defaultValue: true },
  { type: 'boolean', prop: 'dismissable', label: 'Dismissable', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Callback zavření.' },
  { name: 'title', type: 'string | ReactNode', description: 'Titulek záhlaví. String nebo ReactNode pro vlastní hlavičku.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Obsah těla.' },
  { name: 'footer', type: 'ReactNode', description: 'Patička (tlačítka).' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'fullscreen'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'closeOnOverlay', type: 'boolean', defaultValue: 'true', description: 'Zavřít kliknutím na overlay.' },
  { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Zavřít klávesou Escape.' },
  { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Zobrazí zavírací tlačítko (×).' },
  { name: 'titleSlot', type: 'ReactNode', description: 'Alternativní slot pro celou hlavičku (nahrazuje title + close).' },
  { name: 'width', type: 'number | string', description: 'Explicitní šířka modálu. Přepíše size.' },
  { name: 'dismissable', type: 'boolean', defaultValue: 'true', description: 'Umožní zavření (overlay/ESC/close). Když false, jen programově.' },
  { name: 'showHeaderDivider', type: 'boolean', defaultValue: 'true', description: 'Zobrazí oddělovací čáru pod hlavičkou.' },
];

const ModalDemo: React.FC<{ size: string; title: string; showClose: boolean; showHeaderDivider: boolean; dismissable: boolean }> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} size={props.size as any} title={props.title} showClose={props.showClose} showHeaderDivider={props.showHeaderDivider} dismissable={props.dismissable}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Zrušit</Button><Button onClick={() => setOpen(false)}>Potvrdit</Button></>}>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>Opravdu chcete pokračovat? Tato akce je nevratná.</p>
      </Modal>
    </>
  );
};

const ReactNodeTitleDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Modal s ReactNode titulkem</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Detail objednávky</span>
          <Tag label="Nová" />
        </div>
      }
        footer={<Button onClick={() => setOpen(false)}>Zavřít</Button>}>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>Titulek obsahuje text i Tag komponentu jako ReactNode.</p>
      </Modal>
    </>
  );
};

const CustomWidthDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Modal se šířkou 720px</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Široký modal" width={720}
        footer={<Button onClick={() => setOpen(false)}>Zavřít</Button>}>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>Tento modal má explicitně nastavenou šířku na 720px, nezávisle na size presetu.</p>
      </Modal>
    </>
  );
};

export const ModalPage: React.FC = () => (
  <PageLayout>
    <H1>Modal</H1>
    <Paragraph large>Modální dialog s překryvem, focus trapem a glass efektem.</Paragraph>

    <Playground controls={controls} render={(props) => <ModalDemo size={props.size} title={props.title} showClose={props.showClose} showHeaderDivider={props.showHeaderDivider as boolean} dismissable={props.dismissable as boolean} />} />

    <H2>ReactNode titulek</H2>
    <VariantShowcase label="Titulek jako ReactNode — flex kontejner s textem a Tag komponentou">
      <ReactNodeTitleDemo />
    </VariantShowcase>

    <H2>Vlastní šířka</H2>
    <VariantShowcase label="Modal s width={720} — přepíše výchozí size preset">
      <CustomWidthDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
