import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, RadioGroup } from '../components/Radio';

const meta = {
  title: 'Formuláře/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Volba A',
    value: 'a',
    size: 'md',
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Radio
        {...args}
        checked={checked}
        onChange={() => setChecked(true)}
      />
    );
  },
};

export const Skupina: Story = {
  name: 'Skupina',
  render: () => {
    const [value, setValue] = useState('kava');
    return (
      <RadioGroup
        label="Oblíbený nápoj"
        value={value}
        onChange={setValue}
        helperText="Vyberte jeden nápoj"
        options={[
          { value: 'kava', label: 'Káva' },
          { value: 'caj', label: 'Čaj' },
          { value: 'dzus', label: 'Džus' },
          { value: 'voda', label: 'Voda', disabled: true },
        ]}
      />
    );
  },
};
