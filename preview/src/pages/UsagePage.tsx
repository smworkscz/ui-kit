import React from 'react';
import { PageLayout, H1, H2, H3, Paragraph, CodeBlock, Code, InfoBox } from './shared';

export const UsagePage: React.FC = () => (
  <PageLayout>
    <H1>Použití</H1>
    <Paragraph large>
      Jak používat SMWORKS UI KIT komponenty ve vašem projektu.
    </Paragraph>

    <H2>Import komponent</H2>
    <Paragraph>
      Všechny komponenty se importují z hlavního barrel exportu.
      Díky tree-shakingu se do výsledného bundle zahrnou pouze
      použité komponenty.
    </Paragraph>
    <CodeBlock>{`import { Button, Input, Modal } from '@smworks-cz/ui-kit';`}</CodeBlock>

    <H2>Základní příklad</H2>
    <Paragraph>
      Jednoduchý formulář s tlačítkem a textovým vstupem:
    </Paragraph>
    <CodeBlock>{`import { Button, Input } from '@smworks-cz/ui-kit';

function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <form>
      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vas@email.cz"
      />
      <Button type="submit">
        Přihlásit se
      </Button>
    </form>
  );
}`}</CodeBlock>

    <H2>Varianty a velikosti</H2>
    <Paragraph>
      Většina komponent podporuje <Code>variant</Code> a <Code>size</Code> prop
      pro přizpůsobení vzhledu:
    </Paragraph>
    <CodeBlock>{`// Varianty tlačítka
<Button variant="primary">Primární</Button>
<Button variant="secondary">Sekundární</Button>
<Button variant="outline">Obrysové</Button>

// Velikosti
<Button size="sm">Malé</Button>
<Button size="md">Střední</Button>
<Button size="lg">Velké</Button>

// Velikosti inputu
<Input size="sm" placeholder="Malý" />
<Input size="md" placeholder="Střední" />
<Input size="lg" placeholder="Velký" />`}</CodeBlock>

    <H2>Ikony</H2>
    <Paragraph>
      Komponenty podporující ikony přijímají jakýkoliv React node.
      Doporučujeme používat <Code>@phosphor-icons/react</Code>:
    </Paragraph>
    <CodeBlock>{`import { MagnifyingGlass, Plus } from '@phosphor-icons/react';

<Button icon={<Plus size={16} />}>
  Přidat
</Button>

<Input
  icon={<MagnifyingGlass size={16} />}
  placeholder="Hledat..."
/>`}</CodeBlock>

    <H2>Toast notifikace</H2>
    <Paragraph>
      Pro zobrazení toast notifikací obalte aplikaci
      v <Code>ToasterProvider</Code> a použijte hook <Code>useToast</Code>:
    </Paragraph>
    <CodeBlock>{`import { ToasterProvider, useToast, Button } from '@smworks-cz/ui-kit';

// V kořeni aplikace
function App() {
  return (
    <ToasterProvider position="bottom-right">
      <MyApp />
    </ToasterProvider>
  );
}

// Kdekoliv uvnitř
function MyComponent() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({
      variant: 'success',
      title: 'Uloženo',
      content: 'Změny byly úspěšně uloženy.',
    })}>
      Uložit
    </Button>
  );
}`}</CodeBlock>

    <H2>Modální okna</H2>
    <Paragraph>
      Modály a drawery jsou řízené komponenty — předáváte <Code>open</Code> stav
      a <Code>onClose</Code> callback:
    </Paragraph>
    <CodeBlock>{`import { Modal, Button } from '@smworks-cz/ui-kit';

function MyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Otevřít dialog
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Potvrzení"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Zrušit
            </Button>
            <Button onClick={() => setOpen(false)}>
              Potvrdit
            </Button>
          </>
        }
      >
        <p>Opravdu chcete pokračovat?</p>
      </Modal>
    </>
  );
}`}</CodeBlock>

    <InfoBox>
      Všechny overlay komponenty (Modal, Drawer, Spotlight, DropdownMenu)
      se vykreslují přes React portál do <Code>document.body</Code>.
    </InfoBox>
  </PageLayout>
);
