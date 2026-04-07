import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    text: '#ffffff',
    textSecondary: '#ACACAC',
    textMuted: '#888888',
    line: 'rgba(255,255,255,0.1)',
    dotBorder: '#FC4F00',
    dotBg: 'rgba(252,79,0,0.15)',
    iconBg: 'rgba(252,79,0,0.12)',
    cardBg: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.08)',
  },
  light: {
    text: '#1a1a1a',
    textSecondary: '#333333',
    textMuted: '#999999',
    line: 'rgba(0,0,0,0.08)',
    dotBorder: '#FC4F00',
    dotBg: 'rgba(252,79,0,0.08)',
    iconBg: 'rgba(252,79,0,0.06)',
    cardBg: 'rgba(0,0,0,0.02)',
    cardBorder: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Položka časové osy. */
export interface TimelineItem {
  /** Nadpis události. */
  title: string;
  /** Volitelný popis události. */
  description?: string;
  /** Volitelný datum / časový údaj. */
  date?: string;
  /** Vlastní ikona místo výchozí tečky. */
  icon?: React.ReactNode;
  /** Barva tečky nebo pozadí ikony. @default '#FC4F00' */
  color?: string;
}

export interface TimelineProps {
  /** Položky časové osy. */
  items: TimelineItem[];
  /** Orientace časové osy. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Timeline ───────────────────────────────────────────────────────────────

/**
 * Časová osa s tečkami nebo ikonami.
 *
 * Podporuje vertikální i horizontální orientaci.
 * Každá položka zobrazuje nadpis, volitelný popis a datum.
 * Ikona nebo barevná tečka je propojená čárou.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { title: 'Odesláno', date: '10:00', description: 'Objednávka byla vytvořena.' },
 *     { title: 'Doručeno', date: '14:30', color: '#00A205' },
 *   ]}
 * />
 * ```
 */
export const Timeline: React.FC<TimelineProps> = ({ items, orientation = 'vertical', style, className }) => {
  const theme = useTheme();
  const t = tokens[theme];

  if (orientation === 'horizontal') {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: '14px',
          color: t.text,
          overflow: 'auto',
          ...style,
        }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const dotColor = item.color || t.dotBorder;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: isLast ? '0 0 auto' : '1 1 0',
                minWidth: '120px',
                position: 'relative',
              }}
            >
              {/* Top row: dot/icon + horizontal line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  position: 'relative',
                }}
              >
                {/* Line before dot */}
                {idx > 0 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: t.line,
                    }}
                  />
                )}
                {idx === 0 && <div style={{ flex: 1 }} />}

                {/* Dot or icon */}
                {item.icon ? (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: item.color ? `${item.color}18` : t.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: dotColor,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: `2px solid ${dotColor}`,
                      backgroundColor: t.dotBg,
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Line after dot */}
                {!isLast && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: t.line,
                    }}
                  />
                )}
                {isLast && <div style={{ flex: 1 }} />}
              </div>

              {/* Content below */}
              <div
                style={{
                  textAlign: 'center',
                  paddingTop: '10px',
                  maxWidth: '140px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Zalando Sans Expanded', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '18px',
                    display: 'block',
                  }}
                >
                  {item.title}
                </span>
                {item.date && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: t.textMuted,
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    {item.date}
                  </span>
                )}
                {item.description && (
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '12px',
                      color: t.textSecondary,
                      lineHeight: '16px',
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical orientation (default)
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: '14px',
        color: t.text,
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const dotColor = item.color || t.dotBorder;

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              position: 'relative',
              paddingBottom: isLast ? 0 : '4px',
              minHeight: item.icon ? '36px' : '28px',
            }}
          >
            {/* Left column: dot/icon + line */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                width: '32px',
                marginRight: '14px',
              }}
            >
              {/* Dot or icon */}
              {item.icon ? (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                      ? `${item.color}18`
                      : t.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: dotColor,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
              ) : (
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: `2px solid ${dotColor}`,
                    backgroundColor: t.dotBg,
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                />
              )}

              {/* Vertical line */}
              {!isLast && (
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    backgroundColor: t.line,
                    marginTop: '4px',
                    minHeight: '8px',
                  }}
                />
              )}
            </div>

            {/* Right column: content */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: item.icon ? '5px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: "'Zalando Sans Expanded', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px',
                  }}
                >
                  {item.title}
                </span>
                {item.date && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: t.textMuted,
                      flexShrink: 0,
                    }}
                  >
                    {item.date}
                  </span>
                )}
              </div>
              {item.description && (
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '13px',
                    color: t.textSecondary,
                    lineHeight: '18px',
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Timeline.displayName = 'Timeline';
