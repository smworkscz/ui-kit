import React from 'react';
import { Tooltip, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'position', label: 'Pozice', options: ['top', 'bottom', 'left', 'right'], defaultValue: 'top' },
  { type: 'text', prop: 'content', label: 'Obsah', defaultValue: 'Nápověda k tlačítku' },
  { type: 'select', prop: 'mode', label: 'Mode', options: ['anchor', 'cursor'], defaultValue: 'anchor' },
  { type: 'boolean', prop: 'autoFlip', label: 'Auto flip', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'content', type: 'string | ReactNode', required: true, description: 'Obsah tooltipu.' },
  { name: 'children', type: 'ReactElement', required: true, description: 'Trigger element.' },
  { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Pozice vůči triggeru.' },
  { name: 'delay', type: 'number', defaultValue: '0', description: 'Zpoždění zobrazení v ms.' },
  { name: 'mode', type: "'anchor' | 'cursor'", defaultValue: "'anchor'", description: 'Režim pozicování. cursor sleduje myš.' },
  { name: 'autoFlip', type: 'boolean', defaultValue: 'true', description: 'Automaticky otočí pozici při přetečení viewportu.' },
  { name: 'offset', type: '[number, number]', defaultValue: '[0, 0]', description: 'Posun od triggeru/kurzoru v px.' },
  { name: 'openDelay', type: 'number', description: 'Prodleva otevření (ms). Přepíše delay.' },
  { name: 'closeDelay', type: 'number', defaultValue: '0', description: 'Prodleva zavření (ms) pro hover-out grace.' },
];

export const TooltipPage: React.FC = () => (
  <PageLayout>
    <H1>Tooltip</H1>
    <Paragraph large>Informační bublina zobrazená při najetí myší na element.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Tooltip content={props.content} position={props.position} mode={props.mode} autoFlip={props.autoFlip as boolean} delay={0}>
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

    <H2>Cursor mode</H2>
    <VariantShowcase label="Tooltip sleduje kurzor myši — ideální pro široké prvky (Gantt bary)">
      <Tooltip content="Detail úkolu #42" mode="cursor" delay={0}>
        <div style={{ width: 600, padding: '16px 24px', background: 'rgba(252,79,0,0.15)', borderRadius: 8, fontFamily: "'Zalando Sans', sans-serif", fontSize: 14, cursor: 'default' }}>
          Široký Gantt bar — najeďte kamkoli
        </div>
      </Tooltip>
    </VariantShowcase>

    <H2>Close delay</H2>
    <VariantShowcase label="Prodleva zavření 300 ms — hover-out grace perioda">
      <Tooltip content="Zmizím se zpožděním" closeDelay={300} delay={0}>
        <Button variant="outline" size="sm">Hover a odjeďte pomalu</Button>
      </Tooltip>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
