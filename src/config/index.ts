import type { AppConfig } from '../types/config';
import { themePresets } from './_base/themePresets';
import { sections } from './_base/sections';

/**
 * 默认卡片堆配置
 * 6 个堆对应 5 个导航 Section（profile 有 2 个堆）
 * 每个堆内部使用 flex flex-wrap 自由排列卡片
 */
export const APP_CONFIG: AppConfig = {
  meta: { version: '3.0', appName: 'Clay SpaceStation' },
  themeSystem: {
    defaultTheme: 'space',
    presets: themePresets,
  },
  sections,
  stacks: [
    {
      id: 'stack-hero',
      sectionId: 'hero',
      visible: true,
      stackWidth: 'w-[380px]',
      stackMaxWidth: 'max-w-[380px]',
      gap: 'gap-3',
      cards: [
        {
          id: 'card-hero-1',
          sectionId: 'hero',
          visible: true,
          layout: { width: 'w-full', height: 'h-auto' },
          visual: { glassMode: 'default', font: 'font-sans' },
          body: {
            component: 'PlaceholderCard',
            props: {
              sectionId: 'hero',
              title: '自我介绍',
              subtitle: '在这里添加你的介绍卡片',
            },
          },
        },
      ],
    },
    {
      id: 'stack-profile-a',
      sectionId: 'profile',
      visible: true,
      stackWidth: 'w-[380px]',
      stackMaxWidth: 'max-w-[380px]',
      gap: 'gap-3',
      cards: [
        {
          id: 'card-profile-a-1',
          sectionId: 'profile',
          visible: true,
          layout: { width: 'w-full', height: 'h-auto' },
          visual: { glassMode: 'default', font: 'font-sans' },
          body: {
            component: 'PlaceholderCard',
            props: {
              sectionId: 'profile',
              title: '资料简介 A',
              subtitle: '在这里添加你的资料卡片',
            },
          },
        },
      ],
    },
    {
      id: 'stack-profile-b',
      sectionId: 'profile',
      visible: true,
      stackWidth: 'w-[380px]',
      stackMaxWidth: 'max-w-[380px]',
      gap: 'gap-3',
      cards: [
        {
          id: 'card-profile-b-1',
          sectionId: 'profile',
          visible: true,
          layout: { width: 'w-full', height: 'h-auto' },
          visual: { glassMode: 'default', font: 'font-sans' },
          body: {
            component: 'PlaceholderCard',
            props: {
              sectionId: 'profile',
              title: '资料简介 B',
              subtitle: '在这里添加你的资料卡片',
            },
          },
        },
      ],
    },
    {
      id: 'stack-attributes',
      sectionId: 'attributes',
      visible: true,
      stackWidth: 'w-[380px]',
      stackMaxWidth: 'max-w-[380px]',
      gap: 'gap-3',
      cards: [
        {
          id: 'card-attributes-1',
          sectionId: 'attributes',
          visible: true,
          layout: { width: 'w-full', height: 'h-auto' },
          visual: { glassMode: 'default', font: 'font-sans' },
          body: {
            component: 'PlaceholderCard',
            props: {
              sectionId: 'attributes',
              title: '详细属性',
              subtitle: '在这里添加你的属性卡片',
            },
          },
        },
      ],
    },
    {
      id: 'stack-network',
      sectionId: 'network',
      visible: true,
      stackWidth: 'w-[380px]',
      stackMaxWidth: 'max-w-[380px]',
      gap: 'gap-3',
      cards: [
        {
          id: 'card-network-1',
          sectionId: 'network',
          visible: true,
          layout: { width: 'w-full', height: 'h-auto' },
          visual: { glassMode: 'default', font: 'font-sans' },
          body: {
            component: 'PlaceholderCard',
            props: {
              sectionId: 'network',
              title: '联系方式',
              subtitle: '在这里添加你的联系方式卡片',
            },
          },
        },
      ],
    },
    {
      id: 'stack-history',
      sectionId: 'history',
      visible: true,
      stackWidth: 'w-[380px]',
      stackMaxWidth: 'max-w-[380px]',
      gap: 'gap-3',
      cards: [
        {
          id: 'card-history-1',
          sectionId: 'history',
          visible: true,
          layout: { width: 'w-full', height: 'h-auto' },
          visual: { glassMode: 'default', font: 'font-sans' },
          body: {
            component: 'PlaceholderCard',
            props: {
              sectionId: 'history',
              title: '更新历史',
              subtitle: '在这里添加你的历史卡片',
            },
          },
        },
      ],
    },
  ],
};

export { themePresets } from './_base/themePresets';
export { sections } from './_base/sections';