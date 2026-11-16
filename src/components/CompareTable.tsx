import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SpecField, SpecValue } from '../types';
import { formatSpec, groupFields } from './format';
import { XIcon } from './Icons';

export interface CompareColumn {
  id: string;
  name: string;
  sub?: string;
  to?: string;
  specs: Record<string, SpecValue>;
}
export interface BasicRow {
  label: string;
  cells: ReactNode[];
}
export interface ListRow {
  label: string;
  lists: string[][];
}

interface Props {
  columns: CompareColumn[];
  fields: SpecField[];
  basicRows?: BasicRow[];
  listRows?: ListRow[];
  onRemove?: (id: string) => void;
}

const isNum = (v: SpecValue | undefined): v is number => typeof v === 'number';
const LABEL_CELL =
  'sticky left-0 z-10 w-32 min-w-32 border-b border-line bg-surface px-4 py-3 text-sm text-slate-400 md:w-44 md:min-w-44';
const CELL = 'min-w-48 border-b border-line px-4 py-3 align-top text-sm text-slate-200';

export default function CompareTable({ columns, fields, basicRows = [], listRows = [], onRemove }: Props) {
  const span = columns.length + 1;
  return (
    <div className="card overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={`${LABEL_CELL} text-left font-normal`}>对比项</th>
            {columns.map((c) => (
              <th key={c.id} className={`${CELL} bg-surface-2/60 text-left`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {c.to ? (
                      <Link to={c.to} className="font-semibold text-white hover:text-accent">{c.name}</Link>
                    ) : (
                      <span className="font-semibold text-white">{c.name}</span>
                    )}
                    {c.sub && <p className="text-xs font-normal text-slate-500">{c.sub}</p>}
                  </div>
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(c.id)}
                      aria-label={`移除 ${c.name}`}
                      className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <XIcon width={14} height={14} />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {basicRows.map((r) => (
            <tr key={r.label} className="transition-colors hover:bg-white/[0.02]">
              <th className={`${LABEL_CELL} text-left font-normal`}>{r.label}</th>
              {columns.map((c, i) => (
                <td key={c.id} className={CELL}>{r.cells[i]}</td>
              ))}
            </tr>
          ))}
          {groupFields(fields).map(([group, gf]) => (
            <GroupRows key={group} group={group} fields={gf} columns={columns} span={span} />
          ))}
          {listRows.map((r) => (
            <tr key={r.label}>
              <th className={`${LABEL_CELL} text-left font-normal`}>{r.label}</th>
              {columns.map((c, i) => (
                <td key={c.id} className={CELL}>
                  {r.lists[i]?.length ? (
                    <ul className="space-y-1.5">
                      {r.lists[i].map((t) => (
                        <li key={t} className="flex gap-1.5 text-slate-300">
                          <span className="text-accent">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '—'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupRows({
  group,
  fields,
  columns,
  span,
}: {
  group: string;
  fields: SpecField[];
  columns: CompareColumn[];
  span: number;
}) {
  return (
    <>
      <tr>
        <td colSpan={span} className="border-b border-line bg-surface-2 px-4 py-2 text-xs font-semibold tracking-wider text-accent">
          {group}
        </td>
      </tr>
      {fields.map((f) => {
        const vals = columns.map((c) => c.specs[f.key]);
        const nums = vals.filter(isNum);
        const max = nums.length ? Math.max(...nums) : 0;
        const min = nums.length ? Math.min(...nums) : 0;
        const canBest = f.better !== 'none' && nums.length >= 2 && max !== min;
        const best = f.better === 'higher' ? max : min;
        return (
          <tr key={f.key} className="transition-colors hover:bg-white/[0.02]">
            <th className={`${LABEL_CELL} text-left font-normal`}>
              {f.label}
              {f.unit && <span className="ml-1 text-xs text-slate-600">({f.unit})</span>}
            </th>
            {columns.map((c, i) => {
              const v = vals[i];
              if (isNum(v)) {
                const isBest = canBest && v === best;
                const pct = max > 0 ? Math.max(4, Math.min(100, (v / max) * 100)) : 0;
                return (
                  <td
                    key={c.id}
                    className={`${CELL} ${isBest ? 'bg-good/10' : ''}`}
                  >
                    <div className={`font-mono ${isBest ? 'font-semibold text-good' : ''}`}>
                      {formatSpec(v, f.unit)}
                      {isBest && <span className="ml-1 text-xs">▲</span>}
                    </div>
                    {max > 0 && (
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full ${
                            isBest ? 'bg-good' : 'bg-linear-to-r from-accent to-accent-2'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </td>
                );
              }
              return (
                <td key={c.id} className={`${CELL} ${v == null ? 'text-slate-600' : ''}`}>
                  {formatSpec(v, f.unit)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
