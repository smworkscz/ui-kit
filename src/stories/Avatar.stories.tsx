import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../components/Avatar';

const meta = {
  title: 'Zobrazení dat/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { initials: 'DC' } };
