import { useMemo } from 'react';
import { AI_MODELS, COLLECTION_DEVICES, DATASETS, ROBOTS } from '../data';
import { localizeAiModel, localizeCollectionDevice, localizeDataset, localizeRobot } from '../i18n/localizeData';
import { useLocale } from '../i18n/useLocale';
import type { AiModel, CollectionDevice, EmbodiedDataset, Robot } from '../types';

/** 返回已按当前语言本地化的机器人 / 模型 / 数据集 / 数采设备数据 */
export function useLocalData() {
  const { locale } = useLocale();
  return useMemo(() => {
    const robots: Robot[] = ROBOTS.map((r) => localizeRobot(r, locale));
    const models: AiModel[] = AI_MODELS.map((m) => localizeAiModel(m, locale));
    const datasets: EmbodiedDataset[] = DATASETS.map((d) => localizeDataset(d, locale));
    const devices: CollectionDevice[] = COLLECTION_DEVICES.map((c) => localizeCollectionDevice(c, locale));
    return {
      robots,
      models,
      datasets,
      devices,
      getRobot: (id: string) => robots.find((r) => r.id === id),
      getModel: (id: string) => models.find((m) => m.id === id),
      getDataset: (id: string) => datasets.find((d) => d.id === id),
      getDevice: (id: string) => devices.find((c) => c.id === id),
    };
  }, [locale]);
}
