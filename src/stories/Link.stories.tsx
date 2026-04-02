import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../components/Link';
import { ArrowRight, Trash } from '@phosphor-icons/react';

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }, { name: 'dark', value: '#1a1a1a' }],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Zpět na přehled' } };

export const Danger: Story = {
  args: { children: 'Odstranit položku', variant: 'danger' }
};

export const WithIconLeft: Story = {
  args: { children: 'Smazat', variant: 'danger', icon: <Trash weight="bold" /> }
};

export const WithIconRight: Story = {
  args: { children: 'Pokračovat', iconPosition: 'right', icon: <ArrowRight weight="bold" /> }
};
