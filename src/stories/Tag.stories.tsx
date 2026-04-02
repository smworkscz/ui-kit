import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag, Badge, TagItem } from '../components/Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }, { name: 'dark', value: '#1a1a1a' }],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleTag: Story = { args: { label: 'React' } };

export const RemovableTag: Story = {
  args: { label: 'TypeScript', onRemove: fn() }
};

export const BadgesLayer = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Badge label="Novinka" />
    <Badge label="10+" />
  </div>
);

export const TagListItem = () => (
  <div style={{ width: 350 }}>
    <TagItem label="Homepage" onFilter={fn()} onEdit={fn()} onDelete={fn()} />
    <div style={{ height: 8 }} />
    <TagItem label="Blog" onFilter={fn()} onDelete={fn()} />
  </div>
);
