# 代码注释合集

> ⚠️ 本文件记录所有从源文件中剥离的注释。
> 如需修改对应源码逻辑，请先在本文件中按行号查找到对应注释上下文，
> 再回到无注释源码中定位修改位置。

---

## src/types/config.ts（32条注释）

```
Line 1-3:   // ==========================================
Line 4:     // 🎯 星壤空间站 V3 - 全局类型定义
Line 5:     // ==========================================
Line 7:     // ---- 卡片相关 ----
Line 9:     /** 卡片布局 */
Line 14:    /** 玻璃模式 */
Line 17:    /** 卡片视觉配置 */
Line 24:    /** 卡片动作 */
Line 34:    /** 组件 Props - 任意键值 */
Line 37:    /** 卡片内容体 */
Line 43:    /** 单张卡片完整配置 */
Line 55:    // ---- 卡片堆相关 ----
Line 57:    /** 卡片堆配置：类似 iOS 负一屏小组件的自由流式布局容器 */
Line 59:    id: string;              // 堆 DOM id
Line 60:    sectionId: string;       // 绑定 Section，导航通过此 ID 定位
Line 61:    stackWidth: string;      // 堆宽度，如 "w-[380px]"
Line 62:    stackMaxWidth?: string;  // 最大宽度，如 "max-w-[380px]"（≤6.67英寸手机屏 375dp）
Line 63:    gap?: string;            // 卡片间距 "gap-3"
Line 64:    cards: CardConfig[];     // 堆内卡片列表
Line 69:    // ---- 主题相关 ----
Line 71:    /** 壁纸配置 */
Line 77:    /** 主题 UI 样式类名 */
Line 84:    /** 主题预设 */
Line 97:    // ---- 区块相关 ----
Line 99:    /** 区块定义 */
Line 105:   // ---- 歌单相关 ----
Line 107:   /** 单首歌曲 */
Line 116:   // ---- 组件注册相关 ----
Line 118:   /** 组件注册表 */
Line 123:   // ---- 聊天相关 ----
Line 125:   /** 聊天消息 */
Line 130:   /** AI 模型 */
Line 133:   /** 模型状态 */
Line 136:   // ---- 应用配置 ----
Line 138:   /** 语言代码 */
Line 141:   /** 语言选项 */
Line 147:   /** 应用元信息 */
Line 152:   /** 主题系统 */
Line 159:   /** 完整应用配置 */
Line 168:   // ---- 工具类型 ----
Line 170:   /** 深度递归 Partial */
Line 174:   // ---- 合并引擎相关 ----
Line 176:   /** 合并优先级 */
Line 179:   /** 强制配置 */
Line 188:   // ---- API 服务相关 ----
Line 190:   /** Chat API 流式请求体 */
Line 195:   /** Chat API 流式回调 */
Line 204:   // ---- i18n 类型 ----
Line 206:   /** 文案结构 */
```

---

## src/App.tsx（28条注释）

```
Line 1-9:   /**
            * App.tsx - 星壤空间站 V3 主应用入口
            *
            * 职责：
            * - 初始化主题、语言、播放列表、ChatBot 等核心状态
            * - 渲染背景层（主题壁纸/自定义背景）
            * - 渲染 Header（顶栏+设置面板）、AIChatModule（AI 对话）、
            *   BottomFloatingPill（底栏导航+音乐播放器）
            * - 横向滚动卡片堆容器（卡片堆内部 flex-wrap 自由排列卡片）
            */
Line 31-33: // ==========================================
            // 🚫 DO NOT DELETE - 液态玻璃常量（三层兜底）
            // ==========================================
Line 50:    /** 当前语言状态（react state，切换会触发子组件重渲染） */
Line 53:    /** 切换语言时同时更新全局 i18n（html lang/dir）和本地 state */
Line 63:    // 路由主题优先级
Line 74:    // 路由语言同步到本地 state
Line 81:    // dark mode 初始化
Line 90:    // 背景亮度检测
Line 120:   /** 导航/动作分发 */
Line 124:        // 查找第一个匹配 sectionId 的堆
Line 142:   /** 滚轮横向滚动（在卡片堆之间切换） */
Line 177:   /** 解析卡片配置（base + theme override） */
Line 183:   /** 渲染单张卡片（堆内使用） */
Line 232-236:/**
             * 渲染堆占位符：保留 DOM 节点（id + 尺寸）用于 snap 定位，
             * 但不渲染内部卡片内容（惰性渲染优化）
             */
Line 250:        // 外层锁定 372px，维持和底部控制栏完美对齐，加上 relative 作为基准
Line 256:        {/* 负边距外扩容纳阴影 + mask-image 顶部底部分散过渡 + 卡片沉底 */}
Line 267:        {/* 底部垫片：为卡片阴影提供渲染空间 */}
Line 277:      {/* ---------- 背景层 ---------- */}
Line 289:      // 所有主题都显示壁纸
Line 301:      {/* ---------- 顶栏 + 设置面板 ---------- */}
Line 312:      {/* ---------- AI 对话 ---------- */}
Line 318:      {/* ---------- 卡片堆横向滚动区 ---------- */}
Line 335:      {/* ---------- 底栏导航+音乐播放器 ---------- */}
```

