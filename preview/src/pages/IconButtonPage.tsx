import React from 'react';
import { IconButton } from '../../../src';
import { Trash, PencilSimple, DotsThree, Heart } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['default', 'ghost', 'outline', 'danger'], defaultValue: 'default' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['xs', 'sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'icon', type: 'ReactNode', required: true, description: 'Ikona zobrazená uvnitř tlačítka.' },
  { name: 'label', type: 'string', required: true, description: 'Přístupný popis pro screen readery (aria-label).' },
  { name: 'variant', type: "'default' | 'ghost' | 'outline' | 'danger'", defaultValue: "'default'", description: 'Vizuální styl tlačítka.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci s tlačítkem.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner a zakáže interakci.' },
  { name: 'tooltip', type: 'string', description: 'Text tooltipu při hoveru.' },
];

export const IconButtonPage: React.FC = () => (
  <PageLayout>
    <H1>IconButton</H1>
    <Paragraph large>
      Tlačítko pouze s ikonou pro kompaktní akce v toolbarech, tabulkách a dalších místech.
      Vyžaduje přístupný label pro screen readery.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <IconButton
          icon={<PencilSimple size={16} weight="bold" />}
          label="Upravit"
          variant={props.variant}
          size={props.size}
          loading={props.loading}
          disabled={props.disabled}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Vizuální styly">
      <IconButton icon={<PencilSimple size={16} weight="bold" />} label="Upravit" variant="default" />
      <IconButton icon={<PencilSimple size={16} weight="bold" />} label="Upravit" variant="ghost" />
      <IconButton icon={<PencilSimple size={16} weight="bold" />} label="Upravit" variant="outline" />
      <IconButton icon={<Trash size={16} weight="bold" />} label="Smazat" variant="danger" />
    </VariantShowcase>

    <VariantShowcase label="Velikosti">
      <IconButton icon={<Heart size={16} weight="bold" />} label="Oblíbené" size="xs" />
      <IconButton icon={<Heart size={16} weight="bold" />} label="Oblíbené" size="sm" />
      <IconButton icon={<Heart size={16} weight="bold" />} label="Oblíbené" size="md" />
      <IconButton icon={<Heart size={16} weight="bold" />} label="Oblíbené" size="lg" />
    </VariantShowcase>

    <VariantShowcase label="Příklady použití">
      <IconButton icon={<Trash size={16} weight="bold" />} label="Smazat" variant="danger" />
      <IconButton icon={<PencilSimple size={16} weight="bold" />} label="Upravit" variant="ghost" />
      <IconButton icon={<DotsThree size={16} weight="bold" />} label="Více akcí" variant="outline" />
      <IconButton icon={<Heart size={16} weight="bold" />} label="Oblíbené" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
