import { STATUS_LABELS } from '../data/specFields';
import { STATUS_CLASS, STATUS_CLASS_DEFAULT } from './format';

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
        STATUS_CLASS[status] ?? STATUS_CLASS_DEFAULT
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function OpenSourceBadge({ value }: { value: boolean | null }) {
  const [text, cls] =
    value === true
      ? ['开源', 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30']
      : value === false
        ? ['闭源', 'bg-slate-400/15 text-slate-300 border-slate-400/30']
        : ['部分开源', 'bg-amber-400/15 text-amber-300 border-amber-400/30'];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${cls}`}>
      {text}
    </span>
  );
}
