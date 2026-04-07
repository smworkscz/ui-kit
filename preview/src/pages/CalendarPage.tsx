import React, { useState } from 'react';
import { Calendar } from '../../../src';
import type { CalendarEvent } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const today = new Date();

const demoEvents: CalendarEvent[] = [
  { date: new Date(today.getFullYear(), today.getMonth(), 5), title: 'Porada týmu', color: '#2196F3' },
  { date: new Date(today.getFullYear(), today.getMonth(), 12), title: 'Deadline projektu', color: '#EF3838' },
  { date: new Date(today.getFullYear(), today.getMonth(), 12), title: 'Review kódu', color: '#00A205' },
  { date: new Date(today.getFullYear(), today.getMonth(), 18), title: 'Sprint retrospektiva' },
  { date: new Date(today.getFullYear(), today.getMonth(), 25), title: 'Release', color: '#9C27B0' },
];

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'view', label: 'Zobrazení', options: ['month', 'week'], defaultValue: 'month' },
];

const propDefs: PropDef[] = [
  { name: 'value', type: 'Date | null', description: 'Aktuálně vybraný datum.' },
  { name: 'onChange', type: '(date: Date) => void', description: 'Callback při výběru data.' },
  { name: 'view', type: "'month' | 'week'", defaultValue: "'month'", description: 'Režim zobrazení — měsíční nebo týdenní.' },
  { name: 'events', type: 'CalendarEvent[]', description: 'Události zobrazené v kalendáři (barevné tečky).' },
  { name: 'onEventClick', type: '(event: CalendarEvent) => void', description: 'Callback při kliknutí na událost.' },
  { name: 'minDate', type: 'Date', description: 'Minimální povolený datum.' },
  { name: 'maxDate', type: 'Date', description: 'Maximální povolený datum.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styly.' },
  { name: 'className', type: 'string', description: 'CSS třída.' },
];

const CalendarDemo: React.FC<{ view: any }> = ({ view }) => {
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

export const CalendarPage: React.FC = () => (
  <PageLayout>
    <H1>Calendar</H1>
    <Paragraph large>
      Kalendářní komponenta s měsíčním a týdenním zobrazením. Podporuje výběr data,
      zobrazení událostí jako barevných teček, navigaci mezi měsíci/týdny a omezení rozsahu dat.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => <CalendarDemo view={props.view} />}
    />

    <H2>Varianty</H2>
    <VariantShowcase label="Měsíční zobrazení">
      <CalendarDemo view="month" />
    </VariantShowcase>

    <VariantShowcase label="Týdenní zobrazení">
      <CalendarDemo view="week" />
    </VariantShowcase>

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
