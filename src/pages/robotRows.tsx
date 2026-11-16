import type { Robot } from '../types';
import { displayManufacturer } from '../i18n/localizeData';
import type { Locale } from '../i18n/config';
import PriceText from '../components/PriceText';
import StatusBadge from '../components/StatusBadge';

/** items 需已经过 localizeRobot */
export function robotBasicRows(items: Robot[], locale: Locale, t: (k: string) => string) {
  return [
    { label: t('row.manufacturer'), cells: items.map((r) => displayManufacturer(r, locale)) },
    { label: t('row.year'), cells: items.map((r) => <span key={r.id} className="font-mono">{r.releaseYear ?? '—'}</span>) },
    { label: t('row.status'), cells: items.map((r) => <StatusBadge key={r.id} status={r.status} />) },
    {
      label: t('row.price'),
      cells: items.map((r) => (
        <div key={r.id}>
          <PriceText price={r.price} className="font-mono font-semibold text-accent" />
          {r.price.note && <p className="mt-0.5 text-xs text-slate-500">{r.price.note}</p>}
        </div>
      )),
    },
  ];
}
