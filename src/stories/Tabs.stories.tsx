import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs, Tab, TabPanel } from '../components/Tabs';

const meta = {
  title: 'Zobrazení dat/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'pills'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    value: { control: false },
    onChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'underline',
    size: 'md',
    fullWidth: false,
  },
  render: (args) => {
    const [value, setValue] = useState('obecne');
    return (
      <div style={{ width: 400 }}>
        <Tabs {...args} value={value} onChange={setValue}>
          <Tab value="obecne" label="Obecné" />
          <Tab value="pokrocile" label="Pokročilé" />
          <Tab value="zabezpeceni" label="Zabezpečení" />
          <Tab value="zakazane" label="Zakázané" disabled />
          <TabPanel value="obecne">
            <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', margin: 0 }}>
              Obecné nastavení aplikace. Zde můžete upravit základní parametry.
            </p>
          </TabPanel>
          <TabPanel value="pokrocile">
            <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', margin: 0 }}>
              Pokročilé nastavení pro zkušené uživatele.
            </p>
          </TabPanel>
          <TabPanel value="zabezpeceni">
            <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', margin: 0 }}>
              Nastavení zabezpečení a přístupových práv.
            </p>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const Pilulky: Story = {
  name: 'Varianta pilulky',
  args: {
    variant: 'pills',
    size: 'md',
    fullWidth: false,
  },
  render: (args) => {
    const [value, setValue] = useState('prehled');
    return (
      <div style={{ width: 400 }}>
        <Tabs {...args} value={value} onChange={setValue}>
          <Tab value="prehled" label="Přehled" />
          <Tab value="analyza" label="Analýza" />
          <Tab value="export" label="Export" />
          <TabPanel value="prehled">
            <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', margin: 0 }}>
              Přehled všech dat v systému.
            </p>
          </TabPanel>
          <TabPanel value="analyza">
            <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', margin: 0 }}>
              Analytické nástroje a grafy.
            </p>
          </TabPanel>
          <TabPanel value="export">
            <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px', margin: 0 }}>
              Exportujte data ve formátu CSV nebo PDF.
            </p>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};
