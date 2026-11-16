import type { MouseEvent } from 'react';
import { useCompare } from '../context/useCompare';
import type { CompareType } from '../context/compareStore';
import { CheckIcon, PlusIcon } from './Icons';

interface Props {
  type: CompareType;
  group: string;
  id: string;
  className?: string;
}

export default function CompareToggle({ type, group, id, className = '' }: Props) {
  const { state, toggle } = useCompare();
  const on = state.type === type && state.ids.includes(id);
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(type, group, id);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
        on
          ? 'border-accent bg-accent/15 text-accent'
          : 'border-line text-slate-300 hover:border-accent/50 hover:text-accent'
      } ${className}`}
    >
      {on ? <CheckIcon width={13} height={13} /> : <PlusIcon width={13} height={13} />}
      {on ? '已加入对比' : '对比'}
    </button>
  );
}
