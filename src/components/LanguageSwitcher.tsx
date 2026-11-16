import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_META } from '../i18n/config';
import { useLocale } from '../i18n/useLocale';
import { GlobeIcon } from './Icons';

/** 桌面端：地球图标 + 当前语言名，点击弹出下拉 */
export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={t('lang.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
      >
        <GlobeIcon />
        <span>{LOCALE_META[locale].native}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-36 overflow-hidden rounded-xl border border-line bg-surface-2 p-1 shadow-xl shadow-black/40"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale}>
              <button
                type="button"
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  l.code === locale ? 'bg-accent/10 text-accent' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {l.native}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 移动端菜单内的语言选项（平铺） */
export function LanguageList({ onPick }: { onPick?: () => void }) {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className="mt-2 border-t border-line pt-3">
      <p className="mb-2 flex items-center gap-1.5 px-3 text-xs text-slate-500">
        <GlobeIcon width={14} height={14} /> {t('lang.label')}
      </p>
      <div className="flex flex-wrap gap-2 px-1">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => {
              setLocale(l.code);
              onPick?.();
            }}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              l.code === locale ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    </div>
  );
}
