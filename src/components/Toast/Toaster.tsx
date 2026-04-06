import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Toast } from './Toast';
import type { ToastVariant } from './Toast';

// ─── Constants ────────────────────────────────────────────────────────────────

/** How many toasts peek out behind the front one in collapsed mode. */
const MAX_VISIBLE_COLLAPSED = 3;

/** Scale reduction per step back in the stack. */
const STACK_SCALE_STEP = 0.06;

/** How many px each toast peeks above the one in front (collapsed mode). */
const STACK_PEEK_PX = 12;

/** Duration of all layout transitions (ms). */
const TRANSITION_DURATION = 320;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type ToastLifecycle = 'entering' | 'visible' | 'leaving';

/** Nastavení předávaná do `toast()` při vyvolání notifikace. */
export interface ToastOptions {
  /**
   * Úroveň závažnosti — ovládá barvu okraje a výchozí ikonu.
   * @default 'info'
   */
  variant?: ToastVariant;
  /** Tučný nadpis notifikace. */
  title: string;
  /** Volitelný popis vykreslený pod nadpisem. */
  content?: string;
  /**
   * Vlastní ikona nahrazující vestavěnou variantní ikonu.
   * Libovolný React uzel — SVG, obrázek, komponenta…
   */
  icon?: React.ReactNode;
  /**
   * Časový limit automatického zavření v ms.
   * Nastavte na `0` pro trvalou notifikaci, kterou je nutné zavřít ručně.
   * @default 4000
   */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, 'variant' | 'title' | 'duration'>> {
  id: string;
  content?: string;
  icon?: React.ReactNode;
  lifecycle: ToastLifecycle;
  /** Measured height in px — filled in after first render. */
  height: number;
}

/** Hodnota vrácená hookem `useToast()`. */
export interface ToastContextValue {
  /**
   * Vyvolá novou notifikaci.
   * Vrací vygenerované `id` pro případné ruční zavření.
   *
   * @example
   * ```tsx
   * const { toast } = useToast();
   * toast({ variant: 'success', title: 'Uloženo', content: 'Změny byly uloženy.' });
   * ```
   */
  toast: (options: ToastOptions) => string;
  /**
   * Ručně zavře notifikaci podle jejího `id`.
   * Toast se nejprve animovaně vysune a poté se odebere z DOM.
   *
   * @example
   * ```tsx
   * const id = toast({ variant: 'info', title: 'Načítání…', duration: 0 });
   * await work();
   * dismiss(id);
   * ```
   */
  dismiss: (id: string) => void;
}

/** Props pro `<ToasterProvider>`. */
export interface ToasterProviderProps {
  children: React.ReactNode;
  /**
   * Pozice notifikací na obrazovce.
   * @default 'bottom-right'
   */
  position?: ToastPosition;
  /**
   * Šířka jednotlivé notifikace v px.
   * @default 380
   */
  toastWidth?: number;
  /**
   * Vertikální mezera mezi notifikacemi v **rozbalené** (hovered) podobě, v px.
   * @default 8
   */
  gap?: number;
  /**
   * Vzdálenost od okraje obrazovky v px.
   * @default 16
   */
  offset?: number;
  /**
   * Maximální počet notifikací v DOM najednou.
   * Nejstarší se odebírají při překročení limitu.
   * @default 5
   */
  maxToasts?: number;
  /**
   * Globální výchozí doba trvání notifikace v ms.
   * Přepíše se hodnotou `duration` v `toast()`, pokud je zadána.
   * Nastavte na `0` pro trvalé notifikace.
   * @default 4000
   */
  duration?: number;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── ID generator ─────────────────────────────────────────────────────────────

let _counter = 0;
const uid = () => `sm-toast-${++_counter}-${Date.now()}`;

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Poskytuje toast kontext a vykresluje overlay s notifikacemi.
 * Umístěte **jednou** blízko kořene vaší aplikace.
 *
 * @example
 * ```tsx
 * // main.tsx / App.tsx
 * <ToasterProvider position="bottom-right">
 *   <App />
 * </ToasterProvider>
 * ```
 */
export const ToasterProvider: React.FC<ToasterProviderProps> = ({
  children,
  position = 'bottom-right',
  toastWidth = 380,
  gap = 8,
  offset = 16,
  maxToasts = 5,
  duration: globalDuration = 4000,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, lifecycle: 'leaving' as ToastLifecycle } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TRANSITION_DURATION + 100);
  }, []);

  const toast = useCallback(
    (options: ToastOptions): string => {
      const id = uid();
      const effectiveDuration = options.duration ?? globalDuration;
      const item: ToastItem = {
        id,
        variant: options.variant ?? 'info',
        title: options.title,
        content: options.content,
        icon: options.icon,
        duration: effectiveDuration,
        lifecycle: 'entering',
        height: 0,
      };

      setToasts((prev) => {
        const next = [...prev, item];
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
      });

      // entering → visible on next frame (triggers slide-in)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) =>
            prev.map((t) =>
              t.id === id ? { ...t, lifecycle: 'visible' as ToastLifecycle } : t,
            ),
          );
        });
      });

      // Auto-dismiss
      if (effectiveDuration > 0) {
        setTimeout(() => dismiss(id), effectiveDuration);
      }

      return id;
    },
    [maxToasts, dismiss, globalDuration],
  );

  const handleHeightMeasured = useCallback((id: string, height: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id && t.height !== height ? { ...t, height } : t)),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {toasts.length > 0 && (
        <StackContainerWrapper
          toasts={toasts}
          position={position}
          toastWidth={toastWidth}
          gap={gap}
          offset={offset}
          onDismiss={dismiss}
          onHeightMeasured={handleHeightMeasured}
        />
      )}
    </ToastContext.Provider>
  );
};

