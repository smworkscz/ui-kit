import React from 'react';
import { useTheme } from '../../../src';
import { PageLayout, H1, H2, Paragraph, CodeBlock, InfoBox } from './shared';

export const IntroductionPage: React.FC = () => {
  const theme = useTheme();

  return (
    <PageLayout>
      <H1>SMWORKS UI KIT</H1>
      <Paragraph large>
        Interní knihovna komponent pro aplikace SMWORKS. Postavená na Reactu 18+,
        TypeScriptu a inline design tokenech s podporou tmavého a světlého režimu.
      </Paragraph>

      <InfoBox>
        SMWORKS UI KIT je aktuálně ve verzi <strong>0.1.0</strong> a je určen výhradně
        pro interní projekty SMWORKS.
      </InfoBox>

      <H2>Vlastnosti</H2>
      <ul style={{ paddingLeft: 20, lineHeight: '2', opacity: 0.8, fontSize: 14 }}>
        <li>36 komponent organizovaných do kategorií</li>
        <li>Tmavý a světlý režim s automatickou detekcí systému</li>
        <li>Glassmorphismus efekty na overlay komponentách</li>
        <li>Plná podpora klávesnice a přístupnosti (ARIA)</li>
        <li>Inline design tokeny — žádné externí CSS soubory</li>
        <li>Tree-shakeable ESM i CJS výstup</li>
        <li>TypeScript typové definice ze zdroje</li>
      </ul>

      <H2>Technologie</H2>
      <ul style={{ paddingLeft: 20, lineHeight: '2', opacity: 0.8, fontSize: 14 }}>
        <li><strong>React</strong> 18+ (peer dependency)</li>
        <li><strong>TypeScript</strong> 5.3+</li>
        <li><strong>tsup</strong> — bundler (ESM + CJS)</li>
        <li><strong>Phosphor Icons</strong> — ikonová sada</li>
        <li><strong>Vitest</strong> + Playwright — testování</li>
      </ul>

      <H2>Struktura knihovny</H2>
      <CodeBlock>{`sm-ui/
├── src/
│   ├── components/    # Všechny komponenty
│   ├── hooks/         # useTheme, useToast
│   ├── fonts/         # Zalando Sans fonty
│   └── index.ts       # Barrel export
├── dist/              # Sestavený výstup (npm)
└── preview/           # Tato preview aplikace`}</CodeBlock>

      <H2>Komponenty</H2>
      <Paragraph>
        Knihovna obsahuje komponenty v následujících kategoriích:
      </Paragraph>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 8 }}>
        {[
          { name: 'Formuláře', count: 10, items: 'Button, Input, Select, DatePicker, Checkbox, Radio, Switch, Textarea, Slider, FileUpload' },
          { name: 'Zobrazení dat', count: 11, items: 'Table, Card, Accordion, Tabs, Tooltip, Popover, Skeleton, EmptyState, Stat, Avatar, Tag' },
          { name: 'Navigace', count: 8, items: 'Modal, Drawer, Breadcrumb, Pagination, Stepper, DropdownMenu, Link, Spotlight' },
          { name: 'Feedback', count: 4, items: 'Toast, Alert, Progress, Spinner' },
          { name: 'Utility', count: 4, items: 'Divider, Stack, Container, DragList' },
        ].map((cat) => (
          <div
            key={cat.name}
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{cat.name}</div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>{cat.count} komponent</div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};
