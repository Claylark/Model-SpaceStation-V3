import type { CardConfig } from '../types/config';

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * 深度合并：target 为基座，source 为覆写
 * 三级优先级：base → themeOverride → forceOverride
 */
export function mergeCardConfig(
  base: CardConfig,
  themeOverride?: DeepPartial<CardConfig>,
  forceOverride?: DeepPartial<CardConfig>,
): CardConfig {
  let result = deepClone(base) as unknown as Record<string, unknown>;

  if (themeOverride) {
    result = deepMerge(result, themeOverride as unknown as Record<string, unknown>);
  }

  if (forceOverride) {
    result = deepMerge(result, forceOverride as unknown as Record<string, unknown>);
  }

  return result as unknown as CardConfig;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== undefined && source[key] !== null) {
      if (isObject(source[key]) && isObject(output[key])) {
        output[key] = deepMerge(output[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}