// ─── StackContainerWrapper + expanded card logic ──────────────────────────────
// Extracted to avoid TypeScript complaints about the expandedTransformOverride prop.

interface CardWithOverrideProps {
  item: ToastItem;
  depthIndex: number;
  stackSize: number;
  expanded: boolean;
  isBottom: boolean;
  appeared: boolean;
  toastWidth: number;
  onDismiss: (id: string) => void;
  onHeightMeasured: (id: string, h: number) => void;
  expandedTransformOverride?: string;
}

const CardWithOverride: React.FC<CardWithOverrideProps> = ({
  expandedTransformOverride,
  item,
  depthIndex,
  stackSize,
  expanded,
  isBottom,
  appeared,
  toastWidth,
  onDismiss,
  onHeightMeasured,
}) => {
  const isLeaving = item.lifecycle === 'leaving';
  const slideOut = !appeared || isLeaving;

  const scale = expanded ? 1 : Math.max(0.7, 1 - depthIndex * STACK_SCALE_STEP);
  const peekOffset = expanded ? 0 : depthIndex * STACK_PEEK_PX;
  const translateY = isBottom ? -peekOffset : peekOffset;

  // Slide-in direction follows the toaster position:
  // bottom-* → toast enters from below, top-* → from above
  const slideTransform = isBottom
    ? 'translateY(calc(100% + 32px))'
    : 'translateY(calc(-100% - 32px))';

  const transform = slideOut
    ? slideTransform
    : expandedTransformOverride
      ? expandedTransformOverride
      : `scale(${scale}) translateY(${translateY}px)`;

  const opacity = (() => {
    if (slideOut) return 0;
    if (expanded) return 1;
    return Math.max(0.4, 1 - depthIndex * 0.18);
  })();

  const isHiddenByDepth = !expanded && depthIndex >= MAX_VISIBLE_COLLAPSED;
  const zIndex = stackSize - depthIndex;

  const measuredRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el && item.height === 0) onHeightMeasured(item.id, el.offsetHeight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.id, item.height === 0],
  );

  return (
    <div
      ref={measuredRef}
      style={{
        position: 'absolute',
        bottom: isBottom ? 0 : 'auto',
        top: isBottom ? 'auto' : 0,
        left: 0,
        right: 0,
        transformOrigin: isBottom ? 'bottom center' : 'top center',
        transform,
        opacity: isHiddenByDepth ? 0 : opacity,
        zIndex,
        transition: [
          `transform ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          `opacity ${TRANSITION_DURATION}ms ease`,
        ].join(', '),
        pointerEvents: depthIndex === 0 ? 'auto' : expanded ? 'auto' : 'none',
        backdropFilter: 'blur(32px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
        borderRadius: '8px',
      }}
    >
      <Toast
        variant={item.variant}
        title={item.title}
        content={item.content}
        icon={item.icon}
        onClose={() => onDismiss(item.id)}
        style={{ width: toastWidth, maxWidth: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
};

interface StackContainerWrapperProps {
  toasts: ToastItem[];
  position: ToastPosition;
  toastWidth: number;
  gap: number;
  offset: number;
  onDismiss: (id: string) => void;
  onHeightMeasured: (id: string, h: number) => void;
}

const StackContainerWrapper: React.FC<StackContainerWrapperProps> = ({
  toasts,
  position,
  toastWidth,
  gap,
  offset,
  onDismiss,
  onHeightMeasured,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [appearedIds, setAppearedIds] = useState<Set<string>>(new Set());

  const isBottom = position.startsWith('bottom');
  const isRight = position.endsWith('right');
  const isCenter = position.endsWith('center');

  // Track appeared toasts
  useEffect(() => {
    setAppearedIds((prev) => {
      const next = new Set(prev);
      toasts.forEach((t) => { if (t.lifecycle === 'visible') next.add(t.id); });
      // Clean up removed
      [...next].forEach((id) => { if (!toasts.find((t) => t.id === id)) next.delete(id); });
      return next;
    });
  }, [toasts]);

  const frontToast = toasts[toasts.length - 1];
  const frontHeight = frontToast?.height || 80;

  const collapsedHeight =
    frontHeight + Math.min(toasts.length - 1, MAX_VISIBLE_COLLAPSED - 1) * STACK_PEEK_PX;

  const expandedHeight =
    toasts.reduce((sum, t) => sum + (t.height || 80), 0) +
    Math.max(0, toasts.length - 1) * gap;

  const containerHeight = expanded ? expandedHeight : collapsedHeight;

  const horizontalStyle: React.CSSProperties = isCenter
    ? { left: '50%', transform: 'translateX(-50%)' }
    : isRight
      ? { right: offset }
      : { left: offset };

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        width: toastWidth,
        maxWidth: `calc(100vw - ${offset * 2}px)`,
        height: containerHeight,
        ...(isBottom ? { bottom: offset } : { top: offset }),
        ...horizontalStyle,
        transition: `height ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((item, arrayIndex) => {
        const depthIndex = toasts.length - 1 - arrayIndex;
        const appeared = appearedIds.has(item.id);
        const isLeaving = item.lifecycle === 'leaving';
        const slideOut = !appeared || isLeaving;

        // In expanded mode, offset each card so they stack vertically
        let expandedTransformOverride: string | undefined;
        if (expanded && !slideOut) {
          // Sum up heights of toasts that appear "after" (closer to front) this one
          const toastsInFront = toasts.slice(arrayIndex + 1);
          const offsetPx = toastsInFront.reduce(
            (sum, t) => sum + (t.height || 80) + gap,
            0,
          );
          // bottom positions: container anchored at bottom, older toasts must go UP → negative Y
          // top positions: container anchored at top, older toasts must go DOWN → positive Y
          const yOffset = isBottom ? -offsetPx : offsetPx;
          expandedTransformOverride = `translateY(${yOffset}px)`;
        }

        return (
          <CardWithOverride
            key={item.id}
            item={item}
            depthIndex={depthIndex}
            stackSize={toasts.length}
            expanded={expanded}
            isBottom={isBottom}
            appeared={appeared}
            toastWidth={toastWidth}
            onDismiss={onDismiss}
            onHeightMeasured={onHeightMeasured}
            expandedTransformOverride={expandedTransformOverride}
          />
        );
      })}
    </div>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Vrací `{ toast, dismiss }` pro vyvolání a zavření notifikací.
 * Musí být volán uvnitř stromu `<ToasterProvider>`.
 *
 * @throws Při volání mimo `<ToasterProvider>`.
 *
 * @example
 * ```tsx
 * function UlozitTlacitko() {
 *   const { toast } = useToast();
 *   return (
 *     <Button onClick={() => toast({ variant: 'success', title: 'Uloženo!' })}>
 *       Uložit
 *     </Button>
 *   );
 * }
 * ```
 */
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      '[sm-ui] useToast() musí být volán uvnitř <ToasterProvider>. ' +
        'Obalte kořen vaší aplikace pomocí <ToasterProvider>.',
    );
  }
  return ctx;
};
