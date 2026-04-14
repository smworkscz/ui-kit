import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CaretLeft as CaretLeftIcon, CaretRight as CaretRightIcon, Check as CheckIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';
import { Stepper } from '../Stepper/Stepper';

// ─── Spinner ─────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 16, color }) => {
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === undefined) startRef.current = ts;
      setAngle(((ts - startRef.current) / 800 * 360) % 360);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ transform: `rotate(${angle}deg)`, flexShrink: 0, display: 'block' }}>
      <circle cx="8" cy="8" r="6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    contentBg: 'transparent',
    navBorder: 'rgba(255,255,255,0.08)',
    buttonPrimary: '#FC4F00',
    buttonPrimaryHover: '#FF6D2A',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: 'transparent',
    buttonSecondaryBorder: 'rgba(255,255,255,0.3)',
    buttonSecondaryText: '#ffffff',
    buttonSecondaryHover: 'rgba(255,255,255,0.06)',
    buttonDisabledBg: 'rgba(255,255,255,0.06)',
    buttonDisabledText: 'rgba(255,255,255,0.3)',
  },
  light: {
    contentBg: 'transparent',
    navBorder: 'rgba(0,0,0,0.06)',
    buttonPrimary: '#FC4F00',
    buttonPrimaryHover: '#FF6D2A',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: 'transparent',
    buttonSecondaryBorder: 'rgba(0,0,0,0.2)',
    buttonSecondaryText: '#1a1a1a',
    buttonSecondaryHover: 'rgba(0,0,0,0.04)',
    buttonDisabledBg: 'rgba(0,0,0,0.04)',
    buttonDisabledText: 'rgba(0,0,0,0.25)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FormWizardStep {
  /** Popisek kroku zobrazený ve Stepperu. */
  label: string;
  /** Volitelný popis kroku. */
  description?: string;
  /** Obsah kroku (formulář, komponenta). */
  content: React.ReactNode;
  /** Validace před pokračováním. Vrací boolean nebo Promise<boolean>. */
  validate?: () => boolean | Promise<boolean>;
}

export interface FormWizardProps {
  /** Definice kroků. */
  steps: FormWizardStep[];
  /** Index aktivního kroku (0-indexed). */
  activeStep: number;
  /** Callback při změně kroku. Při posledním kroku volá s `steps.length`. */
  onStepChange: (step: number) => void;
  /** Orientace stepperu. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Zobrazit navigační tlačítka (Předchozí/Další). @default true */
  showNavigation?: boolean;
  /** Text tlačítka na posledním kroku. @default 'Dokončit' */
  finishLabel?: string;
  /** Text tlačítka Další. @default 'Další' */
  nextLabel?: string;
  /** Text tlačítka Předchozí. @default 'Předchozí' */
  prevLabel?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── FormWizard ──────────────────────────────────────────────────────────────

/**
 * Vícekrokový formulářový průvodce.
 *
 * Kombinuje Stepper s obsahem kroků a navigačními tlačítky.
 * Podporuje synchronní i asynchronní validaci před pokračováním.
 *
 * @example
 * ```tsx
 * <FormWizard
 *   steps={[
 *     { label: 'Kontakt', content: <ContactForm />, validate: () => isValid },
 *     { label: 'Adresa', content: <AddressForm /> },
 *     { label: 'Souhrn', content: <Summary /> },
 *   ]}
 *   activeStep={step}
 *   onStepChange={setStep}
 * />
 * ```
 */
export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  activeStep,
  onStepChange,
  orientation = 'horizontal',
  showNavigation = true,
  finishLabel = 'Dokončit',
  nextLabel = 'Další',
  prevLabel = 'Předchozí',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const [validating, setValidating] = useState(false);

  const isFirst = activeStep <= 0;
  const isLast = activeStep >= steps.length - 1;
  const clampedStep = Math.max(0, Math.min(activeStep, steps.length - 1));
  const isHorizontal = orientation === 'horizontal';

  const stepperSteps = steps.map((s) => ({ label: s.label, description: s.description }));

  const handleNext = useCallback(async () => {
    if (validating) return;
    const current = steps[clampedStep];
    if (current.validate) {
      setValidating(true);
      try {
        const result = await current.validate();
        if (!result) {
          setValidating(false);
          return;
        }
      } catch {
        setValidating(false);
        return;
      }
      setValidating(false);
    }
    onStepChange(clampedStep + 1);
  }, [validating, steps, clampedStep, onStepChange]);

  const handlePrev = useCallback(() => {
    if (clampedStep > 0) onStepChange(clampedStep - 1);
  }, [clampedStep, onStepChange]);

  const handleStepClick = useCallback((idx: number) => {
    // Only allow backward navigation via click
    if (idx < clampedStep) onStepChange(idx);
  }, [clampedStep, onStepChange]);

  if (steps.length === 0) return null;

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '8px',
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 'normal',
    cursor: 'pointer',
    transition: 'background-color 0.12s ease, border-color 0.12s ease',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const primaryBtnStyle: React.CSSProperties = {
    ...btnBase,
    backgroundColor: validating ? t.buttonDisabledBg : t.buttonPrimary,
    color: validating ? t.buttonDisabledText : t.buttonPrimaryText,
    border: '1px solid transparent',
    cursor: validating ? 'not-allowed' : 'pointer',
  };

  const secondaryBtnStyle: React.CSSProperties = {
    ...btnBase,
    backgroundColor: t.buttonSecondaryBg,
    color: t.buttonSecondaryText,
    border: `1px solid ${t.buttonSecondaryBorder}`,
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'column' : 'row',
        gap: isHorizontal ? '0' : '32px',
        fontFamily: "'Zalando Sans', sans-serif",
        ...style,
      }}
    >
      {/* Stepper */}
      <div style={{ flexShrink: 0, ...(isHorizontal ? {} : { width: '240px' }) }}>
        <Stepper
          steps={stepperSteps}
          activeStep={clampedStep}
          orientation={orientation}
          clickable="completed"
          onStepClick={handleStepClick}
        />
      </div>

      {/* Content + Navigation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Step content */}
        <div style={{ flex: 1, padding: isHorizontal ? '24px 0' : '0' }}>
          {steps[clampedStep]?.content}
        </div>

        {/* Navigation buttons */}
        {showNavigation && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: `1px solid ${t.navBorder}`,
              marginTop: '8px',
            }}
          >
            <div>
              {!isFirst && (
                <button
                  type="button"
                  style={secondaryBtnStyle}
                  onClick={handlePrev}
                  disabled={validating}
                  onMouseEnter={(e) => { if (!validating) (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonSecondaryHover; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonSecondaryBg; }}
                >
                  <CaretLeftIcon size={14} />
                  {prevLabel}
                </button>
              )}
            </div>
            <button
              type="button"
              style={primaryBtnStyle}
              onClick={handleNext}
              disabled={validating}
              onMouseEnter={(e) => { if (!validating) (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonPrimaryHover; }}
              onMouseLeave={(e) => { if (!validating) (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonPrimary; }}
            >
              {validating ? (
                <Spinner size={14} color={t.buttonDisabledText} />
              ) : isLast ? (
                <>
                  <CheckIcon size={14} />
                  {finishLabel}
                </>
              ) : (
                <>
                  {nextLabel}
                  <CaretRightIcon size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

FormWizard.displayName = 'FormWizard';
