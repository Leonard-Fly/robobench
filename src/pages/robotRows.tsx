import type { Robot } from '../types';
import { formatPrice } from '../components/format';
import StatusBadge from '../components/StatusBadge';

export function robotBasicRows(items: Robot[]) {
  return [
    { label: '厂商', cells: items.map((r) => r.manufacturerZh) },
    { label: '发布年份', cells: items.map((r) => <span key={r.id} className="font-mono">{r.releaseYear ?? '—'}</span>) },
    { label: '状态', cells: items.map((r) => <StatusBadge key={r.id} status={r.status} />) },
    {
      label: '价格',
      cells: items.map((r) => (
        <div key={r.id}>
          <span className="font-mono font-semibold text-accent">{formatPrice(r.price)}</span>
          {r.price.note && <p className="mt-0.5 text-xs text-slate-500">{r.price.note}</p>}
        </div>
      )),
    },
  ];
}
