import { useState } from 'react';
import { displayManufacturer, displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { useLocalData } from '../components/useLocalData';
import { SPEC_FIELDS_BY_KIND } from './modelFields';
import type { AiModel, AiModelKind } from '../types';
import { MAX_COMPARE, MODEL_SPEC_NS, countryLabel, keySpecs } from '../components/format';
import { useCompare } from '../context/useCompare';
import CompareToggle from '../components/CompareToggle';
import CompareTable from '../components/CompareTable';
import { OpenSourceBadge } from '../components/StatusBadge';
import { ExternalIcon } from '../components/Icons';

const KINDS: AiModelKind[] = ['vla', 'world-model'];

export default function Models() {
  const { locale, t } = useLocale();
  const { models: AI_MODELS, getModel } = useLocalData();
  const [kind, setKind] = useState<AiModelKind>('vla');
  const { state, remove } = useCompare();
  const fields = SPEC_FIELDS_BY_KIND[kind];
  const list = AI_MODELS.filter((m) => m.kind === kind);
  const selected =
    state.type === 'model' && state.group === kind
      ? state.ids.map(getModel).filter((m): m is AiModel => !!m)
      : [];
  const otherKindSelected = state.type === 'model' && state.ids.length > 0 && state.group !== kind;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white">{t('models.title')}</h1>
      <p className="mt-2 text-slate-400">{t('models.desc')}</p>

      <div className="mt-6 flex gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full border px-5 py-2 text-sm transition-colors ${
              kind === k ? 'border-accent bg-accent/15 text-accent' : 'border-line text-slate-300 hover:border-accent/40'
            }`}
          >
            {t(`kind.${k}`)}
            <span className="ml-1.5 font-mono text-xs opacity-70">{AI_MODELS.filter((m) => m.kind === k).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {list.map((m) => {
          const specs = keySpecs(fields, m.specs, 4);
          return (
            <article key={m.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="lg:w-72 lg:shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">{displayName(m, locale)}</h2>
                  <OpenSourceBadge value={m.openSource} />
                </div>
                <p className="mt-1 text-sm text-slate-400">{displayManufacturer({ manufacturer: m.org, manufacturerZh: m.orgZh }, locale)} · {countryLabel(t, m.country)}</p>
                <p className="font-mono text-xs text-slate-500">{m.releaseDate}</p>
              </div>
              <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
                {specs.map(({ field, text }) => (
                  <div key={field.key} className="min-w-0">
                    <dt className="text-xs text-slate-500">{t(`spec.${MODEL_SPEC_NS[m.kind]}.${field.key}`)}</dt>
                    <dd className="truncate font-mono text-sm text-slate-200" title={text}>{text}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                <div className="flex gap-3 text-xs">
                  {m.paperUrl && (
                    <a href={m.paperUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-400 hover:text-accent">{t('models.paper')} <ExternalIcon width={12} height={12} /></a>
                  )}
                  {m.codeUrl && (
                    <a href={m.codeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-400 hover:text-accent">{t('models.code')} <ExternalIcon width={12} height={12} /></a>
                  )}
                </div>
                <CompareToggle type="model" group={m.kind} id={m.id} />
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">{t('models.compareTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('models.compareHint').replace('{n}', String(MAX_COMPARE))}</p>
        {otherKindSelected && (
          <p className="mt-3 text-sm text-amber-300">{t('models.otherKind')}</p>
        )}
        {selected.length === 0 ? (
          <div className="card mt-5 p-10 text-center text-slate-500">{t('models.none')}</div>
        ) : (
          <div className="mt-5">
            <CompareTable
              columns={selected.map((m) => ({ id: m.id, name: displayName(m, locale), sub: displayManufacturer({ manufacturer: m.org, manufacturerZh: m.orgZh }, locale), specs: m.specs }))}
              fields={fields}
              specNs={MODEL_SPEC_NS[kind]}
              basicRows={[
                { label: t('row.org'), cells: selected.map((m) => displayManufacturer({ manufacturer: m.org, manufacturerZh: m.orgZh }, locale)) },
                { label: t('row.country'), cells: selected.map((m) => countryLabel(t, m.country)) },
                { label: t('row.releaseDate'), cells: selected.map((m) => <span key={m.id} className="font-mono">{m.releaseDate}</span>) },
                { label: t('row.openSource'), cells: selected.map((m) => <OpenSourceBadge key={m.id} value={m.openSource} />) },
                { label: t('row.license'), cells: selected.map((m) => m.license ?? '—') },
              ]}
              listRows={[
                { label: t('row.highlights'), lists: selected.map((m) => m.highlights) },
                { label: t('row.modelApps'), lists: selected.map((m) => m.applications) },
              ]}
              onRemove={remove}
            />
          </div>
        )}
        <p className="mt-6 text-xs text-slate-500">{t('models.disclaimer')}</p>
      </section>
    </div>
  );
}
