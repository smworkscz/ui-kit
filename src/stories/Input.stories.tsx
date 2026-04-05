import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input, InputGroup } from '../components/Input';
import { MagnifyingGlass, EnvelopeSimple, Lock } from '@phosphor-icons/react';

const meta = {
  title: 'Formuláře/Input',
  component: Input,
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
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    clearable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'E-mailová adresa',
    placeholder: 'jmeno@priklad.cz',
    type: 'email',
    helperText: 'Zadejte svůj firemní e-mail.',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithIcon: Story = {
  name: 'S ikonou',
  args: {
    label: 'Vyhledávání',
    placeholder: 'Hledat…',
    icon: <MagnifyingGlass weight="bold" />,
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Password: Story = {
  name: 'Heslo',
  args: {
    label: 'Heslo',
    type: 'password',
    placeholder: 'Zadejte heslo',
    helperText: 'Minimálně 8 znaků',
    icon: <Lock weight="bold" />,
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const InputGroupDemo = () => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <InputGroup label="Přihlášení">
      <Input
        placeholder="jmeno@priklad.cz"
        icon={<EnvelopeSimple weight="bold" />}
      />
      <Input
        type="password"
        placeholder="Heslo"
        icon={<Lock weight="bold" />}
      />
    </InputGroup>
  </div>
);
