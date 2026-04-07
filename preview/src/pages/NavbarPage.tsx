import React from 'react';
import { Navbar, Button } from '../../../src';
import { BellIcon, UserIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { PageLayout, H1, H2, Paragraph, PropsTable, VariantShowcase } from './shared';
import type { PropDef } from './shared';

const propDefs: PropDef[] = [
  { name: 'logo', type: 'ReactNode', description: 'Logo nebo název aplikace (vykresleno vlevo).' },
  { name: 'children', type: 'ReactNode', description: 'Navigační obsah (vykresleno uprostřed).' },
  { name: 'actions', type: 'ReactNode', description: 'Akční prvky — tlačítka, avatar apod. (vykresleno vpravo).' },
  { name: 'sticky', type: 'boolean', defaultValue: 'true', description: 'Zda je navbar přilepený k hornímu okraji.' },
  { name: 'glass', type: 'boolean', defaultValue: 'true', description: 'Zda použít glass efekt (průhledné pozadí).' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const linkStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontFamily: "'Zalando Sans', sans-serif",
  fontWeight: 500,
  textDecoration: 'none',
  color: 'inherit',
  opacity: 0.7,
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  opacity: 1,
  color: '#FC4F00',
};

const logoStyle: React.CSSProperties = {
  fontFamily: "'Zalando Sans Expanded', sans-serif",
  fontWeight: 700,
  fontSize: 16,
};

export const NavbarPage: React.FC = () => (
  <PageLayout>
    <H1>Navbar</H1>
    <Paragraph large>
      Horní navigační lišta s třemi sloty: logo (vlevo), navigace (uprostřed) a akce (vpravo). Podporuje glass efekt a sticky pozici.
    </Paragraph>

    <H2>S logem a akcemi</H2>
    <Paragraph>Kompletní navbar se všemi třemi oblastmi.</Paragraph>
    <VariantShowcase label="Plný navbar">
      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(128,128,128,0.15)' }}>
        <Navbar
          sticky={false}
          logo={<span style={logoStyle}>SMWORKS</span>}
          actions={
            <>
              <Button variant="ghost" size="sm" style={{ padding: 6 }}><MagnifyingGlassIcon size={18} /></Button>
              <Button variant="ghost" size="sm" style={{ padding: 6 }}><BellIcon size={18} /></Button>
              <Button size="sm">Přihlásit se</Button>
            </>
          }
        >
          <span style={activeLinkStyle}>Dashboard</span>
          <span style={linkStyle}>Produkty</span>
          <span style={linkStyle}>Analytika</span>
          <span style={linkStyle}>Nastavení</span>
        </Navbar>
      </div>
    </VariantShowcase>

    <H2>Pouze logo a akce</H2>
    <Paragraph>Navbar bez středového navigačního obsahu.</Paragraph>
    <VariantShowcase label="Bez navigace">
      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(128,128,128,0.15)' }}>
        <Navbar
          sticky={false}
          logo={<span style={logoStyle}>MůjApp</span>}
          actions={
            <Button variant="ghost" size="sm" style={{ padding: 6 }}><UserIcon size={18} /></Button>
          }
        />
      </div>
    </VariantShowcase>

    <H2>Bez glass efektu</H2>
    <Paragraph>Navbar s plným neprůhledným pozadím bez rozmazání.</Paragraph>
    <VariantShowcase label="Solid pozadí">
      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(128,128,128,0.15)' }}>
        <Navbar
          sticky={false}
          glass={false}
          logo={<span style={logoStyle}>Portál</span>}
          actions={<Button size="sm" variant="secondary">Kontakt</Button>}
        >
          <span style={activeLinkStyle}>Domů</span>
          <span style={linkStyle}>O nás</span>
          <span style={linkStyle}>Služby</span>
        </Navbar>
      </div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
