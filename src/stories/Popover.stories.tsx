import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from '../components/Popover';

const meta = {
  title: 'Zobrazení dat/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover'],
    },
    content: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: 'bottom',
    trigger: 'click',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
        <div style={{ fontFamily: "'Zalando Sans Expanded', sans-serif", fontWeight: 500, fontSize: '14px' }}>
          Možnosti
        </div>
        <div style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '13px', opacity: 0.7 }}>
          Vyberte akci, kterou chcete provést s tímto záznamem.
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button style={{ flex: 1, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', background: 'transparent', color: 'inherit', cursor: 'pointer', fontFamily: "'Zalando Sans', sans-serif", fontSize: '13px' }}>
            Upravit
          </button>
          <button style={{ flex: 1, padding: '6px 12px', border: 'none', borderRadius: '6px', background: '#EF3838', color: '#fff', cursor: 'pointer', fontFamily: "'Zalando Sans', sans-serif", fontSize: '13px' }}>
            Smazat
          </button>
        </div>
      </div>
    ),
  },
  render: (args) => (
    <Popover {...args}>
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
        Otevřít popover
      </button>
    </Popover>
  ),
};
