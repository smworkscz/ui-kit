import type { Meta, StoryObj } from '@storybook/react-vite';

const IntroductionContent = () => (
  <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ marginBottom: 12 }}>SMWORKS – UI Design System</h1>

    <p>Vítejte v interaktivní knihovně webových React komponent od <strong>SMWORKS</strong>.</p>

    <h2 style={{ marginTop: 32, marginBottom: 12, borderBottom: '1px solid #eaeaea', paddingBottom: 8 }}>Seznam komponent</h2>

    <p>
      V levém menu naleznete všechny základní stavební kameny pro aplikace SMWORKS. Každá komponenta obsahuje sadu <i>příběhů (stories)</i>, na kterých si můžete interaktivně vyzkoušet varianty, stavy (včetně Light/Dark režimů) a plynule přizpůsobovat jejich vlastnosti.
    </p>

    <ul style={{ paddingLeft: 24, marginTop: 16 }}>
      <li style={{ marginBottom: 6 }}><strong>Avatar</strong> – Uživatelské iniciály a profilovky.</li>
      <li style={{ marginBottom: 6 }}><strong>Button</strong> – Veškerá tlačítka a linky.</li>
      <li style={{ marginBottom: 6 }}><strong>Input</strong> – Formulářová textová pole a jejich obálky.</li>
      <li style={{ marginBottom: 6 }}><strong>Link</strong> – Akční a navigační odkazy včetně <i>danger</i> stavu.</li>
      <li style={{ marginBottom: 6 }}><strong>TabHeader</strong> – Komplexní hlavičky tabů, kontejnerů a oken.</li>
      <li style={{ marginBottom: 6 }}><strong>Tag &amp; Badge</strong> – Štítky a stavové badges.</li>
      <li style={{ marginBottom: 6 }}><strong>Toast</strong> – Systémové notifikace včetně reálného <code>ToasterProvider</code>u pro chytré vrstvení.</li>
    </ul>

    <h2 style={{ marginTop: 32, marginBottom: 12, borderBottom: '1px solid #eaeaea', paddingBottom: 8 }}>Iniciální nastavení v projektu</h2>

    <p>Napříč jakoukoliv vaší React aplikací nezapomeňte obalit hlavní root kontejner pomocí vizualizačního providera pro plnou funkčnost notifikací:</p>

    <pre style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 8, overflowX: 'auto', marginTop: 12, fontSize: 14 }}>
      {`import { ToasterProvider } from 'sm-ui';

function App() {
  return (
    <ToasterProvider position="bottom-right" maxToasts={5}>
      <MainLayout />
    </ToasterProvider>
  );
}`}
    </pre>

    <p style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #eaeaea', color: '#666', fontSize: 13 }}>
      &copy; {new Date().getFullYear()} Daniel Cvejn, SMWORKS.
    </p>
  </div>
);

const meta = {
  title: 'Úvod',
  component: IntroductionContent,
  parameters: {
    layout: 'fullscreen',
    options: {
      showPanel: false, // Skryje dolní panel Controls, aby stránka vypadala jako dokumentace
    },
  },
} satisfies Meta<typeof IntroductionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  name: 'Dokumentace',
};
