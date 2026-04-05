import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar, ProgressCircle } from '../components/Progress';

// ─── ProgressBar ─────────────────────────────────────────────────────────────

const barMeta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default barMeta;
type BarStory = StoryObj<typeof barMeta>;

export const Default: BarStory = {
  args: {
    value: 45,
    showValue: true,
    label: 'Nahrávání',
  },
};

export const Pruhovaný: BarStory = {
  name: 'Pruhovaný s animací',
  args: {
    value: 70,
    size: 'lg',
    striped: true,
    animated: true,
    showValue: true,
    label: 'Zpracování dat',
  },
};

export const Malý: BarStory = {
  name: 'Malý',
  args: {
    value: 30,
    size: 'sm',
  },
};

export const VlastníBarva: BarStory = {
  name: 'Vlastní barva',
  args: {
    value: 90,
    color: '#00A205',
    showValue: true,
    label: 'Dokončeno',
  },
};
