import React, { useState } from 'react';
import { MobileDataCard, Button, Badge } from '../../../src';
import type { MobileDataCardColumn } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoData = [
  { id: '1', name: 'Jan Novák', email: 'jan@example.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Eva Černá', email: 'eva@example.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'Petr Malý', email: 'petr@example.com', role: 'Viewer', status: 'inactive' },
  { id: '4', name: 'Anna Krátká', email: 'anna@example.com', role: 'Editor', status: 'active' },
];

const demoColumns: MobileDataCardColumn[] = [
  { key: 'name', header: 'Jméno', primary: true, sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Stav',
    render: (val: string) => (
      <Badge variant={val === 'active' ? 'success' : 'default'}>
        {val === 'active' ? 'Aktivní' : 'Neaktivní'}
      </Badge>
    ),
  },
];

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'selectable', label: 'Selectable', defaultValue: false },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'showActions', label: 'Card actions', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'columns', type: 'MobileDataCardColumn[]', required: true, description: 'Definice sloupců — stejný tvar jako Table/DataGrid.' },
  { name: 'data', type: 'any[]', required: true, description: 'Pole dat.' },
  { name: 'primaryKey', type: 'string', description: 'Klíč pro titulek karty. Alternativa k primary na sloupci.' },
  { name: 'rowKey', type: 'string', defaultValue: "'id'", description: 'Klíč identifikátoru řádku.' },
  { name: 'selectable', type: 'boolean', defaultValue: 'false', description: 'Povolit výběr karet.' },
  { name: 'selectedIds', type: 'string[]', description: 'Řízené vybrané ID.' },
  { name: 'onSelectionChange', type: '(ids: string[]) => void', description: 'Callback při změně výběru.' },
  { name: 'onCardClick', type: '(row: any) => void', description: 'Callback při kliknutí na kartu.' },
  { name: 'onSort', type: '(key, direction) => void', description: 'Callback při řazení.' },
  { name: 'sortKey', type: 'string', description: 'Aktuální klíč řazení.' },
  { name: 'sortDirection', type: "'asc' | 'desc'", description: 'Aktuální směr řazení.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazit skeleton karty.' },
  { name: 'skeletonCount', type: 'number', defaultValue: '3', description: 'Počet skeleton karet.' },
  { name: 'emptyText', type: 'string', defaultValue: "'Žádná data'", description: 'Text prázdného stavu.' },
  { name: 'emptyContent', type: 'ReactNode', description: 'Vlastní obsah prázdného stavu.' },
  { name: 'gap', type: 'number', defaultValue: '12', description: 'Mezera mezi kartami v px.' },
  { name: 'cardActions', type: '(row, index) => ReactNode', description: 'Vykreslení akčních tlačítek v patičce karty.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const columnPropDefs: PropDef[] = [
  { name: 'key', type: 'string', required: true, description: 'Klíč dat v řádkovém objektu.' },
  { name: 'header', type: 'string', required: true, description: 'Zobrazovaný popisek.' },
  { name: 'render', type: '(value, row, index) => ReactNode', description: 'Vlastní renderování hodnoty.' },
  { name: 'hidden', type: 'boolean', description: 'Skrýt tento sloupec z karty.' },
  { name: 'primary', type: 'boolean', description: 'Zobrazit jako titulek karty.' },
  { name: 'sortable', type: 'boolean', description: 'Povolit řazení podle tohoto sloupce.' },
];

const PlaygroundDemo: React.FC<{ selectable: boolean; loading: boolean; showActions: boolean }> = ({
  selectable,
  loading,
  showActions,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = sortKey
    ? [...demoData].sort((a: any, b: any) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      })
    : demoData;

  return (
    <MobileDataCard
      columns={demoColumns}
      data={loading ? [] : sorted}
      loading={loading}
      selectable={selectable}
      selectedIds={selected}
      onSelectionChange={setSelected}
      onSort={(key, dir) => { setSortKey(key); setSortDir(dir); }}
      sortKey={sortKey}
      sortDirection={sortDir}
      onCardClick={(row) => alert(`Kliknuto na: ${row.name}`)}
      cardActions={showActions ? (row) => (
        <>
          <Button size="sm" variant="ghost" onClick={() => alert(`Upravit: ${row.name}`)}>Upravit</Button>
          <Button size="sm" variant="ghost" onClick={() => alert(`Smazat: ${row.name}`)}>Smazat</Button>
        </>
      ) : undefined}
      style={{ maxWidth: 420 }}
    />
  );
};

export const MobileDataCardPage: React.FC = () => (
  <PageLayout>
    <H1>MobileDataCard</H1>
    <Paragraph large>
      Mobilní zobrazení dat ve formě karet. Každý datový řádek se zobrazí jako karta
      s páry popisek-hodnota. Kombinuje funkce Table (řazení, custom render) a DataGrid
      (výběr, kliknutí na řádek, skeleton). Obsahuje volitelnou patičku pro akční tlačítka.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <PlaygroundDemo
          selectable={props.selectable as boolean}
          loading={props.loading as boolean}
          showActions={props.showActions as boolean}
        />
      )}
    />

    <H2>Prázdný stav</H2>
    <VariantShowcase label="Žádná data">
      <MobileDataCard columns={demoColumns} data={[]} style={{ maxWidth: 420 }} />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />

    <H2>MobileDataCardColumn</H2>
    <PropsTable props={columnPropDefs} />
  </PageLayout>
);
