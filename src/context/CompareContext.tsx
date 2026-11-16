import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CompareContext, type CompareState, type CompareType } from './compareStore';
import { useLocale } from '../i18n/useLocale';
import { MAX_COMPARE } from '../components/format';
import { getAiModelById, getCollectionDeviceById, getDatasetById, getRobotById } from '../data';

const KEY = 'robobench-compare-v1';
const EMPTY: CompareState = { type: 'robot', group: '', ids: [] };

const VALID_TYPES: CompareType[] = ['robot', 'model', 'dataset', 'device'];

function isValidItem(type: CompareType, id: string): boolean {
  if (type === 'robot') return !!getRobotById(id);
  if (type === 'model') return !!getAiModelById(id);
  if (type === 'dataset') return !!getDatasetById(id);
  return !!getCollectionDeviceById(id);
}

function load(): CompareState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const s = JSON.parse(raw) as CompareState;
    if (!VALID_TYPES.includes(s.type) || !Array.isArray(s.ids)) return EMPTY;
    const ids = s.ids.filter((id) => typeof id === 'string' && isValidItem(s.type, id));
    return ids.length ? { type: s.type, group: String(s.group), ids: ids.slice(0, MAX_COMPARE) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function groupLabel(t: (k: string) => string, type: CompareType, group: string): string {
  const prefix = type === 'model' ? 'kind' : type === 'dataset' || type === 'device' ? 'datakind' : 'cat';
  const key = `${prefix}.${group}`;
  const v = t(key);
  return v === key ? group : v;
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [state, setState] = useState<CompareState>(load);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const toggle = useCallback(
    (type: CompareType, group: string, id: string) => {
      if (state.ids.includes(id) && state.type === type) {
        setState({ ...state, ids: state.ids.filter((x) => x !== id) });
        return;
      }
      if (state.ids.length > 0 && (state.type !== type || state.group !== group)) {
        setState({ type, group, ids: [id] });
        showToast(t('toast.switched').replace('{label}', groupLabel(t, type, group)));
        return;
      }
      if (state.ids.length >= MAX_COMPARE) {
        showToast(t('toast.max').replace('{n}', String(MAX_COMPARE)));
        return;
      }
      setState({ type, group, ids: [...state.ids, id] });
    },
    [state, showToast, t],
  );

  const remove = useCallback(
    (id: string) => setState((s) => ({ ...s, ids: s.ids.filter((x) => x !== id) })),
    [],
  );
  const clear = useCallback(() => setState(EMPTY), []);
  const setAll = useCallback(
    (type: CompareType, group: string, ids: string[]) =>
      setState(ids.length ? { type, group, ids: ids.slice(0, MAX_COMPARE) } : EMPTY),
    [],
  );

  const value = useMemo(
    () => ({ state, has: (id: string) => state.ids.includes(id), toggle, remove, clear, setAll }),
    [state, toggle, remove, clear, setAll],
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
      <div
        className={`pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <div className="rounded-xl border border-accent/40 bg-surface-2 px-4 py-2.5 text-sm text-slate-100 shadow-xl shadow-black/40">
          {toast}
        </div>
      </div>
    </CompareContext.Provider>
  );
}
