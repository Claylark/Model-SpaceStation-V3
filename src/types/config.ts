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

export interface PropSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'image' | 'select' | 'color' | 'text';
    label: string;
    default?: unknown;
    options?: string[];
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
  version?: string;
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

export interface RegistryEntry {
  component: React.ComponentType<any>;
  schema: PropSchema;
}

export type ComponentRegistry = Record<string, RegistryEntry>;

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
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
  appNameShort: string;
  stationName: string;
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

export type PlayMode = 'list' | 'single' | 'shuffle';

export type AppAction =
  | { type: 'NAVIGATE_SECTION'; payload: string }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'TOGGLE_PLAYER' }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LOCALE'; payload: LocaleCode }
  | { type: 'TOGGLE_DARK' }
  | { type: 'TOGGLE_GLASS' }
  | { type: 'TOGGLE_PLAY_MODE' };

export interface ActionMeta {
  label: string;
  needsPayload: boolean;
  payloadHint?: string;
}

export const ACTION_CATALOG: Record<string, ActionMeta> = {
  NAVIGATE_SECTION: { label: '跳转版块', needsPayload: true, payloadHint: 'sectionId' },
  TOGGLE_PLAY: { label: '播放/暂停', needsPayload: false },
  NEXT_TRACK: { label: '下一首', needsPayload: false },
  PREV_TRACK: { label: '上一首', needsPayload: false },
  TOGGLE_CHAT: { label: '打开/关闭 AI 对话', needsPayload: false },
  TOGGLE_PLAYER: { label: '打开/关闭 播放器', needsPayload: false },
  SET_THEME: { label: '切换主题', needsPayload: true, payloadHint: 'themeId' },
  SET_LOCALE: { label: '切换语言', needsPayload: true, payloadHint: 'localeCode' },
  TOGGLE_DARK: { label: '切换暗黑模式', needsPayload: false },
  TOGGLE_GLASS: { label: '切换毛玻璃', needsPayload: false },
};

export interface AppContextValue {
  state: AppContextState;
  dispatch: (action: AppAction) => void;
  sendMessage: (content: string, model: AIModel, isDeepThink: boolean, locale: LocaleCode, currentTrackInfo?: string) => void;
  updateCardProps: (cardId: string, key: string, value: unknown) => void;
  moveCard: (cardId: string, sourceStackId: string, targetStackId: string, targetIndex: number) => void;
  deleteCard: (cardId: string) => void;
}

export interface AppContextState {
  locale: LocaleCode;
  currentThemeId: string;
  isDark: boolean;
  isGlassUI: boolean;
  isChatOpen: boolean;
  isPlayerOpen: boolean;
  isPlaying: boolean;
  currentTrack: Track | null;
  playMode: PlayMode;
  messages: ChatMessage[];
  isStreaming: boolean;
  activeSectionId: string;
  isDesignMode: boolean;
  isBgDark: boolean;
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
    systemPrompt: string;
  };
  player: {
    noTrack: string;
    previous: string;
    next: string;
    play: string;
    pause: string;
    close: string;
    open: string;
    playModeList: string;
    playModeSingle: string;
    playModeShuffle: string;
  };
  cards: Record<string, Record<string, string>>;
}