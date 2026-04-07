import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Badge,
  Button,
  DropdownMenu,
  Spotlight,
  useTheme,
} from '../../src';
import type { DropdownMenuItem } from '../../src';
import { SunIcon, MoonIcon, DesktopIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { spotlightItems } from './spotlightData';
import { Sidebar } from './Sidebar';
import {
  IntroductionPage, InstallationPage, UsagePage, ThemingPage, DesignTokensPage,
  ButtonPage, InputPage, SelectPage, DatePickerPage, CheckboxPage, RadioPage,
  SwitchPage, TextareaPage, SliderPage, FileUploadPage,
  TablePage, CardPage, AccordionPage, TabsPage, TooltipPage, PopoverPage,
  SkeletonPage, EmptyStatePage, StatPage, AvatarPage, TagPage,
  ModalPage, DrawerPage, BreadcrumbPage, PaginationPage, StepperPage,
  DropdownMenuPage, LinkPage, SpotlightPage,
  ToastPage, AlertPage, ProgressPage, SpinnerPage,
  DividerPage, StackPage, ContainerPage, DragListPage, SegmentedControlPage,
  UseThemePage, UseToastPage,
} from './pages';

// ─── Theme preference ───────────────────────────────────────────────────────

type ThemePreference = 'light' | 'dark' | 'system';

const THEME_ICONS: Record<ThemePreference, React.ReactNode> = {
  light: <SunIcon size={16} weight="bold" />,
  dark: <MoonIcon size={16} weight="bold" />,
  system: <DesktopIcon size={16} weight="bold" />,
};

// ─── Logo ───────────────────────────────────────────────────────────────────

const Logo: React.FC = () => {
  const theme = useTheme();
  const textFill = theme === 'dark' ? '#ffffff' : '#1a1a1a';

  return (
    <svg width="147" height="20" viewBox="0 0 147 20" fill="none" aria-label="SMWORKS" style={{ flexShrink: 0 }}>
      <g clipPath="url(#clip0_136_65)">
        <path d="M26.6251 2.53769C27.2045 3.89847 27.6315 5.34002 27.8821 6.84147C26.9022 3.90961 24.594 1.58223 21.6685 0.561301C22.3613 1.77443 22.9241 3.06975 23.3398 4.42913C21.5355 1.75772 18.47 0 14.993 0C11.516 0 8.4504 1.75772 6.64611 4.42913C7.06184 3.06975 7.62458 1.77443 8.31743 0.561301C5.39192 1.58223 3.0851 3.90961 2.10526 6.84007C2.35582 5.33863 2.78275 3.89707 3.36225 2.53491C1.29899 4.36645 0 7.03089 0 9.99895C0 12.967 1.29899 15.6315 3.36225 17.463C2.78135 16.1022 2.35582 14.6593 2.10526 13.1578C3.0851 16.0883 5.39192 18.4171 8.31743 19.4366C7.62458 18.2235 7.06184 16.9282 6.64611 15.5688C8.4504 18.2402 11.516 19.9979 14.993 19.9979C18.47 19.9979 21.5355 18.2402 23.3398 15.5688C22.9241 16.9282 22.3613 18.2235 21.6685 19.4366C24.594 18.4171 26.9008 16.0883 27.8821 13.1565C27.6315 14.6565 27.2045 16.0981 26.6251 17.4602C28.6869 15.6287 29.9859 12.9643 29.9859 9.99754C29.9859 7.0309 28.6869 4.36645 26.6251 2.53491V2.53769Z" fill="#FC4F00" />
      </g>
      <path d="M45.088 15.724C44.0427 15.724 43.12 15.6387 42.32 15.468C41.52 15.2973 40.8373 15.052 40.272 14.732C39.7173 14.412 39.2907 14.028 38.992 13.58C38.704 13.1213 38.544 12.6147 38.512 12.06H41.664C41.728 12.284 41.8507 12.492 42.032 12.684C42.2133 12.8653 42.4427 13.0253 42.72 13.164C43.008 13.292 43.3493 13.3933 43.744 13.468C44.1387 13.5427 44.5867 13.58 45.088 13.58C45.7387 13.58 46.2933 13.5267 46.752 13.42C47.2213 13.3027 47.584 13.1373 47.84 12.924C48.096 12.7107 48.224 12.46 48.224 12.172C48.224 11.9907 48.1813 11.836 48.096 11.708C48.0107 11.58 47.8773 11.4733 47.696 11.388C47.5253 11.3027 47.3013 11.244 47.024 11.212L43.056 10.716C42.3627 10.6307 41.744 10.5027 41.2 10.332C40.656 10.1613 40.2027 9.94267 39.84 9.676C39.4773 9.40933 39.2 9.084 39.008 8.7C38.816 8.316 38.72 7.87333 38.72 7.372C38.72 6.828 38.8587 6.33733 39.136 5.9C39.4133 5.46267 39.8187 5.09467 40.352 4.796C40.8853 4.48667 41.5253 4.252 42.272 4.092C43.0293 3.932 43.888 3.852 44.848 3.852C45.808 3.852 46.6507 3.932 47.376 4.092C48.112 4.24133 48.7307 4.46533 49.232 4.764C49.744 5.052 50.1333 5.404 50.4 5.82C50.6773 6.22533 50.832 6.67867 50.864 7.18H47.696C47.6533 6.93467 47.5147 6.72667 47.28 6.556C47.056 6.37467 46.736 6.236 46.32 6.14C45.904 6.044 45.3867 5.996 44.768 5.996C44.16 5.996 43.6373 6.044 43.2 6.14C42.7627 6.236 42.432 6.37467 42.208 6.556C41.9947 6.73733 41.888 6.956 41.888 7.212C41.888 7.39333 41.9413 7.55867 42.048 7.708C42.1653 7.84667 42.3253 7.964 42.528 8.06C42.7307 8.14533 42.9707 8.20933 43.248 8.252L47.36 8.748C48.2347 8.85467 48.9707 9.04667 49.568 9.324C50.1653 9.60133 50.6187 9.964 50.928 10.412C51.248 10.86 51.408 11.404 51.408 12.044C51.408 12.652 51.2693 13.1853 50.992 13.644C50.7253 14.092 50.32 14.476 49.776 14.796C49.2427 15.1053 48.5813 15.34 47.792 15.5C47.0133 15.6493 46.112 15.724 45.088 15.724ZM52.8826 15.5V4.076H57.2346L61.0586 13.548H59.8586L63.7306 4.076H67.8746V15.5H64.9146V5.932L65.5386 6.028L61.5546 15.5H59.0106L55.0266 6.028L55.6346 5.932V15.5H52.8826ZM72.715 15.5L69.195 4.076H72.363L74.987 13.42H74.427L77.435 4.076H80.891L83.963 13.42L83.387 13.436L85.979 4.076H88.747L85.259 15.5H81.739L78.651 6.332H79.243L76.219 15.5H72.715ZM96.6041 15.724C95.1108 15.724 93.8095 15.484 92.7001 15.004C91.5908 14.524 90.7321 13.8413 90.1241 12.956C89.5268 12.06 89.2281 11.004 89.2281 9.788C89.2281 9.18 89.3028 8.61467 89.4521 8.092C89.6121 7.55867 89.8415 7.07333 90.1401 6.636C90.4388 6.188 90.8015 5.79333 91.2281 5.452C91.6655 5.11067 92.1561 4.82267 92.7001 4.588C93.2441 4.34267 93.8415 4.16133 94.4921 4.044C95.1428 3.916 95.8468 3.852 96.6041 3.852C98.0975 3.852 99.3935 4.09733 100.492 4.588C101.601 5.068 102.455 5.75067 103.052 6.636C103.66 7.52133 103.964 8.572 103.964 9.788C103.964 10.396 103.889 10.9667 103.74 11.5C103.591 12.0227 103.361 12.508 103.052 12.956C102.753 13.3933 102.391 13.7827 101.964 14.124C101.548 14.4653 101.063 14.7587 100.508 15.004C99.9535 15.2387 99.3508 15.4147 98.7001 15.532C98.0495 15.66 97.3508 15.724 96.6041 15.724ZM96.6041 13.404C97.0308 13.404 97.4255 13.3667 97.7881 13.292C98.1615 13.2173 98.5028 13.1107 98.8121 12.972C99.1321 12.8227 99.4095 12.6467 99.6441 12.444C99.8895 12.2307 100.097 11.9907 100.268 11.724C100.439 11.4573 100.567 11.164 100.652 10.844C100.737 10.5133 100.78 10.1613 100.78 9.788C100.78 9.03067 100.609 8.38533 100.268 7.852C99.9268 7.308 99.4415 6.892 98.8121 6.604C98.1935 6.316 97.4575 6.172 96.6041 6.172C96.1775 6.172 95.7775 6.20933 95.4041 6.284C95.0308 6.35867 94.6895 6.47067 94.3801 6.62C94.0708 6.75867 93.7935 6.93467 93.5481 7.148C93.3028 7.35067 93.0948 7.58533 92.9241 7.852C92.7535 8.11867 92.6255 8.412 92.5401 8.732C92.4548 9.052 92.4121 9.404 92.4121 9.788C92.4121 10.5347 92.5828 11.18 92.9241 11.724C93.2655 12.268 93.7508 12.684 94.3801 12.972C95.0201 13.26 95.7615 13.404 96.6041 13.404ZM105.351 15.5V4.076H113.591C114.423 4.076 115.138 4.19867 115.735 4.444C116.333 4.67867 116.797 5.03067 117.127 5.5C117.458 5.95867 117.623 6.524 117.623 7.196C117.623 7.72933 117.506 8.22 117.271 8.668C117.037 9.10533 116.669 9.468 116.167 9.756C115.677 10.044 115.021 10.2253 114.199 10.3L114.391 10.14C114.978 10.1507 115.458 10.236 115.831 10.396C116.215 10.5453 116.525 10.78 116.759 11.1C116.994 11.4093 117.186 11.8147 117.335 12.316L118.279 15.5H115.095L114.295 12.764C114.167 12.316 113.965 11.9747 113.687 11.74C113.41 11.5053 113.005 11.388 112.471 11.388H108.407V15.5H105.351ZM108.407 9.068H113.063C113.309 9.068 113.533 9.02533 113.735 8.94C113.949 8.844 114.119 8.7 114.247 8.508C114.375 8.30533 114.439 8.044 114.439 7.724C114.439 7.244 114.295 6.90267 114.007 6.7C113.73 6.49733 113.415 6.396 113.063 6.396H108.407V9.068ZM119.711 15.5V4.076H122.767V10.828L121.791 10.412L128.591 4.076H132.431L127.183 8.812C127.492 8.89733 127.769 9.01467 128.015 9.164C128.271 9.31333 128.505 9.5 128.719 9.724C128.943 9.93733 129.167 10.1987 129.391 10.508L132.959 15.5H129.295L126.383 11.356C126.137 11.0147 125.86 10.8227 125.551 10.78C125.252 10.7373 124.937 10.8653 124.607 11.164L121.775 13.676L122.767 11.468V15.5H119.711ZM139.479 15.724C138.433 15.724 137.511 15.6387 136.711 15.468C135.911 15.2973 135.228 15.052 134.663 14.732C134.108 14.412 133.681 14.028 133.383 13.58C133.095 13.1213 132.935 12.6147 132.903 12.06H136.055C136.119 12.284 136.241 12.492 136.423 12.684C136.604 12.8653 136.833 13.0253 137.111 13.164C137.399 13.292 137.74 13.3933 138.135 13.468C138.529 13.5427 138.977 13.58 139.479 13.58C140.129 13.58 140.684 13.5267 141.143 13.42C141.612 13.3027 141.975 13.1373 142.231 12.924C142.487 12.7107 142.615 12.46 142.615 12.172C142.615 11.9907 142.572 11.836 142.487 11.708C142.401 11.58 142.268 11.4733 142.087 11.388C141.916 11.3027 141.692 11.244 141.415 11.212L137.447 10.716C136.753 10.6307 136.135 10.5027 135.591 10.332C135.047 10.1613 134.593 9.94267 134.231 9.676C133.868 9.40933 133.591 9.084 133.399 8.7C133.207 8.316 133.111 7.87333 133.111 7.372C133.111 6.828 133.249 6.33733 133.527 5.9C133.804 5.46267 134.209 5.09467 134.743 4.796C135.276 4.48667 135.916 4.252 136.663 4.092C137.42 3.932 138.279 3.852 139.239 3.852C140.199 3.852 141.041 3.932 141.767 4.092C142.503 4.24133 143.121 4.46533 143.623 4.764C144.135 5.052 144.524 5.404 144.791 5.82C145.068 6.22533 145.223 6.67867 145.255 7.18H142.087C142.044 6.93467 141.905 6.72667 141.671 6.556C141.447 6.37467 141.127 6.236 140.711 6.14C140.295 6.044 139.777 5.996 139.159 5.996C138.551 5.996 138.028 6.044 137.591 6.14C137.153 6.236 136.823 6.37467 136.599 6.556C136.385 6.73733 136.279 6.956 136.279 7.212C136.279 7.39333 136.332 7.55867 136.439 7.708C136.556 7.84667 136.716 7.964 136.919 8.06C137.121 8.14533 137.361 8.20933 137.639 8.252L141.751 8.748C142.625 8.85467 143.361 9.04667 143.959 9.324C144.556 9.60133 145.009 9.964 145.319 10.412C145.639 10.86 145.799 11.404 145.799 12.044C145.799 12.652 145.66 13.1853 145.383 13.644C145.116 14.092 144.711 14.476 144.167 14.796C143.633 15.1053 142.972 15.34 142.183 15.5C141.404 15.6493 140.503 15.724 139.479 15.724Z" fill={textFill} />
      <defs>
        <clipPath id="clip0_136_65">
          <rect width="30" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

// ─── Search trigger (custom inline) ─────────────────────────────────────────

const SearchTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 220,
        padding: '5px 10px',
        borderRadius: 8,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        color: isDark ? '#888888' : '#999999',
        cursor: 'pointer',
        fontFamily: "'Zalando Sans', sans-serif",
        fontSize: 13,
        fontWeight: 400,
        transition: 'border-color 0.12s ease, background-color 0.12s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
      }}
    >
      <MagnifyingGlassIcon size={14} weight="bold" style={{ flexShrink: 0, opacity: 0.6 }} />
      <span style={{ flex: 1, textAlign: 'left' }}>Hledat...</span>
      <kbd
        style={{
          fontSize: 10,
          padding: '1px 5px',
          borderRadius: 4,
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          fontFamily: "'Zalando Sans', sans-serif",
          fontWeight: 500,
          lineHeight: 'normal',
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
};

// ─── Page content router ────────────────────────────────────────────────────

const pages: Record<string, React.FC> = {
  // Začínáme
  introduction: IntroductionPage,
  installation: InstallationPage,
  usage: UsagePage,
  theming: ThemingPage,
  'design-tokens': DesignTokensPage,
  // Formuláře
  button: ButtonPage,
  input: InputPage,
  select: SelectPage,
  datepicker: DatePickerPage,
  checkbox: CheckboxPage,
  radio: RadioPage,
  switch: SwitchPage,
  textarea: TextareaPage,
  slider: SliderPage,
  fileupload: FileUploadPage,
  // Zobrazení dat
  table: TablePage,
  card: CardPage,
  accordion: AccordionPage,
  tabs: TabsPage,
  tooltip: TooltipPage,
  popover: PopoverPage,
  skeleton: SkeletonPage,
  emptystate: EmptyStatePage,
  stat: StatPage,
  avatar: AvatarPage,
  tag: TagPage,
  segmentedcontrol: SegmentedControlPage,
  // Navigace
  modal: ModalPage,
  drawer: DrawerPage,
  breadcrumb: BreadcrumbPage,
  pagination: PaginationPage,
  stepper: StepperPage,
  dropdownmenu: DropdownMenuPage,
  link: LinkPage,
  spotlight: SpotlightPage,
  // Feedback
  toast: ToastPage,
  alert: AlertPage,
  progress: ProgressPage,
  spinner: SpinnerPage,
  // Utility
  divider: DividerPage,
  stack: StackPage,
  container: ContainerPage,
  draglist: DragListPage,
  // Hooks
  useTheme: UseThemePage,
  useToast: UseToastPage,
};

const PageContent: React.FC<{ activeId: string }> = ({ activeId }) => {
  const Page = pages[activeId];
  if (Page) return <Page />;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: "'Zalando Sans Expanded', sans-serif",
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 12,
      }}>
        {activeId.charAt(0).toUpperCase() + activeId.slice(1)}
      </h1>
      <p style={{ opacity: 0.5, fontSize: 14, lineHeight: 1.7 }}>
        Stránka pro tuto komponentu zatím není vytvořena.
        Bude doplněna s interaktivním preview a dokumentací.
      </p>
    </div>
  );
};

