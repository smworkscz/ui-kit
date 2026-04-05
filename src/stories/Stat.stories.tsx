import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from '../components/Stat';
import { ShoppingCart, CurrencyEur, Users, ChartLineUp } from '@phosphor-icons/react';

const meta = {
  title: 'Zobrazení dat/Stat',
  component: Stat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'number' },
    changeLabel: { control: 'text' },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
    icon: { control: false },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Objednávky',
    value: '1 284',
    change: 12.5,
    changeLabel: 'za měsíc',
    trend: 'up',
    icon: <ShoppingCart size={20} weight="bold" />,
  },
  render: (args) => (
    <div style={{ width: 260 }}>
      <Stat {...args} />
    </div>
  ),
};

export const PrehledStatistik: Story = {
  name: 'Přehled statistik',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '560px' }}>
      <Stat
        label="Objednávky"
        value="1 284"
        change={12.5}
        changeLabel="za měsíc"
        trend="up"
        icon={<ShoppingCart size={20} weight="bold" />}
      />
      <Stat
        label="Tržby"
        value="€ 45 320"
        change={-3.2}
        changeLabel="za měsíc"
        trend="down"
        icon={<CurrencyEur size={20} weight="bold" />}
      />
      <Stat
        label="Uživatelé"
        value="892"
        change={0.0}
        trend="neutral"
        icon={<Users size={20} weight="bold" />}
      />
      <Stat
        label="Konverze"
        value="4.2 %"
        change={1.8}
        changeLabel="za týden"
        trend="up"
        icon={<ChartLineUp size={20} weight="bold" />}
      />
    </div>
  ),
};
