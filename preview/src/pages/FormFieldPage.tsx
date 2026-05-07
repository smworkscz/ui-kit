import React from 'react';
import { FormField, Input } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'inline', label: 'Inline', defaultValue: false },
  { type: 'boolean', prop: 'required', label: 'Required', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'label', type: 'string | ReactNode', description: 'Popisek pole.' },
  { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Zobrazí hvězdičku povinného pole.' },
  { name: 'helperText', type: 'string | ReactNode', description: 'Pomocný text pod polem.' },
  { name: 'error', type: 'string | ReactNode', description: 'Chybová zpráva. Přepne pole do chybového stavu.' },
  { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Zobrazí label a pole vedle sebe (horizontálně).' },
  { name: 'labelWidth', type: 'number | string', description: 'Šířka labelu v inline režimu (px nebo CSS hodnota).' },
];

export const FormFieldPage: React.FC = () => (
  <PageLayout>
    <H1>FormField</H1>
    <Paragraph large>
      Obalová komponenta pro formulářová pole. Přidává label, helper text,
      chybovou zprávu a podporuje inline i vertikální rozložení.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <FormField
          label="E-mail"
          helperText="Zadejte pracovní e-mail"
          inline={props.inline}
          required={props.required}
        >
          <Input placeholder="jan@firma.cz" />
        </FormField>
      )}
    />

    <H2>Inline rozložení</H2>
    <VariantShowcase label="Horizontální label + pole">
      <FormField label="Jméno" inline labelWidth={120}>
        <Input placeholder="Jan Novák" />
      </FormField>
      <FormField label="E-mail" inline labelWidth={120} required>
        <Input placeholder="jan@firma.cz" />
      </FormField>
    </VariantShowcase>

    <H2>Chybový stav</H2>
    <VariantShowcase label="Validace">
      <FormField label="E-mail" error="Neplatná e-mailová adresa" required>
        <Input placeholder="jan@firma.cz" />
      </FormField>
      <FormField label="Heslo" error="Heslo musí mít alespoň 8 znaků">
        <Input placeholder="********" />
      </FormField>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
