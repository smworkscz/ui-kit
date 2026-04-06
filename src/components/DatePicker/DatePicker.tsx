import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { CalendarBlank as CalendarBlankIcon, X as XIcon, CaretLeft as CaretLeftIcon, CaretRight as CaretRightIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

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
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: `rotate(${angle}deg)`, flexShrink: 0, display: 'block' }}
    >
      <circle cx="8" cy="8" r="6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    background: 'rgba(3,3,3,0.75)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    border: 'rgba(255,255,255,0.3)',
    borderFocus: 'rgba(255,255,255,0.7)',
    borderError: '#EF3838',
    text: '#ffffff',
    placeholder: '#ACACAC',
    label: '#ffffff',
    helperText: '#ACACAC',
    dropdownBg: 'rgba(24,24,24,0.95)',
    dropdownBorder: 'rgba(255,255,255,0.12)',
    dayHover: 'rgba(255,255,255,0.06)',
    daySelected: '#E8612D',
    daySelectedText: '#ffffff',
    dayRangeMiddle: 'rgba(232,97,45,0.15)',
    dayToday: 'rgba(255,255,255,0.2)',
    dayOutside: 'rgba(255,255,255,0.25)',
    dayDisabled: 'rgba(255,255,255,0.12)',
    divider: 'rgba(255,255,255,0.08)',
    scrollbarThumb: 'rgba(255,255,255,0.15)',
  },
  light: {
    background: 'rgba(255,255,255,0.85)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    border: 'rgba(0,0,0,0.2)',
    borderFocus: 'rgba(0,0,0,0.6)',
    borderError: '#EF3838',
    text: '#1a1a1a',
    placeholder: '#888888',
    label: '#1a1a1a',
    helperText: '#888888',
    dropdownBg: 'rgba(255,255,255,0.95)',
    dropdownBorder: 'rgba(0,0,0,0.1)',
    dayHover: 'rgba(0,0,0,0.04)',
    daySelected: '#E8612D',
    daySelectedText: '#ffffff',
    dayRangeMiddle: 'rgba(232,97,45,0.10)',
    dayToday: 'rgba(0,0,0,0.1)',
    dayOutside: 'rgba(0,0,0,0.3)',
    dayDisabled: 'rgba(0,0,0,0.15)',
    divider: 'rgba(0,0,0,0.06)',
    scrollbarThumb: 'rgba(0,0,0,0.15)',
  },
} as const;

// ─── Animation duration ─────────────────────────────────────────────────────

const ANIM_DURATION = 180;

// ─── Size config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { padding: '6px 10px', fontSize: '14px', iconSize: 14, gap: '8px' },
  md: { padding: '8px 12px', fontSize: '16px', iconSize: 16, gap: '10px' },
  lg: { padding: '10px 14px', fontSize: '18px', iconSize: 18, gap: '12px' },
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

