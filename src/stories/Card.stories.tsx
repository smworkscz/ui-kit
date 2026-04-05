import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/Card';

const meta = {
  title: 'Zobrazení dat/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    hoverable: { control: 'boolean' },
    bordered: { control: 'boolean' },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    header: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Přehled projektu',
    subtitle: 'Poslední aktualizace před 2 hodinami',
    hoverable: false,
    bordered: true,
    padding: 'md',
    children: (
      <p style={{ margin: 0, fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px' }}>
        Tento projekt obsahuje 12 komponent a 34 příběhů. Všechny testy prošly úspěšně.
      </p>
    ),
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Card {...args} />
    </div>
  ),
};

export const SPatickou: Story = {
  name: 'S patičkou',
  args: {
    title: 'Nastavení účtu',
    padding: 'md',
    bordered: true,
    children: (
      <p style={{ margin: 0, fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px' }}>
        Upravte své osobní údaje a předvolby.
      </p>
    ),
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button style={{ padding: '6px 16px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent', color: 'inherit', cursor: 'pointer', fontFamily: "'Zalando Sans', sans-serif" }}>
          Zrušit
        </button>
        <button style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', background: '#E8612D', color: '#fff', cursor: 'pointer', fontFamily: "'Zalando Sans', sans-serif" }}>
          Uložit
        </button>
      </div>
    ),
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Card {...args} />
    </div>
  ),
};
