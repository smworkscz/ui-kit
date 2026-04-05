import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { Toast, ToasterProvider, useToast } from '../components/Toast';
import type { ToastPosition } from '../components/Toast';
import { Button } from '../components/Button';
import { Student } from '@phosphor-icons/react';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'info', title: 'Aktualizace', content: 'Byla nalezena nová verze aplikace.', onClose: fn() },
};

const ToastDemoComponent = () => {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
      <Button variant="outline" onClick={() => toast({ variant: 'info', title: 'Běžná notifikace', content: 'Systém běží jak má.' })}>
        Info Toast
      </Button>
      <Button variant="primary" onClick={() => toast({ variant: 'success', title: 'Výborně!', content: 'Akce proběhla úspěšně.' })}>
        Success Toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: 'error', title: 'Systémová chyba', content: 'Tento toast se sám nezavře, má duration 0.', duration: 0 })}>
        Error (Perzistentní)
      </Button>
      <Button variant="outline" onClick={() => toast({ variant: 'info', title: 'Vlastní ikona', content: 'Do icon prop můžete vložit React Element.', icon: <Student weight="bold" size={24} /> })}>
        Custom Ikona
      </Button>
    </div>
  );
};

export const InteractiveDemo = () => {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  return (
    <div>
      <div style={{ marginBottom: 24, padding: 12, border: '1px solid #444', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <strong>Nastavení Toasteru:</strong>
        <label>
          Pozice:
          <select value={position} onChange={(e) => setPosition(e.target.value as ToastPosition)} style={{ padding: '4px 8px', marginLeft: 8, backgroundColor: '#1a1a1a', color: '#eaeaea', border: '1px solid #444', borderRadius: 4 }}>
            <option value="top-left">top-left</option>
            <option value="top-center">top-center</option>
            <option value="top-right">top-right</option>
            <option value="bottom-left">bottom-left</option>
            <option value="bottom-center">bottom-center</option>
            <option value="bottom-right">bottom-right</option>
          </select>
        </label>
      </div>

      <ToasterProvider position={position} maxToasts={5} offset={24} gap={12}>
        <div style={{ width: '100%', height: 350, fontFamily: 'sans-serif' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Vyzkoušejte si volání useToast()</h3>
          <p style={{ marginBottom: 24, fontSize: 14 }}>
            Klikáním na tlačítka vyvoláváte nová upozornění přes hook. Toaster
            se postará o skládání karet přes sebe.
          </p>
          <ToastDemoComponent />
        </div>
      </ToasterProvider>
    </div>
  );
};
