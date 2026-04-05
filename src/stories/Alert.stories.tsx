import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Alert } from '../components/Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'info',
    title: 'Informace',
    children: 'Toto je informační zpráva pro uživatele.',
  },
};

export const Uspech: Story = {
  name: 'Úspěch',
  args: {
    variant: 'success',
    title: 'Uloženo',
    children: 'Změny byly úspěšně uloženy do databáze.',
  },
};

export const Varovani: Story = {
  name: 'Varování',
  args: {
    variant: 'warning',
    title: 'Pozor',
    children: 'Tato akce je nevratná. Ujistěte se, že chcete pokračovat.',
  },
};

export const Chyba: Story = {
  args: {
    variant: 'error',
    title: 'Chyba',
    children: 'Při ukládání dat došlo k neočekávané chybě.',
    closable: true,
    onClose: fn(),
  },
};

export const BezPopisku: Story = {
  name: 'Bez popisku',
  args: {
    variant: 'info',
    title: 'Krátké upozornění bez dalšího popisu.',
  },
};

export const Zavřitelný: Story = {
  name: 'Zavřitelný',
  args: {
    variant: 'success',
    title: 'Operace dokončena',
    children: 'Klikněte na křížek pro zavření tohoto upozornění.',
    closable: true,
    onClose: fn(),
  },
};
