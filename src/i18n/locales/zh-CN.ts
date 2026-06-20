/**
 * zh-CN (简体中文-中国大陆) 文案
 *
 * i18n 覆盖范围：
 * - 设置面板（语言选择、主题选择、玻璃开关、自定义背景、底部备案信息）
 * - AI 对话（输入框 placeholder、深度思考按钮、欢迎语、fallback 回复）
 * - 底栏导航（5个区块名称）
 * - 音乐播放器（无曲目提示）
 *
 * 卡片内容不在 i18n 范围内，由卡片配置文件单独管理。
 */
import type { LocaleStrings } from '../../types/config';

export const zhCN: LocaleStrings = {
  header: { title: 'Clay SpaceStation 3.0' },

  /** 底栏5个区块的中文名（2字缩写） */
  nav: {
    hero: '自我介绍',
    profile: '资料简介',
    attributes: '详细属性',
    network: '联系方式',
    history: '更新历史',
  },

  /** 设置面板全部文案 */
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

  /** AI 对话模块文案 */
  chat: {
    placeholder: '向ClaySeek提问……',
    deepThink: '深度思考',
    comingSoon: '即将支持',
    greeting: '你好你好！我是ClaySeek！很高兴认识你，有什么想问的，尽管问~',
    fallbackReply: '信号已接收，您的指令正在进行核心处理。感谢您参与 ClaySeek 交互实验。',
  },

  /** 音乐播放器文案 */
  player: {
    noTrack: '暂无曲目',
    previous: '上一曲',
    next: '下一曲',
    play: '播放',
    pause: '暂停',
    close: '关闭播放器',
    open: '打开播放器',
  },

  /** 卡片文案（占位，卡片不做 i18n） */
  cards: {},
};