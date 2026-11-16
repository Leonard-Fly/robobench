import type { AiModel, CollectionDevice, EmbodiedDataset, Robot } from '../types';
import robotsJson from './robots.json';
import aiModelsJson from './aiModels.json';
import datasetsJson from './datasets.json';
import collectionDevicesJson from './collectionDevices.json';

// ============ 数据加载入口 ============
// 每月更新：直接编辑 *.json，重新构建即可。

export const ROBOTS: Robot[] = robotsJson as unknown as Robot[];
export const AI_MODELS: AiModel[] = aiModelsJson as unknown as AiModel[];
export const DATASETS: EmbodiedDataset[] = datasetsJson as unknown as EmbodiedDataset[];
export const COLLECTION_DEVICES: CollectionDevice[] =
  collectionDevicesJson as unknown as CollectionDevice[];

/** 全站数据版本（取所有条目中最新的 dataUpdated） */
export const DATA_VERSION: string = [...ROBOTS, ...AI_MODELS, ...DATASETS, ...COLLECTION_DEVICES]
  .map((x) => x.dataUpdated)
  .sort()
  .at(-1) ?? '';

export function getRobotById(id: string): Robot | undefined {
  return ROBOTS.find((r) => r.id === id);
}

export function getAiModelById(id: string): AiModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export function getDatasetById(id: string): EmbodiedDataset | undefined {
  return DATASETS.find((d) => d.id === id);
}

export function getCollectionDeviceById(id: string): CollectionDevice | undefined {
  return COLLECTION_DEVICES.find((d) => d.id === id);
}

/** 站点联系方式（厂商参数提交/合作） */
export const CONTACT_EMAIL = 'liuguoqiang12552138@gmail.com';
export const SITE_NAME = 'RoboBench';
export const SITE_NAME_ZH = '具身智能机器人数据库';
