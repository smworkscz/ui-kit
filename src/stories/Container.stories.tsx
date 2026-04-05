import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../components/Container';

const meta = {
  title: 'Utility/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxWidth: 'lg',
    padding: 16,
    centered: true,
  },
  render: (args) => (
    <Container {...args}>
      <div style={{
        padding: 24,
        backgroundColor: 'rgba(232,97,45,0.1)',
        border: '1px dashed #E8612D',
        borderRadius: 8,
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: 14,
      }}>
        <h3 style={{ margin: '0 0 8px', fontFamily: "'Zalando Sans Expanded', sans-serif" }}>
          Obsah kontejneru
        </h3>
        <p style={{ margin: 0 }}>
          Tento kontejner má maximální šířku 1024 px a je vycentrovaný na stránce.
          Změňte šířku okna prohlížeče pro pozorování responzivního chování.
        </p>
      </div>
    </Container>
  ),
};

export const MalýKontejner: Story = {
  name: 'Malý kontejner (sm)',
  args: {
    maxWidth: 'sm',
    padding: 24,
    centered: true,
  },
  render: (args) => (
    <Container {...args}>
      <div style={{
        padding: 24,
        backgroundColor: 'rgba(232,97,45,0.1)',
        border: '1px dashed #E8612D',
        borderRadius: 8,
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: 14,
        textAlign: 'center',
      }}>
        Úzký kontejner (640 px) — vhodný pro formuláře a přihlášení.
      </div>
    </Container>
  ),
};
