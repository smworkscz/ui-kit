import React from 'react';
import { FileUpload } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['dropzone', 'button'], defaultValue: 'dropzone' },
  { type: 'select', prop: 'buttonStyle', label: 'Styl tlačítka', options: ['default', 'primary'], defaultValue: 'default' },
  { type: 'boolean', prop: 'multiple', label: 'Multiple', defaultValue: false },
  { type: 'boolean', prop: 'showFileList', label: 'Seznam souborů', defaultValue: true },
  { type: 'boolean', prop: 'disabled', label: 'Disabled', defaultValue: false },
  { type: 'boolean', prop: 'error', label: 'Chyba', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'dropzone' | 'button'", defaultValue: "'dropzone'", description: 'Vizuální varianta — velká zóna nebo kompaktní tlačítko.' },
  { name: 'buttonStyle', type: "'default' | 'primary'", defaultValue: "'default'", description: 'Styl button varianty — neutrální pole nebo primární tlačítko.' },
  { name: 'showFileList', type: 'boolean', defaultValue: 'true', description: 'Zobrazí seznam nahraných souborů.' },
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
      Nahrání souborů přetažením nebo kliknutím. Tři styly — velká dropzone,
      kompaktní vstup a primární tlačítko.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: 360 }}>
          <FileUpload
            variant={props.variant}
            buttonStyle={props.buttonStyle}
            multiple={props.multiple}
            showFileList={props.showFileList}
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
    <VariantShowcase label="Button — kompaktní vstup">
      <div style={{ width: 340 }}>
        <FileUpload variant="button" label="Profilový obrázek" accept="image/*" />
      </div>
    </VariantShowcase>
    <VariantShowcase label="Button — primární tlačítko">
      <FileUpload variant="button" buttonStyle="primary" label="Přílohy" accept="image/*,.pdf" />
    </VariantShowcase>
    <VariantShowcase label="Bez seznamu souborů">
      <div style={{ width: 340 }}>
        <FileUpload variant="button" label="Avatar" accept="image/*" showFileList={false} />
      </div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
