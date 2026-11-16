import { useLocale } from '../i18n/useLocale';
import { STATUS_CLASS, STATUS_CLASS_DEFAULT } from './format';

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useLocale();
  const key = `status.${status}`;
  const label = t(key);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
        STATUS_CLASS[status] ?? STATUS_CLASS_DEFAULT
      }`}
    >
      {label === key ? status : label}
    </span>
  );
}

export function OpenSourceBadge({ value }: { value: boolean | null }) {
  const { t } = useLocale();
  const [text, cls] =
    value === true
      ? [t('badge.open'), 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30']
      : value === false
        ? [t('badge.closed'), 'bg-slate-400/15 text-slate-300 border-slate-400/30']
        : [t('badge.partial'), 'bg-amber-400/15 text-amber-300 border-amber-400/30'];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${cls}`}>
      {text}
    </span>
  );
}
