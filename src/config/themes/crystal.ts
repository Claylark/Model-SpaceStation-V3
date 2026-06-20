import type { CardConfig } from '../../types/config';

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export const crystalThemeOverride: Record<string, DeepPartial<CardConfig>> = {
  'hero-1': {
    body: {
      props: {
        lines: ["水晶律动触发", "全息投影：", "UI已深度联控突变"],
        avatar: { name: "Crystalark", src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=100&h=100&fit=crop" }
      }
    }
  }
};