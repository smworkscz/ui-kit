import React from 'react';
import { Table } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoCols = [
  { key: 'name', header: 'Jméno', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];
const demoData = [
  { name: 'Jan Novák', role: 'Developer', status: 'Aktivní' },
  { name: 'Petra Dvořáková', role: 'Designer', status: 'Aktivní' },
  { name: 'Karel Svoboda', role: 'PM', status: 'Neaktivní' },
  { name: 'Marie Černá', role: 'QA', status: 'Aktivní' },
];

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'striped', label: 'Striped', defaultValue: false },
  { type: 'boolean', prop: 'hoverable', label: 'Hoverable', defaultValue: true },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'columns', type: 'TableColumn[]', required: true, description: 'Definice sloupců.' },
  { name: 'data', type: 'any[]', required: true, description: 'Data k zobrazení.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí skeleton řádky.' },
  { name: 'emptyText', type: 'string', defaultValue: "'Žádná data'", description: 'Text pro prázdnou tabulku.' },
  { name: 'onSort', type: '(key, direction) => void', description: 'Callback řazení.' },
  { name: 'striped', type: 'boolean', defaultValue: 'false', description: 'Střídající barvy řádků.' },
  { name: 'hoverable', type: 'boolean', defaultValue: 'true', description: 'Zvýraznění řádku při hoveru.' },
];

export const TablePage: React.FC = () => (
  <PageLayout>
    <H1>Table</H1>
    <Paragraph large>Datová tabulka s řazením, loading stavem a přizpůsobitelným renderem buněk.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: '100%' }}>
          <Table columns={demoCols} data={demoData} striped={props.striped} hoverable={props.hoverable} loading={props.loading} />
        </div>
      )}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
