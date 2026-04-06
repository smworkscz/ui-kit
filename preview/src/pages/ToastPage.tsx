import React from 'react';
import { Button, useToast } from '../../../src';
import { PageLayout, H1, H2, Paragraph, PropsTable, VariantShowcase } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'variant', type: "'info' | 'success' | 'error'", defaultValue: "'info'", description: 'Typ notifikace.' },
  { name: 'title', type: 'string', required: true, description: 'Nadpis notifikace.' },
  { name: 'content', type: 'string', description: 'Volitelný popis.' },
  { name: 'icon', type: 'ReactNode', description: 'Vlastní ikona.' },
  { name: 'duration', type: 'number', defaultValue: '4000', description: 'Auto-zavření v ms (0 = trvale).' },
];

const providerPropDefs: PropDef[] = [
  { name: 'position', type: 'ToastPosition', defaultValue: "'bottom-right'", description: 'Pozice notifikací.' },
  { name: 'toastWidth', type: 'number', defaultValue: '380', description: 'Šířka notifikace v px.' },
  { name: 'maxToasts', type: 'number', defaultValue: '5', description: 'Maximální počet viditelných.' },
  { name: 'duration', type: 'number', defaultValue: '4000', description: 'Globální výchozí doba trvání v ms. Přepíše se per-toast hodnotou.' },
];

const ToastDemo: React.FC = () => {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button size="sm" onClick={() => toast({ variant: 'info', title: 'Informace', content: 'Toto je informační zpráva.' })}>Info</Button>
      <Button size="sm" onClick={() => toast({ variant: 'success', title: 'Úspěch', content: 'Operace dokončena.' })}>Success</Button>
      <Button size="sm" onClick={() => toast({ variant: 'error', title: 'Chyba', content: 'Nastala neočekávaná chyba.' })}>Error</Button>
    </div>
  );
};

export const ToastPage: React.FC = () => (
  <PageLayout>
    <H1>Toast</H1>
    <Paragraph large>Notifikační zprávy s auto-dismiss a stack animací. Vyžaduje ToasterProvider.</Paragraph>

    <H2>Ukázka</H2>
    <ToastDemo />

    <H2>ToastOptions Props</H2>
    <PropsTable props={propDefs} />
    <H2>ToasterProvider Props</H2>
    <PropsTable props={providerPropDefs} />
  </PageLayout>
);
