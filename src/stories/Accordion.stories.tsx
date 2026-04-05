import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from '../components/Accordion';

const meta = {
  title: 'Zobrazení dat/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    multiple: false,
  },
  render: (args) => (
    <div style={{ width: 400 }}>
      <Accordion {...args}>
        <AccordionItem title="Co je SM-UI?">
          SM-UI je knihovna React komponent vytvořená pro design systém SMWORKS.
          Podporuje tmavý a světlý režim, vlastní fonty a jednotné tokeny.
        </AccordionItem>
        <AccordionItem title="Jak nainstalovat?">
          Nainstalujte balíček pomocí příkazu: yarn add sm-ui. Poté importujte
          požadované komponenty do vašeho projektu.
        </AccordionItem>
        <AccordionItem title="Jaké jsou požadavky?">
          SM-UI vyžaduje React 18 nebo novější a podporuje TypeScript.
          Fonty Zalando Sans musí být načteny zvlášť.
        </AccordionItem>
        <AccordionItem title="Zakázaná sekce" disabled>
          Tento obsah je momentálně nedostupný.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const ViceOtevreni: Story = {
  name: 'Více současně',
  args: {
    multiple: true,
  },
  render: (args) => (
    <div style={{ width: 400 }}>
      <Accordion {...args}>
        <AccordionItem title="Sekce A" defaultOpen>
          Obsah sekce A je výchozně otevřený.
        </AccordionItem>
        <AccordionItem title="Sekce B">
          Obsah sekce B.
        </AccordionItem>
        <AccordionItem title="Sekce C" defaultOpen>
          Obsah sekce C je také výchozně otevřený.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
