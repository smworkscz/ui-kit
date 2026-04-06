import React from 'react';
import { Tag, Badge } from '../../../src';
import { PageLayout, H1, H2, Paragraph, PropsTable, VariantShowcase } from './shared';
import type { PropDef } from './shared';

const tagPropDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Text tagu.' },
  { name: 'onRemove', type: '() => void', description: 'Callback odebrání (zobrazí ✕).' },
];

const badgePropDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Text badge (auto-uppercase).' },
];

export const TagPage: React.FC = () => (
  <PageLayout>
    <H1>Tag / Badge</H1>
    <Paragraph large>Malé štítky pro kategorizaci a stavové badge pro označení stavu.</Paragraph>

    <H2>Tag</H2>
    <VariantShowcase label="Základní">
      <Tag label="React" />
      <Tag label="TypeScript" />
      <Tag label="Design" />
    </VariantShowcase>
    <VariantShowcase label="S odebráním">
      <Tag label="React" onRemove={() => {}} />
      <Tag label="TypeScript" onRemove={() => {}} />
    </VariantShowcase>

    <H2>Badge</H2>
    <VariantShowcase label="Základní">
      <Badge label="Novinka" />
      <Badge label="Beta" />
      <Badge label="v0.1.0" />
    </VariantShowcase>

    <H2>Tag Props</H2>
    <PropsTable props={tagPropDefs} />
    <H2>Badge Props</H2>
    <PropsTable props={badgePropDefs} />
  </PageLayout>
);
