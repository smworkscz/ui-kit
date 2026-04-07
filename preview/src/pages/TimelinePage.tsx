import React from 'react';
import { Timeline } from '../../../src';
import { CheckCircle, Package, Truck, MapPin } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'orientation', label: 'Orientace', options: ['vertical', 'horizontal'], defaultValue: 'vertical' },
];

const propDefs: PropDef[] = [
  { name: 'items', type: 'TimelineItem[]', description: 'Položky časové osy.', required: true },
  { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Orientace časové osy.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const itemPropDefs: PropDef[] = [
  { name: 'title', type: 'string', description: 'Nadpis události.', required: true },
  { name: 'description', type: 'string', description: 'Volitelný popis události.' },
  { name: 'date', type: 'string', description: 'Volitelný datum / časový údaj.' },
  { name: 'icon', type: 'ReactNode', description: 'Vlastní ikona místo výchozí tečky.' },
  { name: 'color', type: 'string', defaultValue: "'#FC4F00'", description: 'Barva tečky nebo pozadí ikony.' },
];

const demoItems = [
  { title: 'Objednávka vytvořena', date: '10:00', description: 'Objednávka byla úspěšně přijata do systému.' },
  { title: 'Platba potvrzena', date: '10:05', description: 'Platba kartou byla autorizována.', color: '#00A205' },
  { title: 'Připraveno k odeslání', date: '14:30' },
  { title: 'Odesláno', date: '16:00', description: 'Zásilka předána přepravci.' },
  { title: 'Doručeno', date: '18:45', color: '#2196F3' },
];

const iconItems = [
  { title: 'Objednávka potvrzena', date: '10:00', icon: <CheckCircle size={16} weight="fill" />, color: '#00A205' },
  { title: 'Zabaleno', date: '12:30', icon: <Package size={16} weight="fill" />, description: 'Zásilka byla zabalena a označena.' },
  { title: 'Na cestě', date: '14:00', icon: <Truck size={16} weight="fill" />, color: '#2196F3' },
  { title: 'Doručeno', date: '18:00', icon: <MapPin size={16} weight="fill" />, color: '#9C27B0', description: 'Zásilka byla úspěšně doručena.' },
];

export const TimelinePage: React.FC = () => (
  <PageLayout>
    <H1>Timeline</H1>
    <Paragraph large>
      Časová osa s tečkami nebo ikonami a obsahem. Podporuje vertikální i horizontální orientaci.
      Každá položka zobrazuje nadpis, volitelný popis a datum. Ikona nebo
      barevná tečka je propojená čárou.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Timeline
          items={demoItems}
          orientation={props.orientation}
          style={{ maxWidth: props.orientation === 'horizontal' ? 700 : 480 }}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Vertikální časová osa">
      <Timeline
        items={demoItems}
        style={{ maxWidth: 480 }}
      />
    </VariantShowcase>

    <VariantShowcase label="Horizontální časová osa">
      <Timeline
        items={demoItems}
        orientation="horizontal"
        style={{ maxWidth: 700 }}
      />
    </VariantShowcase>

    <VariantShowcase label="S vlastními ikonami (vertikální)">
      <Timeline
        items={iconItems}
        style={{ maxWidth: 480 }}
      />
    </VariantShowcase>

    <VariantShowcase label="S vlastními ikonami (horizontální)">
      <Timeline
        items={iconItems}
        orientation="horizontal"
        style={{ maxWidth: 700 }}
      />
    </VariantShowcase>

    <H2>Props (Timeline)</H2>
    <PropsTable props={propDefs} />

    <H2>Props (TimelineItem)</H2>
    <PropsTable props={itemPropDefs} />
  </PageLayout>
);
