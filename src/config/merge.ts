import type { CardConfig, CardStackConfig } from '../types/config';

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

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

export function mergeStackConfig(
  base: CardStackConfig,
  themeOverride?: DeepPartial<CardStackConfig>,
): CardStackConfig {
  if (!themeOverride) return deepClone(base) as CardStackConfig;

  const merged = deepClone(base) as unknown as Record<string, unknown>;
  const override = deepClone(themeOverride) as unknown as Record<string, unknown>;

  const stackMerged = deepMerge(merged, override) as unknown as CardStackConfig;

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
      if (Array.isArray(source[key])) {
        const targetArr = output[key];
        if (
          Array.isArray(targetArr) &&
          targetArr.length > 0 &&
          source[key].length > 0 &&
          typeof source[key][0] === 'object' &&
          source[key][0] !== null &&
          typeof targetArr[0] === 'object' &&
          targetArr[0] !== null &&
          'id' in (source[key][0] as Record<string, unknown>) &&
          'id' in (targetArr[0] as Record<string, unknown>)
        ) {
          const mergedArr = [...targetArr] as Record<string, unknown>[];
          for (const sourceItem of source[key] as Record<string, unknown>[]) {
            const idx = mergedArr.findIndex(
              (item) => item.id === sourceItem.id,
            );
            if (idx >= 0) {
              mergedArr[idx] = deepMerge(mergedArr[idx], sourceItem);
            } else {
              mergedArr.push(sourceItem);
            }
          }
          output[key] = mergedArr;
        } else {
          output[key] = source[key];
        }
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