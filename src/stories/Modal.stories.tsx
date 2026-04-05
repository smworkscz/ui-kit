import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from '../components/Modal';

const meta = {
  title: 'Navigace/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: false },
    onClose: { control: false },
    title: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'fullscreen'] },
    closeOnOverlay: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    showClose: { control: 'boolean' },
    children: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Potvrzení akce',
    size: 'md',
    closeOnOverlay: true,
    closeOnEscape: true,
    showClose: true,
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
          Otevřít modál
        </button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '8px 16px',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '14px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Zrušit
              </button>
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
                Potvrdit
              </button>
            </div>
          }
        >
          <p style={{ margin: 0 }}>
            Opravdu chcete pokračovat s touto akcí? Tato operace je nevratná
            a všechna data budou trvale smazána.
          </p>
        </Modal>
      </>
    );
  },
};

export const Fullscreen: Story = {
  args: {
    title: 'Editor dokumentu',
    size: 'fullscreen',
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
          Otevřít na celou obrazovku
        </button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ margin: 0 }}>
            Obsah zobrazený na celou obrazovku. Ideální pro komplexní formuláře
            nebo editory, kde je potřeba maximální pracovní plocha.
          </p>
        </Modal>
      </>
    );
  },
};
