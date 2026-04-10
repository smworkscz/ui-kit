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

export interface CommandItem {
  /** Unikátní identifikátor příkazu. */
  id: string;
  /** Hlavní text příkazu. */
  label: string;
  /** Volitelný popis příkazu. */
  description?: string;
  /** Volitelná ikona příkazu. */
  icon?: React.ReactNode;
  /** Klávesová zkratka (zobrazena jako badge). */
  shortcut?: string;
  /** Voláno při výběru příkazu. */
  onSelect: () => void;
}

export interface CommandGroup {
  /** Název skupiny příkazů. */
  label: string;
  /** Položky ve skupině. */
  items: CommandItem[];
}

export interface CommandMenuProps {
  /** Řídí zobrazení command menu. */
  open: boolean;
  /** Voláno při zavření command menu. */
  onClose: () => void;
  /** Skupiny příkazů k zobrazení. */
  groups: CommandGroup[];
  /** Placeholder text vyhledávacího pole. @default 'Zadejte příkaz...' */
  placeholder?: string;
  /** Další inline styly pro kartu. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── CommandMenu ────────────────────────────────────────────────────────────

/**
 * Rozšířený command palette s podporou skupin příkazů a klávesových zkratek.
 *
 * Filtruje příkazy podle vyhledávacího řetězce, podporuje klávesovou
 * navigaci (šipky, Enter, Escape) a zobrazuje klávesové zkratky.
 *
 * @example
 * ```tsx
 * <CommandMenu
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   groups={[
 *     { label: 'Akce', items: [{ id: '1', label: 'Uložit', shortcut: '⌘S', onSelect: save }] },
 *   ]}
 * />
 * ```
 */
export const CommandMenu: React.FC<CommandMenuProps> = ({
  open,
  onClose,
  groups,
  placeholder = 'Zadejte příkaz...',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Hide scrollbar (webkit) ──────────────────────────────────────────

  useEffect(() => {
    const id = 'sm-commandmenu-scrollbar-hide';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `.commandmenu-results::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(s);
  }, []);

  // ── Filter groups by query ─────────────────────────────────────────────

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  // ── Flatten for keyboard navigation ────────────────────────────────────

  const flatItems: CommandItem[] = filteredGroups.flatMap((g) => g.items);

  // ── Open / close animation ─────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlightIndex(-1);
      setVisible(true);
      setAnimState('opening');
      const timer = setTimeout(() => {
        setAnimState('open');
      }, 10);
      return () => clearTimeout(timer);
    } else if (visible) {
      setAnimState('closing');
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ── Auto-focus input ───────────────────────────────────────────────────

  useEffect(() => {
    if (visible && animState === 'open') {
      inputRef.current?.focus();
    }
  }, [visible, animState]);

  // ── Reset highlight when query changes ─────────────────────────────────

  useEffect(() => {
    setHighlightIndex(-1);
  }, [query]);

  // ── Scroll highlighted item into view ──────────────────────────────────

  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-cmd-index="${highlightIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  // ── Keyboard ───────────────────────────────────────────────────────────

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

  // ── Animation styles ───────────────────────────────────────────────────

  const getOverlayStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { transition: `opacity ${ANIM_DURATION}ms ease` };
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

  // ── Build flat index counter ───────────────────────────────────────────

  let flatIndex = 0;

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

      {/* Karta command menu */}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          className="commandmenu-results"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none' as any,
          }}
        >
          {filteredGroups.length === 0 ? (
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
            filteredGroups.map((group) => (
              <div key={group.label} role="group" aria-label={group.label}>
                {/* Záhlaví skupiny */}
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
                  {group.label}
                </div>

                {/* Položky */}
                {group.items.map((item) => {
                  const currentFlatIndex = flatIndex++;
                  const isHighlighted = currentFlatIndex === highlightIndex;

                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isHighlighted}
                      data-cmd-index={currentFlatIndex}
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
                      onMouseEnter={() => setHighlightIndex(currentFlatIndex)}
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

                      {/* Klávesová zkratka */}
                      {item.shortcut && (
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
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
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

CommandMenu.displayName = 'CommandMenu';
