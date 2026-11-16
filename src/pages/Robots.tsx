import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORY_ICONS } from '../data/specFields';
import { displayManufacturer } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { useLocalData } from '../components/useLocalData';
import type { RobotCategory } from '../types';
import { CATEGORIES, priceSortValue } from '../components/format';
import RobotCard from '../components/RobotCard';
import { SearchIcon } from '../components/Icons';

type Sort = 'default' | 'year-desc' | 'year-asc' | 'price-asc' | 'price-desc';
const SELECT =
  'rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60';

export default function Robots() {
  const { locale, t } = useLocale();
  const { robots: ROBOTS } = useLocalData();
  const [sp, setSp] = useSearchParams();
  const catParam = sp.get('cat');
  const cat = CATEGORIES.find((c) => c === catParam) ?? null;
  const [mfr, setMfr] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('default');

  const inCat = useMemo(() => ROBOTS.filter((r) => !cat || r.category === cat), [ROBOTS, cat]);
  const manufacturers = useMemo(
    () => [...new Map(inCat.map((r) => [r.manufacturer, displayManufacturer(r, locale)])).entries()],
    [inCat, locale],
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
      <h1 className="text-3xl font-bold text-white">{t('robots.title')}</h1>
      <p className="mt-2 text-slate-400">{t('robots.desc')}</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button type="button" className={tab(!cat)} onClick={() => setCat(null)}>
          {t('robots.all')} <span className="ml-1 font-mono text-xs opacity-70">{ROBOTS.length}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={tab(cat === c)} onClick={() => setCat(c)}>
            {CATEGORY_ICONS[c]} {t(`cat.${c}`)}
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
            placeholder={t('robots.search')}
            className={`${SELECT} w-full pl-9`}
          />
        </div>
        <select className={SELECT} value={mfr} onChange={(e) => setMfr(e.target.value)} aria-label={t('robots.mfr')}>
          <option value="">{t('robots.allMfr')}</option>
          {manufacturers.map(([en, zh]) => <option key={en} value={en}>{zh}</option>)}
        </select>
        <select className={SELECT} value={status} onChange={(e) => setStatus(e.target.value)} aria-label={t('robots.status')}>
          <option value="">{t('robots.allStatus')}</option>
          {statuses.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
        </select>
        <select className={`${SELECT} sm:ml-auto`} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t('robots.sort')}>
          <option value="default">{t('robots.sort.default')}</option>
          <option value="year-desc">{t('robots.sort.yearDesc')}</option>
          <option value="year-asc">{t('robots.sort.yearAsc')}</option>
          <option value="price-asc">{t('robots.sort.priceAsc')}</option>
          <option value="price-desc">{t('robots.sort.priceDesc')}</option>
        </select>
      </div>

      <p className="mt-5 text-sm text-slate-500">{t('robots.results').split('{n}').flatMap((part, i) => (i === 0 ? [part] : [<span key={i} className="font-mono text-slate-300">{list.length}</span>, part]))}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((r) => <RobotCard key={r.id} robot={r} />)}
      </div>
      {list.length === 0 && <div className="card mt-6 p-12 text-center text-slate-500">{t('robots.empty')}</div>}
    </div>
  );
}
