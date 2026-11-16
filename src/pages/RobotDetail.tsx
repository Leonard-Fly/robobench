import { Link, useParams } from 'react-router-dom';
import { ROBOTS, getRobotById } from '../data';
import { CATEGORY_ICONS, CATEGORY_LABELS, COMPONENT_SUBCATEGORY_LABELS, SPEC_FIELDS_BY_CATEGORY } from '../data/specFields';
import { formatPrice, formatSpec, groupFields } from '../components/format';
import StatusBadge from '../components/StatusBadge';
import CompareToggle from '../components/CompareToggle';
import RobotCard from '../components/RobotCard';
import { ArrowLeftIcon, CheckIcon, ExternalIcon } from '../components/Icons';

export default function RobotDetail() {
  const { id } = useParams();
  const robot = id ? getRobotById(id) : undefined;
  if (!robot) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-slate-400">未找到该条目。</p>
        <Link to="/robots" className="mt-4 inline-block text-accent hover:underline">返回机器人库</Link>
      </div>
    );
  }
  const fields = SPEC_FIELDS_BY_CATEGORY[robot.category];
  const similar = ROBOTS.filter((r) => r.category === robot.category && r.id !== robot.id)
    .sort((a, b) => Number(b.subcategory === robot.subcategory) - Number(a.subcategory === robot.subcategory))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to={`/robots?cat=${robot.category}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent">
        <ArrowLeftIcon /> 返回{CATEGORY_LABELS[robot.category]}
      </Link>

      <div className="card mt-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl">{CATEGORY_ICONS[robot.category]}</span>
          <StatusBadge status={robot.status} />
          <span className="text-sm text-slate-500">
            {CATEGORY_LABELS[robot.category]}
            {robot.subcategory ? ` · ${COMPONENT_SUBCATEGORY_LABELS[robot.subcategory]}` : ''}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white">{robot.nameZh}</h1>
        <p className="text-slate-500">{robot.name}</p>
        <p className="mt-3 text-sm text-slate-400">
          {robot.manufacturerZh}（{robot.manufacturer}）· {robot.country}
          {robot.releaseYear ? <span className="font-mono"> · {robot.releaseYear} 年发布</span> : null}
        </p>
        <p className="mt-4 font-mono text-3xl font-bold text-accent">{formatPrice(robot.price)}</p>
        {robot.price.note && <p className="mt-1 text-xs text-slate-500">{robot.price.note}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {robot.officialUrl && (
            <a href={robot.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-bg hover:opacity-90">
              官方网站 <ExternalIcon />
            </a>
          )}
          <CompareToggle type="robot" group={robot.category} id={robot.id} className="py-2 text-sm" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-semibold text-white">核心优势</h2>
          <ul className="mt-4 space-y-3">
            {robot.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm text-slate-300">
                <CheckIcon className="mt-0.5 shrink-0 text-good" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <h2 className="font-semibold text-white">应用场景</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {robot.applications.map((a) => (
              <span key={a} className="rounded-full border border-accent-2/30 bg-accent-2/10 px-3 py-1 text-xs text-accent-2">{a}</span>
            ))}
          </div>
          <h2 className="mt-6 font-semibold text-white">简介</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{robot.description}</p>
        </section>
      </div>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-bold text-white">完整参数</h2>
        {groupFields(fields).map(([group, gf]) => (
          <div key={group} className="card overflow-hidden">
            <h3 className="bg-surface-2 px-5 py-2.5 text-xs font-semibold tracking-wider text-accent">{group}</h3>
            <dl>
              {gf.map((f) => (
                <div key={f.key} className="flex gap-4 border-t border-line px-5 py-3 text-sm first:border-t-0">
                  <dt className="w-32 shrink-0 text-slate-500 sm:w-44">{f.label}</dt>
                  <dd className={`min-w-0 flex-1 ${typeof robot.specs[f.key] === 'number' ? 'font-mono' : ''} text-slate-200`}>
                    {formatSpec(robot.specs[f.key], f.unit)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </section>

      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">同类产品</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((r) => <RobotCard key={r.id} robot={r} />)}
          </div>
        </section>
      )}

      <p className="mt-8 text-center font-mono text-xs text-slate-600">数据更新日期：{robot.dataUpdated}</p>
    </div>
  );
}
