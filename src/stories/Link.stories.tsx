import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../components/Link';
import { ArrowRight } from '@phosphor-icons/react';

const meta = {
  title: 'Navigace/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Zpět na přehled', icon: <ArrowRight weight="bold" /> },
};