/** Vrátí pole dat pro kalendářní mřížku (6 řádků × 7 sloupců). */
function getCalendarDays(year: number, month: number, firstDayOfWeek: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  let dayOfWeek = firstOfMonth.getDay(); // 0=Sunday
  // Převod na ISO index (0=Monday) a posun dle firstDayOfWeek
  dayOfWeek = (dayOfWeek === 0 ? 7 : dayOfWeek) - firstDayOfWeek;
  if (dayOfWeek < 0) dayOfWeek += 7;

  const start = new Date(year, month, 1 - dayOfWeek);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

/** Formátuje datum jako dd.mm.yyyy */
function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/** Formátuje datum s časem jako dd.mm.yyyy HH:mm */
function formatDateTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(d)} ${hh}:${min}`;
}

/** Porovná dva datumy jen podle dne (bez času). */
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Je datum v rozmezí (inkluzivně)? */
function isInRange(d: Date, start: Date, end: Date): boolean {
  const t = d.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return t >= s && t <= e;
}

/** Je datum dnešní? */
function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

// ─── Types ──────────────────────────────────────────────────────────────────

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps {
  /**
   * Režim výběru data.
   * - `'single'` — výběr jednoho data
   * - `'range'` — výběr rozsahu (od–do)
   * @default 'single'
   */
  mode?: 'single' | 'range';
  /**
   * Zobrazí výběr času (hodiny a minuty) pod kalendářem.
   * @default false
   */
  showTime?: boolean;
  /**
   * Aktuální hodnota.
   * - `single` režim: `Date | null`
   * - `range` režim: `[Date | null, Date | null]`
   */
  value?: Date | null | [Date | null, Date | null];
  /**
   * Voláno při změně výběru.
   * - `single` režim: `(value: Date | null) => void`
   * - `range` režim: `(value: [Date | null, Date | null]) => void`
   */
  onChange?: (value: any) => void;
  /**
   * Popisek zobrazený nad vstupním polem.
   * Stylizován velkými písmeny dle SM-UI design systému.
   */
  label?: string;
  /** Zástupný text zobrazený při prázdné hodnotě. */
  placeholder?: string;
  /**
   * Při `true` se pole zobrazí jako nevalidní (červený okraj).
   * Při zadání řetězce se pod polem zobrazí chybová zpráva.
   */
  error?: boolean | string;
  /** Nápovědný text zobrazený pod vstupním polem. */
  helperText?: string;
  /** Zakáže celý DatePicker. @default false */
  disabled?: boolean;
  /**
   * Při `true` je DatePicker neinteraktivní a zobrazí spinner.
   * @default false
   */
  loading?: boolean;
  /** Zobrazí tlačítko pro vymazání výběru. @default false */
  clearable?: boolean;
  /**
   * Velikostní preset.
   * @default 'md'
   */
  size?: DatePickerSize;
  /** Roztáhne pole na celou šířku kontejneru. @default false */
  fullWidth?: boolean;
  /** Označí pole jako povinné (hvězdička u popisku). */
  required?: boolean;
  /** Minimální datum, které lze vybrat. */
  minDate?: Date;
  /** Maximální datum, které lze vybrat. */
  maxDate?: Date;
  /**
   * První den v týdnu (ISO: 1=pondělí).
   * @default 1
   */
  firstDayOfWeek?: number;
  /** Další inline styly pro kořenový obal. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro kořenový obal. */
  className?: string;
}

export interface DatePickerGroupProps {
  /** Text popisku nad DatePickerem, velkými písmeny dle SM-UI design systému. */
  label: string;
  /** `htmlFor` propojující `<label>` s DatePickerem. Automaticky generováno, pokud chybí. */
  htmlFor?: string;
  /** DatePicker element(y) vykreslené uvnitř skupiny. */
  children?: React.ReactNode;
  /** Další inline styly pro obal. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída pro obal. */
  className?: string;
}

// ─── DatePicker ─────────────────────────────────────────────────────────────

/**
 * Výběr data (a volitelně času) dle SM-UI design systému.
 *
 * Podporuje jednoduchý výběr / rozsah, volitelný výběr času,
 * omezení min/max datem, chybový stav a tmavý / světlý režim.
 *
 * Dropdown se vykresluje přes React portál, takže ho neořízne
 * rodičovský kontejner s `overflow: hidden`.
 *
 * @example
 * ```tsx
 * // Jednoduchý výběr
 * <DatePicker
 *   label="Datum narození"
 *   value={datum}
 *   onChange={setDatum}
 *   clearable
 * />
 *
 * // Rozsah s časem
 * <DatePicker
 *   mode="range"
 *   showTime
 *   value={rozsah}
 *   onChange={setRozsah}
 *   placeholder="Vyberte rozsah…"
 * />
 * ```
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'single',
  showTime = false,
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  disabled = false,
  loading = false,
  clearable = false,
  size = 'md',
  fullWidth = false,
  required,
  minDate,
  maxDate,
  firstDayOfWeek = 1,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const autoId = useId();
  const sc = sizeConfig[size];

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; openAbove: boolean }>({ top: 0, left: 0, width: 0, openAbove: false });
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Kalendář stav
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  // Range: fáze výběru (0 = žádný start, 1 = start vybrán, čeká se na konec)
  const [rangePhase, setRangePhase] = useState<0 | 1>(0);

  const isDisabled = disabled || loading;
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // ── Normalizace hodnoty ────────────────────────────────────────────────

  const singleValue: Date | null = mode === 'single' && value instanceof Date ? value : null;
  const rangeValue: [Date | null, Date | null] = mode === 'range' && Array.isArray(value)
    ? value as [Date | null, Date | null]
    : [null, null];

  const hasValue = mode === 'single' ? singleValue !== null : (rangeValue[0] !== null || rangeValue[1] !== null);
  const showClear = clearable && hasValue && !isDisabled;

  // ── Zobrazení formátované hodnoty ──────────────────────────────────────

  const displayValue = (() => {
    if (mode === 'single') {
      if (!singleValue) return '';
      return showTime ? formatDateTime(singleValue) : formatDate(singleValue);
    }
    const [s, e] = rangeValue;
    if (!s && !e) return '';
    const fmt = showTime ? formatDateTime : formatDate;
    return `${s ? fmt(s) : '…'} – ${e ? fmt(e) : '…'}`;
  })();

  const placeholderText = placeholder ?? (mode === 'single'
    ? (showTime ? 'dd.mm.rrrr hh:mm' : 'dd.mm.rrrr')
    : (showTime ? 'dd.mm.rrrr hh:mm – dd.mm.rrrr hh:mm' : 'dd.mm.rrrr – dd.mm.rrrr'));

  // ── Open / close with animation ───────────────────────────────────────

  const doOpen = useCallback(() => {
    // Nastavit view na aktuální vybraný měsíc
    const refDate = mode === 'single' ? singleValue : rangeValue[0];
    if (refDate) {
      setViewYear(refDate.getFullYear());
      setViewMonth(refDate.getMonth());
    }
    setViewMode('days');
    setOpen(true);
    setVisible(true);
    setAnimState('opening');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('open'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, singleValue, rangeValue]);

  const doClose = useCallback(() => {
    setOpen(false);
    setAnimState('closing');
    const timer = setTimeout(() => {
      setVisible(false);
      setAnimState('idle');
    }, ANIM_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ── Position the portal dropdown ──────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.offsetHeight ?? 380;
    const spaceBelow = window.innerHeight - rect.bottom - 6;
    const spaceAbove = rect.top - 6;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    setDropdownPos({
      top: openAbove ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 300),
      openAbove,
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [visible, updatePosition]);

  // ── Close on outside click ────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) {
        doClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, doClose]);

  // ── Keyboard ──────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return;
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      doClose();
    }
    if ((e.key === 'Enter' || e.key === ' ') && !open) {
      e.preventDefault();
      doOpen();
    }
  };

  // ── Day click handler ─────────────────────────────────────────────────

  const isDayDisabled = useCallback((d: Date): boolean => {
    if (minDate) {
      const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (d < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (d > max) return true;
    }
    return false;
  }, [minDate, maxDate]);

  const handleDayClick = useCallback((d: Date) => {
    if (isDayDisabled(d)) return;
    if (!onChange) return;

    if (mode === 'single') {
      // Přenést čas z předchozí hodnoty, pokud showTime
      if (showTime && singleValue) {
        d.setHours(singleValue.getHours(), singleValue.getMinutes());
      }
      onChange(new Date(d));
      if (!showTime) doClose();
    } else {
      // Range mode
      if (rangePhase === 0) {
        // Přenést čas
        if (showTime && rangeValue[0]) {
          d.setHours(rangeValue[0].getHours(), rangeValue[0].getMinutes());
        }
        onChange([new Date(d), null]);
        setRangePhase(1);
      } else {
        const start = rangeValue[0]!;
        if (showTime && rangeValue[1]) {
          d.setHours(rangeValue[1].getHours(), rangeValue[1].getMinutes());
        }
        const [s, e] = d >= start ? [start, new Date(d)] : [new Date(d), start];
        onChange([s, e]);
        setRangePhase(0);
        if (!showTime) doClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, showTime, singleValue, rangeValue, rangePhase, onChange, doClose, isDayDisabled]);

  // ── Time change handlers ──────────────────────────────────────────────

  const handleTimeChange = useCallback((which: 'hour' | 'minute', val: string, index?: number) => {
    if (!onChange) return;
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    if (which === 'hour') num = Math.max(0, Math.min(23, num));
    if (which === 'minute') num = Math.max(0, Math.min(59, num));

    if (mode === 'single') {
      const d = singleValue ? new Date(singleValue) : new Date();
      if (which === 'hour') d.setHours(num);
      else d.setMinutes(num);
      onChange(d);
    } else {
      const idx = index ?? 0;
      const arr: [Date | null, Date | null] = [
        rangeValue[0] ? new Date(rangeValue[0]) : null,
        rangeValue[1] ? new Date(rangeValue[1]) : null,
      ];
      const d = arr[idx] ?? new Date();
      if (which === 'hour') d.setHours(num);
      else d.setMinutes(num);
      arr[idx] = d;
      onChange(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, singleValue, rangeValue, onChange]);

  // ── Navigation ────────────────────────────────────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // ── Clear handler ─────────────────────────────────────────────────────

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onChange) return;
    if (mode === 'single') onChange(null);
    else onChange([null, null]);
    setRangePhase(0);
  };

  // ── Animation styles ──────────────────────────────────────────────────

  const getDropdownAnimStyle = (): React.CSSProperties => {
    const above = dropdownPos.openAbove;
    const slideIn = above ? 'translateY(8px)' : 'translateY(-8px)';
    const slideOut = above ? 'translateY(6px)' : 'translateY(-6px)';
    const base: React.CSSProperties = {
      transition: `opacity ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };
    if (animState === 'opening' || animState === 'idle') {
      return { ...base, opacity: 0, transform: `${slideIn} scale(0.97)` };
    }
    if (animState === 'open') {
      return { ...base, opacity: 1, transform: 'translateY(0) scale(1)' };
    }
    return { ...base, opacity: 0, transform: `${slideOut} scale(0.98)`, pointerEvents: 'none' };
  };

  // ── Calendar days ─────────────────────────────────────────────────────

  const calendarDays = getCalendarDays(viewYear, viewMonth, firstDayOfWeek);

  // ── Render time inputs ────────────────────────────────────────────────

  const renderTimeInputs = (dateVal: Date | null, rangeIdx?: number) => {
    const h = dateVal ? dateVal.getHours() : 0;
    const m = dateVal ? dateVal.getMinutes() : 0;

    const inputStyle: React.CSSProperties = {
      width: '42px',
      background: 'transparent',
      border: `1px solid ${t.border}`,
      borderRadius: '4px',
      padding: '4px 6px',
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: '13px',
      color: t.text,
      textAlign: 'center',
      outline: 'none',
      boxSizing: 'border-box',
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="text"
          value={String(h).padStart(2, '0')}
          onChange={(e) => handleTimeChange('hour', e.target.value, rangeIdx)}
          style={inputStyle}
          maxLength={2}
          aria-label="Hodiny"
        />
        <span style={{ color: t.text, fontFamily: "'Zalando Sans', sans-serif", fontSize: '13px' }}>:</span>
        <input
          type="text"
          value={String(m).padStart(2, '0')}
          onChange={(e) => handleTimeChange('minute', e.target.value, rangeIdx)}
          style={inputStyle}
          maxLength={2}
          aria-label="Minuty"
        />
      </div>
    );
  };

  // ── Render month selection ────────────────────────────────────────────

  const renderMonthView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '8px 12px' }}>
      {MONTH_NAMES.map((name, idx) => {
        const isCurrentMonth = idx === viewMonth;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => { setViewMonth(idx); setViewMode('days'); }}
            style={{
              background: isCurrentMonth ? t.daySelected : 'transparent',
              color: isCurrentMonth ? t.daySelectedText : t.text,
              border: 'none',
              borderRadius: '6px',
              padding: '8px 4px',
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (!isCurrentMonth) (e.target as HTMLElement).style.backgroundColor = t.dayHover;
            }}
            onMouseLeave={(e) => {
              if (!isCurrentMonth) (e.target as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );

  // ── Render year selection ─────────────────────────────────────────────

  const renderYearView = () => {
    const startYear = Math.floor(viewYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
          <button
            type="button"
            onClick={() => setViewYear((y) => y - 12)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              borderRadius: '4px', display: 'flex', alignItems: 'center',
            }}
          >
            <CaretLeftIcon size={16} color={t.text} />
          </button>
          <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '13px', color: t.text }}>
            {startYear} – {startYear + 11}
          </span>
          <button
            type="button"
            onClick={() => setViewYear((y) => y + 12)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              borderRadius: '4px', display: 'flex', alignItems: 'center',
            }}
          >
            <CaretRightIcon size={16} color={t.text} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', padding: '8px 12px' }}>
          {years.map((y) => {
            const isCurrent = y === viewYear;
            return (
              <button
                key={y}
                type="button"
                onClick={() => { setViewYear(y); setViewMode('months'); }}
                style={{
                  background: isCurrent ? t.daySelected : 'transparent',
                  color: isCurrent ? t.daySelectedText : t.text,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 4px',
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) (e.target as HTMLElement).style.backgroundColor = t.dayHover;
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                {y}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // ── Dropdown ──────────────────────────────────────────────────────────

  const dropdown = visible
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            ...(dropdownPos.openAbove
              ? { bottom: window.innerHeight - dropdownPos.top, left: dropdownPos.left }
              : { top: dropdownPos.top, left: dropdownPos.left }),
            width: dropdownPos.width,
            backgroundColor: t.dropdownBg,
            border: `1px solid ${t.dropdownBorder}`,
            borderRadius: '12px',
            boxShadow: theme === 'dark'
              ? '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset'
              : '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03) inset',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            overflow: 'hidden',
            boxSizing: 'border-box',
            transformOrigin: dropdownPos.openAbove ? 'bottom center' : 'top center',
            ...getDropdownAnimStyle(),
          }}
        >
          {viewMode === 'years' ? renderYearView() : viewMode === 'months' ? (
            <>
              {/* Hlavička — zpět na rok */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 12px' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('years')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Zalando Sans Expanded', sans-serif", fontSize: '14px',
                    fontWeight: 500, color: t.text, padding: '4px 8px', borderRadius: '4px',
                  }}
                >
                  {viewYear}
                </button>
              </div>
              {renderMonthView()}
            </>
          ) : (
            <>
              {/* Hlavička měsíce */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
              }}>
                <button
                  type="button"
                  onClick={prevMonth}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                  }}
                >
                  <CaretLeftIcon size={16} color={t.text} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Zalando Sans Expanded', sans-serif", fontSize: '14px',
                      fontWeight: 500, color: t.text, padding: '4px 8px', borderRadius: '4px',
                    }}
                  >
                    {MONTH_NAMES[viewMonth]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('years')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Zalando Sans Expanded', sans-serif", fontSize: '14px',
                      fontWeight: 500, color: t.text, padding: '4px 8px', borderRadius: '4px',
                    }}
                  >
                    {viewYear}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                  }}
                >
                  <CaretRightIcon size={16} color={t.text} />
                </button>
              </div>

              {/* Dny v týdnu */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                padding: '0 12px 4px',
                gap: '0',
              }}>
                {DAY_NAMES.map((name) => (
                  <div
                    key={name}
                    style={{
                      textAlign: 'center',
                      fontFamily: "'Zalando Sans Expanded', sans-serif",
                      fontSize: '11px',
                      fontWeight: 400,
                      color: t.placeholder,
                      padding: '4px 0',
                      userSelect: 'none',
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>

              {/* Kalendářní mřížka */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                padding: '0 12px 8px',
                gap: '2px',
              }}>
                {calendarDays.map((day, idx) => {
                  const isOutside = day.getMonth() !== viewMonth;
                  const isDis = isDayDisabled(day);
                  const isTod = isToday(day);

                  // Výběr logika
                  let isSelected = false;
                  let isRangeStart = false;
                  let isRangeEnd = false;
                  let isRangeMiddle = false;

                  if (mode === 'single' && singleValue) {
                    isSelected = isSameDay(day, singleValue);
                  } else if (mode === 'range') {
                    const [s, e] = rangeValue;
                    if (s && isSameDay(day, s)) { isRangeStart = true; isSelected = true; }
                    if (e && isSameDay(day, e)) { isRangeEnd = true; isSelected = true; }
                    if (s && e && isInRange(day, s, e) && !isRangeStart && !isRangeEnd) {
                      isRangeMiddle = true;
                    }
                    // Hover preview pro range
                    if (rangePhase === 1 && s && hoveredDay && !isDis) {
                      if (isSameDay(day, hoveredDay) && !isSameDay(day, s)) {
                        isSelected = true;
                      }
                      if (isInRange(day, s, hoveredDay) && !isSameDay(day, s) && !isSameDay(day, hoveredDay)) {
                        isRangeMiddle = true;
                      }
                    }
                  }

                  let bg: string = 'transparent';
                  let color: string = t.text;

                  if (isSelected) {
                    bg = t.daySelected;
                    color = t.daySelectedText;
                  } else if (isRangeMiddle) {
                    bg = t.dayRangeMiddle;
                  }

                  if (isOutside) {
                    color = isSelected ? t.daySelectedText : t.dayOutside;
                  }
                  if (isDis) {
                    color = t.dayDisabled;
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isDis}
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => { if (!isDis) setHoveredDay(day); }}
                      onMouseLeave={() => setHoveredDay(null)}
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: bg,
                        color,
                        border: 'none',
                        borderRadius: isRangeStart ? '6px 0 0 6px'
                          : isRangeEnd ? '0 6px 6px 0'
                          : isRangeMiddle ? '0'
                          : '6px',
                        fontFamily: "'Zalando Sans', sans-serif",
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: isDis ? 'not-allowed' : 'pointer',
                        opacity: isDis ? 0.4 : 1,
                        transition: 'background-color 0.1s ease',
                        outline: isTod && !isSelected ? `1.5px solid ${t.dayToday}` : 'none',
                        outlineOffset: '-1.5px',
                        padding: 0,
                        boxSizing: 'border-box',
                      }}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Výběr času */}
              {showTime && (
                <div style={{
                  borderTop: `1px solid ${t.divider}`,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: mode === 'range' ? 'space-between' : 'center',
                  gap: '8px',
                }}>
                  {mode === 'single' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.placeholder }}>Čas:</span>
                      {renderTimeInputs(singleValue)}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.placeholder }}>Od:</span>
                        {renderTimeInputs(rangeValue[0], 0)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.placeholder }}>Do:</span>
                        {renderTimeInputs(rangeValue[1], 1)}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>,
        document.body
      )
    : null;

  // ── Trigger styles ────────────────────────────────────────────────────

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: sc.gap,
    backgroundColor: isDisabled ? t.backgroundDisabled : t.background,
    border: `1px solid ${hasError ? t.borderError : open ? t.borderFocus : t.border}`,
    borderRadius: '8px',
    padding: sc.padding,
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
    opacity: isDisabled ? 0.6 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: t.label,
    userSelect: 'none',
  };

  const bottomTextStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '12px',
    lineHeight: 'normal',
  };

  return (
    <div
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        flexDirection: 'column',
        gap: '6px',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      className={className}
    >
      {label && (
        <label htmlFor={autoId} style={labelStyle}>
          {label}
          {required && <span style={{ color: t.borderError, marginLeft: '3px' }}>*</span>}
        </label>
      )}

      <div
        ref={triggerRef}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        style={triggerStyle}
        onClick={() => { if (!isDisabled) { open ? doClose() : doOpen(); } }}
        onKeyDown={handleKeyDown}
      >
        {/* Hodnota */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue ? (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: sc.fontSize,
              color: t.text,
              lineHeight: 'normal',
            }}>
              {displayValue}
            </span>
          ) : (
            <span style={{
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: sc.fontSize,
              color: t.placeholder,
              lineHeight: 'normal',
            }}>
              {placeholderText}
            </span>
          )}
        </div>

        {/* Akce */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {showClear && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Vymazat výběr"
              style={{ cursor: 'pointer', display: 'flex', padding: '2px' }}
              onClick={handleClear}
            >
              <XIcon size={sc.iconSize - 2} color={t.placeholder} />
            </span>
          )}
          {loading
            ? <Spinner size={sc.iconSize} color={t.placeholder} />
            : <CalendarBlankIcon size={sc.iconSize} color={t.placeholder} />
          }
        </div>
      </div>

      {errorMessage && (
        <span style={{ ...bottomTextStyle, color: t.borderError }}>
          {errorMessage}
        </span>
      )}
      {!errorMessage && helperText && (
        <span style={{ ...bottomTextStyle, color: t.helperText }}>
          {helperText}
        </span>
      )}

      {dropdown}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

// ─── DatePickerGroup ────────────────────────────────────────────────────────

/**
 * Obalí `<DatePicker>` skupinou s popiskem, vizuálně odpovídá `InputGroup`.
 *
 * @example
 * ```tsx
 * <DatePickerGroup label="Datum akce">
 *   <DatePicker value={datum} onChange={setDatum} />
 * </DatePickerGroup>
 * ```
 */
export const DatePickerGroup: React.FC<DatePickerGroupProps> = ({
  label,
  htmlFor,
  children,
  style,
  className,
}) => {
  const theme = useTheme();
  const autoId = useId();
  const labelFor = htmlFor ?? autoId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }} className={className}>
      <label
        htmlFor={labelFor}
        style={{
          fontFamily: "'Zalando Sans Expanded', sans-serif",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: 'normal',
          textTransform: 'uppercase',
          color: tokens[theme].label,
          userSelect: 'none',
        }}
      >
        {label}
      </label>
      {children ?? <DatePicker />}
    </div>
  );
};

DatePickerGroup.displayName = 'DatePickerGroup';
