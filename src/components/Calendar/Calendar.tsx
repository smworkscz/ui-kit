import React, { useState, useMemo, useCallback } from 'react';
import { CaretLeft as CaretLeftIcon, CaretRight as CaretRightIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';
import { Tooltip } from '../Tooltip/Tooltip';

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
    // Full-size specific
    cellBorder: 'rgba(255,255,255,0.06)',
    todayCellBg: 'rgba(252,79,0,0.06)',
    eventBarDefault: '#1a3a5c',
    eventBarText: '#ffffff',
    moreText: '#ACACAC',
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
    // Full-size specific
    cellBorder: 'rgba(0,0,0,0.08)',
    todayCellBg: 'rgba(252,79,0,0.04)',
    eventBarDefault: '#0a1e3d',
    eventBarText: '#ffffff',
    moreText: '#888888',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Událost zobrazená v kalendáři. */
export interface CalendarEvent {
  /** Unikátní ID události. */
  id?: string;
  /** Datum události (začátek). */
  date: Date;
  /** Konec události (pro vícedenní). Pokud není zadáno, rovná se `date`. */
  endDate?: Date;
  /** Název události. */
  title: string;
  /** Barva pozadí baru/tečky. @default '#FC4F00' */
  color?: string;
  /** Barva textu na baru. @default '#ffffff' */
  textColor?: string;
  /** Emoji zobrazené před názvem. */
  emoji?: string;
  /** Obsah tooltipu. Pokud je nastaveno, event bar se obalí tooltipem. */
  tooltip?: string | React.ReactNode;
}

export interface CalendarProps {
  /** Aktuálně vybraný datum. */
  value?: Date | null;
  /** Callback při výběru data. */
  onChange?: (date: Date) => void;
  /** Režim zobrazení. @default 'month' */
  view?: 'month' | 'week';
  /** Události k zobrazení. */
  events?: CalendarEvent[];
  /** Callback při kliknutí na událost (fullSize mode). */
  onEventClick?: (event: CalendarEvent) => void;
  /** Plnohodnotný kalendář s event bary místo teček. @default false */
  fullSize?: boolean;
  /** První den v týdnu: 0 = neděle, 1 = pondělí. @default 1 */
  firstDay?: 0 | 1;
  /** Jazyk. @default 'cs' */
  locale?: 'cs' | 'en';
  /** Max viditelných událostí v buňce (fullSize). @default 3 */
  maxEventsPerDay?: number;
  /** Zobrazit navigační hlavičku (měsíc + šipky). @default true */
  showHeader?: boolean;
  /** Callback při změně zobrazeného měsíce/týdne. Vrací první den zobrazeného období. */
  onNavigate?: (date: Date) => void;
  /** Počáteční datum pro navigaci (neřízený). @default new Date() */
  initialDate?: Date;
  /** Minimální povolený datum. */
  minDate?: Date;
  /** Maximální povolený datum. */
  maxDate?: Date;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Locale data ───────────────────────────────────────────────────────────

const LOCALE_DATA = {
  cs: {
    days: ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne'],
    daysFull: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    months: [
      'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
      'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
    ],
  },
  en: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    daysFull: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
  },
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const startOfDay = (d: Date): Date => {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
};

const startOfWeek = (date: Date, firstDay: 0 | 1 = 1): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = firstDay === 1
    ? (day === 0 ? -6 : 1) - day
    : -day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMonthGrid = (year: number, month: number, firstDay: 0 | 1 = 1): Date[] => {
  const firstOfMonth = new Date(year, month, 1);
  const start = startOfWeek(firstOfMonth, firstDay);
  const days: Date[] = [];
  const current = new Date(start);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const getWeekGrid = (date: Date, firstDay: 0 | 1 = 1): Date[] => {
  const start = startOfWeek(date, firstDay);
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

// ─── Full-size event layout engine ─────────────────────────────────────────

interface EventPlacement {
  event: CalendarEvent;
  /** Row index (0-based) within the day cell */
  row: number;
  /** Column index within the week (0-6) where this event starts (or continues from) */
  startCol: number;
  /** How many columns this event bar spans in this week-row */
  span: number;
  /** Is this the first cell of the event (show label) */
  isStart: boolean;
}

/**
 * For a given week (array of 7 dates), compute event placements so that
 * multi-day events span across columns and events are stacked without overlap.
 */
function computeWeekEventLayout(
  weekDates: Date[],
  events: CalendarEvent[],
): EventPlacement[] {
  const placements: EventPlacement[] = [];
  // Track which row slots are occupied: row -> Set of column indices
  const occupied: Map<number, Set<number>> = new Map();

  const weekStart = startOfDay(weekDates[0]);
  const weekEnd = startOfDay(weekDates[6]);

  // Filter events that overlap this week, sorted by start date then duration (longer first)
  const relevant = events
    .filter((ev) => {
      const evStart = startOfDay(ev.date);
      const evEnd = ev.endDate ? startOfDay(ev.endDate) : evStart;
      return evEnd >= weekStart && evStart <= weekEnd;
    })
    .sort((a, b) => {
      const aStart = startOfDay(a.date).getTime();
      const bStart = startOfDay(b.date).getTime();
      if (aStart !== bStart) return aStart - bStart;
      // Longer events first
      const aEnd = a.endDate ? startOfDay(a.endDate).getTime() : aStart;
      const bEnd = b.endDate ? startOfDay(b.endDate).getTime() : bStart;
      return (bEnd - bStart) - (aEnd - aStart);
    });

  for (const ev of relevant) {
    const evStart = startOfDay(ev.date);
    const evEnd = ev.endDate ? startOfDay(ev.endDate) : evStart;

    // Clamp to this week
    const clampedStart = evStart < weekStart ? weekStart : evStart;
    const clampedEnd = evEnd > weekEnd ? weekEnd : evEnd;

    const startCol = weekDates.findIndex((d) => isSameDay(d, clampedStart));
    const endCol = weekDates.findIndex((d) => isSameDay(d, clampedEnd));
    if (startCol === -1 || endCol === -1) continue;

    const span = endCol - startCol + 1;
    const isStart = evStart >= weekStart;

    // Find first free row
    let row = 0;
    while (true) {
      if (!occupied.has(row)) occupied.set(row, new Set());
      const rowSet = occupied.get(row)!;
      let free = true;
      for (let c = startCol; c <= endCol; c++) {
        if (rowSet.has(c)) { free = false; break; }
      }
      if (free) break;
      row++;
    }

    // Reserve columns in this row
    const rowSet = occupied.get(row)!;
    for (let c = startCol; c <= endCol; c++) {
      rowSet.add(c);
    }

    placements.push({ event: ev, row, startCol, span, isStart });
  }

  return placements;
}

// ─── Compact Calendar (original) ───────────────────────────────────────────

const CompactCalendar: React.FC<
  CalendarProps & { t: (typeof tokens)[keyof typeof tokens]; today: Date }
> = ({
  value,
  onChange,
  view = 'month',
  events = [],
  minDate,
  maxDate,
  style,
  className,
  firstDay = 1,
  locale = 'cs',
  initialDate,
  t,
  today,
}) => {
    const l = LOCALE_DATA[locale];
    const init = initialDate || value || today;

    const [currentMonth, setCurrentMonth] = useState(() => init.getMonth());
    const [currentYear, setCurrentYear] = useState(() => init.getFullYear());
    const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(init, firstDay));
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);

    const days = useMemo(() => {
      if (view === 'week') return getWeekGrid(currentWeekStart, firstDay);
      return getMonthGrid(currentYear, currentMonth, firstDay);
    }, [view, currentYear, currentMonth, currentWeekStart, firstDay]);

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
          return `${currentWeekStart.getDate()}. – ${end.getDate()}. ${l.months[end.getMonth()]} ${end.getFullYear()}`;
        }
        return `${currentWeekStart.getDate()}. ${l.months[currentWeekStart.getMonth()].slice(0, 3)} – ${end.getDate()}. ${l.months[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
      })()
      : `${l.months[currentMonth]} ${currentYear}`;

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
          {l.daysFull.map((label) => (
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

// ─── Full-Size Calendar ────────────────────────────────────────────────────

const EVENT_BAR_HEIGHT = 24;
const EVENT_BAR_GAP = 2;

const FullSizeCalendar: React.FC<
  CalendarProps & { t: (typeof tokens)[keyof typeof tokens]; today: Date }
> = ({
  value,
  onChange,
  events = [],
  onEventClick,
  showHeader = true,
  onNavigate,
  minDate,
  maxDate,
  style,
  className,
  firstDay = 1,
  locale = 'cs',
  maxEventsPerDay = 3,
  initialDate,
  t,
  today,
}) => {
    const l = LOCALE_DATA[locale];
    const init = initialDate || value || today;

    const [currentMonth, setCurrentMonth] = useState(() => init.getMonth());
    const [currentYear, setCurrentYear] = useState(() => init.getFullYear());
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

    const days = useMemo(
      () => getMonthGrid(currentYear, currentMonth, firstDay),
      [currentYear, currentMonth, firstDay],
    );

    // Split into week rows (6 rows of 7 days)
    const weeks = useMemo(() => {
      const result: Date[][] = [];
      for (let i = 0; i < days.length; i += 7) {
        result.push(days.slice(i, i + 7));
      }
      return result;
    }, [days]);

    // Check if we can trim the last row (all days outside current month)
    const visibleWeeks = useMemo(() => {
      const last = weeks[weeks.length - 1];
      if (last && last.every((d) => d.getMonth() !== currentMonth)) {
        return weeks.slice(0, -1);
      }
      return weeks;
    }, [weeks, currentMonth]);

    const navigatePrev = useCallback(() => {
      let newMonth = currentMonth - 1;
      let newYear = currentYear;
      if (newMonth < 0) { newMonth = 11; newYear--; }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      if (onNavigate) onNavigate(new Date(newYear, newMonth, 1));
    }, [currentMonth, currentYear, onNavigate]);

    const navigateNext = useCallback(() => {
      let newMonth = currentMonth + 1;
      let newYear = currentYear;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      if (onNavigate) onNavigate(new Date(newYear, newMonth, 1));
    }, [currentMonth, currentYear, onNavigate]);

    const headerLabel = `${l.months[currentMonth]} ${currentYear}`;

    // Compute the height for the event area in each cell
    const eventAreaHeight = maxEventsPerDay * (EVENT_BAR_HEIGHT + EVENT_BAR_GAP) + EVENT_BAR_GAP;

    const navBtnStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      border: 'none',
      borderRadius: '8px',
      background: '#FC4F00',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.12s ease',
    };

    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: '14px',
          color: t.text,
          userSelect: 'none',
          ...style,
        }}
      >
        {/* Header */}
        {showHeader && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0 16px',
            }}
          >
            <button
              style={navBtnStyle}
              onClick={navigatePrev}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FF6D2A'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FC4F00'; }}
              aria-label="Předchozí"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>
            <span
              style={{
                fontFamily: "'Zalando Sans Expanded', sans-serif",
                fontWeight: 700,
                fontSize: '20px',
              }}
            >
              {headerLabel}
            </span>
            <button
              style={navBtnStyle}
              onClick={navigateNext}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FF6D2A'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FC4F00'; }}
              aria-label="Další"
            >
              <CaretRightIcon size={16} weight="bold" />
            </button>
          </div>
        )}

        {/* Table */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${t.cellBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: t.background,
          }}
        >
          {/* Day-of-week header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: `1px solid ${t.cellBorder}`,
            }}
          >
            {l.days.map((label, i) => (
              <div
                key={label}
                style={{
                  textAlign: 'center',
                  fontFamily: "'Zalando Sans Expanded', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  color: t.text,
                  padding: '10px 0',
                  borderRight: i < 6 ? `1px solid ${t.cellBorder}` : 'none',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Week rows */}
          {visibleWeeks.map((week, weekIdx) => {
            const placements = computeWeekEventLayout(week, events);

            // Count how many event rows this week needs
            const maxRow = placements.length > 0
              ? Math.max(...placements.map((p) => p.row)) + 1
              : 0;

            // Count hidden events per day (events beyond maxEventsPerDay)
            const hiddenCounts: number[] = week.map((_, colIdx) => {
              const dayPlacements = placements.filter(
                (p) => colIdx >= p.startCol && colIdx < p.startCol + p.span,
              );
              return Math.max(0, dayPlacements.filter((p) => p.row >= maxEventsPerDay).length);
            });

            const visibleRows = Math.min(maxRow, maxEventsPerDay);
            const cellEventHeight = visibleRows * (EVENT_BAR_HEIGHT + EVENT_BAR_GAP) + EVENT_BAR_GAP;
            const hasMore = hiddenCounts.some((c) => c > 0);
            const moreRowHeight = hasMore ? 20 : 0;

            return (
              <div
                key={weekIdx}
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  borderBottom: weekIdx < visibleWeeks.length - 1 ? `1px solid ${t.cellBorder}` : 'none',
                }}
              >
                {week.map((day, colIdx) => {
                  const isToday = isSameDay(day, today);
                  const isOutside = day.getMonth() !== currentMonth;
                  const isSelected = value ? isSameDay(day, value) : false;

                  return (
                    <div
                      key={colIdx}
                      style={{
                        borderRight: colIdx < 6 ? `1px solid ${t.cellBorder}` : 'none',
                        backgroundColor: isToday ? t.todayCellBg : 'transparent',
                        minHeight: `${30 + cellEventHeight + moreRowHeight}px`,
                        position: 'relative',
                        cursor: onChange ? 'pointer' : 'default',
                      }}
                      onClick={() => {
                        if (onChange && !isDateDisabled(day, minDate, maxDate)) onChange(day);
                      }}
                    >
                      {/* Day number */}
                      <div
                        style={{
                          textAlign: 'right',
                          padding: '4px 8px 2px',
                          fontSize: '13px',
                          fontWeight: isToday ? 700 : 400,
                          color: isOutside ? t.outsideText : isToday ? '#FC4F00' : t.text,
                        }}
                      >
                        {isSelected ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              backgroundColor: '#FC4F00',
                              color: '#ffffff',
                              fontWeight: 600,
                            }}
                          >
                            {day.getDate()}.
                          </span>
                        ) : (
                          <>{day.getDate()}.</>
                        )}
                      </div>

                      {/* Event bars (positioned absolutely within this cell's event area) */}
                      <div style={{ position: 'relative', height: `${cellEventHeight}px` }}>
                        {placements
                          .filter((p) => p.startCol === colIdx && p.row < maxEventsPerDay)
                          .map((p, pIdx) => {
                            const evId = p.event.id || `${toDateKey(p.event.date)}-${p.event.title}`;
                            const isHovered = hoveredEvent === evId;
                            const barColor = p.event.color || t.eventBarDefault;

                            const bar = (
                              <div
                                key={pIdx}
                                style={{
                                  position: 'absolute',
                                  top: `${EVENT_BAR_GAP + p.row * (EVENT_BAR_HEIGHT + EVENT_BAR_GAP)}px`,
                                  left: '2px',
                                  width: p.span > 1
                                    ? `calc(${p.span * 100}% - 4px)`
                                    : 'calc(100% - 4px)',
                                  height: `${EVENT_BAR_HEIGHT}px`,
                                  backgroundColor: barColor,
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '0 8px',
                                  cursor: onEventClick ? 'pointer' : 'default',
                                  zIndex: isHovered ? 2 : 1,
                                  opacity: isHovered ? 0.85 : 1,
                                  transition: 'opacity 0.12s ease',
                                  overflow: 'hidden',
                                }}
                                title={p.event.tooltip ? undefined : p.event.title}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onEventClick) onEventClick(p.event);
                                }}
                                onMouseEnter={() => setHoveredEvent(evId)}
                                onMouseLeave={() => setHoveredEvent(null)}
                              >
                                {p.isStart && p.event.emoji && (
                                  <span style={{ fontSize: '12px', flexShrink: 0 }}>{p.event.emoji}</span>
                                )}
                                {p.isStart && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 500,
                                      color: p.event.textColor || t.eventBarText,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {p.event.title}
                                  </span>
                                )}
                              </div>
                            );

                            if (p.event.tooltip) {
                              return (
                                <Tooltip key={pIdx} content={p.event.tooltip}>
                                  {bar}
                                </Tooltip>
                              );
                            }

                            return bar;
                          })}
                      </div>

                      {/* "+N more" indicator */}
                      {hiddenCounts[colIdx] > 0 && (
                        <div
                          style={{
                            fontSize: '10px',
                            color: t.moreText,
                            textAlign: 'center',
                            padding: '2px 0',
                          }}
                        >
                          +{hiddenCounts[colIdx]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

// ─── Calendar (public) ─────────────────────────────────────────────────────

/**
 * Kalendářní komponenta s měsíčním a týdenním zobrazením.
 *
 * V kompaktním režimu (`fullSize={false}`) zobrazuje malý datepicker
 * s barevnými tečkami pro události.
 *
 * V plnohodnotném režimu (`fullSize={true}`) zobrazuje velký měsíční
 * kalendář s event bary, které mohou přesahovat přes více dní.
 *
 * @example
 * ```tsx
 * // Kompaktní
 * <Calendar value={date} onChange={setDate} events={events} />
 *
 * // Plnohodnotný
 * <Calendar
 *   fullSize
 *   events={events}
 *   onEventClick={(ev) => console.log(ev)}
 * />
 * ```
 */
export const Calendar: React.FC<CalendarProps> = (props) => {
  const theme = useTheme();
  const t = tokens[theme];
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  if (props.fullSize) {
    return <FullSizeCalendar {...props} t={t} today={today} />;
  }

  return <CompactCalendar {...props} t={t} today={today} />;
};

Calendar.displayName = 'Calendar';
