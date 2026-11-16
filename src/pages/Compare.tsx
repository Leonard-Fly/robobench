import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROBOTS, getRobotById } from '../data';
import { CATEGORY_ICONS, CATEGORY_LABELS, SPEC_FIELDS_BY_CATEGORY } from '../data/specFields';
import type { Robot, RobotCategory } from '../types';
import { CATEGORIES, MAX_COMPARE, formatPrice } from '../components/format';
import { useCompare } from '../context/useCompare';
import CompareTable from '../components/CompareTable';
import AddPicker from '../components/AddPicker';
import { robotBasicRows } from './robotRows';
import { CheckIcon, PlusIcon, XIcon } from '../components/Icons';

export default function Compare() {
  const [sp, setSp] = useSearchParams();
  const { state, setAll } = useCompare();
  const [pickCat, setPickCat] = useState<RobotCategory>('humanoid');
  const [picking, setPicking] = useState(false);
  const idsParam = sp.get('ids') ?? '';

  const items = useMemo(() => {
    const seen = new Set<string>();
    const list = idsParam
      .split(',')
      .filter((id) => id && !seen.has(id) && seen.add(id))
      .map(getRobotById)
      .filter((r): r is Robot => !!r);
    const cat = list[0]?.category;
    return list.filter((r) => r.category === cat).slice(0, MAX_COMPARE);
  }, [idsParam]);

  const ids = items.map((r) => r.id);
  const cat = items[0]?.category;

  const update = (next: string[], c: RobotCategory | undefined = cat) => {
    setSp(next.length ? { ids: next.join(',') } : {}, { replace: true });
    setAll('robot', c ?? '', next);
  };

  useEffect(() => {
    if (items.length) {
      const same = state.type === 'robot' && state.ids.join() === ids.join();
      if (!same) setAll('robot', items[0].category, ids);
    } else if (!idsParam && state.type === 'robot' && state.ids.length) {
      setSp({ ids: state.ids.join(',') }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam]);

  const fields = cat ? SPEC_FIELDS_BY_CATEGORY[cat] : [];
  const candidates = cat ? ROBOTS.filter((r) => r.category === cat && !ids.includes(r.id)) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white">参数对比</h1>
      <p className="mt-2 text-sm text-slate-400">仅支持同一分类内对比，最多同时对比 {MAX_COMPARE} 个。数值型参数中最优值以绿色 ▲ 标出，横条表示相对该行最大值的比例。</p>

      {items.length === 0 ? (
        <div className="card mt-8 p-6 sm:p-8">
          <h2 className="font-semibold text-white">选择分类，开始对比</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPickCat(c)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  pickCat === c ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
                }`}
              >
                {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">热门条目（点击勾选，选 2 个以上即可对比）</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROBOTS.filter((r) => r.category === pickCat).slice(0, 9).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => update([r.id], r.category)}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/60 p-3 text-left transition-colors hover:border-accent/50"
              >
                <PlusIcon className="text-accent" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{r.nameZh}</span>
                  <span className="block truncate text-xs text-slate-500">{r.manufacturerZh} · {formatPrice(r.price)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-16 z-30 -mx-4 mt-6 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
            <p className="mb-2 text-xs text-slate-500">
              {CATEGORY_ICONS[items[0].category]} {CATEGORY_LABELS[items[0].category]} · 已选 <span className="font-mono">{items.length}</span>/{MAX_COMPARE}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
              {items.map((r) => (
                <div key={r.id} className="relative rounded-xl border border-accent/30 bg-surface-2 p-3 pr-8">
                  <p className="truncate text-sm font-semibold text-white">{r.nameZh}</p>
                  <p className="truncate text-xs text-slate-500">{r.manufacturerZh}</p>
                  <button
                    type="button"
                    aria-label={`移除 ${r.nameZh}`}
                    onClick={() => update(ids.filter((x) => x !== r.id))}
                    className="absolute top-2 right-2 rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white"
                  >
                    <XIcon width={14} height={14} />
                  </button>
                </div>
              ))}
              {items.length < MAX_COMPARE && (
                <button
                  type="button"
                  onClick={() => setPicking(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line p-3 text-sm text-slate-400 transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <PlusIcon /> 添加
                </button>
              )}
            </div>
          </div>

          {items.length < 2 && (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-amber-300"><CheckIcon /> 再添加至少 1 个同类条目即可看到对比效果。</p>
          )}

          <div className="mt-6">
            <CompareTable
              columns={items.map((r) => ({ id: r.id, name: r.nameZh, sub: r.name, to: `/robots/${r.id}`, specs: r.specs }))}
              fields={fields}
              basicRows={robotBasicRows(items)}
              listRows={[
                { label: '核心优势', lists: items.map((r) => r.highlights) },
                { label: '应用场景', lists: items.map((r) => r.applications) },
              ]}
              onRemove={(id) => update(ids.filter((x) => x !== id))}
            />
          </div>
        </>
      )}

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        免责声明：参数来自公开资料整理，仅供参考，具体以厂商官方发布为准；不同厂商的测试条件与口径可能不同。
      </p>

      {picking && (
        <AddPicker
          title={`添加${cat ? CATEGORY_LABELS[cat] : ''}`}
          candidates={candidates}
          onClose={() => setPicking(false)}
          onPick={(id) => {
            update([...ids, id]);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
