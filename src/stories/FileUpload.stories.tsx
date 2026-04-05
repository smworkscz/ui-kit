import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from '../components/FileUpload';

const meta = {
  title: 'Formuláře/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxSize: { control: 'number' },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Přílohy',
    helperText: 'Podporované formáty: obrázky, PDF. Max. 5 MB.',
    accept: 'image/*,.pdf',
    multiple: true,
    maxSize: 5 * 1024 * 1024,
  },
  render: (args) => (
    <div style={{ width: 400 }}>
      <FileUpload
        {...args}
        onFiles={(files) => console.log('Nahrané soubory:', files)}
      />
    </div>
  ),
};
