import React, { useState } from 'react';
import { Pagination } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
];

const propDefs: PropDef[] = [
  { name: 'page', type: 'number', required: true, description: 'Aktuální stránka (1-indexed).' },
  { name: 'totalPages', type: 'number', required: true, description: 'Celkový počet stránek.' },
  { name: 'onChange', type: '(page: number) => void', required: true, description: 'Callback při změně stránky.' },
  { name: 'siblings', type: 'number', defaultValue: '1', description: 'Počet stránek kolem aktuální.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
];

const PaginationDemo: React.FC<{ size: string }> = ({ size }) => {
  const [page, setPage] = useState(5);
  return <Pagination page={page} totalPages={20} onChange={setPage} size={size as any} />;
};

export const PaginationPage: React.FC = () => (
  <PageLayout>
    <H1>Pagination</H1>
    <Paragraph large>Stránkování výsledků s chytrou redukcí stránek.</Paragraph>

    <Playground controls={controls} render={(props) => <PaginationDemo size={props.size} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
