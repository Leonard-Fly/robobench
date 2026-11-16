import { CONTACT_EMAIL, SITE_NAME } from '../data';
import { useLocale } from '../i18n/useLocale';

const STEP_KEYS = ['contact.step1', 'contact.step2', 'contact.step3', 'contact.step4'];
const FAQ_KEYS = ['contact.faq.q1', 'contact.faq.q2', 'contact.faq.q3', 'contact.faq.q4'];

export default function Contact() {
  const { t } = useLocale();
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('contact.mailSubject'))}`;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-white">{t('contact.title')}</h1>
      <p className="mt-3 leading-relaxed text-slate-400">
        {t('contact.intro').replace('{site}', SITE_NAME)}
      </p>

      <h2 className="mt-12 text-xl font-bold text-white">{t('contact.stepsTitle')}</h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2">
        {STEP_KEYS.map((k, i) => (
          <li key={k} className="card p-5">
            <span className="font-mono text-sm text-accent">0{i + 1}</span>
            <p className="mt-1 font-semibold text-white">{t(`${k}.t`)}</p>
            <p className="mt-1 text-sm text-slate-400">{t(`${k}.d`)}</p>
          </li>
        ))}
      </ol>

      <div className="card mt-10 bg-linear-to-br from-accent/10 to-accent-2/10 p-8 text-center">
        <p className="text-sm text-slate-400">{t('contact.email')}</p>
        <p className="mt-2 font-mono text-lg break-all text-white sm:text-2xl">{CONTACT_EMAIL}</p>
        <a href={href} className="mt-6 inline-block rounded-xl bg-linear-to-r from-accent to-accent-2 px-8 py-4 text-lg font-semibold text-bg transition-opacity hover:opacity-90">
          {t('contact.send')}
        </a>
      </div>

      <h2 className="mt-12 text-xl font-bold text-white">{t('contact.faqTitle')}</h2>
      <div className="mt-5 space-y-3">
        {FAQ_KEYS.map((k) => (
          <details key={k} className="card group p-5">
            <summary className="cursor-pointer font-medium text-white">{t(k)}</summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(k.replace('.q', '.a')).replace('{site}', SITE_NAME)}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
