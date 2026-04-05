import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../components/Checkbox';

const meta = {
  title: 'Formuláře/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    error: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Souhlasím s podmínkami',
    size: 'md',
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const Skupina: Story = {
  name: 'Skupina',
  render: () => {
    const [values, setValues] = useState({ sport: true, hudba: false, film: false });
    const allChecked = Object.values(values).every(Boolean);
    const someChecked = Object.values(values).some(Boolean);

    return (
      <CheckboxGroup label="Zájmy">
        <Checkbox
          label="Vybrat vše"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(checked) =>
            setValues({ sport: checked, hudba: checked, film: checked })
          }
        />
        <Checkbox
          label="Sport"
          checked={values.sport}
          onChange={(v) => setValues((p) => ({ ...p, sport: v }))}
        />
        <Checkbox
          label="Hudba"
          checked={values.hudba}
          onChange={(v) => setValues((p) => ({ ...p, hudba: v }))}
        />
        <Checkbox
          label="Film"
          checked={values.film}
          onChange={(v) => setValues((p) => ({ ...p, film: v }))}
        />
      </CheckboxGroup>
    );
  },
};
