import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu } from '../components/DropdownMenu';

const meta = {
  title: 'Navigace/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['bottom-left', 'bottom-right'] },
    trigger: { control: false },
    items: { control: false },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const TriggerButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      padding: '8px 16px',
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: '14px',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '8px',
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

export const Default: Story = {
  args: {
    position: 'bottom-left',
    trigger: <TriggerButton>Akce</TriggerButton>,
    items: [
      { label: 'Upravit', onClick: () => console.log('Upravit') },
      { label: 'Duplikovat', onClick: () => console.log('Duplikovat') },
      { label: 'Přesunout', onClick: () => console.log('Přesunout') },
      { label: '', divider: true },
      { label: 'Archivovat', disabled: true },
      { label: 'Smazat', danger: true, onClick: () => console.log('Smazat') },
    ],
  },
};

export const RightAligned: Story = {
  args: {
    position: 'bottom-right',
    trigger: <TriggerButton>Nastavení</TriggerButton>,
    items: [
      { label: 'Profil', onClick: () => console.log('Profil') },
      { label: 'Předvolby', onClick: () => console.log('Předvolby') },
      { label: '', divider: true },
      { label: 'Odhlásit se', danger: true, onClick: () => console.log('Odhlásit') },
    ],
  },
};
