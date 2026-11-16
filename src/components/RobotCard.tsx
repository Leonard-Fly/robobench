import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Robot } from '../types';
import { CATEGORY_ICONS, SPEC_FIELDS_BY_CATEGORY } from '../data/specFields';
import { displayManufacturer, displayName } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import { keySpecs } from './format';
import PriceText from './PriceText';
import StatusBadge from './StatusBadge';
import CompareToggle from './CompareToggle';

/** robot 需已经过 localizeRobot */
export default function RobotCard({ robot }: { robot: Robot }) {
  const { locale, t } = useLocale();
  const [imgError, setImgError] = useState(false);
  const specs = keySpecs(SPEC_FIELDS_BY_CATEGORY[robot.category], robot.specs, 4);
  const sub = robot.subcategory ? t(`subcat.${robot.subcategory}`) : null;
  const title = displayName(robot, locale);
  const showImage = Boolean(robot.imageUrl) && !imgError;

  return (
    <Link to={`/robots/${robot.id}`} className="card group flex flex-col p-5 hover:-translate-y-0.5">
      {showImage ? (
        <div className="relative mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-line/60 bg-surface-2/80 p-2">
          <img
            src={robot.imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2.5 right-2.5">
            <StatusBadge status={robot.status} />
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-2xl">
            {CATEGORY_ICONS[robot.category]}
          </span>
          <StatusBadge status={robot.status} />
        </div>
      )}
      <h3 className={`${showImage ? '' : 'mt-4 '}text-lg font-semibold text-white transition-colors group-hover:text-accent`}>
        {title}
      </h3>
      {title !== robot.name && <p className="text-sm text-slate-500">{robot.name}</p>}
      <p className="mt-1 text-sm text-slate-400">
        {displayManufacturer(robot, locale)}
        <span className="mx-1.5 text-slate-600">·</span>
        {sub ?? t(`cat.${robot.category}`)}
        {robot.releaseYear ? <span className="font-mono"> · {robot.releaseYear}</span> : null}
      </p>
      <PriceText price={robot.price} className="mt-3 block font-mono text-xl font-semibold text-accent" />
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-4">
        {specs.map(({ field, text }) => (
          <div key={field.key} className="min-w-0">
            <dt className="text-xs text-slate-500">{t(`spec.${robot.category}.${field.key}`)}</dt>
            <dd className="truncate font-mono text-sm text-slate-200" title={text}>{text}</dd>
          </div>
        ))}
        {specs.length === 0 && <p className="col-span-2 text-xs text-slate-500">{t('card.noSpecs')}</p>}
      </dl>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs text-slate-500 transition-colors group-hover:text-accent">{t('card.view')}</span>
        <CompareToggle type="robot" group={robot.category} id={robot.id} />
      </div>
    </Link>
  );
}
