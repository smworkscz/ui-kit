import React from 'react';
import { useTheme } from '../../../src';
import { version } from '../../../package.json';
import { PageLayout, H1, H2, Paragraph, CodeBlock, InfoBox, Code } from './shared';

export const IntroductionPage: React.FC = () => {
  const theme = useTheme();

  return (
    <PageLayout>
      <H1>SMWORKS UI KIT</H1>
      <Paragraph large>
        Knihovna React komponent pro interní aplikace SMWORKS. Postavená na Reactu 18+,
        TypeScriptu a inline design tokenech s plnou podporou tmavého a světlého režimu.
      </Paragraph>

      <InfoBox>
        Aktuální verze: <strong>{version}</strong> · Balíček: <Code>@smworks-cz/ui-kit</Code> · Licence: MIT
      </InfoBox>

      <H2>Rychlý start</H2>
      <CodeBlock>{`yarn add @smworks-cz/ui-kit react react-dom @phosphor-icons/react`}</CodeBlock>
      <CodeBlock>{`import { Button, Input, Modal } from '@smworks-cz/ui-kit';

function App() {
  return <Button onClick={() => alert('Funguje!')}>Klikni</Button>;
}`}</CodeBlock>

      <H2>Vlastnosti</H2>
      <ul style={{ paddingLeft: 20, lineHeight: '2', opacity: 0.8, fontSize: 14 }}>
        <li><strong>57 komponent</strong> a 2 hooky organizované do 6 kategorií</li>
        <li>Tmavý a světlý režim s automatickou detekcí systému</li>
        <li>Glassmorphismus efekty na overlay komponentách</li>
        <li>Plná podpora klávesnice a přístupnosti (ARIA)</li>
        <li>Inline design tokeny — žádné externí CSS soubory</li>
        <li>Tree-shakeable ESM i CJS výstup</li>
        <li>TypeScript typové definice ze zdroje</li>
        <li>LLM dokumentace pro generování kódu s AI</li>
      </ul>

      <H2>Komponenty</H2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 8 }}>
        {[
          { name: 'Formuláře', count: 16, desc: 'Button, Input, Select, Combobox, DatePicker, Checkbox, Radio, Switch, Textarea, Slider, FileUpload, SegmentedControl, NumberInput, ColorPicker, Rating, OTPInput' },
          { name: 'Zobrazení dat', count: 17, desc: 'Table, DataGrid, Card, Accordion, Tabs, Tooltip, Popover, Skeleton, EmptyState, Stat, Avatar, Tag, Calendar, Timeline, DataList, Tree, StatusBadge' },
          { name: 'Navigace & Layout', count: 12, desc: 'Modal, Drawer, Sheet, Breadcrumb, Pagination, Stepper, DropdownMenu, Link, Spotlight, CommandMenu, AppSidebar, SidebarItem, Navbar' },
          { name: 'Feedback', count: 7, desc: 'Toast, Alert, Notification, Progress, Spinner, ConfirmDialog, CopyButton' },
          { name: 'Utility', count: 4, desc: 'Divider, Stack, Container, DragList' },
          { name: 'Hooks', count: 2, desc: 'useTheme, useToast' },
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
            <div style={{ fontSize: 12, opacity: 0.5 }}>{cat.count} {cat.count === 2 ? 'hooky' : 'komponent'}</div>
          </div>
        ))}
      </div>

      <H2>Technologie</H2>
      <ul style={{ paddingLeft: 20, lineHeight: '2', opacity: 0.8, fontSize: 14 }}>
        <li><strong>React</strong> 18+ (peer dependency)</li>
        <li><strong>TypeScript</strong> 5.3+</li>
        <li><strong>tsup</strong> — bundler (ESM + CJS)</li>
        <li><strong>Phosphor Icons</strong> — ikonová sada (@phosphor-icons/react)</li>
        <li><strong>Vite 8</strong> — preview aplikace</li>
      </ul>

      <H2>LLM dokumentace</H2>
      <Paragraph>
        Knihovna obsahuje strojově čitelnou dokumentaci pro LLM asistenty.
        Zkopírujte obsah souboru a vložte ho do kontextu vašeho LLM pro generování
        kódu s knihovnou.
      </Paragraph>
      <ul style={{ paddingLeft: 20, lineHeight: '2', opacity: 0.8, fontSize: 14 }}>
        <li><Code>/llm/all.md</Code> — kompletní dokumentace v jednom souboru</li>
        <li><Code>/llm/button.md</Code> — per-component dokumentace</li>
        <li>Tlačítko <strong>LLM</strong> v horní liště zkopíruje odkaz pro aktuální komponentu</li>
      </ul>
    </PageLayout>
  );
};
