import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressCircle } from '../components/Progress';

const meta = {
  title: 'Feedback/ProgressCircle',
  component: ProgressCircle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 75,
    showValue: true,
  },
};

export const SPopiskem: Story = {
  name: 'S popiskem',
  args: {
    value: 50,
    showValue: true,
    label: 'Stahování',
    size: 80,
    strokeWidth: 6,
  },
};

export const VlastníBarva: Story = {
  name: 'Vlastní barva',
  args: {
    value: 100,
    showValue: true,
    color: '#00A205',
    size: 96,
    strokeWidth: 8,
    label: 'Hotovo',
  },
};
