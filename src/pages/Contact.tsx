import { CONTACT_EMAIL, SITE_NAME } from '../data';

const STEPS = [
  { t: '发送邮件', d: '通过下方邮箱联系我们，说明产品型号与需求（新增收录或更正参数）。' },
  { t: '提供资料', d: '官方产品规格书、价格信息、高清图片、核心优势说明。' },
  { t: '核实收录', d: '我们对照公开资料核实，保持第三方中立的表述方式。' },
  { t: '月度上线', d: '确认的数据将在下一次月度更新中发布。' },
];
const FAQ = [
  { q: '收录标准是什么？', a: '具备公开可查的官方规格资料、已发布或有明确发布计划的具身智能相关产品与模型，覆盖人形、轮式、四足、灵巧手、核心零部件及 AI 模型。' },
  { q: '数据多久更新一次？', a: '数据库每月更新一次，页脚显示当前数据库版本。重大发布我们会酌情提前补充。' },
  { q: '参数准确吗？', a: '参数整理自公开资料，不同厂商测试口径可能不同，仅供参考，具体以厂商官方发布为准。' },
  { q: '收录是否收费？', a: `${SITE_NAME} 定位为第三方中立平台，基础收录与参数更正不收费，也不接受影响客观性的付费排名。` },
];

export default function Contact() {
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('RoboBench 参数合作')}`;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-white">厂商合作</h1>
      <p className="mt-3 leading-relaxed text-slate-400">
        {SITE_NAME} 是第三方中立的具身智能参数对比平台，数据库每月更新一次。欢迎厂商提交或更正产品参数，让用户看到准确、完整的信息。
      </p>

      <h2 className="mt-12 text-xl font-bold text-white">提交 / 更正参数流程</h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={s.t} className="card p-5">
            <span className="font-mono text-sm text-accent">0{i + 1}</span>
            <p className="mt-1 font-semibold text-white">{s.t}</p>
            <p className="mt-1 text-sm text-slate-400">{s.d}</p>
          </li>
        ))}
      </ol>

      <div className="card mt-10 bg-linear-to-br from-accent/10 to-accent-2/10 p-8 text-center">
        <p className="text-sm text-slate-400">联系邮箱</p>
        <p className="mt-2 font-mono text-lg break-all text-white sm:text-2xl">{CONTACT_EMAIL}</p>
        <a href={href} className="mt-6 inline-block rounded-xl bg-linear-to-r from-accent to-accent-2 px-8 py-4 text-lg font-semibold text-bg transition-opacity hover:opacity-90">
          发送邮件
        </a>
      </div>

      <h2 className="mt-12 text-xl font-bold text-white">常见问题</h2>
      <div className="mt-5 space-y-3">
        {FAQ.map((f) => (
          <details key={f.q} className="card group p-5">
            <summary className="cursor-pointer font-medium text-white">{f.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
