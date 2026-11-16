import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, DATA_VERSION, SITE_NAME, SITE_NAME_ZH } from '../data';
import { NAV_LINKS } from './navLinks';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">
            {SITE_NAME.slice(0, 4)}<span className="text-gradient">{SITE_NAME.slice(4)}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">{SITE_NAME_ZH}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            第三方中立的具身智能参数对比平台，收录人形、轮式、四足机器人、灵巧手、核心零部件与 AI 模型。
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">快捷链接</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-slate-400 transition-colors hover:text-accent">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">联系我们</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-sm text-accent hover:underline">{CONTACT_EMAIL}</a>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            免责声明：本站参数整理自公开资料，仅供参考，具体以厂商官方发布为准。
          </p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-slate-500">
        <span className="font-mono">数据库版本 {DATA_VERSION}</span> · 每月更新 · © {DATA_VERSION.slice(0, 4)} {SITE_NAME}
      </div>
    </footer>
  );
}
