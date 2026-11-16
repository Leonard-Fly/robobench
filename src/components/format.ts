import type { PriceInfo, RobotCategory, SpecField, SpecValue } from '../types';
import { CATEGORY_LABELS } from '../data/specFields';

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as RobotCategory[];
export const MAX_COMPARE = 4;


/** 排序用价格（统一折算为人民币），未公开返回 null */
export function priceSortValue(p: PriceInfo): number | null {
  if (p.cny != null) return p.cny;
  if (p.usd != null) return p.usd * 7.2;
  return null;
}

export function formatSpec(v: SpecValue | undefined, unit?: string): string {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number') return unit ? `${v} ${unit}` : String(v);
  return v;
}

export function keySpecs(fields: SpecField[], specs: Record<string, SpecValue>, max = 4) {
  return fields
    .filter((f) => f.keySpec && specs[f.key] != null && specs[f.key] !== '')
    .slice(0, max)
    .map((f) => ({ field: f, text: formatSpec(specs[f.key], f.unit) }));
}

export function groupFields(fields: SpecField[]): [string, SpecField[]][] {
  const map = new Map<string, SpecField[]>();
  for (const f of fields) {
    const arr = map.get(f.group) ?? [];
    arr.push(f);
    map.set(f.group, arr);
  }
  return [...map.entries()];
}

export const STATUS_CLASS: Record<string, string> = {
  available: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  preorder: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
  research: 'bg-violet-400/15 text-violet-300 border-violet-400/30',
};
export const STATUS_CLASS_DEFAULT = 'bg-slate-400/15 text-slate-300 border-slate-400/30';

/** 国家显示名：词典中无对应条目时回退原文 */
export function countryLabel(t: (k: string) => string, country: string): string {
  const k = `country.${country}`;
  const v = t(k);
  return v === k ? country : v;
}

/** 规格词典命名空间：分类 → spec.<ns>.<key> */
export const MODEL_SPEC_NS = { vla: 'vla', 'world-model': 'wm' } as const;
