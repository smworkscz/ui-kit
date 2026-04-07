import React, { useState } from 'react';
import { Rating } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'text', prop: 'max', label: 'Max', defaultValue: '5' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'readOnly', label: 'Read only', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'number', description: 'Aktuální hodnota hodnocení (1 – max).', required: true },
  { name: 'onChange', type: '(value: number) => void', description: 'Callback volaný při změně hodnocení. Pokud chybí, komponenta je read-only.' },
  { name: 'max', type: 'number', defaultValue: '5', description: 'Maximální počet hvězd.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikostní preset.' },
  { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Přepne komponentu do režimu pouze pro zobrazení.' },
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad komponentou.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly pro obalový element.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const RatingDemo: React.FC<{ max: string; size: any; readOnly: boolean }> = ({ max, size, readOnly }) => {
  const [value, setValue] = useState(3);
  return (
    <Rating
      value={value}
      onChange={readOnly ? undefined : setValue}
      max={Number(max) || 5}
      size={size}
      readOnly={readOnly}
      label="Hodnocení"
    />
  );
};

const SizesDemo: React.FC = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [c, setC] = useState(2);
  return (
    <>
      <Rating value={a} onChange={setA} size="sm" label="Small" />
      <Rating value={b} onChange={setB} size="md" label="Medium" />
      <Rating value={c} onChange={setC} size="lg" label="Large" />
    </>
  );
};

export const RatingPage: React.FC = () => (
  <PageLayout>
    <H1>Rating</H1>
    <Paragraph large>
      Hodnocení hvězdičkami s interaktivním výběrem a náhledem při najetí myší.
      Podporuje nastavitelný počet hvězd, velikosti a režim pouze pro čtení.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <RatingDemo max={props.max} size={props.size} readOnly={props.readOnly} />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Velikosti">
      <SizesDemo />
    </VariantShowcase>

    <VariantShowcase label="Pouze pro čtení">
      <Rating value={4} readOnly label="Průměrné hodnocení" />
      <Rating value={2} max={10} readOnly size="sm" label="Z deseti" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
