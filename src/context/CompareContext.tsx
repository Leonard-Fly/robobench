import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CompareContext, type CompareState, type CompareType } from './compareStore';
import { CATEGORY_LABELS } from '../data/specFields';
import { KIND_LABELS, MAX_COMPARE } from '../components/format';
import { getAiModelById, getRobotById } from '../data';

const KEY = 'robobench-compare-v1';
const EMPTY: CompareState = { type: 'robot', group: '', ids: [] };

function load(): CompareState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const s = JSON.parse(raw) as CompareState;
    if ((s.type !== 'robot' && s.type !== 'model') || !Array.isArray(s.ids)) return EMPTY;
    const ids = s.ids.filter((id) =>
      typeof id === 'string' && (s.type === 'robot' ? getRobotById(id) : getAiModelById(id)),
    );
    return ids.length ? { type: s.type, group: String(s.group), ids: ids.slice(0, MAX_COMPARE) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function groupLabel(type: CompareType, group: string): string {
  if (type === 'model') return KIND_LABELS[group as keyof typeof KIND_LABELS] ?? group;
  return CATEGORY_LABELS[group as keyof typeof CATEGORY_LABELS] ?? group;
}

export function CompareProvider({ children }: { children: ReactNode }) {
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
        showToast(`已切换为「${groupLabel(type, group)}」对比，之前的选择已清空`);
        return;
      }
      if (state.ids.length >= MAX_COMPARE) {
        showToast(`最多同时对比 ${MAX_COMPARE} 个`);
        return;
      }
      setState({ type, group, ids: [...state.ids, id] });
    },
    [state, showToast],
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
