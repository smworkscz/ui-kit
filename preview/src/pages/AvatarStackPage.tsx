import React from 'react';
import { AvatarStack, Avatar } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'max', label: 'Max', defaultValue: '3' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['2xs', 'xs', 'sm', 'md', 'lg'], defaultValue: 'sm' },
  { type: 'select', prop: 'spacing', label: 'Spacing', options: ['tight', 'normal', 'loose'], defaultValue: 'normal' },
];

const propDefs: PropDef[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'Avatar komponenty jako potomci.' },
  { name: 'max', type: 'number', defaultValue: '3', description: 'Maximalni pocet zobrazenych avataru. Zbytek se schova do +N.' },
  { name: 'size', type: "'2xs' | 'xs' | 'sm' | 'md' | 'lg'", defaultValue: "'sm'", description: 'Velikost vsech avataru ve stacku.' },
  { name: 'spacing', type: "'tight' | 'normal' | 'loose'", defaultValue: "'normal'", description: 'Mezera (prekryv) mezi avatary.' },
  { name: 'direction', type: "'ltr' | 'rtl'", defaultValue: "'ltr'", description: 'Smer prekryvani avataru.' },
  { name: 'overflowTooltip', type: 'string | ((count: number) => string)', description: 'Tooltip pro +N indikator. Funkce prijima pocet skrytych.' },
];

export const AvatarStackPage: React.FC = () => (
  <PageLayout>
    <H1>AvatarStack</H1>
    <Paragraph large>
      Seskupeni avataru s prekryvanim a automatickym +N indikatorem
      pro preteceni.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <AvatarStack
          max={Number(props.max) || 3}
          size={props.size}
          spacing={props.spacing}
        >
          <Avatar initials="JN" />
          <Avatar initials="PD" />
          <Avatar initials="KS" />
          <Avatar initials="MC" />
          <Avatar initials="TH" />
        </AvatarStack>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="5 avataru, max=3 (zobrazi +2)">
      <AvatarStack max={3} size="sm">
        <Avatar initials="JN" />
        <Avatar initials="PD" />
        <Avatar initials="KS" />
        <Avatar initials="MC" />
        <Avatar initials="TH" />
      </AvatarStack>
    </VariantShowcase>

    <VariantShowcase label="Vsechny velikosti">
      <AvatarStack max={4} size="2xs">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
        <Avatar initials="E" />
      </AvatarStack>
      <AvatarStack max={4} size="xs">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
        <Avatar initials="E" />
      </AvatarStack>
      <AvatarStack max={4} size="sm">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
        <Avatar initials="E" />
      </AvatarStack>
      <AvatarStack max={4} size="md">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
        <Avatar initials="E" />
      </AvatarStack>
      <AvatarStack max={4} size="lg">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
        <Avatar initials="E" />
      </AvatarStack>
    </VariantShowcase>

    <VariantShowcase label="Spacing varianty">
      <AvatarStack max={5} size="sm" spacing="tight">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
      </AvatarStack>
      <AvatarStack max={5} size="sm" spacing="normal">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
      </AvatarStack>
      <AvatarStack max={5} size="sm" spacing="loose">
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
        <Avatar initials="D" />
      </AvatarStack>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
