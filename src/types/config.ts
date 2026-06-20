// ==========================================
// 🎯 星壤空间站 V3 - 全局类型定义
// ==========================================

// ---- 卡片相关 ----

/** 卡片布局 */
export interface CardLayout {
  width: string;
  height: string;
}

/** 玻璃模式 */
export type GlassMode = 'default' | 'force-glass' | 'force-solid';

/** 卡片视觉配置 */
export interface CardVisual {
  glassMode?: GlassMode;
  font?: string;
  bg?: string;
}

/** 卡片动作 */
export interface CardAction {
  label: string;
  primary: boolean;
  action: {
    type: string;
    payload: string;
  };
}

/** 组件 Props - 任意键值 */
export type ComponentProps = Record<string, unknown>;

/** 卡片内容体 */
export interface CardBody {
  component: string;
  props: ComponentProps;
}

/** 单张卡片完整配置 */
export interface CardConfig {
  id: string;
  sectionId: string;
  visible: boolean;
  layout: CardLayout;
  visual: CardVisual;
  body: CardBody;
  actions?: CardAction[];
  themeOverrides?: Record<string, DeepPartial<CardConfig>>;
}

// ---- 卡片堆相关 ----

/** 卡片堆配置：类似 iOS 负一屏小组件的自由流式布局容器 */
export interface CardStackConfig {
  id: string;              // 堆 DOM id
  sectionId: string;       // 绑定 Section，导航通过此 ID 定位
  visible: boolean;
  stackWidth: string;      // 堆宽度，如 "w-[380px]"
  stackMaxWidth?: string;  // 最大宽度，如 "max-w-[380px]"（≤6.67英寸手机屏 375dp）
  gap?: string;            // 卡片间距 "gap-3"
  cards: CardConfig[];     // 堆内卡片列表
  themeOverrides?: Record<string, DeepPartial<CardStackConfig>>;
}

// ---- 主题相关 ----

/** 壁纸配置 */
export interface WallpaperConfig {
  url: string;
  darkUrl?: string;
}

/** 主题 UI 样式类名 */
export interface ThemeUIStyles {
  header: string;
  pill: string;
  cardDefault: string;
}

/** 主题预设 */
export interface ThemePreset {
  id: string;
  label: string;
  style: string;
  isDark?: boolean;
  adaptiveLuminance?: boolean;
  previewCard: string;
  wallpaper: WallpaperConfig;
  ui: ThemeUIStyles;
  domain: string;
}

// ---- 区块相关 ----

/** 区块定义 */
export interface Section {
  id: string;
  label: string;
}

// ---- 歌单相关 ----

/** 单首歌曲 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration?: number;
}

// ---- 组件注册相关 ----

/** 组件注册表 */
export type ComponentRegistry = Record<string, React.ComponentType<ComponentProps>>;

// ---- 聊天相关 ----

/** 聊天消息 */
export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

/** AI 模型 */
export type AIModel = 'DeepSeek' | 'Gemini' | 'GPT-4o';

/** 模型状态 */
export type ModelStatus = 'active' | 'coming-soon';

// ---- 应用配置 ----

/** 语言代码 */
export type LocaleCode = 'zh-CN' | 'zh-TW' | 'zh-HK' | 'en-US' | 'fr-FR' | 'ru-RU' | 'es-ES' | 'ar-SA';

/** 语言选项 */
export interface LocaleOption {
  id: LocaleCode;
  label: string;
}

/** 应用元信息 */
export interface AppMeta {
  version: string;
  appName: string;
}

/** 主题系统 */
export interface ThemeSystem {
  defaultTheme: string;
  presets: Record<string, ThemePreset>;
}

/** 完整应用配置 */
export interface AppConfig {
  meta: AppMeta;
  themeSystem: ThemeSystem;
  sections: Section[];
  stacks: CardStackConfig[];
}

// ---- 工具类型 ----

/** 深度递归 Partial */
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// ---- 合并引擎相关 ----

/** 合并优先级 */
export type MergePriority = 'base' | 'theme' | 'force';

/** 强制配置 */
export interface ForceConfig {
  id: string;
  label: string;
  glassMode: GlassMode;
  globalOverrides: DeepPartial<CardConfig>;
}

// ---- API 服务相关 ----

/** Chat API 流式请求体 */
export interface ChatStreamRequest {
  model: AIModel;
  messages: ChatMessage[];
}

/** Chat API 流式回调 */
export interface ChatStreamCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

// ---- i18n 类型 ----

/** 文案结构 */
export interface LocaleStrings {
  header: {
    title: string;
  };
  nav: Record<string, string>;
  settings: {
    title: string;
    language: string;
    theme: string;
    forceGlass: string;
    customBg: string;
    uploadDesc: string;
    uploadHint: string;
    replaceBg: string;
    footer: string;
    license: string;
    beian: string;
    policeBeian: string;
  };
  chat: {
    placeholder: string;
    deepThink: string;
    comingSoon: string;
    greeting: string;
    fallbackReply: string;
  };
  player: {
    noTrack: string;
    previous: string;
    next: string;
    play: string;
    pause: string;
    close: string;
    open: string;
  };
  cards: Record<string, Record<string, string>>;
}