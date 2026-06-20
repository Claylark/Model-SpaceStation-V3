import type { LocaleCode, LocaleStrings } from '../types/config';
import { zhCN } from './locales/zh-CN';
import { zhTW } from './locales/zh-TW';
import { zhHK } from './locales/zh-HK';
import { enUS } from './locales/en-US';
import { frFR } from './locales/fr-FR';
import { ruRU } from './locales/ru-RU';
import { esES } from './locales/es-ES';
import { arSA } from './locales/ar-SA';
import { isRTL, getDir } from './rtl';

const locales: Record<LocaleCode, LocaleStrings> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'zh-HK': zhHK,
  'en-US': enUS,
  'fr-FR': frFR,
  'ru-RU': ruRU,
  'es-ES': esES,
  'ar-SA': arSA,
};

let currentLocale: LocaleCode = 'zh-CN';

/** 设置文档级语言与 RTL 方向（不含 currentLocale 状态） */
export function setDocumentLocale(locale: LocaleCode): void {
  document.documentElement.lang = locale;
  document.documentElement.dir = getDir(locale);
}

export function setLocale(locale: LocaleCode): void {
  currentLocale = locale;
  setDocumentLocale(locale);
}

export function getLocale(): LocaleCode {
  return currentLocale;
}

export function t(key: string, fallback?: string): string {
  const keys = key.split('.');
  let result: unknown = locales[currentLocale];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return fallback ?? key;
    }
  }

  return typeof result === 'string' ? result : fallback ?? key;
}

export { isRTL, getDir, locales };