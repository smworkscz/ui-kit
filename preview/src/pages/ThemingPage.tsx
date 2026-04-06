import React from 'react';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, H3, Paragraph, CodeBlock, Code, InfoBox } from './shared';

export const ThemingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <PageLayout>
      <H1>Témování</H1>
      <Paragraph large>
        SMWORKS UI KIT podporuje tmavý a světlý režim. Téma se řídí
        HTML atributem a automaticky reaguje na změny.
      </Paragraph>

      <H2>Jak téma funguje</H2>
      <Paragraph>
        Všechny komponenty používají hook <Code>useTheme()</Code>, který
        detekuje aktuální téma podle následující priority:
      </Paragraph>
      <ol style={{ paddingLeft: 20, lineHeight: '2.2', opacity: 0.8, fontSize: 14 }}>
        <li>Atribut <Code>data-theme</Code> na <Code>&lt;html&gt;</Code> nebo <Code>&lt;body&gt;</Code></li>
        <li>Systémová preference (<Code>prefers-color-scheme</Code>)</li>
        <li>Výchozí hodnota: <Code>'light'</Code></li>
      </ol>

      <H2>Nastavení tématu</H2>
      <Paragraph>
        Nejjednodušší způsob je nastavit atribut na body element:
      </Paragraph>
      <CodeBlock>{`// Tmavý režim
document.body.setAttribute('data-theme', 'dark');

// Světlý režim
document.body.setAttribute('data-theme', 'light');

// Systémová preference (odstraněním atributu)
document.body.removeAttribute('data-theme');`}</CodeBlock>

      <H2>React příklad</H2>
      <Paragraph>
        Typická implementace přepínání tématu v Reactu:
      </Paragraph>
      <CodeBlock>{`type ThemePreference = 'light' | 'dark' | 'system';

function useThemePreference() {
  const [pref, setPref] = useState<ThemePreference>('system');

  useEffect(() => {
    if (pref === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () =>
        document.body.setAttribute(
          'data-theme',
          mq.matches ? 'dark' : 'light'
        );
      apply();
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    document.body.setAttribute('data-theme', pref);
  }, [pref]);

  return [pref, setPref] as const;
}`}</CodeBlock>

      <H2>Hook useTheme</H2>
      <Paragraph>
        Hook <Code>useTheme()</Code> vrací aktuální téma jako string
        a automaticky se aktualizuje při změně:
      </Paragraph>
      <CodeBlock>{`import { useTheme } from 'sm-ui';

function MyComponent() {
  const theme = useTheme(); // 'light' | 'dark'

  return (
    <div style={{
      color: theme === 'dark' ? '#fff' : '#000',
    }}>
      Aktuální téma: {theme}
    </div>
  );
}`}</CodeBlock>

      <InfoBox>
        Hook využívá <Code>MutationObserver</Code> pro sledování změn
        atributu <Code>data-theme</Code> a <Code>matchMedia</Code> listener
        pro systémové preference. Komponenty se automaticky překreslí
        při jakékoliv změně tématu.
      </InfoBox>

      <H2>Vzor inline tokenů</H2>
      <Paragraph>
        Pokud vytváříte vlastní komponenty, doporučujeme stejný vzor
        jako knihovna — inline design tokeny:
      </Paragraph>
      <CodeBlock>{`import { useTheme } from 'sm-ui';

const tokens = {
  dark: {
    bg: 'rgba(24,24,24,0.95)',
    text: '#eaeaea',
    border: 'rgba(255,255,255,0.1)',
  },
  light: {
    bg: 'rgba(255,255,255,0.95)',
    text: '#1a1a1a',
    border: 'rgba(0,0,0,0.08)',
  },
} as const;

function MyCard({ children }) {
  const t = tokens[useTheme()];

  return (
    <div style={{
      backgroundColor: t.bg,
      color: t.text,
      border: \`1px solid \${t.border}\`,
      borderRadius: 12,
      padding: 20,
    }}>
      {children}
    </div>
  );
}`}</CodeBlock>
    </PageLayout>
  );
};
