import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../components/Stack';

const meta = {
  title: 'Utility/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    padding: '12px 20px',
    backgroundColor: 'rgba(232,97,45,0.15)',
    border: '1px solid #E8612D',
    borderRadius: 6,
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: 14,
  }}>
    {children}
  </div>
);

export const Default: Story = {
  args: {
    direction: 'column',
    gap: 12,
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Prvek 1</Box>
      <Box>Prvek 2</Box>
      <Box>Prvek 3</Box>
    </Stack>
  ),
};

export const Řádkový: Story = {
  name: 'Řádkový',
  args: {
    direction: 'row',
    gap: 12,
    align: 'center',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Akce A</Box>
      <Box>Akce B</Box>
      <Box>Akce C</Box>
    </Stack>
  ),
};

export const CeláŠířka: Story = {
  name: 'Celá šířka s mezerami',
  args: {
    direction: 'row',
    gap: 16,
    justify: 'between',
    fullWidth: true,
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Vlevo</Box>
      <Box>Uprostřed</Box>
      <Box>Vpravo</Box>
    </Stack>
  ),
};
