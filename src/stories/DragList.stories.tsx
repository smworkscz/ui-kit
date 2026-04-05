import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DragList, DragListItem } from '../components/DragList';

const meta = {
  title: 'Utility/DragList',
  component: DragList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: false },
    onReorder: { control: false },
    renderItem: { control: false },
    allowNesting: { control: 'boolean' },
    maxDepth: { control: { type: 'number', min: 1, max: 10 } },
  },
} satisfies Meta<typeof DragList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Flat list ──────────────────────────────────────────────────────────────

const flatItems: DragListItem[] = [
  { id: '1', label: 'Položka 1' },
  { id: '2', label: 'Položka 2' },
  { id: '3', label: 'Položka 3' },
  { id: '4', label: 'Položka 4' },
  { id: '5', label: 'Položka 5' },
  { id: '6', label: 'Položka 6' },
];

export const Default: Story = {
  args: {
    items: flatItems,
    onReorder: () => {},
  },
  render: function FlatListStory(args) {
    const [items, setItems] = useState<DragListItem[]>(flatItems);
    return (
      <div style={{ width: 360 }}>
        <DragList {...args} items={items} onReorder={setItems} />
      </div>
    );
  },
};

// ─── Tree / nested ──────────────────────────────────────────────────────────

const treeItems: DragListItem[] = [
  {
    id: 'docs',
    label: 'Dokumenty',
    expanded: true,
    children: [
      { id: 'docs-1', label: 'Smlouvy' },
      { id: 'docs-2', label: 'Faktury' },
      {
        id: 'docs-3',
        label: 'Archiv',
        expanded: true,
        children: [
          { id: 'docs-3-1', label: 'Rok 2024' },
          { id: 'docs-3-2', label: 'Rok 2025' },
        ],
      },
    ],
  },
  {
    id: 'images',
    label: 'Obrázky',
    expanded: false,
    children: [
      { id: 'img-1', label: 'Fotografie' },
      { id: 'img-2', label: 'Screenshoty' },
    ],
  },
  { id: 'notes', label: 'Poznámky' },
  { id: 'projects', label: 'Projekty' },
];

export const StromovyRezim: Story = {
  name: 'Stromový režim',
  args: {
    items: treeItems,
    onReorder: () => {},
    allowNesting: true,
    maxDepth: 3,
  },
  render: function TreeStory(args) {
    const [items, setItems] = useState<DragListItem[]>(treeItems);
    return (
      <div style={{ width: 360 }}>
        <DragList {...args} items={items} onReorder={setItems} allowNesting />
      </div>
    );
  },
};
