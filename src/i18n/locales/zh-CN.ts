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
  },

  player: {
    noTrack: '暂无曲目',
    previous: '上一曲',
    next: '下一曲',
    play: '播放',
    pause: '暂停',
    close: '关闭播放器',
    open: '打开播放器',
  },

  cards: {},
};