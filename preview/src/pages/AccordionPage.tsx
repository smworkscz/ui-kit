import React from 'react';
import { Accordion, AccordionItem } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'multiple', label: 'Multiple', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'AccordionItem komponenty.' },
  { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Povolí více otevřených položek.' },
];

const itemPropDefs: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Titulek položky.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Obsah položky.' },
  { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Výchozí rozbalená.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže rozbalení.' },
];

export const AccordionPage: React.FC = () => (
  <PageLayout>
    <H1>Accordion</H1>
    <Paragraph large>Skládací sekce obsahu pro organizaci dlouhých stránek.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Accordion multiple={props.multiple}>
            <AccordionItem title="Co je SMWORKS UI KIT?">Interní knihovna komponent pro aplikace SMWORKS.</AccordionItem>
            <AccordionItem title="Jaké technologie používá?">React 18+, TypeScript, inline design tokeny.</AccordionItem>
            <AccordionItem title="Jak nastavit téma?">Nastavte atribut data-theme na body element.</AccordionItem>
          </Accordion>
        </div>
      )}
    />

    <H2>Accordion Props</H2>
    <PropsTable props={propDefs} />
    <H2>AccordionItem Props</H2>
    <PropsTable props={itemPropDefs} />
  </PageLayout>
);
