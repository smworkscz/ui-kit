import React, { useState } from 'react';
import { Tree } from '../../../src';
import type { TreeNode } from '../../../src';
import { FileIcon, FolderIcon, FolderOpenIcon, ImageIcon, FileJsIcon, FileCssIcon } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, PropsTable, VariantShowcase } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'data', type: 'TreeNode[]', required: true, description: 'Stromová data k zobrazení.' },
  { name: 'onSelect', type: '(node: TreeNode) => void', description: 'Callback při výběru uzlu.' },
  { name: 'selectedId', type: 'string', description: 'ID aktuálně vybraného uzlu.' },
  { name: 'defaultExpanded', type: 'string[]', description: 'ID uzlů rozbalených ve výchozím stavu.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const basicData: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        children: [
          { id: 'useTheme', label: 'useTheme.ts' },
          { id: 'useMediaQuery', label: 'useMediaQuery.ts' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'favicon', label: 'favicon.ico' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

const iconData: TreeNode[] = [
  {
    id: 'src2',
    label: 'src',
    icon: <FolderOpenIcon size={16} />,
    children: [
      {
        id: 'components2',
        label: 'components',
        icon: <FolderIcon size={16} />,
        children: [
          { id: 'app', label: 'App.tsx', icon: <FileJsIcon size={16} /> },
          { id: 'styles', label: 'styles.css', icon: <FileCssIcon size={16} /> },
        ],
      },
      {
        id: 'assets2',
        label: 'assets',
        icon: <FolderIcon size={16} />,
        children: [
          { id: 'logo', label: 'logo.png', icon: <ImageIcon size={16} /> },
        ],
      },
      { id: 'main', label: 'main.ts', icon: <FileJsIcon size={16} /> },
    ],
  },
  { id: 'config', label: 'tsconfig.json', icon: <FileIcon size={16} /> },
];

export const TreePage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>('button');
  const [selectedId2, setSelectedId2] = useState<string | undefined>('app');

  return (
    <PageLayout>
      <H1>Tree</H1>
      <Paragraph large>
        Stromový seznam s rozbalitelnými uzly, ikonami a výběrem. Vhodný pro zobrazení hierarchických dat jako jsou soubory nebo kategorie.
      </Paragraph>

      <H2>Základní strom</H2>
      <Paragraph>Stromová struktura se soubory a složkami. Kliknutím na uzel ho vyberete, šipkou rozbalíte potomky.</Paragraph>
      <VariantShowcase label="Souborový strom">
        <div style={{ width: 300 }}>
          <Tree
            data={basicData}
            defaultExpanded={['src', 'components']}
            selectedId={selectedId}
            onSelect={(node) => setSelectedId(node.id)}
          />
        </div>
      </VariantShowcase>

      <H2>S ikonami</H2>
      <Paragraph>Každý uzel může mít vlastní ikonu pro lepší vizuální rozlišení typu obsahu.</Paragraph>
      <VariantShowcase label="Strom s ikonami">
        <div style={{ width: 300 }}>
          <Tree
            data={iconData}
            defaultExpanded={['src2', 'components2']}
            selectedId={selectedId2}
            onSelect={(node) => setSelectedId2(node.id)}
          />
        </div>
      </VariantShowcase>

      <H2>Props</H2>
      <PropsTable props={propDefs} />
    </PageLayout>
  );
};
