import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { Table } from '../components/Table';
import { Tag } from '../components/Tag';

const columns = [
  { key: 'name', header: 'Jméno', sortable: true },
  { key: 'email', header: 'E-mail' },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Stav',
    render: (value: string) => (
      <Tag
        variant={value === 'Aktivní' ? 'success' : 'default'}
        size="sm"
      >
        {value}
      </Tag>
    ),
  },
];

const data = [
  { name: 'Jan Novák', email: 'jan.novak@firma.cz', role: 'Administrátor', status: 'Aktivní' },
  { name: 'Petra Svobodová', email: 'petra.s@firma.cz', role: 'Editor', status: 'Aktivní' },
  { name: 'Martin Dvořák', email: 'martin.d@firma.cz', role: 'Čtenář', status: 'Neaktivní' },
  { name: 'Eva Černá', email: 'eva.c@firma.cz', role: 'Editor', status: 'Aktivní' },
  { name: 'Tomáš Procházka', email: 'tomas.p@firma.cz', role: 'Čtenář', status: 'Neaktivní' },
  { name: 'Anna Králová', email: 'anna.k@firma.cz', role: 'Administrátor', status: 'Aktivní' },
  { name: 'Lukáš Veselý', email: 'lukas.v@firma.cz', role: 'Editor', status: 'Neaktivní' },
  { name: 'Kateřina Horáková', email: 'katerina.h@firma.cz', role: 'Čtenář', status: 'Aktivní' },
];

const meta = {
  title: 'Zobrazení dat/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    emptyText: { control: 'text' },
    columns: { control: false },
    data: { control: false },
    onSort: { control: false },
    sortKey: { control: false },
    sortDirection: { control: false },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns,
    data,
    striped: true,
    hoverable: true,
  },
  render: (args) => {
    const [sortKey, setSortKey] = useState<string | undefined>(undefined);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const sortedData = useMemo(() => {
      if (!sortKey) return args.data;
      return [...args.data].sort((a: any, b: any) => {
        const aVal = String(a[sortKey] ?? '');
        const bVal = String(b[sortKey] ?? '');
        const cmp = aVal.localeCompare(bVal, 'cs');
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }, [args.data, sortKey, sortDir]);

    return (
      <Table
        {...args}
        data={sortedData}
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
      />
    );
  },
};

export const Nacitani: Story = {
  name: 'Načítání',
  args: {
    columns,
    data: [],
    loading: true,
  },
};

export const PrazdnaData: Story = {
  name: 'Prázdná data',
  args: {
    columns,
    data: [],
    emptyText: 'Nebyly nalezeny žádné záznamy.',
  },
};
