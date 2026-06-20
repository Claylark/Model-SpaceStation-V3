# 🚀 Model SpaceStation V3

> 配置驱动型个人空间站模板 | 改 JSON 就能变页面

[![License](https://img.shields.io/badge/license-Claylark%20OSL-blue)](https://github.com/Claylark/Clay-SpaceStation/blob/main/License.md)
[![Vite](https://img.shields.io/badge/vite-8.x-purple)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-19.x-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-3178c6)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/tailwind-3.x-38bdf8)](https://tailwindcss.com/)

---

## 📖 目录

- [简介](#-简介)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [配置体系](#-配置体系)
  - [三层配置架构](#三层配置架构)
  - [卡片配置](#卡片配置)
  - [主题配置](#主题配置)
  - [歌单配置](#歌单配置)
  - [i18n 多语言配置](#i18n-多语言配置)
- [ChatBot 配置](#-chatbot-配置)
- [主题切换方式](#-主题切换方式)
- [部署](#-部署)
- [许可](#-许可)

---

## 🌌 简介

**星壤空间站 V3** 是一个**完全配置驱动**的个人展示页面框架。你不需要写 React 组件代码——只需编辑 `src/config/` 下的 `.ts` 配置文件，就能：

- 📋 新增/删除/修改卡片
- 🎨 切换/新增主题（每主题独立壁纸、UI 样式）
- 🌐 切换 8 种联合国工作语言（含阿拉伯语 RTL）
- 🎵 管理背景音乐歌单
- 🤖 接入 DeepSeek ChatBot（流式打字机效果）

> 💡 V3.5 将加入可视化编辑器。

---

## 🛠 技术栈

| 层 | 选型 | 版本 |
|---|------|------|
| 构建工具 | Vite | 8.x |
| 前端框架 | React | 19.x |
| 类型系统 | TypeScript | 5.x |
| 样式引擎 | Tailwind CSS | 3.x |
| 图标 | Material Symbols Rounded | Google Fonts CDN |
| 字体 | Google Sans Flex + Noto Sans SC | Google Fonts CDN |
| AI 对话 | DeepSeek API (SSE 流式) | V4 Flash |
| 多语言 | 自研 i18n | 8 语言 |
| 部署目标 | Cloudflare Pages / Vercel / 静态托管 | - |

---

## 🚀 快速开始

```bash
# 1. 克隆模板仓库
git clone https://github.com/Claylark/Model-SpaceStation-V3.git my-spacestation
cd my-spacestation

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# → http://localhost:5173

# 4. 生产构建
npm run build
# → dist/ 可直接部署
```

---

## 📂 项目结构

```
Model-SpaceStation-V3/
├── index.html                    # HTML 入口（Google Fonts + Material Icons CDN）
├── package.json                  # 依赖与脚本
├── vite.config.ts                # Vite 配置
├── tailwind.config.js            # Tailwind 字体与主题配置
├── postcss.config.js             # PostCSS 插件
├── tsconfig.json                 # TypeScript 配置
├── .env                          # 环境变量（DeepSeek API Key）
├── .gitignore                    # Git 忽略规则
│
├── public/
│   └── favicon.svg               # 网站图标
│
└── src/
    ├── main.tsx                  # React 挂载入口
    ├── App.tsx                   # 主应用（背景、卡片容器、组件组合）
    │
    ├── types/
    │   └── config.ts             # 🔧 全局 TypeScript 类型定义
    │
    ├── config/                   # 🎯 配置中心（改这里就变页面）
    │   ├── _base/                # 全局默认配置
    │   │   ├── themePresets.ts   # 4 个主题预设（含壁纸 URL）
    │   │   ├── sections.ts       # 5 个区块定义
    │   │   ├── playlist.ts       # 歌单
    │   │   ├── componentRegistry.ts  # 组件注册表
    │   │   └── cards/            # 每张卡片独立配置文件
    │   │       ├── hero-1.ts     # 富文本介绍卡
    │   │       ├── hero-2.ts     # 弹性空间卡
    │   │       ├── ghost-1.ts    # 幽灵卡（visible: false）
    │   │       └── ...           # 共 9 张卡片
    │   ├── themes/               # 主题专属覆写（只写差异）
    │   │   ├── space.ts          # 星轨航线
    │   │   ├── crystal.ts        # 水晶律动
    │   │   ├── solid.ts          # 极简白昼
    │   │   └── aurora.ts         # 暗夜极光
    │   ├── force/                # 强制配置（开关触发）
    │   │   ├── forceGlass.ts     # 强制液态玻璃
    │   │   └── forceSolid.ts     # 强制实色
    │   ├── merge.ts              # 三级合并引擎
    │   └── index.ts              # 汇总导出 → APP_CONFIG
    │
    ├── i18n/                     # 🌐 多语言
    │   ├── locales/
    │   │   ├── zh-CN.ts          # 简体中文-中国大陆
    │   │   ├── zh-TW.ts          # 繁体中文-中国台湾
    │   │   ├── zh-HK.ts          # 繁体中文-中国香港
    │   │   ├── en-US.ts          # English-United States
    │   │   ├── fr-FR.ts          # Français
    │   │   ├── ru-RU.ts          # Русский
    │   │   ├── es-ES.ts          # Español
    │   │   └── ar-SA.ts          # العربية (RTL)
    │   ├── rtl.ts                # RTL 工具函数
    │   └── index.ts              # i18n 入口（t() + setLocale()）
    │
    ├── registry/                 # 🧩 组件注册机
    │   ├── ComponentRegistry.ts  # 注册/获取组件
    │   └── components/
    │       ├── RichTextIntro.tsx # 富文本介绍卡片组件
    │       ├── ElasticSpace.tsx  # 弹性空间卡片组件
    │       └── PlaceholderCard.tsx # 占位卡片组件
    │
    ├── components/               # 🖼️ UI 组件
    │   ├── Icon.tsx              # Material Symbols 封装
    │   ├── SVGIcons.tsx          # 星标 SVG 图标
    │   ├── Header.tsx            # 顶栏 + 设置面板（含语言/主题切换）
    │   ├── AIChatModule.tsx      # AI 对话模块（流式输出）
    │   └── BottomFloatingPill.tsx # 底部导航栏 + 音乐播放器
    │
    ├── hooks/                    # 🪝 自定义 Hooks
    │   ├── useRouteTheme.ts      # 域名/URL 主题与语言路由
    │   ├── useHorizontalScrollSpy.ts # 横向滚动监听
    │   ├── useTheme.ts           # 主题状态管理
    │   ├── useChatStream.ts      # AI 流式聊天
    │   └── usePlaylist.ts        # 歌单播放管理
    │
    ├── services/                 # 🔌 API 服务层
    │   ├── apiClient.ts          # 统一请求客户端（预留）
    │   ├── chatApi.ts            # DeepSeek 流式 API
    │   ├── configApi.ts          # 配置 CRUD（预留）
    │   └── uploadApi.ts          # 文件上传（预留）
    │
    └── styles/
        └── index.css             # 全局样式 + Tailwind 指令 + RTL 样式
```

---

## ⚙️ 配置体系

### 三层配置架构

```
全局默认配置 (_base)           ← 卡片的"出厂设置"
    ↓ 被合并
主题专属覆写 (themes)          ← 每个主题可以改任意卡片的任意字段
    ↓ 被合并
强制配置 (force)              ← 开关触发（如"强制液态玻璃"）
    ↓
  resolveCardConfig() → 最终卡片
```

优先级：**force > theme override > base**

### 卡片配置

每张卡片是一个独立的 `.ts` 文件，位于 `src/config/_base/cards/`。

```ts
// src/config/_base/cards/hero-1.ts
export const hero1: CardConfig = {
  id: 'hero-1',           // 唯一 ID（对应 DOM id）
  sectionId: 'hero',      // 所属区块（hero/profile/attributes/network/history）
  visible: true,          // visible: false = 幽灵卡片（占位但不渲染内容）
  layout: {
    width: "w-[372px] max-w-[94vw]",
    height: "h-[35vh] min-h-[280px]",
  },
  visual: {
    glassMode: "default", // "default" | "force-glass" | "force-solid"
    font: "font-sans",    // 字体类
    bg: undefined,        // 自定义背景类（可选）
  },
  body: {
    component: "RichTextIntro",  // 组件名（在 registry 中注册）
    props: {                      // 传给组件的 props
      tag: "Introduction / 01",
      lines: ["你好你好", "我是", "很高兴跟你扩列鸭"],
      avatar: { name: "Claylark", src: "https://..." }
    },
  },
  actions: [                       // 底部按钮（可选）
    { label: "按钮文字", primary: true, action: { type: "NAVIGATE", payload: "sectionId" } },
  ],
  themeOverrides: {                // 主题覆写（只会覆写你指定的字段）
    crystal: {
      body: { props: { lines: ["水晶律动触发", ...] } }
    }
  }
};
```

**新增卡片步骤：**

1. 在 `src/config/_base/cards/` 创建新 `.ts` 文件
2. 在 `src/config/index.ts` 中导入并加入 `cards` 数组
3. 如需新组件，在 `registry/components/` 创建组件并注册

### 主题配置

每个主题在 `src/config/_base/themePresets.ts` 中定义：

```ts
{
  id: 'space',           // 主题 ID（对应三级域名、URL 参数）
  label: '星轨航线',      // 显示名称
  style: 'bg-[#f4f7fb] dark:bg-gradient-to-b...',  // 背景样式
  adaptiveLuminance: true,       // 是否跟随暗黑模式自适应亮度
  wallpaper: {
    url: 'https://images.unsplash.com/...',  // CDN 壁纸 URL
  },
  ui: {
    header: "bg-white/40...",    // 顶栏样式
    pill: "bg-white/50...",      // 底部导航条样式
    cardDefault: "bg-white/80...", // 卡片默认样式
  },
  domain: 'space',       // 三级域名前缀
}
```

**新增主题步骤：**

1. 在 `themePresets.ts` 添加新条目
2. 在 `src/config/themes/` 创建对应覆写文件（可选）
3. 新主题立即生效

### 歌单配置

编辑 `src/config/_base/playlist.ts`：

```ts
export const playlist: Track[] = [
  {
    id: '1',
    title: '星空协奏曲',
    artist: 'Space Ambient',
    cover: 'https://...',   // 封面图 CDN URL
    url: 'https://...',     // 音频文件 CDN URL
  },
  // 添加更多曲目...
];
```

### i18n 多语言配置

8 种语言文件位于 `src/i18n/locales/`，覆盖范围：
- 设置面板（标题、语言、主题等）
- 底栏导航（区块名称）
- AI 对话（输入框、按钮、欢迎语）
- 音乐播放器（播放/暂停/上下一曲）

**新增语言步骤：**

1. 复制 `zh-CN.ts` → 新语言文件
2. 翻译所有字段
3. 在 `src/i18n/index.ts` 中注册
4. 在 `src/types/config.ts` 的 `LocaleCode` 中添加语言代码
5. 在 `src/hooks/useRouteTheme.ts` 的 `validLocales` 中添加
6. 在 `src/components/Header.tsx` 的 `langOptions` 中添加

---

## 🤖 ChatBot 配置

### 开启 DeepSeek API（可选）

编辑 `.env` 文件：

```env
VITE_DEEPSEEK_API_KEY=sk-your-deepseek-api-key
```

- 不配置：ChatBot 使用本地 Mock 模式（模拟打字机效果）
- 配置后：真实调用 DeepSeek V4 Flash，流式输出

### 获取 API Key

1. 访问 [platform.deepseek.com](https://platform.deepseek.com/)
2. 注册并充值（费用极低）
3. 在 API Keys 页面创建新 Key

---

## 🔗 主题切换方式

| 方式 | 格式 | 示例 | 优先级 |
|------|------|------|--------|
| 设置面板 | UI 点击 | 点击设置 → 选择主题 | 低 |
| URL 查询参数 | `?theme=crystal` | `我的域名.com/?theme=crystal` | 中 |
| 三级域名 | `crystal.我的域名.com` | `crystal.claylark.com` | 最高 |

语言同理：`域名/zh-CN`、`?locale=en-US`、路径或设置面板。

---

## 🚢 部署

### Cloudflare Pages（推荐）

1. 将项目推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 构建设置：
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. 环境变量：`VITE_DEEPSEEK_API_KEY`（可选）

### Vercel

1. 导入 GitHub 仓库
2. 框架自动检测为 Vite
3. 环境变量同上

### 静态托管

```bash
npm run build
# 将 dist/ 目录上传到任意静态服务器
```

---

## 📄 许可

基于 [Claylark 开源软件使用许可协议](https://github.com/Claylark/Clay-SpaceStation/blob/main/License.md)

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/Claylark">Claylark</a></strong>
</p>