import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../components/Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }, { name: 'dark', value: '#1a1a1a' }],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { initials: 'DC' } };
export const Small: Story = { args: { initials: 'SM', size: 'sm' } };
export const Large: Story = { args: { initials: 'LG', size: 'lg' } };
export const CustomSizeShape: Story = {
  args: { initials: 'R', size: 100, borderRadius: '50%' }
};
