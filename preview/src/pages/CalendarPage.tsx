import React, { useState } from 'react';
import { Calendar } from '../../../src';
import type { CalendarEvent } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();

const demoEvents: CalendarEvent[] = [
  { date: new Date(y, m, 3), title: 'Schůzka', color: '#2196F3' },
  { date: new Date(y, m, 10), title: 'Odevzdání', color: '#EF3838' },
  { date: new Date(y, m, 10), title: 'Kontrola', color: '#00A205' },
  { date: new Date(y, m, 18), title: 'Retrospektiva' },
  { date: new Date(y, m, 24), title: 'Vydání', color: '#9C27B0' },
];

const fullSizeEvents: CalendarEvent[] = [
  { date: new Date(y, m, 2), title: 'Anna Nová', emoji: '🟦', color: '#1565C0', tooltip: 'Anna Nová — Dovolená (8:00 – 16:00)' },
  { date: new Date(y, m, 2), title: 'Petr Malý', emoji: '🟦', color: '#1565C0', tooltip: 'Petr Malý — Home office' },
  { date: new Date(y, m, 7), title: 'Eva Krátká', emoji: '🟦', color: '#0a1e3d' },
  { date: new Date(y, m, 8), title: 'Tomáš Horák', emoji: '🟦', color: '#0a1e3d' },
  { date: new Date(y, m, 8), title: 'Anna Nová', emoji: '🟦', color: '#0a1e3d' },
  { date: new Date(y, m, 16), title: 'Petr Malý', emoji: '🟦', color: '#1565C0' },
  { date: new Date(y, m, 23), title: 'Tomáš Horák', emoji: '🟦', color: '#0a1e3d' },
  {
    date: new Date(y, m, 1),
    endDate: new Date(y, m, 4),
    title: 'Martin Černý',
    emoji: '📋',
    color: '#FC4F00',
  },
  {
    date: new Date(y, m, 1),
    endDate: new Date(y, m, 4),
    title: 'Jana Bílá',
    emoji: '📋',
    color: '#e65100',
  },
  {
    date: new Date(y, m, 1),
    endDate: new Date(y, m, 4),
    title: 'Karel Veselý',
    emoji: '📋',
    color: '#bf360c',
  },
  {
    date: new Date(y, m, 14),
    endDate: new Date(y, m, 15),
    title: 'Tomáš Horák',
    emoji: '🟦',
    color: '#0a1e3d',
  },
  {
    date: new Date(y, m, 14),
    endDate: new Date(y, m, 15),
    title: 'Anna Nová',
    emoji: '🟦',
    color: '#0a1e3d',
  },
  { date: new Date(y, m - 1, 30), title: 'Petr Malý', emoji: '🟦', color: '#1565C0' },
];

