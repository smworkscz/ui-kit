import React, { useState } from 'react';
import { SortableList } from '../../../src';
import { DotsSixVertical } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

interface PriorityItem {
  id: string;
  label: string;
  color: string;
}

const initialItems: PriorityItem[] = [
  { id: '1', label: 'Kriticka', color: '#EF3838' },
  { id: '2', label: 'Vysoka', color: '#F5A623' },
  { id: '3', label: 'Stredni', color: '#2196F3' },
  { id: '4', label: 'Nizka', color: '#00A205' },
  { id: '5', label: 'Zadna', color: '#888888' },
];

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'handle', label: 'Handle', options: ['whole', 'explicit'], defaultValue: 'whole' },
];

const propDefs: PropDef[] = [
  { name: 'items', type: 'T[]', required: true, description: 'Pole polozek k serazeni.' },
  { name: 'keyExtractor', type: '(item: T) => string | number', required: true, description: 'Funkce pro ziskani unikatniho klice z polozky.' },
  { name: 'renderItem', type: '(item: T, dragHandle: ReactNode) => ReactNode', required: true, description: 'Render funkce pro polozku. dragHandle je element pro pretahovani.' },
  { name: 'onReorder', type: '(newOrder: T[]) => void', required: true, description: 'Callback pri zmene poradi.' },
  { name: 'direction', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Smer razeni.' },
  { name: 'handle', type: "'whole' | 'explicit'", defaultValue: "'whole'", description: 'Cela polozka pretahovatelna nebo jen za handle.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakaze pretahovani.' },
  { name: 'gap', type: 'number | string', description: 'Mezera mezi polozkami.' },
];

const SortableListDemo: React.FC<{ handle: string }> = ({ handle }) => {
  const [items, setItems] = useState<PriorityItem[]>(initialItems);

  return (
    <div style={{ width: 340 }}>
      <SortableList
        items={items}
        keyExtractor={(item) => item.id}
        handle={handle as any}
        onReorder={setItems}
        renderItem={(item, dragHandle) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            {handle === 'explicit' && dragHandle}
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: item.color,
              flexShrink: 0,
            }} />
            <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
            {handle === 'explicit' && (
              <DotsSixVertical size={16} weight="bold" style={{ opacity: 0.4 }} />
            )}
          </div>
        )}
      />
    </div>
  );
};

export const SortableListPage: React.FC = () => (
  <PageLayout>
    <H1>SortableList</H1>
    <Paragraph large>
      Genericky seraditelny seznam s drag & drop. Podporuje vertikalni
      i horizontalni smer a volitelny explicitni drag handle.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => <SortableListDemo handle={props.handle} />}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Zakladni seznam priorit">
      <SortableListDemo handle="whole" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
