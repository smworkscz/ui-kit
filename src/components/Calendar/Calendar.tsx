import React, { useState, useMemo, useCallback } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    surface: 'rgba(24,24,24,0.95)',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    textMuted: '#888888',
    hover: 'rgba(255,255,255,0.06)',
    todayBg: 'rgba(252,79,0,0.12)',
    todayBorder: '#FC4F00',
    selectedBg: '#FC4F00',
    selectedText: '#ffffff',
    headerBg: 'rgba(255,255,255,0.04)',
    outsideText: 'rgba(255,255,255,0.2)',
    eventDot: '#FC4F00',
    navHover: 'rgba(255,255,255,0.08)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    surface: 'rgba(255,255,255,0.95)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    textMuted: '#999999',
    hover: 'rgba(0,0,0,0.04)',
    todayBg: 'rgba(252,79,0,0.08)',
    todayBorder: '#FC4F00',
    selectedBg: '#FC4F00',
    selectedText: '#ffffff',
    headerBg: 'rgba(0,0,0,0.02)',
    outsideText: 'rgba(0,0,0,0.2)',
    eventDot: '#FC4F00',
    navHover: 'rgba(0,0,0,0.06)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Událost zobrazená v kalendáři. */
export interface CalendarEvent {
  /** Datum události. */
  date: Date;
  /** Název události. */
  title: string;
  /** Barva tečky/indikátoru. @default '#FC4F00' */
  color?: string;
}

export interface CalendarProps {
  /** Aktuálně vybraný datum. */
  value?: Date | null;
  /** Callback při výběru data. */
  onChange?: (date: Date) => void;
  /** Režim zobrazení. @default 'month' */
  view?: 'month' | 'week';
  /** Události k zobrazení (vizuální indikátory — barevné tečky). */
  events?: CalendarEvent[];
  /** Minimální povolený datum. */
  minDate?: Date;
  /** Maximální povolený datum. */
  maxDate?: Date;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const MONTH_LABELS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday-first
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMonthGrid = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const start = startOfWeek(firstDay);
  const days: Date[] = [];
  const current = new Date(start);
  // always generate 42 cells (6 rows)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const getWeekGrid = (date: Date): Date[] => {
  const start = startOfWeek(date);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate) {
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    if (date < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate);
    max.setHours(23, 59, 59, 999);
    if (date > max) return true;
  }
  return false;
};

// ─── Calendar ───────────────────────────────────────────────────────────────

/**
 * Kalendářní komponenta s měsíčním a týdenním zobrazením.
 *
 * Podporuje výběr data, zobrazení událostí (barevné tečky),
 * navigaci mezi měsíci/týdny a omezení rozsahu dat.
 *
 * @example
 * ```tsx
 * <Calendar
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   events={[{ date: new Date(), title: 'Meeting', color: '#00A205' }]}
 * />
 * ```
 */
export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  view = 'month',
  events = [],
  minDate,
  maxDate,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = useState(() => value ? value.getMonth() : today.getMonth());
  const [currentYear, setCurrentYear] = useState(() => value ? value.getFullYear() : today.getFullYear());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(value || today));
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const days = useMemo(() => {
    if (view === 'week') return getWeekGrid(currentWeekStart);
    return getMonthGrid(currentYear, currentMonth);
  }, [view, currentYear, currentMonth, currentWeekStart]);

  const navigatePrev = useCallback(() => {
    if (view === 'week') {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d;
      });
    } else {
      setCurrentMonth((prev) => {
        if (prev === 0) {
          setCurrentYear((y) => y - 1);
          return 11;
        }
        return prev - 1;
      });
    }
  }, [view]);

  const navigateNext = useCallback(() => {
    if (view === 'week') {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      });
    } else {
      setCurrentMonth((prev) => {
        if (prev === 11) {
          setCurrentYear((y) => y + 1);
          return 0;
        }
        return prev + 1;
      });
    }
  }, [view]);

  const getEventsForDay = (date: Date) =>
    events.filter((ev) => isSameDay(ev.date, date));

  const headerLabel = view === 'week'
    ? (() => {
        const end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);
        const sameMonth = currentWeekStart.getMonth() === end.getMonth();
        if (sameMonth) {
          return `${currentWeekStart.getDate()}. – ${end.getDate()}. ${MONTH_LABELS[end.getMonth()]} ${end.getFullYear()}`;
        }
        return `${currentWeekStart.getDate()}. ${MONTH_LABELS[currentWeekStart.getMonth()].slice(0, 3)} – ${end.getDate()}. ${MONTH_LABELS[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
      })()
    : `${MONTH_LABELS[currentMonth]} ${currentYear}`;

  const containerStyle: React.CSSProperties = {
    backgroundColor: t.background,
    border: `1px solid ${t.border}`,
    borderRadius: '12px',
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    color: t.text,
    overflow: 'hidden',
    userSelect: 'none',
    ...style,
  };

  const navBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: t.text,
    cursor: 'pointer',
    transition: 'background-color 0.12s ease',
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: t.headerBg,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <button
          style={navBtnStyle}
          onClick={navigatePrev}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.navHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          aria-label="Předchozí"
        >
          <CaretLeftIcon size={16} />
        </button>
        <span
          style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {headerLabel}
        </span>
        <button
          style={navBtnStyle}
          onClick={navigateNext}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.navHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          aria-label="Další"
        >
          <CaretRightIcon size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0', padding: '8px 12px 0' }}>
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            style={{
              textAlign: 'center',
              fontFamily: "'Zalando Sans Expanded', sans-serif",
              fontSize: '10px',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: t.textMuted,
              padding: '6px 0 8px',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', padding: '0 12px 12px' }}>
        {days.map((day, idx) => {
          const isToday = isSameDay(day, today);
          const isSelected = value ? isSameDay(day, value) : false;
          const isOutside = view === 'month' && day.getMonth() !== currentMonth;
          const disabled = isDateDisabled(day, minDate, maxDate);
          const dayKey = day.toISOString();
          const isHovered = hoveredDay === dayKey;
          const dayEvents = getEventsForDay(day);

          let cellBg: string = 'transparent';
          let cellColor: string = isOutside ? t.outsideText : t.text;
          let cellBorder: string = '2px solid transparent';

          if (isSelected) {
            cellBg = t.selectedBg;
            cellColor = t.selectedText;
          } else if (isToday) {
            cellBg = t.todayBg;
            cellBorder = `2px solid ${t.todayBorder}`;
          } else if (isHovered && !disabled) {
            cellBg = t.hover;
          }

          if (disabled) {
            cellColor = t.textMuted;
          }

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px',
                minHeight: '44px',
              }}
            >
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: cellBorder,
                  background: cellBg,
                  color: cellColor,
                  fontSize: '13px',
                  fontWeight: isToday ? 600 : 400,
                  fontFamily: "'Zalando Sans', sans-serif",
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.4 : 1,
                  transition: 'background-color 0.12s ease',
                }}
                disabled={disabled}
                onClick={() => {
                  if (!disabled && onChange) onChange(day);
                }}
                onMouseEnter={() => !disabled && setHoveredDay(dayKey)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {day.getDate()}
              </button>
              {/* Event dots — visual indicators only */}
              {dayEvents.length > 0 && (
                <div style={{ display: 'flex', gap: '3px', marginTop: '3px', height: '5px' }}>
                  {dayEvents.slice(0, 3).map((ev, evIdx) => (
                    <div
                      key={evIdx}
                      title={ev.title}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: ev.color || t.eventDot,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';
