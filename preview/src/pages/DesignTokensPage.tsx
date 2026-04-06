import React from 'react';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, H3, Paragraph, Code, InfoBox } from './shared';

// ─── Color swatch ───────────────────────────────────────────────────────────

const Swatch: React.FC<{ color: string; label: string; value: string }> = ({ color, label, value }) => {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          backgroundColor: color,
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, opacity: 0.5, fontFamily: "'SF Mono', monospace" }}>{value}</div>
      </div>
    </div>
  );
};

// ─── Token table ────────────────────────────────────────────────────────────

const TokenRow: React.FC<{ token: string; value: string; desc: string }> = ({ token, value, desc }) => {
  const theme = useTheme();
  return (
    <tr>
      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        <Code>{token}</Code>
      </td>
      <td style={{ padding: '8px 12px', fontFamily: "'SF Mono', monospace", fontSize: 12, opacity: 0.7, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        {value}
      </td>
      <td style={{ padding: '8px 12px', fontSize: 13, opacity: 0.6, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
        {desc}
      </td>
    </tr>
  );
};

export const DesignTokensPage: React.FC = () => {
  const theme = useTheme();

  return (
    <PageLayout>
      <H1>Design tokeny</H1>
      <Paragraph large>
        Přehled všech barev, typografie, efektů a rozměrů používaných
        v SMWORKS UI KIT komponentách.
      </Paragraph>

      <H2>Barvy — primární</H2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8, marginBottom: 16 }}>
        <Swatch color="#FC4F00" label="Primary" value="#FC4F00" />
        <Swatch color="#FF6D2A" label="Primary Hover" value="#FF6D2A" />
        <Swatch color="#E8612D" label="Accent" value="#E8612D" />
      </div>

      <H2>Barvy — sémantické</H2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8, marginBottom: 16 }}>
        <Swatch color="#EF3838" label="Error" value="#EF3838" />
        <Swatch color="#00A205" label="Success" value="#00A205" />
      </div>

      <H2>Barvy — neutrální (tmavý režim)</H2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8, marginBottom: 16 }}>
        <Swatch color="#1a1a1a" label="Background" value="#1a1a1a" />
        <Swatch color="#ffffff" label="Text Primary" value="#ffffff" />
        <Swatch color="#eaeaea" label="Text Secondary" value="#eaeaea" />
        <Swatch color="#888888" label="Text Muted" value="#888888" />
      </div>

      <H2>Barvy — neutrální (světlý režim)</H2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8, marginBottom: 16 }}>
        <Swatch color="#ffffff" label="Background" value="#ffffff" />
        <Swatch color="#1a1a1a" label="Text Primary" value="#1a1a1a" />
        <Swatch color="#333333" label="Text Secondary" value="#333333" />
        <Swatch color="#999999" label="Text Muted" value="#999999" />
      </div>

      <H2>Typografie</H2>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: 24, marginBottom: 8 }}>
          Zalando Sans — Body text
        </div>
        <div style={{ fontFamily: "'Zalando Sans Expanded', sans-serif", fontSize: 24, marginBottom: 16 }}>
          Zalando Sans Expanded — Headings
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', opacity: 0.5 }}>
            <th style={{ padding: '8px 12px', fontWeight: 500, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Prvek</th>
            <th style={{ padding: '8px 12px', fontWeight: 500, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Velikost</th>
            <th style={{ padding: '8px 12px', fontWeight: 500, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Popis</th>
          </tr>
        </thead>
        <tbody>
          <TokenRow token="10px" value="Expanded, 400" desc="Kategorie, badge, labely" />
          <TokenRow token="12px" value="Regular, 400" desc="Sekundární text, popisy" />
          <TokenRow token="14px" value="Regular, 400–500" desc="Výchozí velikost textu" />
          <TokenRow token="16px" value="Regular, 400" desc="Vyhledávací pole" />
          <TokenRow token="18px" value="Regular, 600" desc="Záhlaví modálů, sekcí" />
        </tbody>
      </table>

      <H2>Glass efekt</H2>
      <Paragraph>
        Glassmorphismus se používá pro overlay a sticky prvky. Kombinuje
        poloprůhledné pozadí s rozmazáním pozadí:
      </Paragraph>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginTop: 8,
        }}
      >
        {[
          { label: 'Spotlight', blur: '32px', alpha: '0.65' },
          { label: 'Modal', blur: '32px', alpha: '0.65' },
          { label: 'Drawer', blur: '32px', alpha: '0.65' },
          { label: 'Top bar', blur: '20px', alpha: '0.7' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, opacity: 0.5, fontFamily: "'SF Mono', monospace" }}>
              blur({item.blur}) · alpha {item.alpha}
            </div>
          </div>
        ))}
      </div>

      <H2>Border radius</H2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
        <thead>
          <tr style={{ textAlign: 'left', opacity: 0.5 }}>
            <th style={{ padding: '8px 12px', fontWeight: 500, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Prvek</th>
            <th style={{ padding: '8px 12px', fontWeight: 500, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Hodnota</th>
            <th style={{ padding: '8px 12px', fontWeight: 500, borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Použití</th>
          </tr>
        </thead>
        <tbody>
          <TokenRow token="4px" value="Tag" desc="Malé inline prvky" />
          <TokenRow token="6px" value="Button, Dropdown item" desc="Interaktivní prvky" />
          <TokenRow token="8px" value="Input, Spotlight item" desc="Formulářové prvky" />
          <TokenRow token="12px" value="Card, Dropdown, Badge" desc="Kontejnery" />
          <TokenRow token="16px" value="Modal, Spotlight" desc="Velké overlay" />
        </tbody>
      </table>

      <H2>Animace</H2>
      <InfoBox>
        Všechny overlay komponenty používají state machine{' '}
        <Code>idle → opening → open → closing</Code> s dobou trvání{' '}
        <strong>180 ms</strong> a easing <Code>cubic-bezier(0.16, 1, 0.3, 1)</Code>.
      </InfoBox>
    </PageLayout>
  );
};
