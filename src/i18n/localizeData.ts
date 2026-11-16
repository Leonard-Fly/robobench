import type { AiModel, Robot } from '../types';
import type { Locale } from './config';
import enRobots from './data/en/robots.json';
import enModels from './data/en/models.json';
import jaRobots from './data/ja/robots.json';
import jaModels from './data/ja/models.json';
import koRobots from './data/ko/robots.json';
import koModels from './data/ko/models.json';
import frRobots from './data/fr/robots.json';
import frModels from './data/fr/models.json';
import deRobots from './data/de/robots.json';
import deModels from './data/de/models.json';
import esRobots from './data/es/robots.json';
import esModels from './data/es/models.json';

// ============ 数据内容本地化 ============
// src/i18n/data/<locale>/robots.json 与 models.json 按条目 id 存放译文覆盖。
// 回退链：当前语言 → 英文 → 中文原文（主数据 JSON）。

/** 单条目译文覆盖（字段均可省略，省略则回退） */
export interface EntryOverride {
  description?: string;
  highlights?: string[];
  applications?: string[];
  /** 仅字符串型规格值需要翻译，数值型保持原样 */
  specs?: Record<string, string>;
  /** 价格备注译文 */
  priceNote?: string;
}

type OverrideMap = Record<string, EntryOverride>;

const ROBOT_OVERRIDES: Partial<Record<Locale, OverrideMap>> = {
  en: enRobots as OverrideMap,
  ja: jaRobots as OverrideMap,
  ko: koRobots as OverrideMap,
  fr: frRobots as OverrideMap,
  de: deRobots as OverrideMap,
  es: esRobots as OverrideMap,
};

const MODEL_OVERRIDES: Partial<Record<Locale, OverrideMap>> = {
  en: enModels as OverrideMap,
  ja: jaModels as OverrideMap,
  ko: koModels as OverrideMap,
  fr: frModels as OverrideMap,
  de: deModels as OverrideMap,
  es: esModels as OverrideMap,
};

function applyOverride<T extends Robot | AiModel>(
  entry: T,
  locale: Locale,
  overrides: Partial<Record<Locale, OverrideMap>>,
): T {
  if (locale === 'zh') return entry;
  const own = overrides[locale]?.[entry.id];
  const en = overrides.en?.[entry.id];
  const pick = <K extends keyof EntryOverride>(k: K): EntryOverride[K] | undefined =>
    own?.[k] ?? en?.[k];

  const specOverride = pick('specs');
  const priceNote = pick('priceNote');
  return {
    ...entry,
    description: pick('description') ?? entry.description,
    highlights: pick('highlights') ?? entry.highlights,
    applications: pick('applications') ?? entry.applications,
    specs: specOverride ? { ...entry.specs, ...specOverride } : entry.specs,
    ...('price' in entry && priceNote
      ? { price: { ...(entry as Robot).price, note: priceNote } }
      : {}),
  };
}

export function localizeRobot(r: Robot, locale: Locale): Robot {
  return applyOverride(r, locale, ROBOT_OVERRIDES);
}

export function localizeAiModel(m: AiModel, locale: Locale): AiModel {
  return applyOverride(m, locale, MODEL_OVERRIDES);
}

/** 条目显示名：中文环境用 nameZh，其余用 name */
export function displayName(x: { name: string; nameZh?: string }, locale: Locale): string {
  return locale === 'zh' && x.nameZh ? x.nameZh : x.name;
}

/** 厂商显示名 */
export function displayManufacturer(
  x: { manufacturer: string; manufacturerZh?: string },
  locale: Locale,
): string {
  return locale === 'zh' && x.manufacturerZh ? x.manufacturerZh : x.manufacturer;
}
