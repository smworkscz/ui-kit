import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps {
  /**
   * Maximální šířka kontejneru.
   * - `'sm'` — 640 px
   * - `'md'` — 768 px
   * - `'lg'` — 1024 px
   * - `'xl'` — 1280 px
   * - `number` — vlastní hodnota v pixelech
   * @default 'lg'
   */
  maxWidth?: ContainerMaxWidth | number;
  /**
   * Vnitřní odsazení (padding). Číslo v pixelech nebo CSS hodnota.
   * @default 16
   */
  padding?: number | string;
  /**
   * Vycentruje kontejner pomocí automatických okrajů.
   * @default true
   */
  centered?: boolean;
  /**
   * Potomci vykreslení uvnitř kontejneru.
   */
  children?: React.ReactNode;
  /** Dodatečná CSS třída pro kořenový element. */
  className?: string;
  /** Další inline styly pro kořenový element. */
  style?: React.CSSProperties;
}

// ─── Size map ────────────────────────────────────────────────────────────────

const maxWidthMap: Record<ContainerMaxWidth, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Layout kontejner s maximální šířkou a volitelným centrováním.
 *
 * Usnadňuje tvorbu stránek s konzistentní šířkou obsahu
 * a odsazením. Ve výchozím nastavení centruje obsah pomocí
 * automatických okrajů a aplikuje vnitřní padding.
 *
 * @example
 * ```tsx
 * <Container>
 *   <h1>Obsah stránky</h1>
 *   <p>Tento obsah bude omezený na 1024 px a vycentrovaný.</p>
 * </Container>
 *
 * <Container maxWidth="sm" padding={24}>
 *   <LoginForm />
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  padding = 16,
  centered = true,
  children,
  className,
  style,
}) => {
  const resolvedMaxWidth = typeof maxWidth === 'number' ? maxWidth : maxWidthMap[maxWidth];
  const resolvedPadding = typeof padding === 'number' ? `${padding}px` : padding;

  return (
    <div
      className={className}
      style={{
        maxWidth: `${resolvedMaxWidth}px`,
        width: '100%',
        padding: resolvedPadding,
        boxSizing: 'border-box',
        ...(centered ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
