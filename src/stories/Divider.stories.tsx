import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../components/Divider';

const meta = {
  title: 'Utility/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const STextem: Story = {
  name: 'S textem',
  args: {
    orientation: 'horizontal',
    label: 'nebo',
  },
};

export const Vertikální: Story = {
  name: 'Vertikální',
  args: {
    orientation: 'vertical',
    style: { height: 100 },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 100 }}>
        <span>Levá strana</span>
        <Story />
        <span>Pravá strana</span>
      </div>
    ),
  ],
};
