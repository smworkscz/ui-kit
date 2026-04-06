import React, { useState } from 'react';
import { DragList } from '../../../src';
import type { DragListItem } from '../../../src';
import { Folder, File, DotsSixVertical } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, CodeBlock } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'allowNesting', label: 'Stromový režim', defaultValue: false },
  { type: 'boolean', prop: 'handleMode', label: 'Drag jen za handle', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'items', type: 'DragListItem[]', required: true, description: 'Seznam položek.' },
  { name: 'onReorder', type: '(items) => void', required: true, description: 'Callback změny pořadí.' },
  { name: 'renderItem', type: '(item, dragProps) => ReactNode', description: 'Vlastní render s přístupem k drag handle props.' },
  { name: 'allowNesting', type: 'boolean', defaultValue: 'false', description: 'Povolí stromový režim s vnořováním.' },
  { name: 'maxDepth', type: 'number', defaultValue: '3', description: 'Maximální hloubka vnoření.' },
  { name: 'dragMode', type: "'full' | 'handle'", defaultValue: "'full'", description: 'Celá karta přetahovatelná nebo jen za handle.' },
];

const handlePropDefs: PropDef[] = [
  { name: 'handleProps', type: '{ onMouseDown, style, aria-label }', description: 'Spread na element sloužící jako drag handle.' },
  { name: 'isDragging', type: 'boolean', description: 'Zda je položka právě přetahována.' },
  { name: 'depth', type: 'number', description: 'Hloubka vnoření (0 = root).' },
  { name: 'isExpanded', type: 'boolean', description: 'Zda je položka rozbalena.' },
  { name: 'toggleExpand', type: '() => void', description: 'Přepne rozbalení/sbalení.' },
  { name: 'hasChildren', type: 'boolean', description: 'Zda má položka potomky.' },
];

// ── Simple demo ─────────────────────────────────────────────────────────────

const FlatDemo: React.FC<{ allowNesting: boolean; handleMode: boolean }> = ({ allowNesting, handleMode }) => {
  const [items, setItems] = useState<DragListItem[]>([
    { id: '1', label: 'Položka 1' },
    { id: '2', label: 'Položka 2' },
    { id: '3', label: 'Položka 3' },
    { id: '4', label: 'Položka 4' },
  ]);
  return (
    <div style={{ width: 340 }}>
      <DragList
        items={items}
        onReorder={setItems}
        allowNesting={allowNesting}
        dragMode={handleMode ? 'handle' : 'full'}
      />
    </div>
  );
};

// ── Tree demo ───────────────────────────────────────────────────────────────

const TreeDemo: React.FC = () => {
  const [items, setItems] = useState<DragListItem[]>([
    {
      id: 'src',
      label: 'src',
      icon: <Folder size={16} weight="fill" />,
      expanded: true,
      children: [
        {
          id: 'components',
          label: 'components',
          icon: <Folder size={16} weight="fill" />,
          expanded: true,
          children: [
            { id: 'button', label: 'Button.tsx', icon: <File size={16} /> },
            { id: 'input', label: 'Input.tsx', icon: <File size={16} /> },
            { id: 'modal', label: 'Modal.tsx', icon: <File size={16} /> },
          ],
        },
        {
          id: 'hooks',
          label: 'hooks',
          icon: <Folder size={16} weight="fill" />,
          children: [
            { id: 'useTheme', label: 'useTheme.ts', icon: <File size={16} /> },
            { id: 'useToast', label: 'useToast.ts', icon: <File size={16} /> },
          ],
        },
        { id: 'index', label: 'index.ts', icon: <File size={16} /> },
      ],
    },
    { id: 'package', label: 'package.json', icon: <File size={16} /> },
    { id: 'readme', label: 'README.md', icon: <File size={16} /> },
  ]);

  return (
    <div style={{ width: 380 }}>
      <DragList items={items} onReorder={setItems} allowNesting maxDepth={4} />
    </div>
  );
};

// ── Custom render demo ──────────────────────────────────────────────────────

const CustomRenderDemo: React.FC = () => {
  const [items, setItems] = useState<DragListItem[]>([
    { id: '1', label: 'Design review', data: { priority: 'high' } },
    { id: '2', label: 'Fix bug #234', data: { priority: 'medium' } },
    { id: '3', label: 'Update docs', data: { priority: 'low' } },
    { id: '4', label: 'Deploy v0.2', data: { priority: 'high' } },
  ]);

  const priorityColors: Record<string, string> = {
    high: '#EF3838',
    medium: '#E8612D',
    low: '#888888',
  };

  return (
    <div style={{ width: 380 }}>
      <DragList
        items={items}
        onReorder={setItems}
        dragMode="handle"
        renderItem={(item, { handleProps }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span {...handleProps} style={{ ...handleProps.style, display: 'inline-flex', padding: '2px' }}>
              <DotsSixVertical size={16} weight="bold" style={{ opacity: 0.4 }} />
            </span>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: priorityColors[item.data?.priority] ?? '#888',
              flexShrink: 0,
            }} />
            <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
            <span style={{ fontSize: 11, opacity: 0.4, textTransform: 'uppercase' }}>
              {item.data?.priority}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export const DragListPage: React.FC = () => (
  <PageLayout>
    <H1>DragList</H1>
    <Paragraph large>
      Přeřaditelný seznam s drag & drop. Podporuje plochý i stromový režim,
      vlastní render s ovladatelným drag handlem.
    </Paragraph>

    <Playground controls={controls} render={(props) => <FlatDemo allowNesting={props.allowNesting} handleMode={props.handleMode} />} />

    <H2>Stromový režim</H2>
    <Paragraph>
      S <code style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>allowNesting</code> lze
      položky vnořovat přetažením na střed karty. Složky se automaticky rozbalí při podržení.
    </Paragraph>
    <TreeDemo />

    <H2>Vlastní render s handlem</H2>
    <Paragraph>
      Funkce <code style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>renderItem</code> přijímá
      položku a objekt s <code style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>handleProps</code> pro
      umístění drag handlu kamkoliv v layoutu.
    </Paragraph>
    <CustomRenderDemo />

    <CodeBlock>{`import { DragList } from 'sm-ui';
import type { DragListItem } from 'sm-ui';
import { DotsSixVertical } from '@phosphor-icons/react';

function TaskList() {
  const [items, setItems] = useState<DragListItem[]>([
    { id: '1', label: 'Design review', data: { priority: 'high' } },
    { id: '2', label: 'Fix bug #234', data: { priority: 'medium' } },
    { id: '3', label: 'Update docs', data: { priority: 'low' } },
  ]);

  return (
    <DragList
      items={items}
      onReorder={setItems}
      dragMode="handle"
      renderItem={(item, { handleProps }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          {/* Drag handle — uživatel přetahuje jen za tento element */}
          <span {...handleProps}>
            <DotsSixVertical size={16} weight="bold" />
          </span>

          {/* Vlastní obsah */}
          <span>{item.label}</span>
          <span>{item.data?.priority}</span>
        </div>
      )}
    />
  );
}`}</CodeBlock>

    <H2>DragList Props</H2>
    <PropsTable props={propDefs} />

    <H2>DragHandleProps (renderItem)</H2>
    <PropsTable props={handlePropDefs} />
  </PageLayout>
);
