import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    overlay: 'rgba(0,0,0,0.4)',
    cardBg: 'rgba(24,24,24,0.65)',
    cardBorder: 'rgba(255,255,255,0.1)',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(255,255,255,0.1)',
    inputText: '#ffffff',
    inputPlaceholder: '#888888',
    text: '#eaeaea',
    textSecondary: '#888888',
    categoryText: 'rgba(255,255,255,0.4)',
    hoverBg: 'rgba(255,255,255,0.06)',
    activeBg: 'rgba(255,255,255,0.1)',
    divider: 'rgba(255,255,255,0.08)',
    kbdBg: 'rgba(255,255,255,0.08)',
    kbdBorder: 'rgba(255,255,255,0.12)',
    kbdText: '#888888',
    shadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
    emptyText: '#666666',
  },
  light: {
    overlay: 'rgba(0,0,0,0.18)',
    cardBg: 'rgba(255,255,255,0.65)',
    cardBorder: 'rgba(0,0,0,0.08)',
    inputBg: 'rgba(0,0,0,0.04)',
    inputBorder: 'rgba(0,0,0,0.08)',
    inputText: '#1a1a1a',
    inputPlaceholder: '#999999',
    text: '#1a1a1a',
    textSecondary: '#666666',
    categoryText: 'rgba(0,0,0,0.4)',
    hoverBg: 'rgba(0,0,0,0.04)',
    activeBg: 'rgba(0,0,0,0.07)',
    divider: 'rgba(0,0,0,0.06)',
    kbdBg: 'rgba(0,0,0,0.05)',
    kbdBorder: 'rgba(0,0,0,0.1)',
    kbdText: '#999999',
    shadow: '0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03) inset',
    emptyText: '#999999',
  },
} as const;

// ─── Animation duration ─────────────────────────────────────────────────────

const ANIM_DURATION = 180; // ms

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SpotlightItem {
  /** Unikátní identifikátor položky. */
  id: string;
  /** Hlavní zobrazovaný text. */
  label: string;
  /** Volitelný sekundární popis. */
  description?: string;
  /** Kategorie pro vizuální seskupení (např. "Komponenty", "Hooky"). */
  category: string;
  /** Volitelná ikona vedle textu. */
  icon?: React.ReactNode;
  /** Voláno při výběru položky (klik nebo Enter). */
  onSelect: () => void;
}

export interface SpotlightProps {
  /** Řídí zobrazení spotlightu. */
  open: boolean;
  /** Voláno při zavření spotlightu. */
  onClose: () => void;
  /** Aktuální hodnota vyhledávacího vstupu (řízená komponenta). */
  value: string;
  /** Voláno při změně vyhledávacího vstupu. */
  onChange: (value: string) => void;
  /** Již filtrované výsledky k zobrazení, seskupené dle `category`. */
  results: SpotlightItem[];
  /** Placeholder text pro vyhledávací vstup. @default 'Hledat...' */
  placeholder?: string;
  /** Dodatečná CSS třída pro kartu spotlightu. */
  className?: string;
  /** Další inline styly pro kartu spotlightu. */
  style?: React.CSSProperties;
}

// ─── Spotlight ──────────────────────────────────────────────────────────────

/**
 * Command-palette / spotlight overlay dle SM-UI design systému.
 *
 * Řízená komponenta – přijímá `value`, `onChange` a předfiltrované `results`.
 * Logika filtrování zůstává na konzumentovi.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * const [query, setQuery] = useState('');
 * const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
 *
 * <Spotlight
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   value={query}
 *   onChange={setQuery}
 *   results={filtered}
 * />
 * ```
 */
