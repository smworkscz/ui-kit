import React, { useState } from 'react';
import { CheckIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    completedBg: '#E8612D',
    completedText: '#ffffff',
    activeBorder: '#E8612D',
    activeText: '#E8612D',
    activeBg: 'transparent',
    futureText: '#ACACAC',
    futureBg: 'transparent',
    futureBorder: 'rgba(255,255,255,0.2)',
    lineCompleted: '#E8612D',
    lineFuture: 'rgba(255,255,255,0.15)',
    labelText: '#ffffff',
    labelFuture: '#ACACAC',
    descText: '#ACACAC',
    descFuture: 'rgba(255,255,255,0.3)',
    hoverBg: 'rgba(232,97,45,0.12)',
  },
  light: {
    completedBg: '#E8612D',
    completedText: '#ffffff',
    activeBorder: '#E8612D',
    activeText: '#E8612D',
    activeBg: 'transparent',
    futureText: '#888888',
    futureBg: 'transparent',
    futureBorder: 'rgba(0,0,0,0.15)',
    lineCompleted: '#E8612D',
    lineFuture: 'rgba(0,0,0,0.1)',
    labelText: '#1a1a1a',
    labelFuture: '#888888',
    descText: '#888888',
    descFuture: 'rgba(0,0,0,0.3)',
    hoverBg: 'rgba(232,97,45,0.08)',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface StepItem {
  /** Popisek kroku. */
  label: string;
  /** Volitelný popis kroku. */
  description?: string;
}

export interface StepperProps {
  /** Definice kroků. */
  steps: StepItem[];
  /** Index aktivního kroku (0-indexed). */
  activeStep: number;
  /** Orientace stepperu. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Umožní klikání na kroky pro přechod mezi nimi.
   * Lze nastavit na `true` (klikatelné všechny kroky),
   * `'completed'` (pouze dokončené a aktivní krok),
   * nebo `false` (vypnuto).
   * @default false
   */
  clickable?: boolean | 'completed';
  /** Voláno při kliknutí na krok. Vrací index zvoleného kroku. */
  onStepClick?: (stepIndex: number) => void;
  /** Dodatečná CSS třída pro obalový element. */
  className?: string;
  /** Další inline styly pro obalový element. */
  style?: React.CSSProperties;
}

// ─── Stepper ────────────────────────────────────────────────────────────────

/**
 * Kroková komponenta (Stepper) dle SM-UI design systému.
 *
 * Zobrazuje číslované kroky s propojovacími čarami.
 * Dokončené kroky mají oranžové pozadí se zaškrtnutím,
 * aktivní krok má oranžový obrys, budoucí kroky jsou ztlumené.
 *
 * Lze zapnout klikatelnost kroků pomocí `clickable` a `onStepClick`,
 * což uživateli umožní přecházet mezi kroky kliknutím.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { label: 'Kontaktní údaje' },
 *     { label: 'Adresa', description: 'Doručovací adresa' },
 *     { label: 'Platba' },
 *     { label: 'Souhrn' },
 *   ]}
 *   activeStep={1}
 *   clickable
 *   onStepClick={(idx) => setStep(idx)}
 * />
 * ```
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  clickable = false,
  onStepClick,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const isHorizontal = orientation === 'horizontal';
  const circleSize = 32;

  const isStepClickable = (idx: number): boolean => {
    if (!clickable || !onStepClick) return false;
    if (clickable === 'completed') return idx <= activeStep;
    return true;
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: isHorizontal ? 'flex-start' : 'stretch',
        gap: 0,
        ...style,
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;
        const isFuture = idx > activeStep;
        const isLast = idx === steps.length - 1;
        const canClick = isStepClickable(idx);
        const isHovered = hoveredStep === idx && canClick;

        // Barvy kruhu
        const circleBg = isCompleted ? t.completedBg : isHovered ? t.hoverBg : t.activeBg;
        const circleBorder = isCompleted
          ? t.completedBg
          : isActive
            ? t.activeBorder
            : isHovered
              ? t.activeBorder
              : t.futureBorder;
        const circleText = isCompleted
          ? t.completedText
          : isActive
            ? t.activeText
            : isHovered
              ? t.activeText
              : t.futureText;

        // Barvy textu
        const labelColor = isHovered ? t.activeText : isFuture ? t.labelFuture : t.labelText;
        const descColor = isFuture ? t.descFuture : t.descText;

        // Barva čáry
        const lineColor = isCompleted ? t.lineCompleted : t.lineFuture;

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: isHorizontal ? 'column' : 'row',
              alignItems: isHorizontal ? 'flex-start' : 'flex-start',
              flex: isLast ? '0 0 auto' : '1 1 0',
              minWidth: 0,
              cursor: canClick ? 'pointer' : 'default',
            }}
            onClick={() => canClick && onStepClick?.(idx)}
            onMouseEnter={() => setHoveredStep(idx)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            {/* Řádek s kruhem a čárou */}
            <div
              style={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                alignItems: 'center',
                width: isHorizontal ? '100%' : 'auto',
              }}
            >
              {/* Kruh */}
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: circleBg,
                  border: `2px solid ${circleBorder}`,
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
              >
                {isCompleted ? (
                  <CheckIcon size={14} color={t.completedText} weight="bold" />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Zalando Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: circleText,
                      lineHeight: 1,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Propojovací čára */}
              {!isLast && (
                <div
                  style={
                    isHorizontal
                      ? {
                          flex: 1,
                          height: '2px',
                          backgroundColor: lineColor,
                          margin: '0 8px',
                          transition: 'background-color 0.2s ease',
                        }
                      : {
                          width: '2px',
                          flex: 1,
                          minHeight: '24px',
                          backgroundColor: lineColor,
                          margin: '6px 0',
                          marginLeft: `${circleSize / 2 - 1}px`,
                          alignSelf: 'flex-start',
                          transition: 'background-color 0.2s ease',
                        }
                  }
                />
              )}
            </div>

            {/* Textový popis */}
            <div
              style={{
                marginTop: isHorizontal ? '10px' : 0,
                marginLeft: isHorizontal ? 0 : '14px',
                paddingTop: isHorizontal ? 0 : '4px',
                textAlign: 'left',
                minHeight: isHorizontal ? undefined : !isLast ? '48px' : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: isActive || isHovered ? 600 : 500,
                  color: labelColor,
                  lineHeight: 'normal',
                  transition: 'color 0.2s ease',
                }}
              >
                {step.label}
              </div>
              {step.description && (
                <div
                  style={{
                    fontFamily: "'Zalando Sans', sans-serif",
                    fontSize: '12px',
                    fontWeight: 400,
                    color: descColor,
                    lineHeight: 'normal',
                    marginTop: '4px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Stepper.displayName = 'Stepper';
