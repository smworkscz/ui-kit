import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

/**
 * Zjistí aktuální téma aplikace.
 * Výchozí je 'light'. Pokud je na html/body nastaven `data-theme`, použije se.
 * Jinak funguje fallback na systémové preference (prefers-color-scheme).
 */
export const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getTheme = (): Theme => {
      const docTheme = document.documentElement.getAttribute('data-theme') || document.body.getAttribute('data-theme');
      if (docTheme === 'dark' || docTheme === 'light') {
        return docTheme as Theme;
      }

      // Fallback na systém
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }

      return 'light'; // default
    };

    setTheme(getTheme());

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      const docTheme = document.documentElement.getAttribute('data-theme') || document.body.getAttribute('data-theme');
      if (!docTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', listener);

    // Nasloucháme případným změnám na data-theme v DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTheme(getTheme());
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });

    return () => {
      mediaQuery.removeEventListener('change', listener);
      observer.disconnect();
    };
  }, []);

  return theme;
};
