import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper } from '../components/Stepper';

const meta = {
  title: 'Navigace/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeStep: { control: 'number' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    clickable: { control: 'select', options: [false, true, 'completed'] },
    steps: { control: false },
    onStepClick: { control: false },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSteps = [
  { label: 'Kontaktní údaje', description: 'Jméno a e-mail' },
  { label: 'Adresa', description: 'Doručovací adresa' },
  { label: 'Platba', description: 'Platební metoda' },
  { label: 'Souhrn' },
];

export const Default: Story = {
  args: {
    steps: defaultSteps,
    activeStep: 2,
    orientation: 'horizontal',
    clickable: true,
  },
  render: (args) => {
    const [step, setStep] = useState(args.activeStep);
    return (
      <div style={{ width: 600 }}>
        <Stepper
          {...args}
          activeStep={step}
          onStepClick={setStep}
        />
      </div>
    );
  },
};

export const Vertical: Story = {
  args: {
    steps: defaultSteps,
    activeStep: 1,
    orientation: 'vertical',
    clickable: 'completed',
  },
  render: (args) => {
    const [step, setStep] = useState(args.activeStep);
    return (
      <div style={{ width: 300 }}>
        <Stepper
          {...args}
          activeStep={step}
          onStepClick={setStep}
        />
      </div>
    );
  },
};
