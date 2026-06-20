# 📖 Model SpaceStation V3 — 详细教程

> 从零开始配置你的个人空间站

---

## 目录

1. [快速概览](#1-快速概览)
2. [如何添加卡片堆](#2-如何添加卡片堆)
3. [如何添加/修改卡片](#3-如何添加修改卡片)
4. [如何添加新卡片组件](#4-如何添加新卡片组件)
5. [如何配置主题](#5-如何配置主题)
6. [如何配置多语言](#6-如何配置多语言)
7. [RTL 支持说明](#7-rtl-支持说明)
8. [卡片堆布局参数说明](#8-卡片堆布局参数说明)

---

## 1. 快速概览

空间站 V3 的核心是**卡片堆 → 卡片**的二级结构：

```
AppConfig
  └── stacks: CardStackConfig[]     ← 卡片堆数组（横向滚动 snap 单元）
        └── cards: CardConfig[]     ← 堆内卡片数组（flex-wrap 自由排列）
              └── body.component    ← 注册的 React 组件名
              └── body.props        ← 传给组件的参数
```

**文件入口：** `src/config/index.ts` — 改这个文件就能改整个页面。

---

## 2. 如何添加卡片堆

### 场景：新增一个 "作品集" Section 的卡片堆

#### Step 1：确保 Section 存在

打开 `src/config/_base/sections.ts`：

```ts
export const sections: Section[] = [
  { id: 'hero', label: '自我介绍' },
  { id: 'profile', label: '资料简介' },
  { id: 'attributes', label: '详细属性' },
  { id: 'network', label: '联系方式' },
  { id: 'history', label: '更新历史' },
  { id: 'portfolio', label: '作品集' },  // ← 新增
];
```

#### Step 2：在 APP_CONFIG.stacks 中添加堆

打开 `src/config/index.ts`，在 `stacks` 数组中追加：

```ts
{
  id: 'stack-portfolio',           // 唯一 DOM id
  sectionId: 'portfolio',          // 绑定 Section
  visible: true,
  stackWidth: 'w-[380px]',
  stackMaxWidth: 'max-w-[380px]',
  gap: 'gap-3',                    // 卡片间距
  cards: [
    {
      id: 'card-portfolio-1',
      sectionId: 'portfolio',
      visible: true,
      layout: { width: 'w-full', height: 'h-auto' },
      visual: { glassMode: 'default', font: 'font-sans' },
      body: {
        component: 'PlaceholderCard',
        props: {
          sectionId: 'portfolio',
          title: '作品集',
          subtitle: '在这里展示你的作品',
        },
      },
    },
  ],
},
```

#### Step 3：底部导航自动支持

底部导航从 `sections` 读取所有 Section，新 Section 会自动出现。如果语言文件中缺少该 Section 的导航文案，需在 `src/i18n/locales/*.ts` 的 `nav` 中添加：

```ts
nav: {
  hero: '自我介绍',
  profile: '资料简介',
  attributes: '详细属性',
  network: '联系方式',
  history: '更新历史',
  portfolio: '作品集',   // ← 新增
},
```

---

## 3. 如何添加/修改卡片

### 在已有堆中添加卡片

打开 `src/config/index.ts`，找到目标堆（如 `stack-hero`），在其 `cards` 数组中添加：

```ts
cards: [
  // 已有卡片...
  {
    id: 'card-hero-2',              // 唯一 ID
    sectionId: 'hero',
    visible: true,
    layout: { width: 'w-1/2', height: 'h-48' },  // 半宽卡片
    visual: { glassMode: 'default', font: 'font-sans' },
    body: {
      component: 'PlaceholderCard',
      props: {
        sectionId: 'hero',
        title: '第二张卡',
        subtitle: 'flex-wrap 会自动换行排列',
      },
    },
  },
],
```

### 卡片布局技巧

在 `flex flex-wrap` 容器中：

| layout.width | 效果 |
|---|---|
| `w-full` | 独占一行 |
| `w-1/2` | 半行（两张并排） |
| `w-1/3` | 三分之一行（三张并排） |
| `w-[180px]` | 固定 180px 宽度 |

| layout.height | 效果 |
|---|---|
| `h-auto` | 内容撑高 |
| `h-48` | 固定 192px |
| `h-64` | 固定 256px |

### 修改现有卡片

直接编辑 `cards` 数组中对应卡片的 `body.props` 即可。例如修改标题：

```ts
props: {
  sectionId: 'hero',
  title: '新标题',         // ← 改这里
  subtitle: '新副标题',    // ← 改这里
},
```

---

## 4. 如何添加新卡片组件

### Step 1：创建组件文件

在 `src/registry/components/` 下新建，如 `MyCard.tsx`：

```tsx
import type { ComponentProps } from '../../types/config';

interface MyCardProps extends ComponentProps {
  title?: string;
  description?: string;
}

export default function MyCard({ props }: { props: ComponentProps }) {
  const { title, description } = props as MyCardProps;

  return (
    <>
      <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        MY CARD
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full h-full p-6">
        <span className="font-bold text-2xl drop-shadow-md">{title || '默认标题'}</span>
        <span className="opacity-60 text-xs mt-2">{description || ''}</span>
      </div>
    </>
  );
}
```

### Step 2：在 App.tsx 中注册

打开 `src/App.tsx`，添加 import 和渲染分支：

```tsx
import MyCard from './registry/components/MyCard';

// 在 renderCard 函数的组件匹配中添加：
{componentName === 'MyCard' && <MyCard props={card.body.props} />}
```

### Step 3：在配置中使用

```ts
body: {
  component: 'MyCard',
  props: {
    title: '我的自定义卡片',
    description: '这是一张自定义组件卡片',
  },
},
```

---

## 5. 如何配置主题

### 修改现有主题

编辑 `src/config/_base/themePresets.ts`，每个主题有这些字段：

```ts
{
  id: 'space',                    // 主题 ID
  label: '星轨航线',              // 显示名称
  style: 'bg-[#f4f7fb]...',       // 背景样式（Tailwind 类）
  adaptiveLuminance: true,        // 是否跟随暗黑模式
  wallpaper: {
    url: 'https://...',            // 壁纸 CDN URL
    darkUrl: 'https://...',        // 暗黑模式壁纸（可选）
  },
  ui: {
    header: 'bg-white/40...',     // 顶栏样式
    pill: 'bg-white/50...',       // 底部导航条样式
    cardDefault: 'bg-white/80...', // 卡片默认样式
  },
  domain: 'space',                // 三级域名前缀
}
```

### 新增主题

1. 在 `themePresets.ts` 的导出对象中添加新条目
2. （可选）在 `src/config/themes/` 创建主题专属覆写文件
3. 刷新页面，新主题即可在设置面板中看到

### 卡片级主题覆写

在卡片配置中设置 `themeOverrides`（合并优先级：force > theme override > base）：

```ts
themeOverrides: {
  crystal: {
    body: {
      props: {
        title: '水晶主题专属标题',   // 仅在 crystal 主题下生效
      },
    },
  },
},
```

---

## 6. 如何配置多语言

### 新增语言

#### Step 1：创建语言文件

复制 `src/i18n/locales/zh-CN.ts` 为 `ja-JP.ts`，翻译所有字段：

```ts
import type { LocaleStrings } from '../../types/config';

const jaJP: LocaleStrings = {
  header: { title: '星壌宇宙ステーション' },
  nav: {
    hero: '自己紹介',
    profile: 'プロフィール',
    // ...
  },
  // ... 翻译所有字段
};

export default jaJP;
```

#### Step 2：修改类型定义

`src/types/config.ts` 中的 `LocaleCode` 添加 `'ja-JP'`。

#### Step 3：注册语言

`src/i18n/index.ts`：

```ts
import { jaJP } from './locales/ja-JP';

const locales: Record<LocaleCode, LocaleStrings> = {
  // ...
  'ja-JP': jaJP,
};
```

#### Step 4：添加到语言选择器

编辑 `src/components/Header.tsx` 的 `langOptions` 数组添加新语言选项。

---

## 7. RTL 支持说明

### 工作原理

- RTL 语言列表定义在 `src/i18n/rtl.ts` 的 `RTL_LOCALES` 数组中（当前：`'ar-SA'`）
- 切换语言时，`setLocale()` 自动调用 `setDocumentLocale()`，设置 `document.documentElement.dir = 'rtl'`
- `src/index.css` 中包含 RTL 样式覆盖：
  - 横向滚动容器方向翻转（`direction: rtl`）
  - 设置面板从左侧滑出
  - 圆角翻转
- 应用启动时在 `src/main.tsx` 中调用 `setDocumentLocale('zh-CN')` 初始化方向

### 添加新的 RTL 语言

在 `src/i18n/rtl.ts` 中添加语言代码：

```ts
const RTL_LOCALES: string[] = ['ar-SA', 'he-IL', 'fa-IR'];
```

### 添加 RTL 样式

在 `src/index.css` 的 RTL 区域使用 `html[dir="rtl"]` 选择器添加新的 RTL 特定样式。

---

## 8. 卡片堆布局参数说明

### CardStackConfig 字段详解

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | ✅ | 堆的 DOM id，同时也是 scroll spy 检测的目标 |
| `sectionId` | `string` | ✅ | 绑定的导航 Section id，底部导航点击此 Section 时滚动到此堆 |
| `visible` | `boolean` | ✅ | `true` 正常渲染；`false` 占位但不显示内容 |
| `stackWidth` | `string` | ✅ | Tailwind 宽度类，如 `"w-[380px]"`，这是卡片堆在横向滚动中的 snap 宽度 |
| `stackMaxWidth` | `string` | ❌ | 最大宽度，如 `"max-w-[380px]"`，防止在小屏幕上超出 |
| `gap` | `string` | ❌ | 堆内卡片间距，如 `"gap-3"`（12px），默认 `"gap-3"` |
| `cards` | `CardConfig[]` | ✅ | 堆内卡片列表，用 flex-wrap 自由排列 |
| `themeOverrides` | `Record<string, DeepPartial<CardStackConfig>>` | ❌ | 主题级堆覆写（如修改某些堆的主题下堆宽度） |

### 卡片堆尺寸约束

- **最小宽度**：卡片堆不设 `min-width`，但建议不小于 `w-[372px]`（与底部导航栏对齐）
- **最大宽度**：`max-w-[380px]`（6.67 英寸手机屏幕 = ~375dp 逻辑像素 + 安全边距）
- **高度**：`h-[calc(100vh-160px)]`（全屏减去顶部 48px + 底部 112px padding）
- **堆间距**：`w-5`（20px 的 gap spacer）

### 堆内卡片排列规则

堆内部容器使用：
```
flex flex-wrap content-start gap-3 overflow-y-auto hide-scrollbar rounded-[24px]
```

- `flex flex-wrap`：卡片从左到右排列，放不下自动换行
- `content-start`：卡片从顶部开始排列
- `gap-3`（可配置）：卡片间距 12px
- `overflow-y-auto`：卡片超出堆高度时可垂直滚动
- `hide-scrollbar`：隐藏滚动条

### 导航行为

- **一个 Section → 多个堆**：同一 `sectionId` 可以有多个堆（如 `stack-profile-a` 和 `stack-profile-b`）
- 底部导航点击 `profile` 时，会滚动到第一个匹配的堆（`stack-profile-a`）
- scroll spy 检测到任一 `profile` 堆时，导航栏 "资料简介" 按钮高亮
- 用户可以通过滚轮在两个 `profile` 堆之间自由切换

### 性能注意事项

- 堆内卡片数量无硬性限制，但建议每个堆 1-6 张卡片以保证流畅体验
- 堆内使用 `overflow-y-auto`，垂直滚动性能良好
- 横向 snap 滚动使用浏览器原生 `scroll-snap-type`，性能最优

### 惰性渲染优化（Lazy Stack Rendering）

当卡片堆数量 > 3 时，应用自动启用惰性渲染：
- 只完整渲染**当前视口堆 ±2** 范围内的堆（共最多 5 个堆的内容）
- 远离视口的堆渲染为**空占位 Section**（保留 DOM 节点 id + snap 尺寸，确保滚动定位不变）
- 范围选择 ±2 而非 ±1，防止用户超快速滚轮操作时出现空白闪烁
- 占位 Section 与完整 Section 的 DOM id 和 CSS 尺寸完全相同，导航、滚轮、scroll snap 行为不受影响
