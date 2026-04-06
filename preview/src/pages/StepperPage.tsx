import React, { useState } from 'react';
import { Stepper, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const demoSteps = [
  { label: 'Účet', description: 'Vytvoření účtu' },
  { label: 'Profil', description: 'Vyplnění údajů' },
  { label: 'Ověření', description: 'Ověření e-mailu' },
  { label: 'Hotovo', description: 'Dokončení' },
];

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'orientation', label: 'Orientace', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
];

const propDefs: PropDef[] = [
  { name: 'steps', type: 'StepItem[]', required: true, description: 'Definice kroků.' },
  { name: 'activeStep', type: 'number', required: true, description: 'Index aktivního kroku (0-indexed).' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Orientace.' },
  { name: 'clickable', type: "boolean | 'completed'", defaultValue: 'false', description: 'Klikatelné kroky.' },
  { name: 'onStepClick', type: '(index: number) => void', description: 'Callback kliknutí na krok.' },
];

const StepperDemo: React.FC<{ orientation: string }> = ({ orientation }) => {
  const [step, setStep] = useState(1);
  return (
    <div style={{ width: '100%' }}>
      <Stepper steps={demoSteps} activeStep={step} orientation={orientation as any} clickable="completed" onStepClick={setStep} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button size="sm" variant="secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>Zpět</Button>
        <Button size="sm" disabled={step === 3} onClick={() => setStep(s => s + 1)}>Další</Button>
      </div>
    </div>
  );
};

export const StepperPage: React.FC = () => (
  <PageLayout>
    <H1>Stepper</H1>
    <Paragraph large>Krokový průvodce pro vícekrokové procesy.</Paragraph>

    <Playground controls={controls} render={(props) => <StepperDemo orientation={props.orientation} />} />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
