import type { AiModelKind, SpecField } from '../types';
import { VLA_SPEC_FIELDS, WORLD_MODEL_SPEC_FIELDS } from '../data/specFields';

export const SPEC_FIELDS_BY_KIND: Record<AiModelKind, SpecField[]> = {
  vla: VLA_SPEC_FIELDS,
  'world-model': WORLD_MODEL_SPEC_FIELDS,
};
