import { createContext } from 'react';

export type CompareType = 'robot' | 'model' | 'dataset' | 'device';

export interface CompareState {
  type: CompareType;
  /** 分类 / kind，同组才能对比 */
  group: string;
  ids: string[];
}

export interface CompareContextValue {
  state: CompareState;
  has: (id: string) => boolean;
  toggle: (type: CompareType, group: string, id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setAll: (type: CompareType, group: string, ids: string[]) => void;
}

export const CompareContext = createContext<CompareContextValue | null>(null);
