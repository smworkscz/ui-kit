import type { Meta, StoryObj } from '@storybook/react-vite';
import logoText from './assets/logo-text.svg';
import logo from './assets/logo.svg';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const accent = '#E8612D';
const muted = '#888';
const border = '#2a2a2a';
const codeBg = '#111';
const codeColor = '#ccc';
const cardBg = 'rgba(255,255,255,0.03)';
const cardBorder = 'rgba(255,255,255,0.06)';

const heading = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "'Zalando Sans Expanded', sans-serif",
  fontWeight: 600,
  margin: 0,
  ...extra,
});

const Code: React.FC<{ children: string }> = ({ children }) => (
  <code style={{
    backgroundColor: '#2a2a2a',
    padding: '2px 7px',
    borderRadius: 4,
    fontSize: '0.85em',
    fontFamily: 'monospace',
    color: '#eaeaea',
  }}>
    {children}
  </code>
);

const Badge: React.FC<{ children: string; color?: string }> = ({ children, color = accent }) => (
  <span style={{
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 600,
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#fff',
    backgroundColor: color,
    borderRadius: '4px',
    padding: '3px 8px',
    lineHeight: 1,
  }}>
    {children}
  </span>
);

// ─── Component card ──────────────────────────────────────────────────────────

interface ComponentCardProps {
  name: string;
  description: string;
  status?: 'stable' | 'beta' | 'new';
}

const statusColors = { stable: '#2ea043', beta: '#d29922', new: accent };
const statusLabels = { stable: 'Stable', beta: 'Beta', new: 'Nové' };

const ComponentCard: React.FC<ComponentCardProps> = ({ name, description, status = 'stable' }) => (
  <div style={{
    backgroundColor: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'border-color 0.15s ease',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: "'Zalando Sans Expanded', sans-serif", fontWeight: 600, fontSize: '15px' }}>
        {name}
      </span>
      <Badge color={statusColors[status]}>{statusLabels[status]}</Badge>
    </div>
    <span style={{ fontSize: '13px', color: muted, lineHeight: 1.5 }}>
      {description}
    </span>
  </div>
);

// ─── Intro page ──────────────────────────────────────────────────────────────

