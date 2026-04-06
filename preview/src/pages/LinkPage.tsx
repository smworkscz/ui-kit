import React from 'react';
import { Link } from '../../../src';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, PropsTable, VariantShowcase } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'variant', type: "'default' | 'danger'", defaultValue: "'default'", description: 'Barevná varianta.' },
  { name: 'icon', type: 'ReactNode', description: 'Ikona vedle textu.' },
  { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Pozice ikony.' },
  { name: 'href', type: 'string', description: 'URL odkazu.' },
];

export const LinkPage: React.FC = () => (
  <PageLayout>
    <H1>Link</H1>
    <Paragraph large>Stylovaný odkaz s podporou ikon a danger varianty.</Paragraph>

    <H2>Varianty</H2>
    <VariantShowcase label="Styly">
      <Link href="#">Výchozí odkaz</Link>
      <Link href="#" variant="danger">Nebezpečný odkaz</Link>
    </VariantShowcase>
    <VariantShowcase label="S ikonou">
      <Link href="#" icon={<ArrowSquareOut size={14} />} iconPosition="right">Otevřít</Link>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
