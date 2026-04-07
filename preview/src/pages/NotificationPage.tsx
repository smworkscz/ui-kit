import React from 'react';
import { Notification, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'variant', label: 'Varianta', options: ['info', 'success', 'warning', 'error'], defaultValue: 'info' },
  { type: 'boolean', prop: 'closable', label: 'Zavíratelná', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", defaultValue: "'info'", description: 'Vizuální varianta notifikace.' },
  { name: 'title', type: 'string', required: true, description: 'Titulek notifikace.' },
  { name: 'children', type: 'ReactNode', description: 'Obsah / popis notifikace.' },
  { name: 'closable', type: 'boolean', defaultValue: 'false', description: 'Zobrazí tlačítko zavření.' },
  { name: 'onClose', type: '() => void', description: 'Voláno při zavření notifikace.' },
  { name: 'icon', type: 'ReactNode', description: 'Vlastní ikona (nahradí výchozí ikonu varianty).' },
  { name: 'action', type: 'ReactNode', description: 'Akční prvek zobrazený na pravé straně (tlačítko apod.).' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

export const NotificationPage: React.FC = () => (
  <PageLayout>
    <H1>Notification</H1>
    <Paragraph large>
      Inline notifikační banner pro trvalé zobrazení v layoutu. Na rozdíl od Toast se nejedná o plovoucí overlay, ale o součást obsahu stránky.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Notification variant={props.variant} title="Ukázková notifikace" closable={props.closable}>
            Toto je obsah notifikace s dalšími detaily o události.
          </Notification>
        </div>
      )}
    />

    <H2>Všechny varianty</H2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, marginBottom: 32 }}>
      <Notification variant="info" title="Informace">
        Nová verze dokumentace je dostupná.
      </Notification>
      <Notification variant="success" title="Úspěch">
        Změny byly úspěšně uloženy.
      </Notification>
      <Notification variant="warning" title="Upozornění">
        Vaše heslo vyprší za 3 dny.
      </Notification>
      <Notification variant="error" title="Chyba">
        Nepodařilo se uložit soubor. Zkuste to prosím znovu.
      </Notification>
    </div>

    <H2>S akcí</H2>
    <Paragraph>Notifikace může obsahovat akční tlačítko na pravé straně.</Paragraph>
    <VariantShowcase label="S tlačítkem akce">
      <div style={{ width: '100%', maxWidth: 520 }}>
        <Notification
          variant="warning"
          title="Nová verze"
          action={<Button size="sm">Aktualizovat</Button>}
        >
          Je dostupná nová verze aplikace.
        </Notification>
      </div>
    </VariantShowcase>

    <H2>Zavíratelná</H2>
    <Paragraph>S tlačítkem zavření pro odstranění notifikace z layoutu.</Paragraph>
    <VariantShowcase label="Closable">
      <div style={{ width: '100%', maxWidth: 520 }}>
        <Notification variant="success" title="Hotovo" closable>
          Všechny úlohy byly dokončeny.
        </Notification>
      </div>
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
