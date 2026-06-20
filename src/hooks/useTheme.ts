import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [isGlassUI, setIsGlassUI] = useState(true);
  const [useCustomBg, setUseCustomBg] = useState(false);
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [customBgType, setCustomBgType] = useState<'image' | 'video'>('image');
  const [currentThemeId, setCurrentThemeId] = useState('space');
  const [isBgDark, setIsBgDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      next ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return {
    isDark, setIsDark, isGlassUI, setIsGlassUI,
    useCustomBg, setUseCustomBg, customBgUrl, setCustomBgUrl,
    customBgType, setCustomBgType, currentThemeId, setCurrentThemeId,
    isBgDark, setIsBgDark, toggleDarkMode,
  };
}