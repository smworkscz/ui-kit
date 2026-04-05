import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePicker, DatePickerGroup } from '../components/DatePicker';

const meta = {
  title: 'Formuláře/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['single', 'range'] },
    showTime: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    value: { control: false },
    onChange: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Datum narození',
    placeholder: 'Vyberte datum…',
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ width: 300 }}>
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const WithTime: Story = {
  args: {
    label: 'Začátek události',
    showTime: true,
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div style={{ width: 300 }}>
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Range: Story = {
  args: {
    label: 'Období dovolené',
    mode: 'range',
    clearable: true,
    helperText: 'Vyberte začátek a konec',
  },
  render: (args) => {
    const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
    return (
      <div style={{ width: 340 }}>
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const InsideLabelGroup = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div style={{ width: 300 }}>
      <DatePickerGroup label="Datum dodání">
        <DatePicker
          value={value}
          onChange={setValue}
          placeholder="Zvolte datum…"
          clearable
        />
      </DatePickerGroup>
    </div>
  );
};
