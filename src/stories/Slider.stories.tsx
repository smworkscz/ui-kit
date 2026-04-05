import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from '../components/Slider';

const meta = {
  title: 'Formuláře/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    showValue: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Hlasitost',
    showValue: true,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
  },
  render: (args) => {
    const [value, setValue] = useState<number>(50);
    return (
      <div style={{ width: 300 }}>
        <Slider
          {...args}
          value={value}
          onChange={(v) => setValue(v as number)}
        />
      </div>
    );
  },
};

export const Rozsah: Story = {
  name: 'Rozsah',
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <div style={{ width: 300 }}>
        <Slider
          label="Cenový rozsah"
          range
          min={0}
          max={1000}
          step={10}
          showValue
          value={value}
          onChange={(v) => setValue(v as [number, number])}
        />
      </div>
    );
  },
};
