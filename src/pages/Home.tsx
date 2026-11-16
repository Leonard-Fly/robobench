import { Link } from 'react-router-dom';
import { AI_MODELS, COLLECTION_DEVICES, CONTACT_EMAIL, DATA_VERSION, DATASETS, LATEST_NEWS_DATE, ROBOTS, SITE_NAME } from '../data';
import { CATEGORY_ICONS } from '../data/specFields';
import { CATEGORIES } from '../components/format';
import { useLocalData } from '../components/useLocalData';
import { displayManufacturer, displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { ArrowRightIcon } from '../components/Icons';

export default function Home() {
  const { locale, t } = useLocale();
  const { robots, news } = useLocalData();
  const latestNews = news.slice(0, 3);
  const stats = [
    { label: t('home.stats.robots'), value: ROBOTS.length },
    { label: t('home.stats.models'), value: AI_MODELS.length },
    { label: t('home.stats.mfrs'), value: new Set(ROBOTS.map((r) => r.manufacturer)).size },
    { label: t('home.stats.version'), value: DATA_VERSION },
  ];
  const hot = (['humanoid', 'quadruped', 'hand', 'wheeled'] as const)
    .map((cat) => robots.filter((r) => r.category === cat).slice(0, 3))
    .filter((g) => g.length >= 2)
    .slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-accent-2/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
            {SITE_NAME} · {t('home.badge')}
          </span>
          <h1 className="text-gradient mt-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t('home.hero.desc')}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/robots" className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-accent to-accent-2 px-6 py-3 font-semibold text-bg transition-opacity hover:opacity-90">
              {t('home.hero.browse')} <ArrowRightIcon />
            </Link>
            <Link to="/compare" className="rounded-xl border border-line bg-surface-2 px-6 py-3 font-semibold text-white transition-colors hover:border-accent/50 hover:text-accent">
              {t('home.hero.compare')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="card grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="p-5 text-center">
              <p className="font-mono text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-white">{t('home.byCat')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/robots?cat=${c}`} className="card group p-5 hover:-translate-y-0.5">
              <span className="text-3xl">{CATEGORY_ICONS[c]}</span>
              <p className="mt-3 font-semibold text-white transition-colors group-hover:text-accent">{t(`cat.${c}`)}</p>
              <p className="mt-1 font-mono text-sm text-slate-500">{t('home.catCount').replace('{n}', String(ROBOTS.filter((r) => r.category === c).length))}</p>
            </Link>
          ))}
        </div>
      </section>

      {hot.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white">{t('home.hot')}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {hot.map((g) => (
              <Link key={g[0].id} to={`/compare?ids=${g.map((r) => r.id).join(',')}`} className="card group p-5 hover:-translate-y-0.5">
                <p className="text-xs text-accent">{CATEGORY_ICONS[g[0].category]} {t(`cat.${g[0].category}`)}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-white">
                  {g.map((r, i) => (
                    <span key={r.id} className="flex items-center gap-2">
                      {i > 0 && <span className="text-xs font-normal text-slate-600">{t('home.vs')}</span>}
                      {displayName(r, locale)}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm text-slate-500 transition-colors group-hover:text-accent">{t('home.compareNow')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-accent-2/15 blur-3xl" />
            <h2 className="text-2xl font-bold text-white">{t('home.models.title')}</h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              {t('home.models.desc')
                .replace('{v}', String(AI_MODELS.filter((m) => m.kind === 'vla').length))
                .replace('{vla}', t('kind.vla'))
                .replace('{w}', String(AI_MODELS.filter((m) => m.kind === 'world-model').length))
                .replace('{wm}', t('kind.world-model'))}
            </p>
            <Link to="/models" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-accent/40 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10">
              {t('home.models.enter')} <ArrowRightIcon />
            </Link>
          </div>
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
            <h2 className="text-2xl font-bold text-white">{t('home.datasets.title')}</h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              {t('home.datasets.desc')
                .replace('{d}', String(DATASETS.length))
                .replace('{c}', String(COLLECTION_DEVICES.length))}
            </p>
            <Link to="/datasets" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-accent/40 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10">
              {t('home.datasets.enter')} <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{t('home.news.title')}</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t('news.dailyBadge').replace('{d}', LATEST_NEWS_DATE)}
            </span>
          </div>
          <Link to="/news" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            {t('home.news.enter')} <ArrowRightIcon />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {latestNews.map((item) => (
            <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="card group flex flex-col justify-between p-5 hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="text-accent">{t(`newscat.${item.category}`)}</span>
                  <span className="font-mono">{item.publishedAt}</span>
                </div>
                <h3 className="mt-2.5 line-clamp-2 font-semibold text-white transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{item.summary}</p>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                {displayManufacturer({ manufacturer: item.company, manufacturerZh: item.companyZh }, locale)} · {item.sourceName}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="card bg-linear-to-br from-accent/10 to-accent-2/10 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white">{t('home.cta.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">{t('home.cta.desc')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="rounded-xl bg-linear-to-r from-accent to-accent-2 px-6 py-3 font-semibold text-bg hover:opacity-90">{t('home.cta.learn')}</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-xl border border-line px-6 py-3 font-semibold text-white hover:border-accent/50">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
