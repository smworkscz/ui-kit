import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Drawer } from '../components/Drawer';

const meta = {
  title: 'Navigace/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: false },
    onClose: { control: false },
    position: { control: 'select', options: ['left', 'right'] },
    title: { control: 'text' },
    width: { control: 'number' },
    showClose: { control: 'boolean' },
    closeOnOverlay: { control: 'boolean' },
    children: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Nastavení',
    position: 'right',
    width: 400,
    showClose: true,
    closeOnOverlay: true,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 20px',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Otevřít šuplík
        </button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                fontFamily: "'Zalando Sans', sans-serif",
                fontSize: '14px',
                border: 'none',
                borderRadius: '8px',
                background: '#E8612D',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Uložit změny
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0 }}>
              Zde můžete upravit nastavení aplikace. Změny se projeví
              po uložení.
            </p>
            <p style={{ margin: 0 }}>
              Šuplík se dá zavřít kliknutím na překryvnou vrstvu,
              klávesou Escape nebo zavíracím tlačítkem.
            </p>
          </div>
        </Drawer>
      </>
    );
  },
};

export const LeftPosition: Story = {
  args: {
    title: 'Navigace',
    position: 'left',
    width: 320,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 20px',
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Otevřít z levé strany
        </button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Přehled', 'Projekty', 'Úkoly', 'Nastavení'].map((item) => (
              <div
                key={item}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {item}
              </div>
            ))}
          </nav>
        </Drawer>
      </>
    );
  },
};
