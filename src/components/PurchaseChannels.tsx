import type { PurchaseChannel, PurchaseChannelType } from '../types';
import { useLocale } from '../i18n/useLocale';
import { ExternalIcon } from './Icons';

const TYPE_STYLE: Record<PurchaseChannelType, string> = {
  official: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  marketplace: 'border-purple-400/30 bg-purple-400/10 text-purple-300',
  distributor: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
  inquiry: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
};

interface Props {
  channels?: PurchaseChannel[];
  officialUrl?: string;
}

export default function PurchaseChannels({ channels, officialUrl }: Props) {
  const { t } = useLocale();
  const list = channels ?? [];
  return (
    <div>
      {list.length > 0 ? (
        <ul className="space-y-2">
          {list.map((c) => (
            <li key={`${c.type}-${c.url}`}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-line px-4 py-3 text-sm transition-colors hover:border-accent/40 hover:bg-white/[0.03]"
              >
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs ${TYPE_STYLE[c.type] ?? TYPE_STYLE.inquiry}`}>
                  {t(`buy.type.${c.type}`)}
                </span>
                <span className="min-w-0 flex-1 font-medium text-slate-200">{c.name}</span>
                {(c.regions ?? []).map((r) => (
                  <span key={r} className="shrink-0 rounded bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {t(`buy.region.${r}`)}
                  </span>
                ))}
                <ExternalIcon className="shrink-0 text-slate-500" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-400">{t('buy.none')}</p>
          {officialUrl && (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 px-3 py-1.5 text-sm text-accent hover:bg-accent/10"
            >
              {t('buy.visit')} <ExternalIcon />
            </a>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-600">{t('buy.disclaimer')}</p>
    </div>
  );
}