// ─── App ────────────────────────────────────────────────────────────────────

export function App() {
  const [themePreference, setThemePreference] = useState<ThemePreference>('dark');
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\//, '') || 'introduction';
    return path;
  });

  // ── Sync URL with state ───────────────────────────────────────────────

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'introduction';
      setActiveId(path);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const theme = useTheme();

  // ── Resolve & apply theme ───────────────────────────────────────────────

  useEffect(() => {
    if (themePreference === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () =>
        document.body.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      apply();
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    document.body.setAttribute('data-theme', themePreference);
  }, [themePreference]);

  // ── Global Ctrl/Cmd+K shortcut ──────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ── Filter spotlight results ────────────────────────────────────────────

  const navigateTo = useCallback((id: string) => {
    setActiveId(id);
    window.history.pushState(null, '', `/${id}`);
  }, []);

  const spotlightResults = useMemo(() => {
    const items = spotlightQuery.trim()
      ? spotlightItems.filter(
        (item) =>
          item.label.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(spotlightQuery.toLowerCase()),
      )
      : spotlightItems;

    return items.map((item) => ({
      ...item,
      onSelect: () => navigateTo(item.id),
    }));
  }, [spotlightQuery, navigateTo]);

  // ── Close spotlight & clear query ───────────────────────────────────────

  const closeSpotlight = useCallback(() => {
    setSpotlightOpen(false);
    setSpotlightQuery('');
  }, []);

  // ── Theme dropdown items ────────────────────────────────────────────────

  const themeItems: DropdownMenuItem[] = [
    {
      label: 'Light',
      icon: <SunIcon size={16} weight="bold" />,
      onClick: () => setThemePreference('light'),
    },
    {
      label: 'Dark',
      icon: <MoonIcon size={16} weight="bold" />,
      onClick: () => setThemePreference('dark'),
    },
    { divider: true, label: '' },
    {
      label: 'System',
      icon: <DesktopIcon size={16} weight="bold" />,
      onClick: () => setThemePreference('system'),
    },
  ];

  // ── Determine current icon for trigger ──────────────────────────────────

  const currentThemeIcon = THEME_ICONS[themePreference];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 20px',
          borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          backgroundColor: theme === 'dark' ? 'rgba(26,26,26,0.7)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Wider gap before badge */}
        <div style={{ width: 4 }} />

        {/* Version badge */}
        <Badge label="v1.0.0" />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search trigger */}
        <SearchTrigger onClick={() => setSpotlightOpen(true)} />

        {/* Theme switcher */}
        <DropdownMenu
          trigger={
            <Button variant="secondary" size="sm" icon={currentThemeIcon} />
          }
          items={themeItems}
          position="bottom-right"
        />
      </header>

      {/* ── Body: Sidebar + Content ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeId={activeId} onSelect={navigateTo} />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          <PageContent activeId={activeId} />
        </main>
      </div>

      {/* ── Spotlight ───────────────────────────────────────────────────── */}
      <Spotlight
        open={spotlightOpen}
        onClose={closeSpotlight}
        value={spotlightQuery}
        onChange={setSpotlightQuery}
        results={spotlightResults}
        placeholder="Hledat komponenty, hooky..."
      />
    </div>
  );
}
