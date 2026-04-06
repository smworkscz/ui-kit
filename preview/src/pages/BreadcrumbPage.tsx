import React from 'react';
import { Breadcrumb } from '../../../src';
import { PageLayout, H1, H2, Paragraph, PropsTable, VariantShowcase } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'items', type: 'BreadcrumbItem[]', required: true, description: 'Seznam položek navigace.' },
  { name: 'separator', type: 'ReactNode', defaultValue: "'/'", description: 'Oddělovač mezi položkami.' },
];

export const BreadcrumbPage: React.FC = () => (
  <PageLayout>
    <H1>Breadcrumb</H1>
    <Paragraph large>Drobečková navigace pro zobrazení hierarchie stránek.</Paragraph>

    <H2>Ukázky</H2>
    <VariantShowcase label="Základní">
      <Breadcrumb items={[{ label: 'Domů', href: '#' }, { label: 'Projekty', href: '#' }, { label: 'UI KIT' }]} />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
