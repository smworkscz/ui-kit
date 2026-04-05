import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from '../components/EmptyState';
import { MagnifyingGlass } from '@phosphor-icons/react';

const meta = {
  title: 'Zobrazení dat/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: false },
    action: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Žádné výsledky',
    description: 'Zkuste upravit filtr nebo vyhledávací dotaz. Můžete také vytvořit nový záznam.',
    icon: <MagnifyingGlass size={48} weight="thin" />,
    action: (
      <button
        style={{
          padding: '8px 20px',
          border: 'none',
          borderRadius: '8px',
          background: '#E8612D',
          color: '#fff',
          cursor: 'pointer',
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: '14px',
        }}
      >
        Vytvořit záznam
      </button>
    ),
  },
};
