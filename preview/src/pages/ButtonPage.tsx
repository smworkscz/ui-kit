import React from 'react';
import { Button } from '../../../src';
import { Plus, ArrowRight, DownloadSimple } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['primary', 'secondary', 'outline'], defaultValue: 'primary' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'children', label: 'Text', defaultValue: 'Tlačítko' },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'fullWidth', label: 'Full width', defaultValue: false },
  { type: 'boolean', prop: 'icon', label: 'S ikonou', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'primary' | 'secondary' | 'outline'", defaultValue: "'primary'", description: 'Vizuální styl tlačítka.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'icon', type: 'ReactNode', description: 'Volitelná ikona (SVG nebo komponenta).' },
  { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Pozice ikony vůči textu.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner a zakáže interakci.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Roztáhne tlačítko na celou šířku kontejneru.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci s tlačítkem.' },
  { name: 'href', type: 'string', description: 'Pokud je zadáno, vykreslí se jako <a> místo <button>.' },
  { name: 'target', type: 'string', description: 'Cíl odkazu (např. "_blank"). Pouze s href. Auto rel="noopener noreferrer" pro _blank.' },
  { name: 'children', type: 'ReactNode', description: 'Textový obsah tlačítka.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

export const ButtonPage: React.FC = () => (
  <PageLayout>
    <H1>Button</H1>
    <Paragraph large>
      Tlačítko pro primární akce, sekundární operace a obrysové varianty.
      Podporuje ikony, loading stav a může se vykreslit jako odkaz.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Button
          variant={props.variant}
          size={props.size}
          loading={props.loading}
          disabled={props.disabled}
          fullWidth={props.fullWidth}
          icon={props.icon ? <Plus size={16} weight="bold" /> : undefined}
        >
          {props.children}
        </Button>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Vizuální styly">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </VariantShowcase>

    <VariantShowcase label="Velikosti">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </VariantShowcase>

    <VariantShowcase label="S ikonou">
      <Button icon={<Plus size={16} weight="bold" />}>Přidat</Button>
      <Button variant="secondary" icon={<DownloadSimple size={16} weight="bold" />}>Stáhnout</Button>
      <Button variant="outline" icon={<ArrowRight size={16} weight="bold" />} iconPosition="right">Další</Button>
    </VariantShowcase>

    <VariantShowcase label="Stavy">
      <Button loading>Načítání</Button>
      <Button disabled>Zakázáno</Button>
      <Button icon={<Plus size={16} weight="bold" />} />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
