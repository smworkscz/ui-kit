import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from '../components/Textarea';

const meta = {
  title: 'Formuláře/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'both'],
    },
    rows: { control: 'number' },
    maxLength: { control: 'number' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Poznámka',
    placeholder: 'Napište svou poznámku…',
    helperText: 'Maximálně 500 znaků.',
    maxLength: 500,
    rows: 4,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 360 }}>
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};