---

## src/hooks/usePlaylist.ts（1条注释）

```
Line 23:      // 播完后自动切到下一首，实现列表循环
```

---

## src/hooks/useChatStream.ts（16条注释）

```
Line 1-3:   /**
            * useChatStream - AI 流式聊天 Hook
            */
Line 14:    // 聊天消息列表，初始有一条 AI 问候语
Line 17:    // 是否正在接收流式输出（用于 UI 显示加载态、禁止重复发送）
Line 20:    // 用 ref 保存最新的 messages，避免 sendMessage 闭包捕获旧值
Line 22-24: /**
             * 发送消息到 AI
             */
Line 28:    // 记录发送前的消息列表快照，用于计算 AI 消息索引
Line 37:    // 同时追加用户消息和占位 AI 消息
Line 39:    // AI 消息在数组中的索引 = 追加前长度 + 1（跳过用户消息）
Line 41-43: /**
             * 安全更新 AI 消息文本的辅助函数
             */
Line 47:        // 防御性检查：确保索引有效且确实是 AI 消息
Line 52:        // DeepSeek V4 Flash 流式请求
Line 56:          [...prevMessages, userMsg],  // 传入对话历史 + 新用户消息
Line 63:          (token) => updateAi(t => t + token),   // 每收到一个 token 就追加
Line 64:          () => setIsStreaming(false),            // 流结束
Line 73:        // Gemini / GPT-4o 预留：模拟延迟后显示"即将支持"
Line 80:  }, []); // 空依赖：sendMessage 内部通过 ref 获取最新 messages
Line 86-89:    messages,       // ChatMessage[] - 所有聊天消息
              setMessages,    // React.Dispatch - 手动设置消息（用于清空等）
              isStreaming,    // boolean - 是否正在流式输出
              sendMessage,    // (content, model, isDeepThink) => void - 发送消息
```

---

## src/hooks/useHorizontalScrollSpy.ts（2条注释）

```
Line 1-2:   /**
            * 横向滚动监听：检测当前视口在哪个卡片堆
            */
Line 8:     /** 当前激活的堆在 stacks 数组中的索引（用于惰性渲染范围计算） */
```

---

## src/hooks/useRouteTheme.ts（4条注释）

```
Line 1-3:   /**
            * 解析主题和语言：
            */
Line 12:    // 1. 三级域名
Line 16:    // 2. URL 路径第一段 (如 /zh-CN/...)
Line 20:    // 3. URL 查询参数：?theme=crystal&locale=zh-CN
```

---

## src/config/merge.ts（9条注释）

```
Line 5-7:   /**
            * 深度合并：target 为基座，source 为覆写
            * 三级优先级：base → themeOverride → forceOverride
            */
Line 27-30: /**
             * 卡片堆深度合并
             * 合并堆级属性后，再对堆内每张卡片调用 mergeCardConfig
             */
Line 37:    // 合并堆级属性（stackWidth, stackMaxWidth, gap, sectionId, visible 等）
Line 42:    // 堆内卡片：按 id 匹配合并
Line 67:        // 按 id 智能合并：数组元素是含 id 的对象则按 id 深度合并，否则整体替换
```

---

## src/config/index.ts（1条注释）

```
Line 1:     /**
            * 默认卡片堆配置
            */
```

