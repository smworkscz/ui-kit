import React from 'react';
import { Alert } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['info', 'success', 'warning', 'error'], defaultValue: 'info' },
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Informace' },
  { type: 'text', prop: 'children', label: 'Popis', defaultValue: 'Toto je ukázkový popis alertu.' },
  { type: 'boolean', prop: 'closable', label: 'Zavíratelný', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", defaultValue: "'info'", description: 'Vizuální styl a barva alertu.' },
  { name: 'title', type: 'string', required: true, description: 'Tučný nadpis alertu.' },
  { name: 'children', type: 'ReactNode', description: 'Volitelný popis pod nadpisem.' },
  { name: 'icon', type: 'ReactNode', description: 'Vlastní ikona (nahradí výchozí).' },
  { name: 'closable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí zavírací tlačítko (✕).' },
  { name: 'onClose', type: '() => void', description: 'Callback při zavření.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

export const AlertPage: React.FC = () => (
  <PageLayout>
    <H1>Alert</H1>
    <Paragraph large>
      Informační banner pro zobrazení důležitých zpráv. Podporuje čtyři
      varianty s různými barvami a ikonami.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Alert
            variant={props.variant}
            title={props.title}
            closable={props.closable}
          >
            {props.children || undefined}
          </Alert>
        </div>
      )}
    />

    <H2>Varianty</H2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert variant="info" title="Informace">Toto je informační zpráva.</Alert>
      <Alert variant="success" title="Úspěch">Operace byla úspěšně dokončena.</Alert>
      <Alert variant="warning" title="Varování">Zkontrolujte zadaná data.</Alert>
      <Alert variant="error" title="Chyba">Nastala neočekávaná chyba.</Alert>
    </div>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