export const Spotlight: React.FC<SpotlightProps> = ({
  open,
  onClose,
  value,
  onChange,
  results,
  placeholder = 'Hledat...',
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Hide scrollbar (webkit) ──────────────────────────────────────────

  useEffect(() => {
    const id = 'sm-spotlight-scrollbar-hide';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `.spotlight-results::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
  }, []);

  // ── Flatten results for keyboard navigation ─────────────────────────────

  const flatItems = results;

  // ── Open / close animation ──────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimState('opening');
      setHighlightIndex(-1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState('open'));
      });
    } else if (visible) {
      setAnimState('closing');
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ── Auto-focus input ────────────────────────────────────────────────────

  useEffect(() => {
    if (visible && animState === 'open') {
      inputRef.current?.focus();
    }
  }, [visible, animState]);

  // ── Reset highlight when results change ─────────────────────────────────

  useEffect(() => {
    setHighlightIndex(-1);
  }, [results]);

  // ── Scroll highlighted item into view ───────────────────────────────────

  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-spotlight-index="${highlightIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  // ── Keyboard ────────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown': {
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev + 1;
            return next >= flatItems.length ? 0 : next;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? flatItems.length - 1 : next;
          });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (highlightIndex >= 0 && highlightIndex < flatItems.length) {
            flatItems[highlightIndex].onSelect();
            onClose();
          }
          break;
        }
      }
    },
    [flatItems, highlightIndex, onClose],
  );

  // ── Group results by category ───────────────────────────────────────────

  const grouped: { category: string; items: (SpotlightItem & { flatIndex: number })[] }[] = [];
  const categoryMap = new Map<string, (SpotlightItem & { flatIndex: number })[]>();

  flatItems.forEach((item, idx) => {
    let arr = categoryMap.get(item.category);
    if (!arr) {
      arr = [];
      categoryMap.set(item.category, arr);
      grouped.push({ category: item.category, items: arr });
    }
    arr.push({ ...item, flatIndex: idx });
  });

  // ── Animation styles ────────────────────────────────────────────────────

  const getOverlayStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms ease`,
    };
    if (animState === 'opening' || animState === 'idle') return { ...base, opacity: 0 };
    if (animState === 'open') return { ...base, opacity: 1 };
    return { ...base, opacity: 0, pointerEvents: 'none' };
  };

  const getCardAnimStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    if (animState === 'opening' || animState === 'idle') {
      return { ...base, opacity: 0, transform: 'scale(0.95) translateY(-10px)' };
    }
    if (animState === 'open') {
      return { ...base, opacity: 1, transform: 'scale(1) translateY(0)' };
    }
    return { ...base, opacity: 0, transform: 'scale(0.97) translateY(-6px)', pointerEvents: 'none' };
  };

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '18vh',
        ...getOverlayStyle(),
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Překryvná vrstva */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: t.overlay,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Karta spotlightu */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={className}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '560px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '60vh',
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '16px',
          boxShadow: t.shadow,
          backdropFilter: 'blur(32px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
          overflow: 'hidden',
          boxSizing: 'border-box',
          ...getCardAnimStyle(),
          ...style,
        }}
      >
        {/* Vyhledávací vstup */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderBottom: `1px solid ${t.divider}`,
          }}
        >
          <MagnifyingGlassIcon size={18} color={t.textSecondary} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 400,
              color: t.inputText,
              caretColor: '#FC4F00',
            }}
          />
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: t.kbdBg,
              border: `1px solid ${t.kbdBorder}`,
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              color: t.kbdText,
              lineHeight: 'normal',
              flexShrink: 0,
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Výsledky */}
        <div
          ref={listRef}
          role="listbox"
          className="spotlight-results"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px',
            scrollbarWidth: 'none',            /* Firefox */
            msOverflowStyle: 'none' as any,    /* IE/Edge */
          }}
        >
          {grouped.length === 0 ? (
            <div
              style={{
                padding: '24px 10px',
                textAlign: 'center',
                fontFamily: "'Zalando Sans', sans-serif",
                fontSize: '14px',
                color: t.emptyText,
              }}
            >
              Žádné výsledky
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} role="group" aria-label={group.category}>
                {/* Záhlaví kategorie */}
                <div
                  style={{
                    padding: '8px 10px 4px',
                    fontFamily: "'Zalando Sans Expanded', sans-serif",
                    fontSize: '10px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: t.categoryText,
                    userSelect: 'none',
                  }}
                >
                  {group.category}
                </div>

                {/* Položky */}
                {group.items.map((item) => {
                  const isHighlighted = item.flatIndex === highlightIndex;

                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isHighlighted}
                      data-spotlight-index={item.flatIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isHighlighted ? t.hoverBg : 'transparent',
                        transition: 'background-color 0.1s ease',
                        userSelect: 'none',
                      }}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setHighlightIndex(item.flatIndex)}
                      onMouseLeave={() => setHighlightIndex(-1)}
                    >
                      {/* Ikona */}
                      {item.icon && (
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            flexShrink: 0,
                            borderRadius: '8px',
                            backgroundColor: isHighlighted ? t.activeBg : t.hoverBg,
                            color: t.text,
                            transition: 'background-color 0.1s ease',
                          }}
                        >
                          {item.icon}
                        </span>
                      )}

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Zalando Sans', sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            color: t.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </div>
                        {item.description && (
                          <div
                            style={{
                              fontFamily: "'Zalando Sans', sans-serif",
                              fontSize: '12px',
                              fontWeight: 400,
                              color: t.textSecondary,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginTop: '1px',
                            }}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

Spotlight.displayName = 'Spotlight';
