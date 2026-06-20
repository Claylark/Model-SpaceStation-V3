import type { CardConfig, CardStackConfig } from '../types/config';

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

/**
 * 卡片堆深度合并
 * 合并堆级属性后，再对堆内每张卡片调用 mergeCardConfig
 */
export function mergeStackConfig(
  base: CardStackConfig,
  themeOverride?: DeepPartial<CardStackConfig>,
): CardStackConfig {
  if (!themeOverride) return deepClone(base) as CardStackConfig;

  const merged = deepClone(base) as unknown as Record<string, unknown>;
  const override = deepClone(themeOverride) as unknown as Record<string, unknown>;

  // 合并堆级属性（stackWidth, stackMaxWidth, gap, sectionId, visible 等）
  const stackMerged = deepMerge(merged, override) as unknown as CardStackConfig;

  // 堆内卡片：按 id 匹配合并
  const overrideCards = themeOverride.cards as DeepPartial<CardConfig>[] | undefined;
  if (overrideCards && Array.isArray(overrideCards)) {
    stackMerged.cards = stackMerged.cards.map((baseCard) => {
      const overrideCard = overrideCards.find((c) => c.id === baseCard.id);
      if (overrideCard) {
        return mergeCardConfig(baseCard, overrideCard);
      }
      return baseCard;
    });
  }

  return stackMerged;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== undefined && source[key] !== null) {
      // arrays (like cards[]) should replace, not deep-merge
      if (Array.isArray(source[key])) {
        output[key] = source[key];
      } else if (isObject(source[key]) && isObject(output[key])) {
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