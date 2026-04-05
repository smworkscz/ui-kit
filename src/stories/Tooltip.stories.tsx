import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from '../components/Tooltip';

const meta = {
  title: 'Zobrazení dat/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: { control: 'number' },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Uložit změny',
    position: 'top',
    delay: 200,
  },
  render: (args) => (
    <Tooltip {...args}>
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
        Najeďte myší
      </button>
    </Tooltip>
  ),
};
