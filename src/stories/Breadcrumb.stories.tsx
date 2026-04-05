import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from '../components/Breadcrumb';

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7L7 2.5L12 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6V11.5H10.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 4V11H12V5H7L5.5 3.5H2V4Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: 'Navigace/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: false },
    separator: { control: false },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Domů', href: '#', icon: <HomeIcon /> },
      { label: 'Projekty', href: '#', icon: <FolderIcon /> },
      { label: 'SM-UI', href: '#' },
      { label: 'Komponenty' },
    ],
    separator: <ChevronIcon />,
  },
};

export const TextSeparator: Story = {
  name: 'Textový oddělovač',
  args: {
    items: [
      { label: 'Administrace', href: '#' },
      { label: 'Uživatelé', href: '#' },
      { label: 'Detail uživatele' },
    ],
    separator: '/',
  },
};
