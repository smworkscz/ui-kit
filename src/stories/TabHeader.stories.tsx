import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TabHeader, TabSubheader, TabHeaderButton, SubtabHeader } from '../components/TabHeader';

const meta = {
  title: 'Components/TabHeader',
  component: TabHeader,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#ffffff' }, { name: 'dark', value: '#1a1a1a' }],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Nastavení' }
};

export const WithClose: Story = {
  args: { title: 'Uživatelé', onClose: fn() }
};

export const SubheaderExample = () => (
  <div style={{ width: 400 }}>
    <TabSubheader title="Filtry" onClose={fn()} />
  </div>
);

export const HeaderWithButtons = () => (
  <div style={{ width: 400 }}>
    <TabHeaderButton title="Sekce webu" onAdd={fn()} onClose={fn()} />
  </div>
);

export const SubtabHeaderExample = () => (
  <div style={{ width: 400 }}>
    <SubtabHeader title="Detail položky" onClose={fn()} />
  </div>
);
