import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from '../components/Pagination';

const meta = {
  title: 'Navigace/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    page: { control: false },
    onChange: { control: false },
    totalPages: { control: 'number' },
    siblings: { control: 'number' },
    showFirst: { control: 'boolean' },
    showLast: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalPages: 20,
    siblings: 1,
    showFirst: true,
    showLast: true,
    size: 'md',
  },
  render: (args) => {
    const [page, setPage] = useState(5);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
};

export const Small: Story = {
  args: {
    totalPages: 10,
    size: 'sm',
  },
  render: (args) => {
    const [page, setPage] = useState(1);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
};
