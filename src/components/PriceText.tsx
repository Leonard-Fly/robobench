import type { PriceInfo } from '../types';
import { RATES_DATE } from '../i18n/config';
import { formatLocalPrice } from '../i18n/currency';
import { useLocale } from '../i18n/useLocale';

export default function PriceText({ price, className }: { price: PriceInfo; className?: string }) {
  const { locale, t } = useLocale();
  const p = formatLocalPrice(price, locale);
  if (!p) return <span className={className}>{t('price.na')}</span>;
  return (
    <span
      className={className}
      title={p.approx ? t('price.approx').replace('{date}', RATES_DATE) : undefined}
    >
      {p.text}
    </span>
  );
}
