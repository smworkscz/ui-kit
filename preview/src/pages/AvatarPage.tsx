import React from 'react';
import { Avatar } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'initials', label: 'Iniciály', defaultValue: 'DC' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'text', prop: 'borderRadius', label: 'Border radius', defaultValue: '8px' },
];

const propDefs: PropDef[] = [
  { name: 'initials', type: 'string', required: true, description: '1–2 písmena zobrazená v avataru (auto-uppercase).' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | number", defaultValue: "'md'", description: 'Velikost avataru (sm: 40px, md: 70px, lg: 96px, nebo číslo v px).' },
  { name: 'borderRadius', type: 'string | number', defaultValue: "'8px'", description: 'Zaoblení rohů.' },
  { name: 'aria-label', type: 'string', description: 'Přístupný popisek (výchozí: "Avatar {initials}").' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

export const AvatarPage: React.FC = () => (
  <PageLayout>
    <H1>Avatar</H1>
    <Paragraph large>
      Profilový avatar zobrazující iniciály uživatele. Podporuje
      různé velikosti a zaoblení rohů.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Avatar
          initials={props.initials}
          size={props.size}
          borderRadius={props.borderRadius}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Velikosti">
      <Avatar initials="SM" size="sm" />
      <Avatar initials="SM" size="md" />
      <Avatar initials="SM" size="lg" />
    </VariantShowcase>

    <VariantShowcase label="Zaoblení">
      <Avatar initials="DC" borderRadius="4px" />
      <Avatar initials="DC" borderRadius="8px" />
      <Avatar initials="DC" borderRadius="50%" />
    </VariantShowcase>

    <VariantShowcase label="Různé iniciály">
      <Avatar initials="A" size="sm" />
      <Avatar initials="JN" size="sm" />
      <Avatar initials="KL" size="sm" />
      <Avatar initials="DP" size="sm" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
