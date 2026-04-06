import React from 'react';
import { Container } from '../../../src';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'maxWidth', label: 'Max šířka', options: ['sm', 'md', 'lg', 'xl'], defaultValue: 'lg' },
  { type: 'boolean', prop: 'centered', label: 'Centrovaný', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | number", defaultValue: "'lg'", description: 'Maximální šířka.' },
  { name: 'padding', type: 'number | string', defaultValue: '16', description: 'Vnitřní odsazení.' },
  { name: 'centered', type: 'boolean', defaultValue: 'true', description: 'Centrování na stránce.' },
];

export const ContainerPage: React.FC = () => {
  const theme = useTheme();
  return (
    <PageLayout>
      <H1>Container</H1>
      <Paragraph large>Obalovací kontejner s maximální šířkou a centrováním.</Paragraph>

      <Playground
        controls={controls}
        render={(props) => (
          <Container maxWidth={props.maxWidth} centered={props.centered}>
            <div style={{ padding: 16, borderRadius: 8, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', fontSize: 13, textAlign: 'center' }}>
              Obsah v kontejneru ({props.maxWidth})
            </div>
          </Container>
        )}
      />

      <H2>Props</H2>
      <PropsTable props={propDefs} />
    </PageLayout>
  );
};
