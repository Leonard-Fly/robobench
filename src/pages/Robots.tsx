import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROBOTS } from '../data';
import { CATEGORY_ICONS, CATEGORY_LABELS, STATUS_LABELS } from '../data/specFields';
import type { RobotCategory } from '../types';
import { CATEGORIES, priceSortValue } from '../components/format';
import RobotCard from '../components/RobotCard';
import { SearchIcon } from '../components/Icons';

type Sort = 'default' | 'year-desc' | 'year-asc' | 'price-asc' | 'price-desc';
const SELECT =
  'rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60';

export default function Robots() {
  const [sp, setSp] = useSearchParams();
  const catParam = sp.get('cat');
  const cat = CATEGORIES.find((c) => c === catParam) ?? null;
  const [mfr, setMfr] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('default');

  const inCat = useMemo(() => ROBOTS.filter((r) => !cat || r.category === cat), [cat]);
  const manufacturers = useMemo(
    () => [...new Map(inCat.map((r) => [r.manufacturer, r.manufacturerZh])).entries()],
    [inCat],
  );
  const statuses = useMemo(() => [...new Set(inCat.map((r) => r.status))], [inCat]);

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const out = inCat.filter(
      (r) =>
        (!mfr || r.manufacturer === mfr) &&
        (!status || r.status === status) &&
        (!kw || `${r.name} ${r.nameZh} ${r.manufacturer} ${r.manufacturerZh}`.toLowerCase().includes(kw)),
    );
    const nullLast = (a: number | null, b: number | null, dir: 1 | -1) =>
      a === null ? (b === null ? 0 : 1) : b === null ? -1 : (a - b) * dir;
    if (sort === 'year-desc') out.sort((a, b) => nullLast(a.releaseYear, b.releaseYear, -1));
    if (sort === 'year-asc') out.sort((a, b) => nullLast(a.releaseYear, b.releaseYear, 1));
    if (sort === 'price-asc') out.sort((a, b) => nullLast(priceSortValue(a.price), priceSortValue(b.price), 1));
    if (sort === 'price-desc') out.sort((a, b) => nullLast(priceSortValue(a.price), priceSortValue(b.price), -1));
    return out;
  }, [inCat, mfr, status, q, sort]);

  const setCat = (c: RobotCategory | null) => {
    setSp(c ? { cat: c } : {});
    setMfr('');
    setStatus('');
  };

  const tab = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
      active ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white">机器人库</h1>
      <p className="mt-2 text-slate-400">按分类、厂商、状态筛选，勾选「对比」即可横向比较参数。</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button type="button" className={tab(!cat)} onClick={() => setCat(null)}>
          全部 <span className="ml-1 font-mono text-xs opacity-70">{ROBOTS.length}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={tab(cat === c)} onClick={() => setCat(c)}>
            {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
            <span className="ml-1 font-mono text-xs opacity-70">{ROBOTS.filter((r) => r.category === c).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索名称 / 厂商"
            className={`${SELECT} w-full pl-9`}
          />
        </div>
        <select className={SELECT} value={mfr} onChange={(e) => setMfr(e.target.value)} aria-label="厂商">
          <option value="">全部厂商</option>
          {manufacturers.map(([en, zh]) => <option key={en} value={en}>{zh}</option>)}
        </select>
        <select className={SELECT} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="状态">
          <option value="">全部状态</option>
          {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>)}
        </select>
        <select className={`${SELECT} sm:ml-auto`} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="排序">
          <option value="default">默认排序</option>
          <option value="year-desc">发布年份：新到旧</option>
          <option value="year-asc">发布年份：旧到新</option>
          <option value="price-asc">价格：低到高</option>
          <option value="price-desc">价格：高到低</option>
        </select>
      </div>

      <p className="mt-5 text-sm text-slate-500">共 <span className="font-mono text-slate-300">{list.length}</span> 个结果</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((r) => <RobotCard key={r.id} robot={r} />)}
      </div>
      {list.length === 0 && <div className="card mt-6 p-12 text-center text-slate-500">没有符合条件的条目，试试调整筛选条件。</div>}
    </div>
  );
}
