import React from 'react';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, Paragraph, CodeBlock, Code, PropsTable, InfoBox } from './shared';
import type { PropDef } from './shared';

const returnDefs: PropDef[] = [
  { name: 'theme', type: "'light' | 'dark'", description: 'Aktuální téma aplikace.' },
];

export const UseThemePage: React.FC = () => {
  const theme = useTheme();

  return (
    <PageLayout>
      <H1>useTheme</H1>
      <Paragraph large>
        Hook pro detekci aktuálního tématu. Vrací <Code>'light'</Code> nebo <Code>'dark'</Code> a
        automaticky se aktualizuje při změně.
      </Paragraph>

      <H2>Živá ukázka</H2>
      <div
        style={{
          padding: '20px 24px',
          borderRadius: 10,
          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          fontFamily: "'SF Mono', monospace",
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        useTheme() → <strong style={{ color: '#FC4F00' }}>'{theme}'</strong>
      </div>

      <H2>Použití</H2>
      <CodeBlock>{`import { useTheme } from 'sm-ui';

function MyComponent() {
  const theme = useTheme(); // 'light' | 'dark'

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    }}>
      Aktuální téma: {theme}
    </div>
  );
}`}</CodeBlock>

      <H2>Detekce tématu</H2>
      <Paragraph>
        Hook zjišťuje téma v následujícím pořadí priority:
      </Paragraph>
      <ol style={{ paddingLeft: 20, lineHeight: '2.2', opacity: 0.8, fontSize: 14 }}>
        <li>Atribut <Code>data-theme</Code> na <Code>&lt;html&gt;</Code> nebo <Code>&lt;body&gt;</Code></li>
        <li>Systémová preference (<Code>prefers-color-scheme</Code>)</li>
        <li>Výchozí hodnota: <Code>'light'</Code></li>
      </ol>

      <H2>Reaktivita</H2>
      <InfoBox>
        Hook využívá <Code>MutationObserver</Code> pro sledování změn
        atributu <Code>data-theme</Code> a <Code>matchMedia</Code> listener
        pro systémové preference. Komponenty se automaticky překreslí
        při jakékoliv změně.
      </InfoBox>

      <H2>Inline tokeny</H2>
      <Paragraph>
        Doporučený vzor pro vlastní komponenty — definujte tokeny pro obě témata:
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
    }}>
      {children}
    </div>
  );
}`}</CodeBlock>

      <H2>Návratová hodnota</H2>
      <PropsTable props={returnDefs} />
    </PageLayout>
  );
};
