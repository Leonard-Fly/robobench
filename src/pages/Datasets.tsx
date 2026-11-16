import { useState } from 'react';
import { displayManufacturer, displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { useLocalData } from '../components/useLocalData';
import { COLLECTION_DEVICE_SPEC_FIELDS, DATASET_SPEC_FIELDS } from '../data/specFields';
import type { CollectionDevice, CollectionDeviceKind, EmbodiedDataset } from '../types';
import { DATA_SPEC_NS, MAX_COMPARE, countryLabel, keySpecs } from '../components/format';
import { useCompare } from '../context/useCompare';
import CompareToggle from '../components/CompareToggle';
import CompareTable from '../components/CompareTable';
import { OpenSourceBadge } from '../components/StatusBadge';
import { ExternalIcon } from '../components/Icons';

type Tab = 'dataset' | 'device';
const TABS: Tab[] = ['dataset', 'device'];
const DEVICE_KINDS: ('all' | CollectionDeviceKind)[] = ['all', 'umi', 'egocentric', 'teleop'];

export default function Datasets() {
  const { locale, t } = useLocale();
  const { datasets, devices, getDataset, getDevice } = useLocalData();
  const [tab, setTab] = useState<Tab>('dataset');
  const [deviceKind, setDeviceKind] = useState<'all' | CollectionDeviceKind>('all');
  const { state, remove } = useCompare();

  const isDatasetTab = tab === 'dataset';
  const fields = isDatasetTab ? DATASET_SPEC_FIELDS : COLLECTION_DEVICE_SPEC_FIELDS;
  const filteredDevices =
    deviceKind === 'all' ? devices : devices.filter((d) => d.deviceKind === deviceKind);

  const selectedDatasets =
    state.type === 'dataset' && state.group === 'dataset'
      ? state.ids.map(getDataset).filter((d): d is EmbodiedDataset => !!d)
      : [];
  const selectedDevices =
    state.type === 'device' && state.group === 'device'
      ? state.ids.map(getDevice).filter((d): d is CollectionDevice => !!d)
      : [];
  const selected = isDatasetTab ? selectedDatasets : selectedDevices;
  const otherTabSelected =
    ((isDatasetTab && state.type === 'device') || (!isDatasetTab && state.type === 'dataset')) &&
    state.ids.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white">{t('datasets.title')}</h1>
      <p className="mt-2 text-slate-400">{t('datasets.desc')}</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {TABS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-full border px-5 py-2 text-sm transition-colors ${
              tab === k
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-line text-slate-300 hover:border-accent/40'
            }`}
          >
            {t(`datakind.${k}`)}
            <span className="ml-1.5 font-mono text-xs opacity-70">
              {k === 'dataset' ? datasets.length : devices.length}
            </span>
          </button>
        ))}
      </div>

      {!isDatasetTab && (
        <div className="mt-4 flex flex-wrap gap-2">
          {DEVICE_KINDS.map((dk) => (
            <button
              key={dk}
              type="button"
              onClick={() => setDeviceKind(dk)}
              className={`rounded-lg border px-3.5 py-1.5 text-xs transition-colors ${
                deviceKind === dk
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-line text-slate-400 hover:border-accent/40 hover:text-slate-200'
              }`}
            >
              {t(`devkind.${dk}`)}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {isDatasetTab
          ? datasets.map((d) => {
              const specs = keySpecs(fields, d.specs, 4);
              return (
                <article key={d.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="lg:w-72 lg:shrink-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">{displayName(d, locale)}</h2>
                      <OpenSourceBadge value={d.openSource} />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {displayManufacturer({ manufacturer: d.org, manufacturerZh: d.orgZh }, locale)} ·{' '}
                      {countryLabel(t, d.country)}
                    </p>
                    <p className="font-mono text-xs text-slate-500">{d.releaseDate}</p>
                  </div>
                  <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
                    {specs.map(({ field, text }) => (
                      <div key={field.key} className="min-w-0">
                        <dt className="text-xs text-slate-500">
                          {t(`spec.${DATA_SPEC_NS.dataset}.${field.key}`)}
                        </dt>
                        <dd className="truncate font-mono text-sm text-slate-200" title={text}>
                          {text}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                    <div className="flex gap-3 text-xs">
                      {d.paperUrl && (
                        <a
                          href={d.paperUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-accent"
                        >
                          {t('models.paper')} <ExternalIcon width={12} height={12} />
                        </a>
                      )}
                      {d.datasetUrl && (
                        <a
                          href={d.datasetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-accent"
                        >
                          {t('datasets.homepage')} <ExternalIcon width={12} height={12} />
                        </a>
                      )}
                    </div>
                    <CompareToggle type="dataset" group="dataset" id={d.id} />
                  </div>
                </article>
              );
            })
          : filteredDevices.map((c) => {
              const specs = keySpecs(fields, c.specs, 4);
              return (
                <article key={c.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="lg:w-72 lg:shrink-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">{displayName(c, locale)}</h2>
                      <OpenSourceBadge value={c.openSource} />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {displayManufacturer({ manufacturer: c.org, manufacturerZh: c.orgZh }, locale)} ·{' '}
                      {countryLabel(t, c.country)}
                    </p>
                    <p className="font-mono text-xs text-slate-500">
                      {t(`devkind.${c.deviceKind}`)} · {c.releaseDate}
                    </p>
                  </div>
                  <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
                    {specs.map(({ field, text }) => (
                      <div key={field.key} className="min-w-0">
                        <dt className="text-xs text-slate-500">
                          {t(`spec.${DATA_SPEC_NS.device}.${field.key}`)}
                        </dt>
                        <dd className="truncate font-mono text-sm text-slate-200" title={text}>
                          {text}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                    <div className="flex gap-3 text-xs">
                      {c.paperUrl && (
                        <a
                          href={c.paperUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-accent"
                        >
                          {t('models.paper')} <ExternalIcon width={12} height={12} />
                        </a>
                      )}
                      {c.codeUrl && (
                        <a
                          href={c.codeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-accent"
                        >
                          {t('models.code')} <ExternalIcon width={12} height={12} />
                        </a>
                      )}
                    </div>
                    <CompareToggle type="device" group="device" id={c.id} />
                  </div>
                </article>
              );
            })}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">
          {isDatasetTab ? t('datasets.compareTitle') : t('devices.compareTitle')}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {t('models.compareHint').replace('{n}', String(MAX_COMPARE))}
        </p>
        {otherTabSelected && <p className="mt-3 text-sm text-amber-300">{t('datasets.otherKind')}</p>}
        {selected.length === 0 ? (
          <div className="card mt-5 p-10 text-center text-slate-500">{t('datasets.none')}</div>
        ) : (
          <div className="mt-5">
            <CompareTable
              columns={selected.map((x) => ({
                id: x.id,
                name: displayName(x, locale),
                sub: displayManufacturer({ manufacturer: x.org, manufacturerZh: x.orgZh }, locale),
                specs: x.specs,
              }))}
              fields={fields}
              specNs={isDatasetTab ? DATA_SPEC_NS.dataset : DATA_SPEC_NS.device}
              basicRows={[
                {
                  label: t('row.org'),
                  cells: selected.map((x) =>
                    displayManufacturer({ manufacturer: x.org, manufacturerZh: x.orgZh }, locale),
                  ),
                },
                { label: t('row.country'), cells: selected.map((x) => countryLabel(t, x.country)) },
                {
                  label: t('row.releaseDate'),
                  cells: selected.map((x) => (
                    <span key={x.id} className="font-mono">
                      {x.releaseDate}
                    </span>
                  )),
                },
                {
                  label: t('row.openSource'),
                  cells: selected.map((x) => <OpenSourceBadge key={x.id} value={x.openSource} />),
                },
                { label: t('row.license'), cells: selected.map((x) => x.license ?? '—') },
              ]}
              listRows={[
                { label: t('row.highlights'), lists: selected.map((x) => x.highlights) },
                { label: t('row.applications'), lists: selected.map((x) => x.applications) },
              ]}
              onRemove={remove}
            />
          </div>
        )}
        <p className="mt-6 text-xs text-slate-500">{t('datasets.disclaimer')}</p>
      </section>
    </div>
  );
}
