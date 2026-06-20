# 📚 Model SpaceStation V3 — 内部 API 参考

> 所有自定义类型、函数、Hook、组件、工具函数的完整文档

---

## 目录

1. [类型系统](#1-类型系统)
2. [配置合并引擎](#2-配置合并引擎)
3. [i18n 多语言系统](#3-i18n-多语言系统)
4. [Hooks](#4-hooks)
5. [UI 组件](#5-ui-组件)
6. [卡片组件（Registry）](#6-卡片组件registry)
7. [App.tsx 内部函数与常量](#7-apptsx-内部函数与常量)
8. [CSS 工具类](#8-css-工具类)

---

## 1. 类型系统

**文件：** `src/types/config.ts`

### CardLayout

卡片尺寸配置。

```ts
interface CardLayout {
  width: string;   // Tailwind 宽度类，如 "w-full", "w-1/2", "w-[372px]"
  height: string;  // Tailwind 高度类，如 "h-auto", "h-48", "h-64"
}
```

### GlassMode

卡片玻璃效果模式。

```ts
type GlassMode = 'default' | 'force-glass' | 'force-solid';
```

| 值 | 行为 |
|---|---|
| `'default'` | 跟随全局 `isGlassUI` 开关 |
| `'force-glass'` | 始终毛玻璃，忽略全局开关 |
| `'force-solid'` | 始终实色，忽略全局开关 |

### CardVisual

卡片视觉样式配置。

```ts
interface CardVisual {
  glassMode?: GlassMode;  // 默认 'default'
  font?: string;          // Tailwind 字体类，如 "font-sans"
  bg?: string;            // 自定义背景 Tailwind 类
}
```

### CardAction

卡片底部按钮配置。

```ts
interface CardAction {
  label: string;         // 按钮文字
  primary: boolean;      // true=主按钮样式, false=次要
  action: {
    type: string;        // 动作类型，如 "NAVIGATE", "NAVIGATE_SECTION"
    payload: string;     // 动作参数，如 sectionId
  };
}
```

### CardBody

卡片内容体——驱动渲染的核心配置。

```ts
interface CardBody {
  component: string;     // 注册的 React 组件名（在 App.tsx renderCard 中匹配）
  props: ComponentProps; // 传给组件的任意键值参数
}

type ComponentProps = Record<string, unknown>;
```

### CardConfig

单张卡片完整配置。

```ts
interface CardConfig {
  id: string;           // 唯一 DOM id
  sectionId: string;    // 所属导航 Section
  visible: boolean;     // false = 占位不渲染内容
  layout: CardLayout;
  visual: CardVisual;
  body: CardBody;
  actions?: CardAction[];
  themeOverrides?: Record<string, DeepPartial<CardConfig>>;
}
```

### CardStackConfig

卡片堆配置——横向滚动的 snap 单元。

```ts
interface CardStackConfig {
  id: string;              // 堆 DOM id（导航/scroll spy 目标）
  sectionId: string;       // 绑定 Section
  visible: boolean;
  stackWidth: string;      // 如 "w-[380px]"
  stackMaxWidth?: string;  // 如 "max-w-[380px]"
  gap?: string;            // 堆内卡片间距，如 "gap-3"
  cards: CardConfig[];     // 堆内卡片列表
  themeOverrides?: Record<string, DeepPartial<CardStackConfig>>;
}
```

### AppConfig

应用顶层配置——所有内容的入口。

```ts
interface AppConfig {
  meta: AppMeta;              // { version: string; appName: string }
  themeSystem: ThemeSystem;   // { defaultTheme: string; presets: Record<string, ThemePreset> }
  sections: Section[];        // 导航区块定义
  stacks: CardStackConfig[];  // 卡片堆数组
}
```

### ThemePreset

主题预设定义。

```ts
interface ThemePreset {
  id: string;                  // 主题 ID（space/crystal/solid/aurora）
  label: string;               // 显示名称
  style: string;               // 背景 Tailwind 类
  isDark?: boolean;
  adaptiveLuminance?: boolean; // 是否根据暗黑模式自适应亮度
  previewCard: string;
  wallpaper: WallpaperConfig;
  ui: ThemeUIStyles;           // { header, pill, cardDefault }
  domain: string;              // 三级域名前缀
}
```

### Section

导航区块定义。

```ts
interface Section {
  id: string;    // Section ID（hero/profile/attributes/network/history）
  label: string; // 显示名称
}
```

### LocaleCode / LocaleStrings

```ts
type LocaleCode = 'zh-CN' | 'zh-TW' | 'zh-HK' | 'en-US' | 'fr-FR' | 'ru-RU' | 'es-ES' | 'ar-SA';

interface LocaleStrings {
  header: { title: string };
  nav: Record<string, string>;
  settings: { /* 设置面板所有文案 */ };
  chat: { /* AI 对话文案 */ };
  player: { /* 音乐播放器文案 */ };
  cards: Record<string, Record<string, string>>;
}
```

---

## 2. 配置合并引擎

**文件：** `src/config/merge.ts`

### mergeCardConfig(base, themeOverride?, forceOverride?)

深度合并卡片配置。优先级：`force > themeOverride > base`。

```ts
function mergeCardConfig(
  base: CardConfig,
  themeOverride?: DeepPartial<CardConfig>,
  forceOverride?: DeepPartial<CardConfig>,
): CardConfig
```

### mergeStackConfig(base, themeOverride?)

深度合并卡片堆配置。合并堆级属性后，再按 `id` 逐个匹配并合并堆内卡片。

```ts
function mergeStackConfig(
  base: CardStackConfig,
  themeOverride?: DeepPartial<CardStackConfig>,
): CardStackConfig
```

### deepClone(obj)

JSON 深拷贝。

```ts
function deepClone<T>(obj: T): T
```

### deepMerge(target, source)

深度合并两个对象。**数组字段整体替换**（不深度合并数组元素）。

```ts
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown>
```

### isObject(value)

类型守卫：判断值是否为非数组的普通对象。

```ts
function isObject(value: unknown): value is Record<string, unknown>
```

---

## 3. i18n 多语言系统

**入口文件：** `src/i18n/index.ts`
**RTL 工具：** `src/i18n/rtl.ts`

### setLocale(locale)

切换当前语言。同时设置 `currentLocale` 状态和文档级 HTML 属性（`lang` + `dir`）。

```ts
function setLocale(locale: LocaleCode): void
```

### setDocumentLocale(locale)

仅设置文档级 HTML 属性（`document.documentElement.lang` + `document.documentElement.dir`）。不改变 `currentLocale` 状态，用于初始化。

```ts
function setDocumentLocale(locale: LocaleCode): void
```

### getLocale()

获取当前语言代码。

```ts
function getLocale(): LocaleCode
```

### t(key, fallback?)

按点号分隔的路径查找翻译文案。

```ts
function t(key: string, fallback?: string): string

// 用法
t('header.title')                // → "星壤空间站 Settings"
t('nav.hero')                    // → "自我介绍"
t('setting.nonexistent', '???')  // → "???"
```

### isRTL(locale)

判断指定语言是否为从右到左书写方向。

```ts
function isRTL(locale: string): boolean
```

### getDir(locale)

获取指定语言的文本方向：`'ltr'` 或 `'rtl'`。

```ts
function getDir(locale: string): 'ltr' | 'rtl'
```

### locales

当前语言的所有翻译字符串（`LocaleStrings` 对象）。

```ts
const locales: Record<LocaleCode, LocaleStrings>
```

### RTL_LOCALES

RTL 语言列表（可扩展）。

```ts
const RTL_LOCALES: string[] = ['ar-SA'];
```

---

## 4. Hooks

### useHorizontalScrollSpy(stacks, containerId)

**文件：** `src/hooks/useHorizontalScrollSpy.ts`

监听横向滚动的 scroll 事件，通过计算视口中心到各堆 DOM 节点的距离，确定当前激活的堆。

```ts
function useHorizontalScrollSpy(
  stacks: CardStackConfig[],
  containerId: string,
): {
  activeSectionId: string;   // 当前堆的 sectionId（用于底部导航高亮）
  activeStackIndex: number;  // 当前堆在 stacks 数组中的索引（用于惰性渲染）
}
```

**实现细节：**
- 滚动事件通过 `setTimeout(fn, 50)` 防抖
- 使用 `Reflect` 比较视口中心到各堆 `offsetLeft` 的距离
- `activeStackIndex` 通过 `useMemo` 从 `activeSectionId` 反查（O(n)）

### useTheme()

**文件：** `src/hooks/useTheme.ts`

主题状态管理。管理：
- `isDark` / `setIsDark` — 暗黑模式
- `isGlassUI` / `setIsGlassUI` — 毛玻璃开关
- `useCustomBg` / `setUseCustomBg` — 自定义背景开关
- `customBgUrl` / `setCustomBgUrl` — 自定义背景 URL
- `customBgType` / `setCustomBgType` — 自定义背景类型（image/video）
- `currentThemeId` / `setCurrentThemeId` — 当前主题 ID
- `isBgDark` / `setIsBgDark` — 背景是否暗色（用于 UI 自适应）
- `toggleDarkMode()` — 切换暗黑模式

### useRouteTheme()

**文件：** `src/hooks/useRouteTheme.ts`

从 URL 路径/域名解析主题和语言。返回：
```ts
{ theme: string | null; locale: LocaleCode }
```

### usePlaylist()

**文件：** `src/hooks/usePlaylist.ts`

歌单播放管理。返回：
```ts
{
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  currentTrack: Track | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}
```

### useChatStream()

**文件：** `src/hooks/useChatStream.ts`

AI 聊天流式输出。返回：
```ts
{
  messages: ChatMessage[];       // 聊天记录
  isStreaming: boolean;          // 是否正在流式输出
  sendMessage: (text: string) => void;  // 发送消息
}
```

---

## 5. UI 组件

### Header

**文件：** `src/components/Header.tsx`

顶部状态栏 + 设置面板。

**Props：**

| Prop | 类型 | 说明 |
|---|---|---|
| `isGlassUI` | `boolean` | 毛玻璃开关 |
| `setIsGlassUI` | `(v: boolean) => void` | |
| `useCustomBg` | `boolean` | 自定义背景开关 |
| `setUseCustomBg` | `(v: boolean) => void` | |
| `customBgUrl` | `string` | 自定义背景 URL |
| `setCustomBgUrl` | `(v: string) => void` | |
| `customBgType` | `'image' \| 'video'` | 自定义背景类型 |
| `setCustomBgType` | `(v: 'image' \| 'video') => void` | |
| `isBgDark` | `boolean` | 背景是否暗色 |
| `currentThemeId` | `string` | 当前主题 ID |
| `setCurrentThemeId` | `(v: string) => void` | |
| `isDark` | `boolean` | 暗黑模式 |
| `toggleDarkMode` | `() => void` | |
| `locale` | `LocaleCode` | 当前语言 |
| `onLocaleChange` | `(locale: LocaleCode) => void` | |

### AIChatModule

**文件：** `src/components/AIChatModule.tsx`

AI 对话浮层（毛玻璃面板）。

**Props：**

| Prop | 类型 | 说明 |
|---|---|---|
| `isChatOpen` | `boolean` | 是否展开 |
| `isGlassUI` | `boolean` | 是否毛玻璃模式 |
| `messages` | `ChatMessage[]` | 聊天记录 |
| `isStreaming` | `boolean` | 是否正在流式输出 |
| `sendMessage` | `(text: string) => void` | |
| `locale` | `LocaleCode` | |

### BottomFloatingPill

**文件：** `src/components/BottomFloatingPill.tsx`

底部浮动导航栏 + 音乐播放器。

**Props：**

| Prop | 类型 | 说明 |
|---|---|---|
| `activeId` | `string` | 当前激活的 sectionId（高亮对应按钮） |
| `isChatOpen` | `boolean` | |
| `setIsChatOpen` | `(v: boolean) => void` | |
| `isPlaying` | `boolean` | |
| `isGlassUI` | `boolean` | |
| `dispatch` | `(a: { type: string; payload: string }) => void` | 导航动作分发 |
| `currentThemeId` | `string` | |
| `isPlayerOpen` | `boolean` | 播放器面板是否展开 |
| `setIsPlayerOpen` | `(v: boolean) => void` | |
| `togglePlay` | `() => void` | |
| `next` / `prev` | `() => void` | |
| `currentTrack` | `Track \| null` | |
| `audioRef` | `React.RefObject<HTMLAudioElement \| null>` | |
| `locale` | `LocaleCode` | |

**导航按钮生成：** 从 `locales[locale].nav` 的 keys 读取所有 Section，每个 Section 渲染一个 2 行 2 字按钮。

### Icon

**文件：** `src/components/Icon.tsx`

Material Symbols 图标封装。

```tsx
<Icon name="play_arrow" className="text-[18px]" />
```

### SVGIcons

**文件：** `src/components/SVGIcons.tsx`

自定义 SVG 图标（星标 `StarSparkle`）。

```tsx
<SVGIcons.StarSparkle />
```

---

## 6. 卡片组件（Registry）

### PlaceholderCard

**文件：** `src/registry/components/PlaceholderCard.tsx`

默认占位卡片组件。显示 Section 标签 + 标题 + 副标题。

**Props：**

| Key | 类型 | 说明 |
|---|---|---|
| `sectionId` | `string` | Section 标签文字 |
| `title` | `string` | 卡片标题 |
| `subtitle` | `string` | 卡片副标题 |

### RichTextIntro

**文件：** `src/registry/components/RichTextIntro.tsx`

富文本介绍卡片。支持多行文字 + 头像 + 底部动作按钮。

**Props（常用）：**

| Key | 类型 | 说明 |
|---|---|---|
| `tag` | `string` | 标签文字 |
| `lines` | `string[]` | 多行文字内容 |
| `avatar` | `{ name: string; src: string }` | 头像名 + URL |

### ElasticSpace

**文件：** `src/registry/components/ElasticSpace.tsx`

弹性空间卡片。灵活的内容展示区域。

**Props：** 见组件内类型定义。

---

## 7. App.tsx 内部函数与常量

**文件：** `src/App.tsx`

### 液态玻璃常量

```ts
// 主题驱动的毛玻璃样式
THEME_DRIVEN_GLASS(ui: { cardDefault: string }): string

// 绝对兜底毛玻璃样式（主题 UI 不可用时）
ABSOLUTE_FALLBACK_GLASS: string

// 实色材质样式
SOLID_MATERIAL: string
```

### dispatchAction(action)

导航/动作分发器。处理 `NAVIGATE` 和 `NAVIGATE_SECTION` 两种动作类型。

```ts
function dispatchAction(action: { type: string; payload: string }): void
```

**行为：**
1. 在 `APP_CONFIG.stacks` 中查找第一个 `sectionId === payload` 的堆
2. 通过 `getElementById(stack.id)` 获取堆的 DOM 节点
3. 计算 targetLeft = `el.offsetLeft - container.clientWidth/2 + el.clientWidth/2`
4. 暂时关闭 snap，smooth scroll，600ms 后恢复 snap

### handleWheel(e)

滚轮事件处理。垂直滚轮 deltaY → 横向滚动到相邻堆。

```ts
function handleWheel(e: React.WheelEvent): void
```

**行为：**
1. 横向滚轮事件直接跳过（`Math.abs(e.deltaX) > Math.abs(e.deltaY)`）
2. 计算当前视口中心最近的堆
3. `deltaY > 15` → 下一个堆；`deltaY < -15` → 上一个堆
4. smooth scroll，600ms 后解锁 `scrollLockRef`

### resolveCardConfig(baseCard, themeId)

解析卡片的最终配置：base + theme override。

```ts
function resolveCardConfig(baseCard: CardConfig, themeId: string): CardConfig
```

### renderCard(rawCard)

渲染单张卡片（堆内使用）。

```ts
function renderCard(rawCard: CardConfig): JSX.Element
```

**行为：**
1. 调用 `resolveCardConfig` 获取最终配置
2. 不可见卡片渲染为空占位 div
3. 根据 `glassMode` + `isGlassUI` 决定毛玻璃/实色样式
4. 根据 `body.component` 匹配对应卡片组件渲染

### renderStack(stack)

渲染完整的卡片堆（包含 flex-wrap 容器 + 所有内部卡片）。

```ts
function renderStack(stack: CardStackConfig): JSX.Element
```

### renderStackPlaceholder(stack)

渲染卡片堆的空占位符。保留 DOM 节点（id + snap-center 尺寸），但不渲染内部内容。用于惰性渲染优化。

```ts
function renderStackPlaceholder(stack: CardStackConfig): JSX.Element
```

### handleBgLuminanceCheck()

背景亮度检测：截取背景图右侧 30% 区域，计算平均亮度，判断背景是否偏暗。用于 Header 图标/文字颜色自适应。

```ts
function handleBgLuminanceCheck(): void
```

---

## 8. CSS 工具类

**文件：** `src/index.css`

### .hide-scrollbar

隐藏滚动条（保留滚动功能）。

```css
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

### .mask-image-top

顶部渐变遮罩（从透明到黑色）。

```css
.mask-image-top {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 100%);
}
```

### .wave-bar + @keyframes musicWave

音乐播放动画——3 条跳动的小竖线。

```css
@keyframes musicWave {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}
.wave-bar { animation: musicWave 1.2s ease-in-out infinite; }
```

### .animate-fade-in / .animate-fade-in-up

淡入动画 / 淡入上移动画。

### RTL 样式（html[dir="rtl"]）

| 规则 | 作用 |
|---|---|
| `html[dir="rtl"] .snap-x { direction: rtl }` | 横向滚动方向翻转 |
| `html[dir="rtl"] #settings-panel { right: auto; left: 0; ... }` | 设置面板从左侧滑出 |
| `html[dir="rtl"] #settings-panel.translate-x-full { --tw-translate-x: -100% }` | 关闭动画方向翻转 |