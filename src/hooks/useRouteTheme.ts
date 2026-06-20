import type { LocaleCode } from '../types/config';
import { themePresets } from '../config/_base/themePresets';

interface RouteResult {
  theme: string;
  locale: LocaleCode;
}

/**
 * 解析主题和语言：
 * 1. 三级域名：crystal.claylark.com/zh-CN → theme=crystal, locale=zh-CN
 * 2. 路径参数：claylark.com/zh-CN/theme=crystal → theme=crystal, locale=zh-CN
 * 3. URL查询：claylark.com/?theme=crystal&locale=zh-CN
 * 4. 默认：theme=space, locale=zh-CN
 */
export function useRouteTheme(): RouteResult {
  let theme = 'space';
  let locale: LocaleCode = 'zh-CN';

  // 1. 三级域名
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const subdomain = parts.length >= 3 ? parts[0] : '';
  const themeIds = Object.values(themePresets).map(t => t.id);
  if (themeIds.includes(subdomain)) {
    theme = subdomain;
  }

  // 2. URL 路径第一段 (如 /zh-CN/...)
  const pathSegments = window.location.pathname.split('/').filter(s => s.length > 0);
  const validLocales: LocaleCode[] = ['zh-CN', 'zh-TW', 'zh-HK', 'en-US', 'fr-FR', 'ru-RU', 'es-ES', 'ar-SA'];
  if (pathSegments.length > 0 && validLocales.includes(pathSegments[0] as LocaleCode)) {
    locale = pathSegments[0] as LocaleCode;
  }

  // 3. URL 查询参数：?theme=crystal&locale=zh-CN
  const params = new URLSearchParams(window.location.search);
  if (params.get('theme')) {
    const t = params.get('theme')!;
    if (themeIds.includes(t)) {
      theme = t;
    }
  }
  if (params.get('locale')) {
    const l = params.get('locale')!;
    if (validLocales.includes(l as LocaleCode)) {
      locale = l as LocaleCode;
    }
  }

  return { theme, locale };
}