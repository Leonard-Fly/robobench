import { Link } from 'react-router-dom';
import type { Robot } from '../types';
import { CATEGORY_ICONS, CATEGORY_LABELS, COMPONENT_SUBCATEGORY_LABELS, SPEC_FIELDS_BY_CATEGORY } from '../data/specFields';
import { formatPrice, keySpecs } from './format';
import StatusBadge from './StatusBadge';
import CompareToggle from './CompareToggle';

export default function RobotCard({ robot }: { robot: Robot }) {
  const specs = keySpecs(SPEC_FIELDS_BY_CATEGORY[robot.category], robot.specs, 4);
  const sub = robot.subcategory ? COMPONENT_SUBCATEGORY_LABELS[robot.subcategory] : null;
  return (
    <Link to={`/robots/${robot.id}`} className="card group flex flex-col p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-2xl">
          {CATEGORY_ICONS[robot.category]}
        </span>
        <StatusBadge status={robot.status} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white transition-colors group-hover:text-accent">
        {robot.nameZh}
      </h3>
      <p className="text-sm text-slate-500">{robot.name}</p>
      <p className="mt-1 text-sm text-slate-400">
        {robot.manufacturerZh}
        <span className="mx-1.5 text-slate-600">·</span>
        {sub ?? CATEGORY_LABELS[robot.category]}
        {robot.releaseYear ? <span className="font-mono"> · {robot.releaseYear}</span> : null}
      </p>
      <p className="mt-3 font-mono text-xl font-semibold text-accent">{formatPrice(robot.price)}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-4">
        {specs.map(({ field, text }) => (
          <div key={field.key} className="min-w-0">
            <dt className="text-xs text-slate-500">{field.label}</dt>
            <dd className="truncate font-mono text-sm text-slate-200" title={text}>{text}</dd>
          </div>
        ))}
        {specs.length === 0 && <p className="col-span-2 text-xs text-slate-500">暂无关键参数</p>}
      </dl>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs text-slate-500 transition-colors group-hover:text-accent">查看详情 →</span>
        <CompareToggle type="robot" group={robot.category} id={robot.id} />
      </div>
    </Link>
  );
}
