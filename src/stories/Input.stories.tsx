import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, InputGroup } from '../components/Input';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }, { name: 'dark', value: '#1a1a1a' }],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Zadejte text...' },
};

export const WithIcons: Story = {
  args: {
    placeholder: 'Hledat...',
    iconLeft: <MagnifyingGlass weight="bold" />,
    iconRight: <X weight="bold" style={{ cursor: 'pointer' }} />,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Zadejte e-mail',
    error: 'Tento e-mail není platný.',
    value: 'spatny-format',
  },
};

export const InsideLabelGroup = () => (
  <InputGroup label="E-mailová adresa">
    <Input type="email" placeholder="name@example.com" />
  </InputGroup>
);
