// ============ 多语言与货币配置 ============

export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es';

export const DEFAULT_LOCALE: Locale = 'zh';

export interface LocaleMeta {
  code: Locale;
  /** 语言切换器中显示的本语言名称 */
  native: string;
  /** <html lang> 与 Intl 使用的标签 */
  tag: string;
  /** 该语言环境显示的货币 */
  currency: 'CNY' | 'USD' | 'JPY' | 'KRW' | 'EUR';
}

export const LOCALES: LocaleMeta[] = [
  { code: 'zh', native: '中文', tag: 'zh-CN', currency: 'CNY' },
  { code: 'en', native: 'English', tag: 'en-US', currency: 'USD' },
  { code: 'ja', native: '日本語', tag: 'ja-JP', currency: 'JPY' },
  { code: 'ko', native: '한국어', tag: 'ko-KR', currency: 'KRW' },
  { code: 'fr', native: 'Français', tag: 'fr-FR', currency: 'EUR' },
  { code: 'de', native: 'Deutsch', tag: 'de-DE', currency: 'EUR' },
  { code: 'es', native: 'Español', tag: 'es-ES', currency: 'EUR' },
];

export const LOCALE_META: Record<Locale, LocaleMeta> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l]),
) as Record<Locale, LocaleMeta>;

/** 参考汇率（1 USD 兑各货币），更新数据库时一并核对 */
export const USD_RATES: Record<LocaleMeta['currency'], number> = {
  USD: 1,
  CNY: 7.1,
  JPY: 155,
  KRW: 1390,
  EUR: 0.92,
};

/** 汇率参考日期（显示在换算价格的提示中） */
export const RATES_DATE = '2025-11';
