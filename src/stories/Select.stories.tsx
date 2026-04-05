import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select, SelectGroup } from '../components/Select';

const fruitOptions = [
  { value: 'apple', label: 'Jablko' },
  { value: 'banana', label: 'Banán' },
  { value: 'cherry', label: 'Třešeň' },
  { value: 'grape', label: 'Hrozno' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Pomeranč' },
  { value: 'peach', label: 'Broskev' },
  { value: 'pear', label: 'Hruška' },
  { value: 'strawberry', label: 'Jahoda' },
];

const countryOptions = [
  { value: 'cz', label: 'Česká republika' },
  { value: 'sk', label: 'Slovensko' },
  { value: 'de', label: 'Německo' },
  { value: 'at', label: 'Rakousko' },
  { value: 'pl', label: 'Polsko' },
  { value: 'hu', label: 'Maďarsko' },
];

const meta = {
  title: 'Formuláře/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    placeholder: { control: 'text' },
    maxDropdownHeight: { control: 'number' },
    error: { control: 'text' },
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Vyberte zemi…',
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: 300 }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Vyberte ovoce…',
    multiple: true,
    searchable: true,
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['apple', 'cherry']);
    return (
      <div style={{ width: 350 }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const InsideLabelGroup = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={{ width: 300 }}>
      <SelectGroup label="Země původu">
        <Select
          options={countryOptions}
          value={value}
          onChange={setValue}
          placeholder="Zvolte…"
          clearable
          searchable
        />
      </SelectGroup>
    </div>
  );
};
