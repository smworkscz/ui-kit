import React from 'react';
import { DataList } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const sampleItems = [
  { label: 'Jméno', value: 'Jan Novák' },
  { label: 'E-mail', value: 'jan.novak@example.com' },
  { label: 'Telefon', value: '+420 123 456 789' },
  { label: 'Adresa', value: 'Václavské náměstí 1, Praha' },
  { label: 'Stav', value: 'Aktivní' },
  { label: 'Registrace', value: '15. 3. 2024' },
  { label: 'Společnost', value: 'SMWORKS s.r.o.' },
  { label: 'Pozice', value: 'Vývojář' },
  { label: 'Oddělení', value: 'Vývoj' },
];

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'columns', label: 'Sloupce', options: ['1', '2', '3'], defaultValue: '1' },
  { type: 'boolean', prop: 'striped', label: 'Striped', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'items', type: 'DataListItem[]', description: 'Položky k zobrazení (klíč-hodnota).', required: true },
  { name: 'columns', type: 'number', defaultValue: '1', description: 'Počet sloupců rozložení.' },
  { name: 'striped', type: 'boolean', defaultValue: 'false', description: 'Střídání barvy řádků.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const itemPropDefs: PropDef[] = [
  { name: 'label', type: 'string', description: 'Popisek (klíč).', required: true },
  { name: 'value', type: 'ReactNode', description: 'Hodnota — řetězec nebo libovolný React uzel.', required: true },
];

export const DataListPage: React.FC = () => (
  <PageLayout>
    <H1>DataList</H1>
    <Paragraph large>
      Seznam klíč-hodnota pro detailní zobrazení dat. Zobrazuje popisek vlevo
      a hodnotu vpravo. Podporuje rozložení do libovolného počtu sloupců a střídání barvy řádků.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <DataList
          items={sampleItems}
          columns={Number(props.columns)}
          striped={props.striped}
          style={{ maxWidth: 700 }}
        />
      )}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Jeden sloupec">
      <DataList items={sampleItems.slice(0, 6)} style={{ width: '100%', maxWidth: 480 }} />
    </VariantShowcase>

    <VariantShowcase label="Dva sloupce, striped">
      <DataList items={sampleItems.slice(0, 6)} columns={2} striped style={{ width: '100%', maxWidth: 600 }} />
    </VariantShowcase>

    <VariantShowcase label="Tři sloupce">
      <DataList items={sampleItems} columns={3} style={{ width: '100%', maxWidth: 900 }} />
    </VariantShowcase>

    <H2>Props (DataList)</H2>
    <PropsTable props={propDefs} />

    <H2>Props (DataListItem)</H2>
    <PropsTable props={itemPropDefs} />
  </PageLayout>
);
