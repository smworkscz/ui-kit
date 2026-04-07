import React, { useState } from 'react';
import { ConfirmDialog, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['default', 'danger'], defaultValue: 'default' },
  { type: 'boolean', prop: 'loading', label: 'Načítání', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení dialogu.' },
  { name: 'onConfirm', type: '() => void', required: true, description: 'Voláno při potvrzení akce.' },
  { name: 'onCancel', type: '() => void', required: true, description: 'Voláno při zrušení (zavření) dialogu.' },
  { name: 'title', type: 'string', required: true, description: 'Titulek dialogu.' },
  { name: 'description', type: 'string', description: 'Volitelný popis akce.' },
  { name: 'confirmLabel', type: 'string', defaultValue: "'Potvrdit'", description: 'Text potvrzovacího tlačítka.' },
  { name: 'cancelLabel', type: 'string', defaultValue: "'Zrušit'", description: 'Text zrušovacího tlačítka.' },
  { name: 'variant', type: "'default' | 'danger'", defaultValue: "'default'", description: 'Varianta dialogu — danger zvýrazní tlačítko červeně.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Stav načítání potvrzovacího tlačítka.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const ConfirmDialogDemo: React.FC<{ variant: string; loading: boolean }> = ({ variant, loading }) => {
  const [open, setOpen] = useState(false);

  const isDanger = variant === 'danger';

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {isDanger ? 'Smazat položku' : 'Potvrdit akci'}
      </Button>
      <ConfirmDialog
        open={open}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title={isDanger ? 'Smazat položku?' : 'Potvrdit změny?'}
        description={isDanger ? 'Tato akce je nevratná. Položka bude trvale odstraněna.' : 'Opravdu chcete uložit provedené změny?'}
        variant={variant as any}
        loading={loading}
        confirmLabel={isDanger ? 'Smazat' : 'Potvrdit'}
      />
    </>
  );
};

export const ConfirmDialogPage: React.FC = () => (
  <PageLayout>
    <H1>ConfirmDialog</H1>
    <Paragraph large>
      Předpřipravený modální dialog pro potvrzení akce. Interně používá komponentu Modal a podporuje standardní i danger variantu s volitelným stavem načítání.
    </Paragraph>

    <Playground controls={controls} render={(props) => <ConfirmDialogDemo variant={props.variant} loading={props.loading} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
