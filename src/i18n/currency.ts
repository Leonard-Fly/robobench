import type { PriceInfo } from '../types';
import { LOCALE_META, USD_RATES, type Locale } from './config';

export interface LocalPrice {
  /** 已按语言环境格式化的金额，如 "¥9.9万"、"≈ ¥2,170,000" */
  text: string;
  /** true = 换算估算值（非厂商定价货币） */
  approx: boolean;
}

/** 近似值保留 3 位有效数字 */
function roundApprox(n: number): number {
  if (n <= 0) return 0;
  const mag = 10 ** Math.max(0, Math.floor(Math.log10(n)) - 2);
  return Math.round(n / mag) * mag;
}

/**
 * 按语言环境返回当地货币价格。
 * 原始定价货币（CNY/USD）与目标货币一致时显示原价；否则按参考汇率换算并加 "≈"。
 * 两个价格都未公开返回 null（调用方显示"价格未公开"文案）。
 */
export function formatLocalPrice(p: PriceInfo, locale: Locale): LocalPrice | null {
  const meta = LOCALE_META[locale];
  const target = meta.currency;

  // 原币种直出
  if (target === 'CNY' && p.cny != null) {
    const text =
      locale === 'zh' && p.cny >= 10000
        ? `¥${Number((p.cny / 10000).toFixed(2))}万`
        : fmt(p.cny, 'CNY', meta.tag);
    return { text, approx: false };
  }
  if (target === 'USD' && p.usd != null) {
    return { text: fmt(p.usd, 'USD', meta.tag), approx: false };
  }

  // 换算：优先以 USD 定价为基准，其次 CNY
  const usdBase = p.usd != null ? p.usd : p.cny != null ? p.cny / USD_RATES.CNY : null;
  if (usdBase == null) return null;
  const amount = roundApprox(usdBase * USD_RATES[target]);
  return { text: `≈ ${fmt(amount, target, meta.tag)}`, approx: true };
}

function fmt(amount: number, currency: string, tag: string): string {
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
