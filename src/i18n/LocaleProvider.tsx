import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LOCALE, LOCALE_META, LOCALES, type Locale } from './config';
import { LOCALE_STORAGE_KEY, LocaleContext } from './localeStore';
import zh from './locales/zh';
import en from './locales/en';
import ja from './locales/ja';
import ko from './locales/ko';
import fr from './locales/fr';
import de from './locales/de';
import es from './locales/es';

const DICTS: Record<Locale, Record<string, string>> = { zh, en, ja, ko, fr, de, es };

function initialLocale(): Locale {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (saved && LOCALES.some((l) => l.code === saved)) return saved as Locale;
  const nav = navigator.language.toLowerCase();
  const match = LOCALES.find((l) => nav.startsWith(l.code));
  return match?.code ?? DEFAULT_LOCALE;
}

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_STORAGE_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].tag;
  }, [locale]);

  const t = useCallback(
    (key: string) => DICTS[locale][key] ?? DICTS.en[key] ?? DICTS.zh[key] ?? key,
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
