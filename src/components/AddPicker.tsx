import { useState } from 'react';
import type { Robot } from '../types';
import { CATEGORY_ICONS } from '../data/specFields';
import { formatPrice } from './format';
import { SearchIcon, XIcon } from './Icons';
import StatusBadge from './StatusBadge';

interface Props {
  title: string;
  candidates: Robot[];
  onPick: (id: string) => void;
  onClose: () => void;
}

export default function AddPicker({ title, candidates, onPick, onClose }: Props) {
  const [q, setQ] = useState('');
  const kw = q.trim().toLowerCase();
  const list = candidates.filter(
    (r) => !kw || `${r.name} ${r.nameZh} ${r.manufacturer} ${r.manufacturerZh}`.toLowerCase().includes(kw),
  );
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="card flex max-h-[80vh] w-full max-w-lg flex-col bg-surface"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-line p-4">
          <h3 className="font-semibold text-white">{title}</h3>
          <button type="button" onClick={onClose} aria-label="关闭" className="rounded-md p-1 text-slate-400 hover:text-white">
            <XIcon />
          </button>
        </div>
        <div className="relative border-b border-line p-3">
          <SearchIcon className="absolute top-1/2 left-6 -translate-y-1/2 text-slate-500" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索名称或厂商"
            className="w-full rounded-lg border border-line bg-surface-2 py-2 pr-3 pl-9 text-sm text-white outline-none focus:border-accent/60"
          />
        </div>
        <ul className="overflow-y-auto p-2">
          {list.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onPick(r.id)}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
              >
                <span className="text-xl">{CATEGORY_ICONS[r.category]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{r.nameZh}</span>
                  <span className="block truncate text-xs text-slate-500">{r.manufacturerZh} · {formatPrice(r.price)}</span>
                </span>
                <StatusBadge status={r.status} />
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="p-6 text-center text-sm text-slate-500">没有可添加的条目</li>}
        </ul>
      </div>
    </div>
  );
}
