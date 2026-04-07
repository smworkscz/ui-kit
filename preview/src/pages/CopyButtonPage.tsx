import React from 'react';
import { CopyButton, useToast } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['icon', 'button'], defaultValue: 'icon' },
  { type: 'select', prop: 'size', label: 'Velikost', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
];

const propDefs: PropDef[] = [
  { name: 'text', type: 'string', required: true, description: 'Text ke zkopírování do schránky.' },
  { name: 'children', type: 'ReactNode', description: 'Vlastní obsah tlačítka (nahrazuje výchozí ikonu/text).' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Velikost tlačítka.' },
  { name: 'variant', type: "'icon' | 'button'", defaultValue: "'icon'", description: 'Varianta zobrazení.' },
  { name: 'label', type: 'string', defaultValue: "'Kopírovat'", description: 'Popisek tlačítka ve variantě button.' },
  { name: 'successLabel', type: 'string', defaultValue: "'Zkopírováno'", description: 'Popisek po úspěšném zkopírování.' },
  { name: 'onCopy', type: '() => void', description: 'Callback volaný po úspěšném zkopírování do schránky.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const sampleCode = 'npm install @smworks/ui';

const CopyWithToast: React.FC<{ text: string; variant?: 'icon' | 'button'; size?: 'sm' | 'md' | 'lg'; label?: string }> = ({
  text,
  variant = 'icon',
  size = 'md',
  label,
}) => {
  const toast = useToast();
  return (
    <CopyButton
      text={text}
      variant={variant}
      size={size}
      label={label}
      onCopy={() => toast.success('Zkopírováno do schránky')}
    />
  );
};

export const CopyButtonPage: React.FC = () => (
  <PageLayout>
    <H1>CopyButton</H1>
    <Paragraph large>
      Tlačítko pro zkopírování textu do schránky. Po kliknutí se na 2 sekundy zobrazí ikona
      zaškrtnutí jako potvrzení. Přes callback <code>onCopy</code> lze reagovat na úspěšné
      zkopírování, například zobrazením toastu.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 13 }}>{sampleCode}</code>
          <CopyWithToast text={sampleCode} variant={props.variant} size={props.size} />
        </div>
      )}
    />

    <H2>Varianta icon</H2>
    <Paragraph>Minimální zobrazení pouze s ikonou kopírování.</Paragraph>
    <VariantShowcase label="Samotná ikona">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 13 }}>sk-1234abcd</code>
        <CopyWithToast text="sk-1234abcd" variant="icon" />
      </div>
    </VariantShowcase>

    <H2>Varianta button</H2>
    <Paragraph>Plné tlačítko s textem a ohraničením.</Paragraph>
    <VariantShowcase label="Tlačítko s textem">
      <CopyWithToast text={sampleCode} variant="button" label="Kopírovat příkaz" />
      <CopyWithToast text="https://example.com" variant="button" label="Kopírovat odkaz" />
    </VariantShowcase>

    <H2>Velikosti</H2>
    <VariantShowcase label="sm / md / lg">
      <CopyWithToast text="text" variant="button" label="Malé" size="sm" />
      <CopyWithToast text="text" variant="button" label="Střední" size="md" />
      <CopyWithToast text="text" variant="button" label="Velké" size="lg" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
