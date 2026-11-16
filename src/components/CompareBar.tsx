import { useLocation, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/useCompare';
import { displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { useLocalData } from './useLocalData';
import { XIcon } from './Icons';

export default function CompareBar() {
  const { locale, t } = useLocale();
  const { getRobot, getModel } = useLocalData();
  const { state, remove, clear } = useCompare();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const n = state.ids.length;
  const hidden = n === 0 || pathname === '/compare';
  const go = () =>
    nav(state.type === 'robot' ? `/compare?ids=${state.ids.join(',')}` : '/models');
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-3 pb-3 transition-all duration-300 sm:px-6 sm:pb-5 ${
        hidden ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 rounded-2xl border border-accent/30 bg-surface-2/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">{t('bar.label')}</span>
          {state.ids.map((id) => {
            const item = state.type === 'robot' ? getRobot(id) : getModel(id);
            const name = item ? displayName(item, locale) : undefined;
            return (
              <span key={id} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-slate-200">
                {name ?? id}
                <button type="button" onClick={() => remove(id)} aria-label={t('common.remove')} className="text-slate-500 hover:text-white">
                  <XIcon width={12} height={12} />
                </button>
              </span>
            );
          })}
        </div>
        <button type="button" onClick={clear} className="text-xs text-slate-400 transition-colors hover:text-white">
          {t('common.clear')}
        </button>
        <button
          type="button"
          onClick={go}
          className="rounded-lg bg-linear-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          {n < 2 && state.type === 'robot' ? t('bar.goAdd') : t('bar.start').replace('{n}', String(n))}
        </button>
      </div>
    </div>
  );
}
