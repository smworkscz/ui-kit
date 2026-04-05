import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '../components/Skeleton';

const meta = {
  title: 'Zobrazení dat/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: 'number' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'text',
    width: '240px',
    lines: 3,
    animate: true,
  },
};

export const Kruh: Story = {
  args: {
    variant: 'circle',
    width: 64,
    height: 64,
  },
};

export const Obdelnik: Story = {
  args: {
    variant: 'rect',
    width: '320px',
    height: '180px',
  },
};
