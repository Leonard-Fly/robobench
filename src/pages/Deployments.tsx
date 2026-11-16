import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { displayManufacturer, displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { useLocalData } from '../components/useLocalData';
import { countryLabel } from '../components/format';
import { ExternalIcon } from '../components/Icons';
import type { DeploymentSector, DeploymentStage } from '../types';

const SECTORS: DeploymentSector[] = ['automotive', 'logistics', 'retail', 'inspection'];
const STAGES: DeploymentStage[] = ['commercial', 'pilot', 'poc'];

const STAGE_STYLE: Record<DeploymentStage, string> = {
  commercial: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  pilot: 'border-accent/30 bg-accent/10 text-accent',
  poc: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
};

export default function Deployments() {
  const { locale, t } = useLocale();
  const { deployments, getRobot } = useLocalData();
  const [sector, setSector] = useState<'all' | DeploymentSector>('all');
  const [stage, setStage] = useState<'all' | DeploymentStage>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deployments.filter((item) => {
      if (sector !== 'all' && item.sector !== sector) return false;
      if (stage !== 'all' && item.stage !== stage) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        (item.clientZh?.toLowerCase().includes(q) ?? false) ||
        item.robotName.toLowerCase().includes(q) ||
        item.metrics.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [deployments, sector, stage, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white">{t('deployments.title')}</h1>
      <p className="mt-2 max-w-3xl text-slate-400">{t('deployments.desc')}</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSector('all')}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              sector === 'all' ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
            }`}
          >
            {t('robots.all')}
            <span className="ml-1.5 font-mono text-xs opacity-70">{deployments.length}</span>
          </button>
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                sector === s ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
              }`}
            >
              {t(`depsector.${s}`)}
              <span className="ml-1.5 font-mono text-xs opacity-70">{deployments.filter((d) => d.sector === s).length}</span>
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('deployments.search')}
          className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-accent lg:w-72"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500">{t('deployments.stageLabel')}:</span>
        <button
          type="button"
          onClick={() => setStage('all')}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            stage === 'all' ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-400 hover:border-accent/40'
          }`}
        >
          {t('robots.all')}
        </button>
        {STAGES.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStage(st)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              stage === st ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-400 hover:border-accent/40'
            }`}
          >
            {t(`depstage.${st}`)}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">{t('robots.results').replace('{n}', String(filtered.length))}</p>

      {filtered.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-slate-500">{t('deployments.empty')}</div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {filtered.map((item) => {
            const robot = item.relatedRobotId ? getRobot(item.relatedRobotId) : undefined;
            return (
              <article key={item.id} className="card flex flex-col justify-between gap-4 p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full border px-2.5 py-0.5 font-medium ${STAGE_STYLE[item.stage]}`}>
                      {t(`depstage.${item.stage}`)}
                    </span>
                    <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-slate-300">
                      {t(`depsector.${item.sector}`)}
                    </span>
                    <span className="font-mono text-slate-400">{item.date}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{countryLabel(t, item.country)}</span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold leading-snug text-white">
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                      {item.title}
                    </a>
                  </h2>

                  <p className="mt-1.5 text-xs font-medium text-accent-2">
                    {displayManufacturer({ manufacturer: item.client, manufacturerZh: item.clientZh }, locale)} · {robot ? displayName(robot, locale) : item.robotName}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.summary}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {item.metrics.map((m) => (
                      <span key={m} className="rounded-lg border border-line bg-surface-2/80 px-2.5 py-1 font-mono text-xs text-slate-200">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs">
                    {robot ? (
                      <Link to={`/robots/${robot.id}`} className="font-medium text-accent hover:underline">
                        {t('deployments.viewRobot').replace('{name}', displayName(robot, locale))} →
                      </Link>
                    ) : (
                      <span className="text-slate-500">{item.robotName}</span>
                    )}
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-accent"
                    >
                      {item.sourceName} <ExternalIcon width={12} height={12} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-xs text-slate-500">{t('deployments.disclaimer')}</p>
    </div>
  );
}
