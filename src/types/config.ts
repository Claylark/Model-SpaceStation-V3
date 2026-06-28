export interface CardLayout {
  width: string;
  height: string;
}

export type GlassMode = 'default' | 'force-glass' | 'force-solid';

export interface CardVisual {
  glassMode?: GlassMode;
  font?: string;
  bg?: string;
}

export interface CardAction {
  label: string;
  primary: boolean;
  action: {
    type: string;
    payload: string;
  };
}

export type ComponentProps = Record<string, unknown>;

export interface CardBody {
  component: string;
  props: ComponentProps;
}

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

export interface CardStackConfig {
  id: string;
  sectionId: string;
  visible: boolean;
  stackWidth: string;
  stackMaxWidth?: string;
  gap?: string;
  cards: CardConfig[];
  themeOverrides?: Record<string, DeepPartial<CardStackConfig>>;
}

export interface WallpaperConfig {
  url: string;
  darkUrl?: string;
}

export interface ThemeUIStyles {
  header: string;
  pill: string;
  cardDefault: string;
}

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

export interface Section {
  id: string;
  label: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration?: number;
}

export type ComponentRegistry = Record<string, React.ComponentType<ComponentProps>>;

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  /** DeepSeek V4 思维链（推理过程），仅在 role='ai' 时有效 */
  reasoning?: string;

}

export type AIModel = 'DeepSeek Flash' | 'DeepSeek Pro';

export type ModelStatus = 'active' | 'coming-soon';

export type LocaleCode = 'zh-CN' | 'zh-TW' | 'zh-HK' | 'en-US' | 'fr-FR' | 'ru-RU' | 'es-ES' | 'ar-SA';

export interface LocaleOption {
  id: LocaleCode;
  label: string;
}

export interface AppMeta {
  version: string;
  appName: string;
}

export interface ThemeSystem {
  defaultTheme: string;
  presets: Record<string, ThemePreset>;
}

export interface AppConfig {
  meta: AppMeta;
  themeSystem: ThemeSystem;
  sections: Section[];
  stacks: CardStackConfig[];
}

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type MergePriority = 'base' | 'theme' | 'force';

export interface ForceConfig {
  id: string;
  label: string;
  glassMode: GlassMode;
  globalOverrides: DeepPartial<CardConfig>;
}

export interface ChatStreamRequest {
  model: AIModel;
  messages: ChatMessage[];
}

export interface ChatStreamCallbacks {
  onToken: (token: string, type: 'content' | 'reasoning') => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

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