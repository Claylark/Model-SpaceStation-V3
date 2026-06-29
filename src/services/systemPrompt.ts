import { APP_CONFIG } from '../config/index';
import type { LocaleCode } from '../types/config';
import { locales } from '../i18n/index';

export function buildPageContext(): string {
  const lines: string[] = [];
  const stacks = APP_CONFIG.stacks;

  lines.push('【页面内容简介】');
  lines.push('');

  for (const stack of stacks) {
    const sectionLabel = stack.sectionId || '未知区块';
    lines.push(`## ${sectionLabel}`);

    for (const card of stack.cards) {
      if (!card.visible) continue;
      const props = card.body.props as Record<string, unknown>;
      const title = (props.title as string) || '';
      const subtitle = (props.subtitle as string) || '';
      const tag = (props.tag as string) || '';
      const list = (props.lines as string[]) || [];

      if (title) lines.push(`- ${title}`);
      if (subtitle && subtitle !== title) lines.push(`  ${subtitle}`);
      if (tag) lines.push(`  标签：${tag}`);
      for (const item of list) {
        lines.push(`  - ${item}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function buildSystemPrompt(currentTrackInfo: string, locale: LocaleCode = 'zh-CN'): string {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const pageContext = buildPageContext();
  const musicLine = currentTrackInfo ? `当前播放歌曲：${currentTrackInfo}` : '';
  const template = locales[locale].chat.systemPrompt || locales['zh-CN'].chat.systemPrompt;

  return template
    .replace('{nameShort}', APP_CONFIG.meta.appNameShort)
    .replace('{stationName}', APP_CONFIG.meta.stationName)
    .replace('{time}', now)
    .replace('{music}', musicLine)
    .replace('{page}', pageContext);
}