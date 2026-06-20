const RTL_LOCALES: string[] = ['ar-SA'];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale);
}

export function getDir(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}