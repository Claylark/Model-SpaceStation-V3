import type { AppConfig } from '../types/config';
import { themePresets } from './_base/themePresets';
import { sections } from './_base/sections';

function stackBase(sectionId: string, cardId: string, title: string, subtitle: string) {
  return {
    id: `stack-${sectionId}`,
    sectionId,
    visible: true,
    stackWidth: 'w-[372px]',
    stackMaxWidth: 'max-w-[94vw]',
    gap: 'gap-4',
    cards: [
      {
        id: cardId,
        sectionId,
        visible: true,
        layout: { width: 'w-full', height: 'h-[35vh] min-h-[280px]' },
        visual: { glassMode: 'default' as const, font: 'font-sans' },
        body: {
          component: 'PlaceholderCard',
          props: { sectionId, title, subtitle },
        },
      },
    ],
  };
}

export const APP_CONFIG: AppConfig = {
  meta: { version: '3.0', appName: 'Clay SpaceStation' },
  themeSystem: {
    defaultTheme: 'space',
    presets: themePresets,
  },
  sections,
  stacks: [
    stackBase('hero', 'card-hero-1', '自我介绍', '在这里添加你的介绍卡片'),
    { ...stackBase('profile', 'card-profile-a-1', '资料简介 A', '在这里添加你的资料卡片'), id: 'stack-profile-a' },
    { ...stackBase('profile', 'card-profile-b-1', '资料简介 B', '在这里添加你的资料卡片'), id: 'stack-profile-b' },
    stackBase('attributes', 'card-attributes-1', '详细属性', '在这里添加你的属性卡片'),
    stackBase('network', 'card-network-1', '联系方式', '在这里添加你的联系方式卡片'),
    stackBase('history', 'card-history-1', '更新历史', '在这里添加你的历史卡片'),
  ],
};

export { themePresets } from './_base/themePresets';
export { sections } from './_base/sections';