const IntroductionContent = () => (
  <div style={{
    fontFamily: "'Zalando Sans', sans-serif",
    lineHeight: 1.6,
    padding: '48px 40px 40px',
    maxWidth: '860px',
    margin: '0 auto',
    boxSizing: 'border-box',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#eaeaea',
  }}>

    {/* ── Hero ── */}
    <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <img src={logoText} alt="SMWORKS" style={{ height: 28 }} />
      <h1 style={heading({ fontSize: '32px', lineHeight: 1.2 })}>
        UI Design System
      </h1>
      <p style={{ margin: 0, fontSize: '16px', color: muted, maxWidth: 560 }}>
        Interaktivní knihovna React komponent pro všechny aplikace SMWORKS.
        Každá komponenta podporuje dark / light režim, je plně typovaná
        a připravená k použití přes <Code>sm-ui</Code>.
      </p>
    </div>

    {/* ── Quick info ── */}
    <div style={{
      display: 'flex',
      gap: '24px',
      flexWrap: 'wrap',
      marginBottom: 40,
    }}>
      {[
        ['Framework', 'React 18+'],
        ['Typování', 'TypeScript'],
        ['Ikony', 'Phosphor Icons'],
        ['Témata', 'Dark & Light'],
      ].map(([label, val]) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: '10px', fontFamily: "'Zalando Sans Expanded', sans-serif", textTransform: 'uppercase', color: muted, letterSpacing: '0.5px' }}>
            {label}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{val}</span>
        </div>
      ))}
    </div>

    {/* ── Instalace ── */}
    <section style={{ marginBottom: 40 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 16 })}>Instalace</h2>
      <pre style={{
        backgroundColor: codeBg,
        color: codeColor,
        padding: '14px 18px',
        borderRadius: 8,
        fontSize: 13,
        overflowX: 'auto',
        border: `1px solid ${border}`,
        margin: 0,
      }}>
{`yarn add sm-ui`}
      </pre>
    </section>

    {/* ── Základní použití ── */}
    <section style={{ marginBottom: 40 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 8 })}>Základní použití</h2>
      <p style={{ margin: '0 0 12px', color: muted, fontSize: 14 }}>
        Obalte root vaší aplikace pomocí <Code>ToasterProvider</Code> pro funkčnost notifikací:
      </p>
      <pre style={{
        backgroundColor: codeBg,
        color: codeColor,
        padding: '14px 18px',
        borderRadius: 8,
        fontSize: 13,
        overflowX: 'auto',
        border: `1px solid ${border}`,
        margin: 0,
      }}>
{`import { ToasterProvider } from 'sm-ui';

function App() {
  return (
    <ToasterProvider position="bottom-right" maxToasts={5}>
      <MainLayout />
    </ToasterProvider>
  );
}`}
      </pre>
    </section>

    {/* ── Formuláře ── */}
    <section style={{ marginBottom: 32 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 16 })}>Formuláře</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
        <ComponentCard name="Button" description="Tlačítka ve variantách primary, secondary a outline s podporou ikon a loading stavu." />
        <ComponentCard name="Input" description="Textová pole s label, ikonami, clearable, password toggle a velikostmi." />
        <ComponentCard name="Select" description="Rozbalovací výběr — single, multi, searchable, clearable." />
        <ComponentCard name="DatePicker" description="Výběr data, rozsahu a času s chytrým pozicováním." status="new" />
        <ComponentCard name="Checkbox" description="Zaškrtávací pole s podporou skupin a indeterminate stavu." status="new" />
        <ComponentCard name="Radio" description="Přepínací tlačítka se skupinovou logikou." status="new" />
        <ComponentCard name="Switch" description="Přepínač on/off s volitelným popiskem." status="new" />
        <ComponentCard name="Textarea" description="Víceřádkové textové pole s auto-resize." status="new" />
        <ComponentCard name="Slider" description="Posuvník pro výběr číselné hodnoty nebo rozsahu." status="new" />
        <ComponentCard name="FileUpload" description="Nahrávání souborů s drag & drop a náhledem." status="new" />
      </div>
    </section>

    {/* ── Zobrazení dat ── */}
    <section style={{ marginBottom: 32 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 16 })}>Zobrazení dat</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
        <ComponentCard name="Table" description="Datová tabulka s řazením, výběrem řádků a stránkováním." status="new" />
        <ComponentCard name="Card" description="Karta s hlavičkou, obsahem a patičkou." status="new" />
        <ComponentCard name="Accordion" description="Rozbalovací sekce s animací." status="new" />
        <ComponentCard name="Tabs" description="Záložkové rozhraní pro přepínání obsahu." status="new" />
        <ComponentCard name="Tooltip" description="Kontextová nápověda při hoveru." status="new" />
        <ComponentCard name="Popover" description="Vyskakovací panel s libovolným obsahem." status="new" />
        <ComponentCard name="Skeleton" description="Zástupné tvary pro loading stav." status="new" />
        <ComponentCard name="EmptyState" description="Prázdný stav s ikonou, textem a akcí." status="new" />
        <ComponentCard name="Stat" description="Statistická karta s hodnotou, trendem a popiskem." status="new" />
        <ComponentCard name="Avatar" description="Iniciály a profilovky s možností vlastní velikosti a tvaru." />
        <ComponentCard name="Tag & Badge" description="Štítky, stavové badges a editovatelné tag položky." />
      </div>
    </section>

    {/* ── Navigace & layout ── */}
    <section style={{ marginBottom: 32 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 16 })}>Navigace & layout</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
        <ComponentCard name="Modal" description="Modální dialog s overlay a animací." status="new" />
        <ComponentCard name="Drawer" description="Vysuvný panel ze strany obrazovky." status="new" />
        <ComponentCard name="Breadcrumb" description="Drobečková navigace s oddělovačem." status="new" />
        <ComponentCard name="Pagination" description="Stránkování s číslovanými stránkami a šipkami." status="new" />
        <ComponentCard name="Stepper" description="Krokový indikátor průběhu." status="new" />
        <ComponentCard name="DropdownMenu" description="Kontextové menu s položkami, oddělovači a klávesovou navigací." status="new" />
        <ComponentCard name="Link" description="Navigační a akční odkazy včetně danger varianty." />
      </div>
    </section>

    {/* ── Feedback ── */}
    <section style={{ marginBottom: 32 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 16 })}>Feedback</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
        <ComponentCard name="Toast" description="Systémové notifikace s ToasterProviderem pro chytré vrstvení." />
        <ComponentCard name="Alert" description="Informační, varovné a chybové bannery." status="new" />
        <ComponentCard name="Progress" description="Lineární a kruhový ukazatel průběhu." status="new" />
        <ComponentCard name="Spinner" description="Animovaný indikátor načítání." status="new" />
      </div>
    </section>

    {/* ── Utility ── */}
    <section style={{ marginBottom: 40 }}>
      <h2 style={heading({ fontSize: '20px', marginBottom: 16 })}>Utility</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
        <ComponentCard name="Divider" description="Horizontální nebo vertikální oddělovač." status="new" />
        <ComponentCard name="Stack" description="Flexbox layout s nastavitelným směrem a mezerami." status="new" />
        <ComponentCard name="Container" description="Responzivní obalovací kontejner s max-width." status="new" />
        <ComponentCard name="DragList" description="Přetahovací seznam s drag & drop a volitelnou stromovou strukturou." status="new" />
      </div>
    </section>

    {/* ── Footer ── */}
    <footer style={{
      paddingTop: 20,
      borderTop: `1px solid ${border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{ color: muted, fontSize: 12 }}>
        &copy; {new Date().getFullYear()} Daniel Cvejn, SMWORKS
      </span>
      <img src={logo} alt="SMWORKS" style={{ height: 16, opacity: 0.3 }} />
    </footer>
  </div>
);

// ─── Story ───────────────────────────────────────────────────────────────────

const meta = {
  title: 'Úvod',
  component: IntroductionContent,
  parameters: {
    layout: 'fullscreen',
    options: {
      showPanel: false,
    },
  },
} satisfies Meta<typeof IntroductionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  name: 'Dokumentace',
};
