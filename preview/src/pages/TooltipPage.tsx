import React from 'react';
import { Tooltip, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'position', label: 'Pozice', options: ['top', 'bottom', 'left', 'right'], defaultValue: 'top' },
  { type: 'text', prop: 'content', label: 'Obsah', defaultValue: 'Nápověda k tlačítku' },
];

const propDefs: PropDef[] = [
  { name: 'content', type: 'string | ReactNode', required: true, description: 'Obsah tooltipu.' },
  { name: 'children', type: 'ReactElement', required: true, description: 'Trigger element.' },
  { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Pozice vůči triggeru.' },
  { name: 'delay', type: 'number', defaultValue: '200', description: 'Zpoždění zobrazení v ms.' },
];

export const TooltipPage: React.FC = () => (
  <PageLayout>
    <H1>Tooltip</H1>
    <Paragraph large>Informační bublina zobrazená při najetí myší na element.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Tooltip content={props.content} position={props.position}>
          <Button>Najeďte myší</Button>
        </Tooltip>
      )}
    />

    <H2>Pozice</H2>
    <VariantShowcase label="Všechny směry">
      <Tooltip content="Nahoře" position="top"><Button variant="outline" size="sm">Top</Button></Tooltip>
      <Tooltip content="Dole" position="bottom"><Button variant="outline" size="sm">Bottom</Button></Tooltip>
      <Tooltip content="Vlevo" position="left"><Button variant="outline" size="sm">Left</Button></Tooltip>
      <Tooltip content="Vpravo" position="right"><Button variant="outline" size="sm">Right</Button></Tooltip>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
