import React from 'react';
import { FileUpload } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['dropzone', 'button'], defaultValue: 'dropzone' },
  { type: 'boolean', prop: 'multiple', label: 'Multiple', defaultValue: false },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'dropzone' | 'button'", defaultValue: "'dropzone'", description: 'Vizuální varianta — velká zóna nebo kompaktní tlačítko.' },
  { name: 'onFiles', type: '(files: File[]) => void', description: 'Callback s vybranými soubory.' },
  { name: 'accept', type: 'string', description: "Povolené typy souborů (např. 'image/*,.pdf')." },
  { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Více souborů najednou.' },
  { name: 'maxSize', type: 'number', description: 'Maximální velikost v bajtech.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Zakáže nahrávání.' },
  { name: 'label', type: 'string', description: 'Popisek.' },
  { name: 'error', type: 'boolean | string', description: 'Chybový stav.' },
];

export const FileUploadPage: React.FC = () => (
  <PageLayout>
    <H1>FileUpload</H1>
    <Paragraph large>
      Nahrání souborů přetažením nebo kliknutím. Dvě varianty — velká dropzone
      pro drag & drop a kompaktní tlačítko ve stylu inputu.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 360 }}>
          <FileUpload
            variant={props.variant}
            multiple={props.multiple}
            disabled={props.disabled}
            error={props.error ? 'Soubor je příliš velký' : false}
            label="Dokumenty"
            accept="image/*,.pdf"
          />
        </div>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Dropzone (výchozí)">
      <div style={{ width: 340 }}>
        <FileUpload variant="dropzone" label="Přílohy" accept="image/*,.pdf" />
      </div>
    </VariantShowcase>
    <VariantShowcase label="Button — kompaktní">
      <div style={{ width: 340 }}>
        <FileUpload variant="button" label="Profilový obrázek" accept="image/*" />
      </div>
    </VariantShowcase>
    <VariantShowcase label="Button — multiple">
      <div style={{ width: 340 }}>
        <FileUpload variant="button" label="Dokumenty" accept=".pdf,.doc" multiple />
      </div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
