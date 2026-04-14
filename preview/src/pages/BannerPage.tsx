import React from 'react';
import { Banner } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['info', 'success', 'warning', 'error'], defaultValue: 'info' },
  { type: 'select', prop: 'position', label: 'Pozice', options: ['top', 'bottom'], defaultValue: 'top' },
  { type: 'boolean', prop: 'closable', label: 'Closable', defaultValue: true },
  { type: 'boolean', prop: 'sticky', label: 'Sticky', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", defaultValue: "'info'", description: 'Vizuální varianta.' },
  { name: 'title', type: 'string', description: 'Tučný titulek.' },
  { name: 'children', type: 'ReactNode', description: 'Obsah banneru.' },
  { name: 'closable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí zavírací tlačítko.' },
  { name: 'onClose', type: '() => void', description: 'Callback při zavření.' },
  { name: 'icon', type: 'ReactNode', description: 'Vlastní ikona.' },
  { name: 'position', type: "'top' | 'bottom'", defaultValue: "'top'", description: 'Pozice akcentního proužku.' },
  { name: 'sticky', type: 'boolean', defaultValue: 'false', description: 'Přilepí banner na pozici.' },
];

export const BannerPage: React.FC = () => (
  <PageLayout>
    <H1>Banner</H1>
    <Paragraph large>
      Oznámovací banner na celou šířku. Vhodný pro systémové zprávy, varování,
      údržbu nebo úspěšné akce. Lze přilepit na horní nebo dolní okraj.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <Banner
          variant={props.variant as any}
          position={props.position as any}
          closable={props.closable as boolean}
          sticky={props.sticky as boolean}
          title="Oznámení systému"
        >
          Systém bude nedostupný 12. dubna od 22:00 do 23:00.
        </Banner>
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Info">
      <Banner variant="info" title="Informace">Nová verze je k dispozici.</Banner>
    </VariantShowcase>
    <VariantShowcase label="Success">
      <Banner variant="success" title="Hotovo">Data byla úspěšně uložena.</Banner>
    </VariantShowcase>
    <VariantShowcase label="Warning">
      <Banner variant="warning" title="Pozor">Vaše heslo brzy vyprší.</Banner>
    </VariantShowcase>
    <VariantShowcase label="Error">
      <Banner variant="error" title="Chyba">Nepodařilo se načíst data.</Banner>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
