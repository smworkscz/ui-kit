import React from 'react';
import { Popover, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'position', label: 'Pozice', options: ['top', 'bottom', 'left', 'right'], defaultValue: 'bottom' },
  { type: 'select', prop: 'trigger', label: 'Trigger', options: ['click', 'hover'], defaultValue: 'click' },
];

const propDefs: PropDef[] = [
  { name: 'content', type: 'ReactNode', required: true, description: 'Obsah popoveru.' },
  { name: 'children', type: 'ReactElement', required: true, description: 'Trigger element.' },
  { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'bottom'", description: 'Pozice vůči triggeru.' },
  { name: 'trigger', type: "'click' | 'hover'", defaultValue: "'click'", description: 'Způsob otevření.' },
];

export const PopoverPage: React.FC = () => (
  <PageLayout>
    <H1>Popover</H1>
    <Paragraph large>Plovoucí panel s libovolným obsahem, otevíraný klikem nebo hoverem.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Popover
          content={<div style={{ padding: 8, fontSize: 14 }}>Obsah popoveru s libovolnými prvky.</div>}
          position={props.position}
          trigger={props.trigger}
        >
          <Button variant="outline">Otevřít popover</Button>
        </Popover>
      )}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
