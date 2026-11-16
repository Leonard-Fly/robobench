import { useContext } from 'react';
import { LocaleContext } from './localeStore';

export function useLocale() {
  return useContext(LocaleContext);
}