const controls: PlaygroundControl[] = [
  { type: 'boolean', prop: 'fullSize', label: 'Full size', defaultValue: true },
  { type: 'boolean', prop: 'showHeader', label: 'Hlavička', defaultValue: true },
  { type: 'select', prop: 'locale', label: 'Jazyk', options: ['cs', 'en'], defaultValue: 'cs' },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'Date | null', description: 'Aktuálně vybraný datum.' },
  { name: 'onChange', type: '(date: Date) => void', description: 'Callback při výběru data.' },
  { name: 'view', type: "'month' | 'week'", defaultValue: "'month'", description: 'Režim zobrazení — měsíční nebo týdenní (kompaktní).' },
  { name: 'fullSize', type: 'boolean', defaultValue: 'false', description: 'Plnohodnotný kalendář s event bary místo teček.' },
  { name: 'showHeader', type: 'boolean', defaultValue: 'true', description: 'Zobrazit navigační hlavičku (měsíc + šipky).' },
  { name: 'events', type: 'CalendarEvent[]', description: 'Události zobrazené v kalendáři.' },
  { name: 'onEventClick', type: '(event: CalendarEvent) => void', description: 'Callback při kliknutí na událost (fullSize).' },
  { name: 'onNavigate', type: '(date: Date) => void', description: 'Callback při změně zobrazeného měsíce/týdne.' },
  { name: 'firstDay', type: '0 | 1', defaultValue: '1', description: 'První den v týdnu (0 = neděle, 1 = pondělí).' },
  { name: 'locale', type: "'cs' | 'en'", defaultValue: "'cs'", description: 'Jazyk pro popisky měsíců a dnů.' },
  { name: 'maxEventsPerDay', type: 'number', defaultValue: '3', description: 'Max viditelných událostí v buňce (fullSize).' },
  { name: 'initialDate', type: 'Date', description: 'Počáteční datum pro navigaci.' },
  { name: 'minDate', type: 'Date', description: 'Minimální povolený datum.' },
  { name: 'maxDate', type: 'Date', description: 'Maximální povolený datum.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const eventPropDefs: PropDef[] = [
  { name: 'id', type: 'string', description: 'Unikátní ID události.' },
  { name: 'date', type: 'Date', required: true, description: 'Datum začátku události.' },
  { name: 'endDate', type: 'Date', description: 'Datum konce události (pro vícedenní).' },
  { name: 'title', type: 'string', required: true, description: 'Název události.' },
  { name: 'color', type: 'string', defaultValue: "'#FC4F00'", description: 'Barva pozadí baru/tečky.' },
  { name: 'textColor', type: 'string', defaultValue: "'#ffffff'", description: 'Barva textu na baru.' },
  { name: 'emoji', type: 'string', description: 'Emoji zobrazené před názvem.' },
  { name: 'tooltip', type: 'string | ReactNode', description: 'Obsah tooltipu. Pokud je nastaveno, event se obalí tooltipem.' },
];

const CalendarDemo: React.FC<{ fullSize: boolean; showHeader: boolean; locale: string }> = ({
  fullSize,
  showHeader,
  locale,
}) => {
  const [date, setDate] = useState<Date | null>(today);

  if (fullSize) {
    return (
      <Calendar
        fullSize
        showHeader={showHeader}
        locale={locale as 'cs' | 'en'}
        value={date}
        onChange={setDate}
        events={fullSizeEvents}
        onEventClick={(ev) => alert(`Kliknuto na: ${ev.title}`)}
      />
    );
  }

  return (
    <Calendar
      value={date}
      onChange={setDate}
      locale={locale as 'cs' | 'en'}
      events={demoEvents}
      style={{ width: 340 }}
    />
  );
};

const CompactDemo: React.FC<{ view: 'month' | 'week' }> = ({ view }) => {
  const [date, setDate] = useState<Date | null>(today);
  return (
    <Calendar
      value={date}
      onChange={setDate}
      view={view}
      events={demoEvents}
      style={{ width: 340 }}
    />
  );
};

const FullSizeDemo: React.FC = () => {
  const [date, setDate] = useState<Date | null>(today);
  return (
    <Calendar
      fullSize
      value={date}
      onChange={setDate}
      events={fullSizeEvents}
      onEventClick={(ev) => alert(`Kliknuto na: ${ev.title}`)}
    />
  );
};

export const CalendarPage: React.FC = () => (
  <PageLayout>
    <H1>Calendar</H1>
    <Paragraph large>
      Kalendářní komponenta s měsíčním a týdenním zobrazením. V kompaktním režimu zobrazuje
      malý datepicker s barevnými tečkami. V plnohodnotném režimu (<code>fullSize</code>) zobrazuje
      velký měsíční kalendář s event bary, které mohou přesahovat přes více dní.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => (
        <CalendarDemo
          fullSize={props.fullSize as boolean}
          showHeader={props.showHeader as boolean}
          locale={props.locale as string}
        />
      )}
    />

    <H2>Full size</H2>
    <VariantShowcase label="Plnohodnotný kalendář s event bary">
      <FullSizeDemo />
    </VariantShowcase>

    <H2>Kompaktní</H2>
    <VariantShowcase label="Měsíční zobrazení">
      <CompactDemo view="month" />
    </VariantShowcase>

    <VariantShowcase label="Týdenní zobrazení">
      <CompactDemo view="week" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />

    <H2>CalendarEvent</H2>
    <PropsTable props={eventPropDefs} />
  </PageLayout>
);
