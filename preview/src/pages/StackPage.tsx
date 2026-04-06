import React from 'react';
import { Stack, Button } from '../../../src';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'direction', label: 'Směr', options: ['row', 'column'], defaultValue: 'column' },
  { type: 'select', prop: 'align', label: 'Zarovnání', options: ['start', 'center', 'end', 'stretch'], defaultValue: 'stretch' },
  { type: 'select', prop: 'justify', label: 'Rozložení', options: ['start', 'center', 'end', 'between', 'around'], defaultValue: 'start' },
  { type: 'boolean', prop: 'wrap', label: 'Wrap', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'direction', type: "'row' | 'column'", defaultValue: "'column'", description: 'Směr layoutu.' },
  { name: 'gap', type: 'number | string', defaultValue: '8', description: 'Mezera mezi prvky.' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", defaultValue: "'stretch'", description: 'Zarovnání.' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around'", defaultValue: "'start'", description: 'Rozložení.' },
  { name: 'wrap', type: 'boolean', defaultValue: 'false', description: 'Zalamování.' },
  { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Plná šířka.' },
];

const Box: React.FC<{ n: number }> = ({ n }) => {
  const theme = useTheme();
  return (
    <div style={{ padding: '8px 16px', borderRadius: 6, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', fontSize: 13 }}>
      Prvek {n}
    </div>
  );
};

export const StackPage: React.FC = () => (
  <PageLayout>
    <H1>Stack</H1>
    <Paragraph large>Flex layout kontejner pro snadné zarovnání prvků.</Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Stack direction={props.direction} align={props.align} justify={props.justify} wrap={props.wrap} gap={12}>
          <Box n={1} /><Box n={2} /><Box n={3} />
        </Stack>
      )}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
