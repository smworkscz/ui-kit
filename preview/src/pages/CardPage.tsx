import React from 'react';
import { Card, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'title', label: 'Titulek', defaultValue: 'Název karty' },
  { type: 'text', prop: 'subtitle', label: 'Podtitulek', defaultValue: 'Sekundární informace' },
  { type: 'select', prop: 'padding', label: 'Padding', options: ['none', 'sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'hoverable', label: 'Hoverable', defaultValue: false },
  { type: 'boolean', prop: 'bordered', label: 'S okrajem', defaultValue: true },
  { type: 'boolean', prop: 'footer', label: 'S patičkou', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'title', type: 'string', description: 'Nadpis karty.' },
  { name: 'subtitle', type: 'string', description: 'Sekundární podnadpis.' },
  { name: 'header', type: 'ReactNode', description: 'Vlastní hlavička (přepíše title/subtitle).' },
  { name: 'footer', type: 'ReactNode', description: 'Obsah patičky (odděleno čárou).' },
  { name: 'children', type: 'ReactNode', description: 'Obsah těla karty.' },
  { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: 'Při hoveru se karta mírně zvedne.' },
  { name: 'bordered', type: 'boolean', defaultValue: 'true', description: 'Zobrazí okraj karty.' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Vnitřní odsazení.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

export const CardPage: React.FC = () => (
  <PageLayout>
    <H1>Card</H1>
    <Paragraph large>
      Obsahová karta pro seskupení souvisejících informací. Podporuje
      hlavičku, patičku, hover efekt a různé úrovně paddingu.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 320 }}>
          <Card
            title={props.title}
            subtitle={props.subtitle}
            padding={props.padding}
            hoverable={props.hoverable}
            bordered={props.bordered}
            footer={props.footer ? <Button size="sm">Akce</Button> : undefined}
          >
            <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
              Toto je ukázkový obsah karty. Může obsahovat text,
              obrázky nebo další komponenty.
            </p>
          </Card>
        </div>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Padding">
      <Card title="None" padding="none"><p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>padding: none</p></Card>
      <Card title="Small" padding="sm"><p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>padding: sm</p></Card>
      <Card title="Medium" padding="md"><p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>padding: md</p></Card>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
