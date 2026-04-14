import React, { useState } from 'react';
import { FormWizard, Input } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'orientation', label: 'Orientace', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
  { type: 'boolean', prop: 'showNavigation', label: 'Navigace', defaultValue: true },
];

const propDefs: PropDef[] = [
  { name: 'steps', type: 'FormWizardStep[]', required: true, description: 'Definice kroků: { label, description?, content, validate? }.' },
  { name: 'activeStep', type: 'number', required: true, description: 'Index aktivního kroku (0-indexed).' },
  { name: 'onStepChange', type: '(step: number) => void', required: true, description: 'Callback při změně kroku.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Orientace stepperu.' },
  { name: 'showNavigation', type: 'boolean', defaultValue: 'true', description: 'Zobrazit navigační tlačítka.' },
  { name: 'finishLabel', type: 'string', defaultValue: "'Dokončit'", description: 'Text tlačítka na posledním kroku.' },
  { name: 'nextLabel', type: 'string', defaultValue: "'Další'", description: 'Text tlačítka Další.' },
  { name: 'prevLabel', type: 'string', defaultValue: "'Předchozí'", description: 'Text tlačítka Předchozí.' },
];

const stepPropDefs: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Popisek kroku ve Stepperu.' },
  { name: 'description', type: 'string', description: 'Volitelný popis kroku.' },
  { name: 'content', type: 'ReactNode', required: true, description: 'Obsah kroku.' },
  { name: 'validate', type: '() => boolean | Promise<boolean>', description: 'Validace před pokračováním.' },
];

const StepContent: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '16px 0' }}>
    <h3 style={{ margin: '0 0 16px', fontFamily: "'Zalando Sans', sans-serif", fontSize: '16px', fontWeight: 600 }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 360 }}>
      <Input label="Pole 1" placeholder="Vyplňte..." />
      <Input label="Pole 2" placeholder="Vyplňte..." />
    </div>
  </div>
);

const WizardDemo: React.FC<{ orientation: any; showNavigation: boolean }> = ({ orientation, showNavigation }) => {
  const [step, setStep] = useState(0);
  return (
    <FormWizard
      orientation={orientation}
      showNavigation={showNavigation}
      activeStep={step}
      onStepChange={(s) => {
        if (s >= 3) { alert('Formulář odeslán!'); setStep(0); }
        else setStep(s);
      }}
      steps={[
        { label: 'Kontakt', description: 'Osobní údaje', content: <StepContent title="Krok 1: Kontaktní údaje" /> },
        { label: 'Adresa', content: <StepContent title="Krok 2: Doručovací adresa" /> },
        { label: 'Souhrn', content: <div style={{ padding: '16px 0', fontFamily: "'Zalando Sans', sans-serif", fontSize: '14px' }}>Vše vyplněno. Klikněte na Dokončit.</div> },
      ]}
    />
  );
};

export const FormWizardPage: React.FC = () => (
  <PageLayout>
    <H1>FormWizard</H1>
    <Paragraph large>
      Vícekrokový formulářový průvodce. Kombinuje Stepper s obsahem kroků
      a navigačními tlačítky. Podporuje synchronní i asynchronní validaci.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => <WizardDemo orientation={props.orientation} showNavigation={props.showNavigation as boolean} />}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />

    <H2>FormWizardStep</H2>
    <PropsTable props={stepPropDefs} />
  </PageLayout>
);
