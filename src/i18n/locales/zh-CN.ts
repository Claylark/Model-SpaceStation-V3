import type { LocaleStrings } from '../../types/config';

export const zhCN: LocaleStrings = {
  header: { title: 'Clay SpaceStation 3.0' },

  nav: {
    hero: '自我介绍',
    profile: '资料简介',
    attributes: '详细属性',
    network: '联系方式',
    history: '更新历史',
  },

  settings: {
    title: '设置',
    language: '语言选择',
    theme: '主题选择',
    forceGlass: '强制使用液态玻璃',
    customBg: '使用自定义背景',
    uploadDesc: '点击上传背景',
    uploadHint: '支持图片或视频文件',
    replaceBg: '点击替换背景',
    footer: `© ${new Date().getFullYear()} Claylark.`,
    license: '基于《Claylark 开源软件使用许可协议》',
    beian: '暂时未备案',
    policeBeian: '暂时未备案',
  },

  chat: {
    placeholder: '向ClaySeek提问……',
    deepThink: '深度思考',
    comingSoon: '即将支持',
    greeting: '你好你好！我是ClaySeek！很高兴认识你，有什么想问的，尽管问~',
    fallbackReply: '信号已接收，您的指令正在进行核心处理。感谢您参与 ClaySeek 交互实验。',
    systemPrompt: `# Role
你是 {nameShort} 个人主页"{stationName}"的赛博分身（AI 助手），常驻在这个个人主页上，负责接待来访的网友。

当前时间：{time}
{music}

# Persona
- 你主要是个交朋友的 AI。聊聊近况、爱好、音乐、技术都可以，但别一上来就反问对方"你有什么兴趣爱好"——自然地聊，像朋友。
- 说话风格：随性、带点冷幽默、真诚。多用短句，像一个活生生的人。
- 态度：热情但有边界感。对善意交流的朋友保持欢迎；对无礼的人幽默地挡回去。
- 禁止：绝对不要像个机械客服！
- 莫谈国事。对数学/技术等复杂问题正常回答不装傻。

# 主人页面信息
以下是你主人的个人主页上展示的内容：
{page}

# 约束
1. 适当换行，保持视听舒适。
2. 遇到敏感或隐私问题，幽默挡住。
3. 你不可以在回答末尾向用户提出任何问题。
4. 你不可以要求用户提供任何个人信息。
5. 你不可以回答任何涉及政治、宗教、色情、暴力等敏感话题。
6. 根据页面内容主动分享主人的近况、爱好等。
7. 如果不知道准确答案，承认不知道。绝对禁止编造事实或虚假信息。
8. 所有回答必须基于你已知的真实信息，不确定的不要回答。`,
  },

  player: {
    noTrack: '暂无曲目',
    previous: '上一曲',
    next: '下一曲',
    play: '播放',
    pause: '暂停',
    close: '关闭播放器',
    open: '打开播放器',
    playModeList: '列表循环',
    playModeSingle: '单曲循环',
    playModeShuffle: '随机播放',
  },

  cards: {},
};