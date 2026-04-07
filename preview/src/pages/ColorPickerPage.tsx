import React, { useState } from 'react';
import { ColorPicker } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'string', description: 'Aktuální barva v hexadecimálním formátu (např. #FC4F00).', required: true },
  { name: 'onChange', type: '(color: string) => void', description: 'Callback volaný při změně barvy.', required: true },
  { name: 'presets', type: 'string[]', description: 'Přednastavené barvy zobrazené v mřížce. Pokud chybí, použije se výchozí paleta.' },
  { name: 'label', type: 'string', description: 'Popisek zobrazený nad komponentou.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže celou komponentu.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly pro obalový element.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const ColorPickerDemo: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const [color, setColor] = useState('#FC4F00');
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      disabled={disabled}
      label="Barva"
      style={{ width: 220 }}
    />
  );
};

const CustomPresetsDemo: React.FC = () => {
  const [color, setColor] = useState('#2196F3');
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      presets={['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#4CAF50', '#FFC107', '#FF9800']}
      label="Vlastní paleta"
      style={{ width: 220 }}
    />
  );
};

export const ColorPickerPage: React.FC = () => (
  <PageLayout>
    <H1>ColorPicker</H1>
    <Paragraph large>
      Výběr barvy s náhledem, hexadecimálním vstupem a popoverem s mřížkou přednastavených barev.
      Kliknutím na náhled nebo ikonu se otevře paleta barev.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <ColorPickerDemo disabled={props.disabled} />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Výchozí paleta">
      <ColorPickerDemo disabled={false} />
    </VariantShowcase>

    <VariantShowcase label="Vlastní presety">
      <CustomPresetsDemo />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
