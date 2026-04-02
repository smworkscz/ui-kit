import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../components/Button';
import { ArrowRight, Plus, X } from '@phosphor-icons/react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    fullWidth: {
      control: 'boolean',
    },
    icon: {
      control: false, // We supply ReactNodes directly in stories
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primární tlačítko
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// Sekundární tlačítko
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Outline varianta
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

// Tlačítko s ikonou vlevo (výchozí)
export const IconLeft: Story = {
  args: {
    variant: 'primary',
    children: 'Checkout',
    icon: <ArrowRight weight="bold" />,
    iconPosition: 'left',
  },
};

// Tlačítko s ikonou vpravo
export const IconRight: Story = {
  args: {
    variant: 'primary',
    children: 'Continue',
    icon: <ArrowRight weight="bold" />,
    iconPosition: 'right',
  },
};

// Tlačítko pouze s ikonou (čtvercové - primary)
export const IconOnlyPrimary: Story = {
  args: {
    variant: 'primary',
    icon: <Plus weight="bold" />,
  },
};

// Tlačítko pouze s ikonou (čtvercové - outline)
export const IconOnlyOutline: Story = {
  args: {
    variant: 'outline',
    icon: <X weight="bold" />,
  },
};

// Tlačítko roztažené na celou šířku
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Tlačítko přes celou šířku',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '16px', border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
};
