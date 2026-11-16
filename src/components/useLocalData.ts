import { useMemo } from 'react';
import { AI_MODELS, ROBOTS } from '../data';
import { localizeAiModel, localizeRobot } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import type { AiModel, Robot } from '../types';

/** 返回已按当前语言本地化的机器人 / 模型数据 */
export function useLocalData() {
  const { locale } = useLocale();
  return useMemo(() => {
    const robots: Robot[] = ROBOTS.map((r) => localizeRobot(r, locale));
    const models: AiModel[] = AI_MODELS.map((m) => localizeAiModel(m, locale));
    return {
      robots,
      models,
      getRobot: (id: string) => robots.find((r) => r.id === id),
      getModel: (id: string) => models.find((m) => m.id === id),
    };
  }, [locale]);
}
