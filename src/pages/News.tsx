import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LATEST_NEWS_DATE } from '../data';
import { displayManufacturer, displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { useLocalData } from '../components/useLocalData';
import { countryLabel } from '../components/format';
import { ExternalIcon } from '../components/Icons';
import type { NewsCategory } from '../types';

const NEWS_CATEGORIES: NewsCategory[] = ['commercial', 'technical', 'funding', 'policy'];

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  commercial: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  technical: 'border-accent/30 bg-accent/10 text-accent',
  funding: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  policy: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
};

export default function News() {
  const { locale, t } = useLocale();
  const { news, getRobot } = useLocalData();
  const [category, setCategory] = useState<'all' | NewsCategory>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return news.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        (item.companyZh?.toLowerCase().includes(q) ?? false) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [news, category, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-white">{t('news.title')}</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t('news.dailyBadge').replace('{d}', LATEST_NEWS_DATE)}
        </span>
      </div>
      <p className="mt-2 max-w-3xl text-slate-400">{t('news.desc')}</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              category === 'all' ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
            }`}
          >
            {t('robots.all')}
            <span className="ml-1.5 font-mono text-xs opacity-70">{news.length}</span>
          </button>
          {NEWS_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                category === c ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
              }`}
            >
              {t(`newscat.${c}`)}
              <span className="ml-1.5 font-mono text-xs opacity-70">{news.filter((n) => n.category === c).length}</span>
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('news.search')}
          className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-accent lg:w-72"
        />
      </div>

      <p className="mt-4 text-xs text-slate-500">{t('robots.results').replace('{n}', String(filtered.length))}</p>

      {filtered.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-slate-500">{t('news.empty')}</div>
      ) : (
        <div className="mt-5 space-y-4">
          {filtered.map((item) => {
            const related = (item.relatedRobotIds ?? [])
              .map((id) => getRobot(id))
              .filter((r): r is NonNullable<typeof r> => !!r);
            return (
              <article key={item.id} className="card flex flex-col gap-3 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full border px-2.5 py-0.5 font-medium ${CATEGORY_STYLE[item.category]}`}>
                    {t(`newscat.${item.category}`)}
                  </span>
                  <span className="font-mono text-slate-400">{item.publishedAt}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-medium text-slate-300">
                    {displayManufacturer({ manufacturer: item.company, manufacturerZh: item.companyZh }, locale)}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{countryLabel(t, item.country)}</span>
                </div>

                <h2 className="text-lg font-semibold leading-snug text-white sm:text-xl">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {item.title}
                  </a>
                </h2>

                <p className="text-sm leading-relaxed text-slate-300">{item.summary}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-slate-400">
                        #{tag}
                      </span>
                    ))}
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        to={`/robots/${r.id}`}
                        className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent transition-colors hover:bg-accent/20"
                      >
                        {displayName(r, locale)} →
                      </Link>
                    ))}
                  </div>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-accent"
                  >
                    {item.sourceName} <ExternalIcon width={12} height={12} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-xs text-slate-500">{t('news.disclaimer')}</p>
    </div>
  );
}
