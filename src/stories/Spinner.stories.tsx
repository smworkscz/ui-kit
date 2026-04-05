import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '../components/Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Malý: Story = {
  name: 'Malý (sm)',
  args: {
    size: 'sm',
    label: 'Načítání',
  },
};

export const Velký: Story = {
  name: 'Velký (lg)',
  args: {
    size: 'lg',
    label: 'Načítání obsahu',
  },
};

export const VlastníVelikost: Story = {
  name: 'Vlastní velikost a barva',
  args: {
    size: 48,
    color: '#E8612D',
    label: 'Odesílání',
  },
};
