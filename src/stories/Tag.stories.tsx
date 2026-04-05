import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag, Badge, TagItem } from '../components/Tag';

const meta = {
  title: 'Zobrazení dat/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'React', onRemove: fn() } };

export const BadgesDemo = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Badge label="Novinka" />
    <Badge label="10+" />
  </div>
);

export const TagItemDemo = () => (
  <div style={{ width: 350 }}>
    <TagItem label="Homepage" onFilter={fn()} onEdit={fn()} onDelete={fn()} />
    <div style={{ height: 8 }} />
    <TagItem label="Blog" onFilter={fn()} onDelete={fn()} />
  </div>
);
