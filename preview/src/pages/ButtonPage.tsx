import React from 'react';
import { Button } from '../../../src';
import { Plus, ArrowRight, DownloadSimple } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['primary', 'secondary', 'outline', 'danger'], defaultValue: 'primary' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'children', label: 'Text', defaultValue: 'Tlačítko' },
  { type: 'boolean', prop: 'loading', label: 'Loading', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'fullWidth', label: 'Full width', defaultValue: false },
  { type: 'boolean', prop: 'icon', label: 'S ikonou', defaultValue: false },
  { type: 'select', prop: 'loadingPosition', label: 'Loading pozice', options: ['replace', 'after-text'], defaultValue: 'replace' },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'danger'", defaultValue: "'primary'", description: 'Vizuální styl tlačítka.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'icon', type: 'ReactNode', description: 'Volitelná ikona (SVG nebo komponenta).' },
  { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Pozice ikony vůči textu.' },
  { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Zobrazí spinner a zakáže interakci.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Roztáhne tlačítko na celou šířku kontejneru.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže interakci s tlačítkem.' },
  { name: 'onClick', type: '() => void', description: 'Callback při kliknutí. Zděděno z nativních HTML atributů.' },
  { name: 'href', type: 'string', description: 'Pokud je zadáno, vykreslí se jako <a> místo <button>.' },
  { name: 'target', type: 'string', description: 'Cíl odkazu (např. "_blank"). Pouze s href. Auto rel="noopener noreferrer" pro _blank.' },
  { name: 'children', type: 'ReactNode', description: 'Textový obsah tlačítka.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
  { name: 'loadingPosition', type: "'replace' | 'after-text'", defaultValue: "'replace'", description: 'Pozice spinneru při loading. after-text zobrazí spinner za textem.' },
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
          loading={props.loading as boolean}
          disabled={props.disabled as boolean}
          fullWidth={props.fullWidth as boolean}
          icon={props.icon ? <Plus size={16} weight="bold" /> : undefined}
          loadingPosition={props.loadingPosition as 'replace' | 'after-text'}
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
      <Button variant="danger">Danger</Button>
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

    <VariantShowcase label="Loading za textem">
      <Button loading loadingPosition="after-text">Ukládání</Button>
      <Button loading loadingPosition="after-text" variant="secondary">Odesílání</Button>
      <Button loading loadingPosition="after-text" variant="outline">Načítání</Button>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
