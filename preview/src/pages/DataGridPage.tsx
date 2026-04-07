import React from 'react';
import { DataGrid } from '../../../src';
import type { DataGridColumn } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const sampleColumns: DataGridColumn[] = [
  { key: 'name', header: 'Jméno', minWidth: 160, sortable: true },
  { key: 'email', header: 'E-mail', minWidth: 200 },
  { key: 'role', header: 'Role', align: 'center', sortable: true },
  { key: 'status', header: 'Stav', align: 'center' },
];

const sampleData = [
  { id: '1', name: 'Jan Novák', email: 'jan@example.com', role: 'Admin', status: 'Aktivní' },
  { id: '2', name: 'Eva Svobodová', email: 'eva@example.com', role: 'Editor', status: 'Aktivní' },
  { id: '3', name: 'Petr Černý', email: 'petr@example.com', role: 'Čtenář', status: 'Neaktivní' },
  { id: '4', name: 'Marie Králová', email: 'marie@example.com', role: 'Editor', status: 'Aktivní' },
  { id: '5', name: 'Tomáš Procházka', email: 'tomas@example.com', role: 'Admin', status: 'Aktivní' },
];

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'selectable', label: 'Selectable', defaultValue: true },
  { type: 'boolean', prop: 'stickyHeader', label: 'Sticky header', defaultValue: false },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'columns', type: 'DataGridColumn[]', description: 'Definice sloupců.', required: true },
  { name: 'data', type: 'any[]', description: 'Data k zobrazení — pole objektů.', required: true },
  { name: 'selectable', type: 'boolean', defaultValue: 'false', description: 'Povolí výběr řádků pomocí zaškrtávacích políček.' },
  { name: 'onSelectionChange', type: '(ids: string[]) => void', description: 'Callback při změně výběru řádků.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí skeleton řádky.' },
  { name: 'rowKey', type: 'string', defaultValue: "'id'", description: 'Klíč pro identifikaci řádků.' },
  { name: 'onRowClick', type: '(row: any) => void', description: 'Callback při kliknutí na řádek.' },
  { name: 'stickyHeader', type: 'boolean', defaultValue: 'false', description: 'Fixní záhlaví při scrollování.' },
  { name: 'emptyText', type: 'string', defaultValue: "'Žádná data'", description: 'Text zobrazený při prázdných datech.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const colPropDefs: PropDef[] = [
  { name: 'key', type: 'string', description: 'Klíč odpovídající hodnotě v datovém objektu.', required: true },
  { name: 'header', type: 'string', description: 'Text záhlaví sloupce.', required: true },
  { name: 'width', type: 'string | number', description: 'Šířka sloupce (CSS hodnota).' },
  { name: 'minWidth', type: 'number', description: 'Minimální šířka sloupce v pixelech.' },
  { name: 'align', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: 'Zarovnání obsahu.' },
  { name: 'sortable', type: 'boolean', defaultValue: 'false', description: 'Povolí řazení podle tohoto sloupce.' },
  { name: 'render', type: '(value, row, index) => ReactNode', description: 'Vlastní vykreslovací funkce pro buňku.' },
];

export const DataGridPage: React.FC = () => (
  <PageLayout>
    <H1>DataGrid</H1>
    <Paragraph large>
      Pokročilá datová mřížka s výběrem řádků, sticky záhlavím a loading stavem.
      Rozšiřuje vzor Table o zaškrtávací políčka, klikání na řádky a skeleton placeholder při načítání.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <DataGrid
          columns={sampleColumns}
          data={sampleData}
          selectable={props.selectable}
          stickyHeader={props.stickyHeader}
          loading={props.loading}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Základní mřížka">
      <div style={{ width: '100%' }}>
        <DataGrid columns={sampleColumns} data={sampleData} />
      </div>
    </VariantShowcase>

    <VariantShowcase label="Loading stav">
      <div style={{ width: '100%' }}>
        <DataGrid columns={sampleColumns} data={[]} loading />
      </div>
    </VariantShowcase>

    <VariantShowcase label="Prázdný stav">
      <div style={{ width: '100%' }}>
        <DataGrid columns={sampleColumns} data={[]} emptyText="Žádní uživatelé nenalezeni" />
      </div>
    </VariantShowcase>

    <H2>Props (DataGrid)</H2>
    <PropsTable props={propDefs} />

    <H2>Props (DataGridColumn)</H2>
    <PropsTable props={colPropDefs} />
  </PageLayout>
);
