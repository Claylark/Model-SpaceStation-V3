# 🚀 Model SpaceStation V3

> 配置驱动型个人空间站模板 | 卡片堆自由流式布局

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
- [卡片堆架构](#-卡片堆架构)
- [配置说明](#-配置说明)
- [主题切换](#-主题切换)
- [部署](#-部署)
- [许可](#-许可)

---

## 🌌 简介

**星壤空间站 V3** 是一个**配置驱动**的个人展示页面框架。核心创新是**卡片堆（Card Stack）**机制：

- 📦 **卡片堆**：类似 iOS 负一屏小组件的自由流式布局容器，内部卡片用 `flex flex-wrap` 自由排列
- 🧭 **导航绑定**：每个卡片堆绑定一个导航 Section，底部导航栏点击即可滚动到对应堆
- 🎨 **主题系统**：4 个主题预设，各自壁纸 + UI 样式，毛玻璃/实心双模式
- 🌐 **8 语言**：简体中文、繁体中文（台湾/香港）、English、Français、Русский、Español、العربية（RTL）
- 🤖 **AI 对话**：DeepSeek ChatBot 流式打字机效果
- 🎵 **音乐播放器**：内置歌单播放管理

> 💡 你不需要写 React 组件代码——只需编辑 `src/config/index.ts`，增删卡片堆和卡片即可。

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
| 多语言 | 自研 i18n | 8 语言（含 RTL） |
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
├── index.html                        # HTML 入口
├── package.json                      # 依赖与脚本
├── vite.config.ts                    # Vite 配置
├── tailwind.config.js                # Tailwind 配置
├── postcss.config.js                 # PostCSS 插件
├── tsconfig.json                     # TypeScript 配置
│
├── public/
│   └── favicon.svg                   # 网站图标
│
└── src/
    ├── main.tsx                      # React 挂载入口（含 RTL 初始化）
    ├── App.tsx                       # 主应用（背景/Header/Chat/卡片堆/BottomBar）
    │
    ├── types/
    │   └── config.ts                 # 全局类型定义（CardConfig/CardStackConfig/AppConfig…）
    │
    ├── config/                       # 配置中心（改这里就变页面）
    │   ├── _base/                    # 基础配置
    │   │   ├── themePresets.ts       # 主题预设
    │   │   ├── sections.ts           # 导航 Section 定义
    │   │   ├── playlist.ts           # 歌单
    │   │   └── cards/                # （已废弃，卡片现在内嵌在堆中）
    │   ├── merge.ts                  # 卡片/卡片堆深度合并引擎
    │   └── index.ts                  # 汇总导出 → APP_CONFIG（stacks 驱动）
    │
    ├── i18n/                         # 多语言
    │   ├── locales/                  # 8 种语言文件
    │   ├── rtl.ts                    # RTL 工具函数
    │   └── index.ts                  # i18n 入口（t() + setLocale() + setDocumentLocale()）
    │
    ├── registry/                     # 卡片组件注册
    │   ├── ComponentRegistry.ts      # 注册/获取组件
    │   └── components/
    │       ├── RichTextIntro.tsx     # 富文本介绍卡片
    │       ├── ElasticSpace.tsx      # 弹性空间卡片
    │       └── PlaceholderCard.tsx   # 占位卡片（默认模板用）
    │
    ├── components/                   # UI 组件
    │   ├── Header.tsx                # 顶栏 + 设置面板
    │   ├── AIChatModule.tsx          # AI 对话模块
    │   ├── BottomFloatingPill.tsx    # 底部导航栏 + 音乐播放器
    │   ├── Icon.tsx                  # Material Symbols 图标
    │   └── SVGIcons.tsx              # 星标 SVG 图标
    │
    ├── hooks/                        # 自定义 Hooks
    │   ├── useRouteTheme.ts          # 域名/URL 主题路由
    │   ├── useHorizontalScrollSpy.ts # 横向滚动监听（卡片堆视口检测）
    │   ├── useTheme.ts              # 主题状态管理
    │   ├── useChatStream.ts          # AI 流式聊天
    │   └── usePlaylist.ts           # 歌单播放管理
    │
    └── index.css                     # 全局样式 + Tailwind 指令 + RTL 样式
```

---

## 📦 卡片堆架构

```
<main> 横向滚动（snap-x snap-mandatory）
│
├── <section> 堆 1: stack-hero               ← snap 单元
│   └── flex flex-wrap gap-3 overflow-y-auto
│       ├── 卡片 A (w-1/2 h-48)
│       ├── 卡片 B (w-full h-32)
│       └── 卡片 C (w-1/3 h-40)
│
├── gap-5
│
├── <section> 堆 2: stack-profile-a          ← snap 单元
│   └── flex flex-wrap gap-3 overflow-y-auto
│       └── 卡片 D (w-full h-auto)
│
├── gap-5
│
├── <section> 堆 3: stack-profile-b          ← snap 单元（同 profile section）
│   └── ...
```

**关键约束：**
- 堆宽度：`w-[380px] max-w-[380px]`（≤6.67 英寸手机屏幕 375dp）
- 堆高度：`h-[calc(100vh-160px)]`
- 堆内布局：`flex flex-wrap` 自由排列 + `overflow-y-auto` 垂直滚动
- 堆间距：`w-5`（20px）
- 底部控制栏宽度：372px，与默认卡片宽度对齐

---

## ⚙️ 配置说明

### 配置体系

```
src/config/index.ts          ← APP_CONFIG（stacks 驱动）
    ↓
CardStackConfig[]             ← 卡片堆数组
    ↓ 每个堆包含
CardConfig[]                  ← 卡片数组
    ↓ 每张卡片
component + props             ← 组件名 + 组件参数
```

### 卡片堆配置

```ts
export interface CardStackConfig {
  id: string;              // 堆 DOM id，如 "stack-hero"
  sectionId: string;       // 绑定 Section（导航定位此 ID）
  visible: boolean;        // true=显示, false=占位
  stackWidth: string;      // 堆宽度 "w-[380px]"
  stackMaxWidth?: string;  // 最大宽度 "max-w-[380px]"
  gap?: string;            // 卡片间距 "gap-3"
  cards: CardConfig[];     // 堆内卡片列表
  themeOverrides?: Record<string, DeepPartial<CardStackConfig>>;
}
```

### 卡片配置

```ts
export interface CardConfig {
  id: string;              // 唯一 ID
  sectionId: string;       // 所属 Section
  visible: boolean;        // 可见性
  layout: { width: string; height: string; };  // 如 "w-full" "h-auto"
  visual: {
    glassMode?: 'default' | 'force-glass' | 'force-solid';
    font?: string;
    bg?: string;
  };
  body: {
    component: string;     // 注册的组件名，如 "PlaceholderCard"
    props: Record<string, unknown>;  // 组件参数
  };
  actions?: CardAction[];
  themeOverrides?: Record<string, DeepPartial<CardConfig>>;
}
```

---

## 🎨 主题系统

### 预设主题

| 主题 ID | 名称 | 说明 |
|---------|------|------|
| `space` | 星轨航线 | 默认主题，深空背景 |
| `crystal` | 水晶律动 | 水晶蓝紫渐变 |
| `solid` | 极简白昼 | 纯白实色，无毛玻璃 |
| `aurora` | 暗夜极光 | 暗色极光渐变 |

### 毛玻璃/实色切换

全局开关（Header 设置面板）：毛玻璃模式 vs 实色模式。
卡片级 `glassMode` 可覆盖：`force-glass`（强制毛玻璃）、`force-solid`（强制实色）、`default`（跟随全局）。

---

## 🔗 主题切换方式

| 方式 | 格式 | 优先级 |
|------|------|--------|
| 设置面板 | UI 点击 | 低 |
| URL 查询参数 | `?theme=crystal` | 中 |
| 三级域名 | `crystal.你的域名.com` | 最高 |

语言同理：`?locale=en-US`、路径或设置面板。

---

## 🚢 部署

### Cloudflare Pages（推荐）

1. 将项目推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 构建设置：Build command: `npm run build`，Output directory: `dist`
4. 环境变量：`VITE_DEEPSEEK_API_KEY`（可选）

### Vercel

1. 导入 GitHub 仓库，框架自动检测为 Vite
2. 环境变量同

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