---

## src/config/_base/componentRegistry.ts（2条注释）

```
Line 1:     // 组件注册表：名字 → 组件映射
Line 3:     // 在 App.tsx 中初始化时会注入实际的 React 组件
```

---

## src/services/apiClient.ts（1行）

```
Line 1:     const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

---

## src/services/chatApi.ts（5条注释）

```
Line 1-2:   /**
            * DeepSeek V4 Flash 流式请求
            */
Line 6:     // 没有 API Key 时使用本地 mock 流式
Line 19:          // 跳过非 JSON 行
Line 27-28: /**
             * 本地 Mock 流式输出
             */
```

---

## src/services/uploadApi.ts（1条注释）

```
Line 1:     // 🔒 预留：文件上传接口
```

---

## src/services/configApi.ts（1条注释）

```
Line 1:     // 🔒 预留：配置 CRUD 接口
```

---

## src/i18n/index.ts（1条注释）

```
Line 1:     /** 设置文档级语言与 RTL 方向（不含 currentLocale 状态） */
```

---

## src/i18n/locales/zh-CN.ts（6条注释）

```
Line 1-3:   /**
            * zh-CN (简体中文-中国大陆) 文案
            */
Line 10:    /** 底栏5个区块的中文名（2字缩写） */
Line 22:    /** 设置面板全部文案 */
Line 47:    /** AI 对话模块文案 */
Line 63:    /** 音乐播放器文案 */
Line 80:    /** 卡片文案（占位，卡片不做 i18n） */
```

---

## src/main.tsx（1条注释）

```
Line 6:     // 初始化 RTL 方向设置
```

---

## src/components/Header.tsx（10条注释）

```
Line 28:      {/* ---------- 顶栏 ---------- */}
Line 33:          {/* 暗黑模式开关 */}
Line 36:          {/* 设置 */}
Line 39:      {/* 设置面板遮罩 */}
Line 42:      {/* ---------- 设置面板 ---------- */}
Line 48:        {/* 设置标题行 */}
Line 51:          {/* ---- 语言选择 ---- */}
Line 54:          {/* ---- 主题选择 ---- */}
Line 57:          {/* ---- 玻璃开关 ---- */}
Line 60:          {/* ---- 自定义背景 ---- */}
Line 66:          {/* ---- 底部备案 ---- */}
```

---

## src/components/AIChatModule.tsx（6条注释）

```
Line 9:      {/* 消息列表 */}
Line 11:     {/* 输入区 */}
Line 17:            {/* 模型选择 */}
Line 20:            {/* 深度思考 */}
Line 23:          {/* 发送按钮 */}
```

---

## src/components/BottomFloatingPill.tsx（5条注释）

```
Line 1:      {/* Chat 切换 */}
Line 5:        {/* ---- 导航 ---- */}
Line 8:        {/* ---- 播放器 ---- */}
Line 16:      {/* 音乐切换 */}
```

---

### src/App.tsx 新增 a11y 无障碍代码（无注释，此处说明）

```
Line 154-169: useEffect 写入 sessionStorage
  - locale 变化时遍历 APP_CONFIG.stacks，提取 title/subtitle/lines/tag
  - 写入 sessionStorage['A11Y_DATA']

Line 261-265: 幽灵锚点
  <a href="/a11y.html" className="sr-only focus:not-sr-only ...">
  跳转到纯文字介绍页

public/a11y.html：独立纯文字页
  - 从 sessionStorage 读取 A11Y_DATA
  - 按 h2 → h3 → p → ul 结构化输出所有卡片文字
  - 无 Header/AI/播放器/设置
  - 底部"返回主界面"回到 /
```

---

## src/index.css（7条注释/标题块）

```
Line 5-7:   /* ==========================================
               Global Styles - Clay SpaceStation V3
               ========================================== */
Line 43-45: /* ==========================================
               Music Wave Animation
               ========================================== */
Line 69-71: /* ==========================================
               Custom Animations
               ========================================== */
Line 97-99: /* ==========================================
               Selection Styling
               ========================================== */
Line 107-109:/* ==========================================
               RTL Support
               ========================================== */
Line 118:   /* 设置面板在 RTL 下从左边滑出，圆角在右边（远离屏幕边缘的一侧） */