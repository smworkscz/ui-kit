import React from 'react';
import { Splitter } from '../../../src';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'orientation', label: 'Orientace', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Smer rozdeleni panelu.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Dva nebo vice potomku (panelu) k rozdeleni.' },
  { name: 'defaultSizes', type: 'number[]', description: 'Vychozi velikosti panelu v procentech (napr. [30, 70]).' },
  { name: 'minSizes', type: 'number[]', description: 'Minimalni velikosti panelu v procentech.' },
  { name: 'maxSizes', type: 'number[]', description: 'Maximalni velikosti panelu v procentech.' },
  { name: 'onResize', type: '(sizes: number[]) => void', description: 'Callback pri zmene velikosti panelu.' },
  { name: 'persistKey', type: 'string', description: 'Klic pro ulozeni velikosti do localStorage.' },
  { name: 'dividerSize', type: 'number', defaultValue: '4', description: 'Sirka rozdelovaciho prvku v px.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakaze zmenu velikosti.' },
];

const PanelContent: React.FC<{ label: string }> = ({ label }) => {
  const theme = useTheme();
  return (
    <div style={{
      padding: 16,
      height: '100%',
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: 14,
      color: theme === 'dark' ? '#eaeaea' : '#333333',
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    }}>
      {label}
    </div>
  );
};

export const SplitterPage: React.FC = () => (
  <PageLayout>
    <H1>Splitter</H1>
    <Paragraph large>
      Rozdelovac panelu s pretahovatelnym rozdelovacem. Podporuje horizontalni
      i vertikalni orientaci a ulozeni velikosti.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ height: 300, border: '1px solid rgba(128,128,128,0.2)', borderRadius: 8, overflow: 'hidden' }}>
          <Splitter
            orientation={props.orientation}
            disabled={props.disabled}
          >
            <PanelContent label="Sidebar" />
            <PanelContent label="Content" />
          </Splitter>
        </div>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Horizontalni rozdeleni">
      <div style={{ height: 300, width: '100%', border: '1px solid rgba(128,128,128,0.2)', borderRadius: 8, overflow: 'hidden' }}>
        <Splitter orientation="horizontal">
          <PanelContent label="Sidebar" />
          <PanelContent label="Content" />
        </Splitter>
      </div>
    </VariantShowcase>

    <VariantShowcase label="Vertikalni rozdeleni">
      <div style={{ height: 300, width: '100%', border: '1px solid rgba(128,128,128,0.2)', borderRadius: 8, overflow: 'hidden' }}>
        <Splitter orientation="vertical">
          <PanelContent label="Horni panel" />
          <PanelContent label="Dolni panel" />
        </Splitter>
      </div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
