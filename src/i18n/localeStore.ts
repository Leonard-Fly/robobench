import { createContext } from 'react';
import { DEFAULT_LOCALE, type Locale } from './config';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** UI 文案查询：当前语言 → en → zh → key 本身 */
  t: (key: string) => string;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => k,
});

export const LOCALE_STORAGE_KEY = 'robobench.locale';
