import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, DATA_VERSION, SITE_NAME } from '../data';
import { useLocale } from '../i18n/useLocale';
import { NAV_LINKS } from './navLinks';

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="mt-20 border-t border-line bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">
            {SITE_NAME.slice(0, 4)}<span className="text-gradient">{SITE_NAME.slice(4)}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">{t('site.tagline')}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {t('footer.desc')}
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">{t('footer.links')}</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-slate-400 transition-colors hover:text-accent">{t(l.key)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">{t('footer.contact')}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-sm text-accent hover:underline">{CONTACT_EMAIL}</a>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-slate-500">
        <span className="font-mono">{t('footer.version').replace('{v}', DATA_VERSION)}</span> · {t('footer.monthly')} · © {DATA_VERSION.slice(0, 4)} {SITE_NAME}
      </div>
    </footer>
  );
}
