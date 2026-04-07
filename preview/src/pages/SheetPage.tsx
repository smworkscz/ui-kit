import React, { useState } from 'react';
import { Sheet, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'side', label: 'Strana', options: ['bottom', 'right', 'left', 'top'], defaultValue: 'bottom' },
];

const propDefs: PropDef[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Řídí zobrazení sheetu.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Voláno při zavření.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Obsah sheetu.' },
  { name: 'side', type: "'bottom' | 'right' | 'left' | 'top'", defaultValue: "'bottom'", description: 'Strana, ze které se sheet vysune.' },
  { name: 'title', type: 'string', description: 'Titulek zobrazený v záhlaví.' },
  { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Zobrazí zavírací tlačítko.' },
  { name: 'style', type: 'CSSProperties', description: 'Další inline styly.' },
  { name: 'className', type: 'string', description: 'Dodatečná CSS třída.' },
];

const SheetDemo: React.FC<{ side: string }> = ({ side }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Otevřít sheet</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side={side as any}
        title="Filtry"
      >
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Obsah vysuvného panelu. Sheet je vhodný pro filtry, nastavení nebo doplňkový obsah.
        </p>
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setOpen(false)}>Použít filtry</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Zrušit</Button>
        </div>
      </Sheet>
    </>
  );
};

export const SheetPage: React.FC = () => (
  <PageLayout>
    <H1>Sheet</H1>
    <Paragraph large>
      Lehký vysuvný panel, který může přijít z libovolné strany. Na rozdíl od Draweru je odlehčený a výchozí pozice je zdola (mobilní rozhraní).
    </Paragraph>

    <Playground controls={controls} render={(props) => <SheetDemo side={props.side} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
