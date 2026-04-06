import React from 'react';
import { useToast, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, CodeBlock, Code, PropsTable, InfoBox } from './shared';
import type { PropDef } from './shared';

const returnDefs: PropDef[] = [
  { name: 'toast', type: '(options: ToastOptions) => string', description: 'Vyvolá notifikaci. Vrací ID pro ruční zavření.' },
  { name: 'dismiss', type: '(id: string) => void', description: 'Ručně zavře notifikaci podle ID.' },
];

const optionsDefs: PropDef[] = [
  { name: 'variant', type: "'info' | 'success' | 'error'", defaultValue: "'info'", description: 'Typ notifikace.' },
  { name: 'title', type: 'string', required: true, description: 'Nadpis notifikace.' },
  { name: 'content', type: 'string', description: 'Volitelný popis pod nadpisem.' },
  { name: 'icon', type: 'ReactNode', description: 'Vlastní ikona.' },
  { name: 'duration', type: 'number', defaultValue: '4000', description: 'Auto-zavření v ms (0 = trvale).' },
];

const ToastDemo: React.FC = () => {
  const { toast, dismiss } = useToast();

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
      <Button size="sm" onClick={() => toast({ variant: 'info', title: 'Informace', content: 'Toto je informační zpráva.' })}>
        Info
      </Button>
      <Button size="sm" onClick={() => toast({ variant: 'success', title: 'Uloženo', content: 'Změny byly úspěšně uloženy.' })}>
        Success
      </Button>
      <Button size="sm" onClick={() => toast({ variant: 'error', title: 'Chyba', content: 'Nastala neočekávaná chyba.' })}>
        Error
      </Button>
      <Button size="sm" variant="outline" onClick={() => {
        const id = toast({ variant: 'info', title: 'Trvalá notifikace', content: 'Tuto musíte zavřít ručně.', duration: 0 });
        setTimeout(() => dismiss(id), 5000);
      }}>
        Trvalá (5s dismiss)
      </Button>
    </div>
  );
};

export const UseToastPage: React.FC = () => (
  <PageLayout>
    <H1>useToast</H1>
    <Paragraph large>
      Hook pro vyvolání toast notifikací. Vrací funkce <Code>toast()</Code> a <Code>dismiss()</Code>.
      Vyžaduje <Code>ToasterProvider</Code> v kořeni aplikace.
    </Paragraph>

    <H2>Živá ukázka</H2>
    <ToastDemo />

    <H2>Nastavení</H2>
    <Paragraph>
      Nejprve obalte kořen aplikace v <Code>ToasterProvider</Code>:
    </Paragraph>
    <CodeBlock>{`import { ToasterProvider } from 'sm-ui';

function App() {
  return (
    <ToasterProvider position="bottom-right" duration={4000}>
      <MyApp />
    </ToasterProvider>
  );
}`}</CodeBlock>

    <H2>Použití</H2>
    <CodeBlock>{`import { useToast, Button } from 'sm-ui';

function SaveButton() {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast({
        variant: 'success',
        title: 'Uloženo',
        content: 'Změny byly úspěšně uloženy.',
      });
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Chyba při ukládání',
        content: err.message,
      });
    }
  };

  return <Button onClick={handleSave}>Uložit</Button>;
}`}</CodeBlock>

    <H2>Ruční zavření</H2>
    <Paragraph>
      Funkce <Code>toast()</Code> vrací ID, které lze použít pro ruční zavření:
    </Paragraph>
    <CodeBlock>{`const { toast, dismiss } = useToast();

// Zobrazit trvalou notifikaci
const id = toast({
  variant: 'info',
  title: 'Načítání...',
  duration: 0, // 0 = nezavře se automaticky
});

// Po dokončení práce zavřít
await doWork();
dismiss(id);`}</CodeBlock>

    <InfoBox>
      Hook musí být volán uvnitř stromu <Code>&lt;ToasterProvider&gt;</Code>.
      Při volání mimo provider vyhodí chybu.
    </InfoBox>

    <H2>Návratová hodnota</H2>
    <PropsTable props={returnDefs} />

    <H2>ToastOptions</H2>
    <PropsTable props={optionsDefs} />
  </PageLayout>
);
