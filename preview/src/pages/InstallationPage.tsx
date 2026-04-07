import React, { useState, useCallback } from 'react';
import { SegmentedControl, Alert, useTheme, useToast } from '../../../src';
import { CopySimpleIcon } from '@phosphor-icons/react';
import { PageLayout, H1, H2, H3, Paragraph, Code, InfoBox } from './shared';

// ─── Copy button code block ─────────────────────────────────────────────────

const CopyCodeBlock: React.FC<{ children: string }> = ({ children }) => {
  const theme = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = children;

    // Try modern Clipboard API first (requires user gesture + focus)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        toast({ variant: 'success', title: 'Zkopírováno', duration: 2000 });
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Fallback
        fallbackCopy(text);
        setCopied(true);
        toast({ variant: 'success', title: 'Zkopírováno', duration: 2000 });
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }

    // Direct fallback
    fallbackCopy(text);
    setCopied(true);
    toast({ variant: 'success', title: 'Zkopírováno', duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  }, [children, toast]);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (_) {
      // silent fail
    }
    document.body.removeChild(textarea);
  };

  return (
    <div style={{ position: 'relative', marginTop: 8, marginBottom: 16 }}>
      <pre
        style={{
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: 13,
          lineHeight: 1.6,
          padding: '16px 48px 16px 20px',
          borderRadius: 10,
          backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          overflowX: 'auto',
          margin: 0,
        }}
      >
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Zkopírováno!' : 'Kopírovat'}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          border: '0 none',
          borderStyle: 'none',
          outline: 'none',
          borderRadius: 6,
          backgroundColor: copied
            ? 'rgba(0,162,5,0.15)'
            : theme === 'dark'
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.04)',
          color: copied
            ? '#00A205'
            : theme === 'dark'
              ? 'rgba(255,255,255,0.5)'
              : 'rgba(0,0,0,0.4)',
          cursor: 'pointer',
          transition: 'background-color 0.12s ease, color 0.12s ease',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {copied ? '✓' : <CopySimpleIcon size={14} />}
      </button>
    </div>
  );
};

// ─── Page ───────────────────────────────────────────────────────────────────

export const InstallationPage: React.FC = () => {
  const [pm, setPm] = useState('yarn');

  const installCmd = pm === 'yarn'
    ? 'yarn add @smworks-cz/ui-kit react react-dom @phosphor-icons/react'
    : pm === 'npm'
      ? 'npm install @smworks-cz/ui-kit react react-dom @phosphor-icons/react'
      : 'pnpm add @smworks-cz/ui-kit react react-dom @phosphor-icons/react';

  const installPkgOnly = pm === 'yarn'
    ? 'yarn add @smworks-cz/ui-kit'
    : pm === 'npm'
      ? 'npm install @smworks-cz/ui-kit'
      : 'pnpm add @smworks-cz/ui-kit';

  return (
    <PageLayout>
      <H1>Instalace</H1>
      <Paragraph large>
        Jak nainstalovat a nastavit SMWORKS UI KIT ve vašem projektu.
      </Paragraph>

      <Alert
        variant="warning"
        title="Balíček zatím není dostupný"
      >
        SMWORKS UI KIT je momentálně ve vývoji a není publikován na npm.
        Tato stránka popisuje budoucí způsob instalace.
      </Alert>

      <H2>Instalace balíčku</H2>
      <Paragraph>
        SMWORKS UI KIT je dostupný jako interní npm balíček. Nainstalujte jej spolu
        s peer dependencies:
      </Paragraph>

      <div style={{ marginBottom: 12 }}>
        <SegmentedControl
          data={['yarn', 'npm', 'pnpm']}
          value={pm}
          onChange={setPm}
          size="sm"
        />
      </div>

      <CopyCodeBlock>{installCmd}</CopyCodeBlock>

      <Paragraph>
        Pokud již máte peer dependencies nainstalované, stačí přidat pouze balíček:
      </Paragraph>

      <CopyCodeBlock>{installPkgOnly}</CopyCodeBlock>

      <H2>Peer dependencies</H2>
      <Paragraph>
        SMWORKS UI KIT vyžaduje následující peer dependencies, které musí být
        nainstalovány ve vašem projektu:
      </Paragraph>
      <ul style={{ paddingLeft: 20, lineHeight: '2.2', opacity: 0.8, fontSize: 14 }}>
        <li><Code>react</Code> &ge; 18.0.0</li>
        <li><Code>react-dom</Code> &ge; 18.0.0</li>
        <li><Code>@phosphor-icons/react</Code> &ge; 2.1.0</li>
      </ul>

      <H2>Fonty</H2>
      <Paragraph>
        Knihovna používá fonty <strong>Zalando Sans</strong> a{' '}
        <strong>Zalando Sans Expanded</strong>. Tyto fonty jsou součástí
        distribuce a musí být načteny ve vaší aplikaci.
      </Paragraph>

      <H3>Import fontů</H3>
      <Paragraph>
        Nejjednodušší způsob je importovat CSS soubor s font-face deklaracemi:
      </Paragraph>
      <CopyCodeBlock>{`import '@smworks-cz/ui-kit/dist/fonts/fonts.css';`}</CopyCodeBlock>

      <InfoBox>
        Pokud váš bundler nepodporuje CSS importy, můžete fonty načíst
        manuálně z <Code>node_modules/@smworks-cz/ui-kit/dist/fonts/</Code>.
      </InfoBox>

      <H2>TypeScript</H2>
      <Paragraph>
        SMWORKS UI KIT je napsán v TypeScriptu a typové definice jsou součástí
        balíčku. Není potřeba instalovat žádné <Code>@types</Code> balíčky.
      </Paragraph>
      <CopyCodeBlock>{`// tsconfig.json — žádná speciální konfigurace není potřeba
{
  "compilerOptions": {
    "moduleResolution": "bundler", // nebo "node"
    "jsx": "react-jsx"
  }
}`}</CopyCodeBlock>

      <H2>Struktura výstupu</H2>
      <Paragraph>
        Balíček poskytuje dual-format výstup pro maximální kompatibilitu:
      </Paragraph>
      <CopyCodeBlock>{`@smworks-cz/ui-kit/dist/
├── index.js      # CommonJS (require)
├── index.mjs     # ES Modules (import)
└── index.d.ts    # TypeScript definice`}</CopyCodeBlock>
    </PageLayout>
  );
};
