import { Link } from 'react-router-dom';
import { AI_MODELS, CONTACT_EMAIL, DATA_VERSION, ROBOTS, SITE_NAME } from '../data';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../data/specFields';
import { CATEGORIES, KIND_LABELS } from '../components/format';
import { ArrowRightIcon } from '../components/Icons';

export default function Home() {
  const stats = [
    { label: '机器人 / 零部件', value: ROBOTS.length },
    { label: 'AI 模型', value: AI_MODELS.length },
    { label: '覆盖厂商', value: new Set(ROBOTS.map((r) => r.manufacturer)).size },
    { label: '数据版本', value: DATA_VERSION },
  ];
  const hot = (['humanoid', 'quadruped', 'hand', 'wheeled'] as const)
    .map((cat) => ROBOTS.filter((r) => r.category === cat).slice(0, 3))
    .filter((g) => g.length >= 2)
    .slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-accent-2/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
            {SITE_NAME} · 第三方中立参数对比
          </span>
          <h1 className="text-gradient mt-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
            具身智能机器人数据库
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            像逛手机参数站一样，对比人形、轮式、四足机器人、灵巧手、核心零部件与 VLA / 世界模型的关键参数、价格与状态。
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/robots" className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-accent to-accent-2 px-6 py-3 font-semibold text-bg transition-opacity hover:opacity-90">
              浏览机器人库 <ArrowRightIcon />
            </Link>
            <Link to="/compare" className="rounded-xl border border-line bg-surface-2 px-6 py-3 font-semibold text-white transition-colors hover:border-accent/50 hover:text-accent">
              开始对比
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="card grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="p-5 text-center">
              <p className="font-mono text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-white">按分类浏览</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/robots?cat=${c}`} className="card group p-5 hover:-translate-y-0.5">
              <span className="text-3xl">{CATEGORY_ICONS[c]}</span>
              <p className="mt-3 font-semibold text-white transition-colors group-hover:text-accent">{CATEGORY_LABELS[c]}</p>
              <p className="mt-1 font-mono text-sm text-slate-500">{ROBOTS.filter((r) => r.category === c).length} 款</p>
            </Link>
          ))}
        </div>
      </section>

      {hot.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white">热门对比</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {hot.map((g) => (
              <Link key={g[0].id} to={`/compare?ids=${g.map((r) => r.id).join(',')}`} className="card group p-5 hover:-translate-y-0.5">
                <p className="text-xs text-accent">{CATEGORY_ICONS[g[0].category]} {CATEGORY_LABELS[g[0].category]}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-white">
                  {g.map((r, i) => (
                    <span key={r.id} className="flex items-center gap-2">
                      {i > 0 && <span className="text-xs font-normal text-slate-600">VS</span>}
                      {r.nameZh}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm text-slate-500 transition-colors group-hover:text-accent">立即对比 →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="card relative overflow-hidden p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-accent-2/15 blur-3xl" />
          <h2 className="text-2xl font-bold text-white">AI 模型库</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            收录 {AI_MODELS.filter((m) => m.kind === 'vla').length} 个{KIND_LABELS.vla}与 {AI_MODELS.filter((m) => m.kind === 'world-model').length} 个{KIND_LABELS['world-model']}，对比参数量、架构、开源情况与适配本体。
          </p>
          <Link to="/models" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-accent/40 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10">
            进入模型库 <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="card bg-linear-to-br from-accent/10 to-accent-2/10 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white">厂商合作：让您的产品被看见</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">提供官方规格书、价格与高清图片，我们将在下一次月度更新中收录或更正。</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="rounded-xl bg-linear-to-r from-accent to-accent-2 px-6 py-3 font-semibold text-bg hover:opacity-90">了解合作方式</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-xl border border-line px-6 py-3 font-semibold text-white hover:border-accent/50">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
