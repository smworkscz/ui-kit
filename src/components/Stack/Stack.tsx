import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackProps {
  /**
   * Směr rozložení potomků.
   * @default 'column'
   */
  direction?: StackDirection;
  /**
   * Mezera mezi potomky v pixelech nebo jako CSS hodnota.
   * @default 8
   */
  gap?: number | string;
  /**
   * Zarovnání na příčné ose (align-items).
   * @default 'stretch'
   */
  align?: StackAlign;
  /**
   * Rozložení na hlavní ose (justify-content).
   * @default 'start'
   */
  justify?: StackJustify;
  /**
   * Povolí zalamování prvků do dalších řádků / sloupců.
   * @default false
   */
  wrap?: boolean;
  /**
   * Roztáhne komponentu na celou šířku kontejneru.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Potomci rozmístění uvnitř stacku.
   */
  children?: React.ReactNode;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const alignMap: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Jednoduchý layout helper využívající CSS flexbox.
 *
 * Usnadňuje běžné rozložení prvků ve sloupcích nebo řádcích
 * s konzistentními mezerami, zarovnáním a zalamováním.
 *
 * @example
 * ```tsx
 * <Stack gap={16}>
 *   <Input label="Jméno" />
 *   <Input label="Příjmení" />
 * </Stack>
 *
 * <Stack direction="row" gap={12} align="center">
 *   <Button>Uložit</Button>
 *   <Button variant="outline">Zrušit</Button>
 * </Stack>
 * ```
 */
export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap = 8,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  fullWidth = false,
  children,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
