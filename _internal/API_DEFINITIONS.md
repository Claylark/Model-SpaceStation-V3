# Model SpaceStation v3.0.1 — 内部 API 参考

> 类型系统、Hooks、Context、组件、Registry、服务层的完整文档

---

## 目录

1. [类型系统](#1-类型系统)
2. [AppContext 全局事件总线](#2-appcontext-全局事件总线)
3. [配置合并引擎](#3-配置合并引擎)
4. [i18n 多语言系统](#4-i18n-多语言系统)
5. [Hooks](#5-hooks)
6. [UI 组件](#6-ui-组件)
7. [卡片组件（Registry）](#7-卡片组件registry)
8. [App.tsx 内部函数与常量](#8-apptsx-内部函数与常量)
9. [服务层](#9-服务层)
10. [CSS 工具类](#10-css-工具类)

---

## 1. 类型系统

**文件：** `src/types/config.ts`

### CardConfig

```ts
interface CardConfig {
  id: string;
  sectionId: string;
  visible: boolean;
  layout: CardLayout;       // { width, height }
  visual: CardVisual;       // { glassMode?, font?, bg? }
  body: CardBody;
  actions?: CardAction[];
  themeOverrides?: Record<string, DeepPartial<CardConfig>>;
  version?: string;          // v3.0.1: Schema 版本迁移预留
}
```

### CardAction

卡片底部按钮配置。

```ts
interface CardAction {
  label: string;
  primary: boolean;
  action: {
    type: string;
    payload: string;
  };
}
```

### CardStackConfig

```ts
interface CardStackConfig {
  id: string;
  sectionId: string;
  visible: boolean;
  stackWidth: string;        // 如 "w-[372px]"
  stackMaxWidth?: string;    // 如 "max-w-[94vw]"
  gap?: string;
  cards: CardConfig[];
  themeOverrides?: Record<string, DeepPartial<CardStackConfig>>;
}
```

### ComponentRegistry

**v3.0.1 升级：** 从 `Record<string, React.ComponentType<any>>` 升级为带 schema 的结构。

```ts
interface RegistryEntry {
  component: React.ComponentType<any>;
  schema: PropSchema;
}

type ComponentRegistry = Record<string, RegistryEntry>;
```

### PropSchema

物料描述协议，可视化编辑器根据此 schema 自动生成属性配置面板。

```ts
interface PropSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'image' | 'select' | 'color' | 'text';
    label: string;
    default?: unknown;
    options?: string[];  // type='select' 时的下拉选项
  };
}
```

### AppAction

全局事件总线统一 Action 类型。

```ts
type AppAction =
  | { type: 'NAVIGATE_SECTION'; payload: string }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'TOGGLE_PLAYER' }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LOCALE'; payload: LocaleCode }
  | { type: 'TOGGLE_DARK' }
  | { type: 'TOGGLE_GLASS' };
```

### ACTION_CATALOG

可枚举的动作资产表。可视化编辑器的事件绑定面板可遍历此表生成下拉菜单。

```ts
const ACTION_CATALOG: Record<string, ActionMeta> = {
  NAVIGATE_SECTION: { label: '跳转版块', needsPayload: true, payloadHint: 'sectionId' },
  TOGGLE_PLAY:      { label: '播放/暂停', needsPayload: false },
  NEXT_TRACK:       { label: '下一首', needsPayload: false },
  PREV_TRACK:       { label: '上一首', needsPayload: false },
  TOGGLE_CHAT:      { label: '打开/关闭 AI 对话', needsPayload: false },
  TOGGLE_PLAYER:    { label: '打开/关闭 播放器', needsPayload: false },
  SET_THEME:        { label: '切换主题', needsPayload: true, payloadHint: 'themeId' },
  SET_LOCALE:       { label: '切换语言', needsPayload: true, payloadHint: 'localeCode' },
  TOGGLE_DARK:      { label: '切换暗黑模式', needsPayload: false },
  TOGGLE_GLASS:     { label: '切换毛玻璃', needsPayload: false },
};
```

### AppContextValue

```ts
interface AppContextValue {
  state: AppContextState;
  dispatch: (action: AppAction) => void;
  sendMessage: (content: string, model: AIModel, isDeepThink: boolean) => void;
  updateCardProps: (cardId: string, key: string, value: unknown) => void;
  moveCard: (cardId: string, sourceStackId: string, targetStackId: string, targetIndex: number) => void;
  deleteCard: (cardId: string) => void;
}
```

### AppContextState

```ts
interface AppContextState {
  locale: LocaleCode;
  currentThemeId: string;
  isDark: boolean;
  isGlassUI: boolean;
  isChatOpen: boolean;
  isPlayerOpen: boolean;
  isPlaying: boolean;
  currentTrack: Track | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  activeSectionId: string;
  isDesignMode: boolean;   // v3.0.1: 设计态/运行态隔离标志
}
```

### ChatMessage

```ts
interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  reasoning?: string;  // DeepSeek V4 思维链
}
```

### PlayMode

```ts
type PlayMode = 'list' | 'single' | 'shuffle';
```

播放模式枚举：
- `list` — 列表循环（播完自动切下一首）
- `single` — 单曲循环（无限重播）
- `shuffle` — 随机播放

通过 `dispatch({ type: 'TOGGLE_PLAY_MODE' })` 切换，`AppContextState.playMode` 读取当前状态。

### AIModel

```ts
type AIModel = 'DeepSeek Flash' | 'DeepSeek Pro';
```

### ChatStreamRequest / ChatStreamCallbacks

```ts
interface ChatStreamRequest {
  model: AIModel;
  messages: ChatMessage[];
}

interface ChatStreamCallbacks {
  onToken: (token: string, type: 'content' | 'reasoning') => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}
```

---

## 2. AppContext 全局事件总线

**文件：** `src/context/AppContext.tsx`

### AppProvider

包裹整个应用，聚合 useTheme + usePlaylist + useChatStream + useHorizontalScrollSpy 的全部状态。

```tsx
<AppProvider stacks={APP_CONFIG.stacks} containerId="main-scroll-container">
  <AppShell />
</AppProvider>
```

### useAppContext()

任何组件（包括卡片）调用此 Hook 获取全局上下文。

```ts
const { state, dispatch, sendMessage, updateCardProps, moveCard, deleteCard } = useAppContext();
```

### dispatch(action: AppAction)

全局事件分发。所有组件通过 dispatch 通信，不直接持有具体逻辑。

### updateCardProps / moveCard / deleteCard

原子化数据突变函数，用于可视化编辑器实时修改配置树。

```ts
updateCardProps('card-hero-1', 'title', '新标题');
moveCard('card-1', 'stack-hero', 'stack-profile', 0);
deleteCard('card-1');
```

### 组件 Props 精简对比

| 组件 | v3.0 Props 数 | v3.0.1 Props 数 |
|------|---------------|-----------------|
| BottomFloatingPill | 15 | 1 (仅 audioRef) |
| AIChatModule | 6 | 0 |
| Header | 14 | 8 (仅背景相关) |
| App.tsx | 直接管理所有 hooks | 通过 Provider 包裹 |

---

## 3. 配置合并引擎

**文件：** `src/config/merge.ts`

### mergeCardConfig(base, themeOverride?, forceOverride?)

深度合并卡片配置。优先级：`force > themeOverride > base`。

### mergeStackConfig(base, themeOverride?)

深度合并卡片堆配置。合并堆级属性后，再按 `id` 逐个匹配合并堆内卡片。

### deepClone(obj) / deepMerge(target, source)

JSON 深拷贝和深度合并。数组元素若含 `id` 则按 id 深度合并，无 `id` 则整体替换。

---

## 4. i18n 多语言系统

**入口文件：** `src/i18n/index.ts`

支持 `zh-CN` / `zh-TW` / `zh-HK` / `en-US` / `fr-FR` / `ru-RU` / `es-ES` / `ar-SA` 八种语言。

- `setLocale(locale)` — 切换语言，同时设置 `document.documentElement.lang` 和 `dir`
- `isRTL(locale)` — 判断是否为 RTL 语言
- `locales[locale]` — 当前语言的翻译字符串

---

## 5. Hooks

### useHorizontalScrollSpy(stacks, containerId)

横向滚动视口检测。返回 `{ activeSectionId, activeStackIndex }`。

### useTheme()

主题状态管理。管理 `isDark`、`isGlassUI`、`useCustomBg`、`customBgUrl`、`currentThemeId` 等。

### usePlaylist()

歌单播放管理。返回 `{ isPlaying, togglePlay, next, prev, currentTrack, audioRef }`。

### useChatStream()

AI 聊天流式输出。返回 `{ messages, isStreaming, sendMessage }`。

- `sendMessage(content, model, isDeepThink)` — 发送消息
- `model` 支持 `'DeepSeek Flash' | 'DeepSeek Pro'`
- `isDeepThink` 为 true 时启用 `thinking: { type: 'enabled', reasoning_effort: 'high' }`
- `ChatMessage.reasoning` 存储 DeepSeek V4 思维链
- 流式回调 `onToken` 接受 `(token, type: 'content' | 'reasoning')` 双类型参数

### useRouteTheme()

从 URL 路径/域名解析主题和语言。返回 `{ theme, locale }`。

---

## 6. UI 组件

### Header

**文件：** `src/components/Header.tsx`

顶部状态栏 + 设置面板。

**Props（v3.0.1 精简后）：**

| Prop | 类型 | 说明 |
|---|---|---|
| `useCustomBg` / `setUseCustomBg` | `boolean` | 自定义背景开关 |
| `customBgUrl` / `setCustomBgUrl` | `string` | 自定义背景 URL |
| `customBgType` / `setCustomBgType` | `'image' \| 'video'` | 自定义背景类型 |
| `isBgDark` | `boolean` | 背景是否暗色 |

其他状态（`locale`、`currentThemeId`、`isDark`、`isGlassUI`）通过 `useAppContext()` 获取。
交互（暗黑切换、主题切换、语言切换、毛玻璃开关）通过 `dispatch(AppAction)` 分发。

### AIChatModule

**文件：** `src/components/AIChatModule.tsx`

AI 对话浮层。

**Props（v3.0.1）：** **0 个**。全部通过 `useAppContext()` 获取。

**深度思考推理链**（ReasoningBox）：解析 `reasoning_content` 字段，支持步骤摘要、折叠展示、淡入动画。

### BottomFloatingPill

**文件：** `src/components/BottomFloatingPill.tsx`

底部浮动导航栏 + 音乐播放器。

**Props（v3.0.1 精简后）：**

| Prop | 类型 | 说明 |
|---|---|---|
| `audioRef` | `React.RefObject<HTMLAudioElement \| null>` | 音频元素引用 |

所有交互通过 `dispatch(AppAction)` 分发：`TOGGLE_CHAT`、`NAVIGATE_SECTION`、`PREV_TRACK`、`TOGGLE_PLAY`、`NEXT_TRACK`、`TOGGLE_PLAYER`。

### CardErrorBoundary

**文件：** `src/components/CardErrorBoundary.tsx`

React ErrorBoundary 包裹每张卡片。单卡崩溃时显示降级 UI，不影响全局。

### Icon / SVGIcons

Material Symbols 图标封装和自定义 SVG 图标。

---

## 7. 卡片组件（Registry）

**文件：** `src/config/_base/componentRegistry.ts`

Registry 实际注入组件和物料 Schema。

```ts
const componentRegistry: ComponentRegistry = {
  RichTextIntro: {
    component: RichTextIntro,
    schema: { tag: { type: 'string', label: '标签文字' }, ... },
  },
  PlaceholderCard: {
    component: PlaceholderCard,
    schema: { title: { type: 'string', label: '标题' }, ... },
  },
  ElasticSpace: {
    component: ElasticSpace,
    schema: {},
  },
};
```

- **PlaceholderCard** — 默认占位卡片，sectionId + title + subtitle
- **RichTextIntro** — 富文本介绍卡片，多行文字 + 头像 + 底部动作按钮
- **ElasticSpace** — 弹性空间卡片

### 注册新卡片

只需在 `componentRegistry` 中追加一条记录，并在 `src/registry/components/` 下添加组件文件。**无需修改 App.tsx。**

---

## 8. App.tsx 内部函数与常量

**文件：** `src/App.tsx`

### 结构

```
App (Provider 包裹)
└── AppShell
    ├── 背景层
    ├── Header
    ├── AIChatModule
    ├── main#main-scroll-container (横向滚动卡片堆)
    │   ├── spacer
    │   ├── renderStack / renderStackPlaceholder × N
    │   └── spacer
    └── BottomFloatingPill
```

### renderCard(rawCard)

动态从 `componentRegistry` 查找组件并渲染。每张卡片外层包裹 `<CardErrorBoundary>`。

### renderStack(stack)

渲染单个卡片堆，内部 flex-wrap 排列卡片。

### 液态玻璃常量

- `THEME_DRIVEN_GLASS(ui)` — 主题驱动毛玻璃
- `ABSOLUTE_FALLBACK_GLASS` — 绝对兜底毛玻璃
- `SOLID_MATERIAL` — 实色材质

### 卡片堆间距公式

spacer 宽度：`calc(50vw - min(186px, 47vw))`，与底部栏 `w-[372px] max-w-[94vw]` 严格对齐。

---

## 9. 服务层

### chatApi

**文件：** `src/services/chatApi.ts`

通过本地 `/api/chat` 代理调用 DeepSeek API。使用 `https://api.deepseek.com/chat/completions`（无 /v1）。

### apiClient

**文件：** `src/services/apiClient.ts`

HTTP 客户端基类。

### configApi（预留）

**文件：** `src/services/configApi.ts`

远程配置拉取/保存接口：`fetchAppConfig()` / `saveAppConfig()` / `publishAppConfig()`。

### uploadApi（预留）

**文件：** `src/services/uploadApi.ts`

文件上传接口预留。

### Cloudflare Functions 代理

**文件：** `functions/api/chat.ts`

生产环境 Cloudflare Functions 代理 DeepSeek API。模型映射：`DeepSeek Pro` → `deepseek-v4-pro`，`DeepSeek Flash` → `deepseek-v4-flash`。

### systemPrompt

**文件：** `src/services/systemPrompt.ts`

AI 聊天系统提示词生成器。在每次发送消息时，由 `chatApi.ts` 调用 `buildSystemPrompt()` 动态生成，并随 `POST /api/chat` 的 `systemPrompt` 字段传递给后端代理。

**`buildPageContext()`** — 遍历 `APP_CONFIG.stacks` 提取所有可见卡片的 title/subtitle/lines/tag，生成纯文本页面简介。

**`buildSystemPrompt(currentTrackInfo: string)`** — 生成完整系统提示词，包含：
- 时间戳（服务端实时）
- 当前播放歌曲（前端传入）
- 页面内容简介
- Role / Persona 定义（从 `APP_CONFIG.meta` 读取 appNameShort、stationName）
- 约束规则

两个代理端点（`vite.config.ts` 和 `functions/api/chat.ts`）都接收 `systemPrompt` 字符串，作为 messages 数组的第一条 system message 发送给 DeepSeek。

### Vite 本地开发代理

**文件：** `vite.config.ts`

本地开发 `/api/chat` 代理中间件，透传 SSE 流。

---

## 10. CSS 工具类

**文件：** `src/index.css`

- `.hide-scrollbar` — 隐藏滚动条
- `.mask-image-top` — 顶部渐变遮罩
- `.wave-bar` + `@keyframes musicWave` — 音乐跳动动画
- `.animate-fade-in` / `.animate-fade-in-up` — 淡入动画
- `html[dir="rtl"]` — RTL 样式适配（横向滚动翻转、设置面板左出）