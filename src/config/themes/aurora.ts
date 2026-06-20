import type { CardConfig } from '../../types/config';

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export const auroraThemeOverride: Record<string, DeepPartial<CardConfig>> = {};