import React, { useState } from 'react';
import { Spotlight, Button } from '../../../src';
import type { SpotlightItem } from '../../../src';
import { PageLayout, H1, H2, Paragraph, PropsTable } from './shared';
import type { PropDef } from './shared';

const demoItems: SpotlightItem[] = [
  { id: '1', label: 'Domů', description: 'Hlavní stránka', category: 'Stránky', onSelect: () => {} },
  { id: '2', label: 'Nastavení', description: 'Změna preferencí', category: 'Stránky', onSelect: () => {} },
  { id: '3', label: 'Uživatelé', description: 'Správa uživatelů', category: 'Stránky', onSelect: () => {} },
  { id: '4', label: 'Vytvořit projekt', category: 'Akce', onSelect: () => {} },
  { id: '5', label: 'Exportovat data', category: 'Akce', onSelect: () => {} },
];

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Callback zavření.' },
  { name: 'value', type: 'string', required: true, description: 'Aktuální hodnota vstupu (řízená).' },
  { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback změny vstupu.' },
  { name: 'results', type: 'SpotlightItem[]', required: true, description: 'Předfiltrované výsledky.' },
  { name: 'placeholder', type: 'string', defaultValue: "'Hledat...'", description: 'Placeholder textu.' },
];

const SpotlightDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = query ? demoItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : demoItems;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít Spotlight</Button>
      <Spotlight open={open} onClose={() => { setOpen(false); setQuery(''); }} value={query} onChange={setQuery} results={filtered} />
    </>
  );
};

export const SpotlightPage: React.FC = () => (
  <PageLayout>
    <H1>Spotlight</H1>
    <Paragraph large>Command palette pro rychlé vyhledávání a navigaci. Řízená komponenta — filtrování je na konzumentovi.</Paragraph>

    <H2>Ukázka</H2>
    <SpotlightDemo />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
