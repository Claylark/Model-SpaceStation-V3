/**
 * App.tsx - 星壤空间站 V3 主应用入口
 *
 * 职责：
 * - 初始化主题、语言、播放列表、ChatBot 等核心状态
 * - 渲染背景层（主题壁纸/自定义背景）
 * - 渲染 Header（顶栏+设置面板）、AIChatModule（AI 对话）、
 *   BottomFloatingPill（底栏导航+音乐播放器）
 * - 横向滚动卡片容器（配置驱动的卡片渲染）
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { APP_CONFIG, themePresets } from './config/index';
import { mergeCardConfig } from './config/merge';
import { useHorizontalScrollSpy } from './hooks/useHorizontalScrollSpy';
import { useTheme } from './hooks/useTheme';
import { useRouteTheme } from './hooks/useRouteTheme';
import { usePlaylist } from './hooks/usePlaylist';
import { useChatStream } from './hooks/useChatStream';
import { setLocale as applyLocale } from './i18n/index';
import type { LocaleCode } from './types/config';
import RichTextIntro from './registry/components/RichTextIntro';
import ElasticSpace from './registry/components/ElasticSpace';
import PlaceholderCard from './registry/components/PlaceholderCard';
import Header from './components/Header';
import AIChatModule from './components/AIChatModule';
import BottomFloatingPill from './components/BottomFloatingPill';
import type { CardConfig } from './types/config';

// ==========================================
// 🚫 DO NOT DELETE - 液态玻璃常量（三层兜底）
// ==========================================
const THEME_DRIVEN_GLASS = (ui: { cardDefault: string }) =>
  `${ui.cardDefault} backdrop-blur-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)]`;
const ABSOLUTE_FALLBACK_GLASS =
  'bg-white/80 dark:bg-[#111111]/70 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] text-gray-900 dark:text-white';
const SOLID_MATERIAL =
  'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] shadow-[0_12px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] text-gray-900 dark:text-white';

export default function App() {
  const { theme: routeTheme, locale: routeLocale } = useRouteTheme();

  const {
    isDark, setIsDark, isGlassUI, setIsGlassUI,
    useCustomBg, setUseCustomBg, customBgUrl, setCustomBgUrl,
    customBgType, setCustomBgType, currentThemeId, setCurrentThemeId,
    isBgDark, setIsBgDark, toggleDarkMode,
  } = useTheme();

  /** 当前语言状态（react state，切换会触发子组件重渲染） */
  const [locale, setLocale] = useState<LocaleCode>(routeLocale);

  /** 切换语言时同时更新全局 i18n（html lang/dir）和本地 state */
  const handleLocaleChange = useCallback((newLocale: LocaleCode) => {
    setLocale(newLocale);
    applyLocale(newLocale);
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isPlaying, setIsPlaying: _setIsPlaying, togglePlay, next, prev, currentTrack, audioRef } = usePlaylist();
  const { messages, isStreaming, sendMessage } = useChatStream();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const scrollLockRef = useRef(false);

  // 路由主题优先级
  useEffect(() => {
    if (routeTheme && routeTheme !== currentThemeId) {
      setCurrentThemeId(routeTheme);
      if (routeTheme === 'solid') setIsGlassUI(false);
      else setIsGlassUI(true);
    }
  }, [routeTheme]);

  // 路由语言同步到本地 state
  useEffect(() => {
    if (routeLocale) {
      setLocale(routeLocale);
      applyLocale(routeLocale);
    }
  }, [routeLocale]);

  // dark mode 初始化
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // 背景亮度检测
  const handleBgLuminanceCheck = useCallback(() => {
    setTimeout(() => {
      if (!useCustomBg) {
        const theme = themePresets[currentThemeId];
        if (theme) {
          setIsBgDark(theme.adaptiveLuminance ? isDark : (theme.isDark ?? false));
        }
        return;
      }
      if (customBgUrl) {
        const bgNode = document.getElementById('main-bg-element') as HTMLImageElement | HTMLVideoElement | null;
        if (!bgNode) return;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 1; canvas.height = 1;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const w = (bgNode as HTMLVideoElement).videoWidth || (bgNode as HTMLImageElement).naturalWidth || bgNode.clientWidth || 100;
          const h = (bgNode as HTMLVideoElement).videoHeight || (bgNode as HTMLImageElement).naturalHeight || bgNode.clientHeight || 100;
          ctx.drawImage(bgNode, w * 0.7, 0, w * 0.3, h, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          setIsBgDark((0.2126 * r + 0.7152 * g + 0.0722 * b) < 145);
        } catch { /* ignore */ }
      }
    }, 500);
  }, [isDark, useCustomBg, customBgUrl, currentThemeId]);

  useEffect(() => { handleBgLuminanceCheck(); }, [handleBgLuminanceCheck]);

  /** 导航/动作分发 */
  const dispatchAction = useCallback((action: { type: string; payload: string }) => {
    switch (action.type) {
      case 'NAVIGATE':
      case 'NAVIGATE_SECTION': {
        const firstCard = APP_CONFIG.cards.find(c => c.sectionId === action.payload);
        if (firstCard) {
          const el = document.getElementById(firstCard.id);
          const container = document.getElementById('main-scroll-container');
          if (el && container) {
            container.style.scrollSnapType = 'none';
            const targetLeft = el.offsetLeft - (container.clientWidth / 2) + (el.clientWidth / 2);
            container.scrollTo({ left: targetLeft, behavior: 'smooth' });
            setTimeout(() => { container.style.scrollSnapType = ''; }, 600);
          }
        }
        break;
      }
    }
  }, []);

  /** 滚轮横向滚动 */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (scrollLockRef.current) return;
    const container = document.getElementById('main-scroll-container');
    if (!container) return;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let currentIndex = 0;
    let minDistance = Infinity;

    APP_CONFIG.cards.forEach((card, index) => {
      const el = document.getElementById(card.id);
      if (el) {
        const distance = Math.abs(scrollCenter - (el.offsetLeft + el.clientWidth / 2));
        if (distance < minDistance) { minDistance = distance; currentIndex = index; }
      }
    });

    let nextIndex = currentIndex;
    if (e.deltaY > 15) nextIndex = Math.min(currentIndex + 1, APP_CONFIG.cards.length - 1);
    else if (e.deltaY < -15) nextIndex = Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      scrollLockRef.current = true;
      const el = document.getElementById(APP_CONFIG.cards[nextIndex].id);
      if (el) {
        const targetLeft = el.offsetLeft - (container.clientWidth / 2) + (el.clientWidth / 2);
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
      setTimeout(() => { scrollLockRef.current = false; }, 600);
    }
  }, []);

  const activeSectionId = useHorizontalScrollSpy(APP_CONFIG.cards, 'main-scroll-container');

  /** 解析卡片配置（base + theme override） */
  const resolveCardConfig = useCallback((baseCard: CardConfig, themeId: string): CardConfig => {
    if (!baseCard.themeOverrides || !baseCard.themeOverrides[themeId]) return baseCard;
    return mergeCardConfig(baseCard, baseCard.themeOverrides[themeId]);
  }, []);

  /** 渲染单张卡片 */
  const renderCard = useCallback((rawCard: CardConfig) => {
    const card = resolveCardConfig(rawCard, currentThemeId);

    if (!card.visible) {
      return (
        <section id={card.id} key={card.id}
          className={`snap-center shrink-0 ${card.layout.width} ${card.layout.height} opacity-0 pointer-events-none select-none box-border`}>
        </section>
      );
    }

    const themeUI = themePresets[currentThemeId]?.ui;
    const glassMode = card.visual.glassMode || 'default';

    let finalBaseMaterial: string;
    if (glassMode === 'force-glass') {
      finalBaseMaterial = themeUI ? THEME_DRIVEN_GLASS(themeUI) : ABSOLUTE_FALLBACK_GLASS;
    } else if (glassMode === 'force-solid') {
      finalBaseMaterial = SOLID_MATERIAL;
    } else {
      finalBaseMaterial = isGlassUI
        ? (themeUI ? THEME_DRIVEN_GLASS(themeUI) : ABSOLUTE_FALLBACK_GLASS)
        : SOLID_MATERIAL;
    }

    let finalBgStyle = finalBaseMaterial;
    if (card.visual.bg) {
      finalBgStyle = (glassMode === 'force-glass' || (glassMode === 'default' && isGlassUI))
        ? `${card.visual.bg} backdrop-blur-3xl`
        : card.visual.bg;
    }

    const componentName = card.body.component;

    return (
      <section id={card.id} key={card.id}
        className={`snap-center shrink-0 ${card.layout.width} ${card.layout.height} relative box-border`}>
        <div className={`w-full h-full rounded-[32px] flex flex-col relative overflow-hidden transition-all duration-300 ${finalBgStyle} ${card.visual.font || 'font-sans'}`}>
          {componentName === 'RichTextIntro' && <RichTextIntro props={card.body.props} actions={card.actions} dispatch={dispatchAction} />}
          {componentName === 'ElasticSpace' && <ElasticSpace props={card.body.props} />}
          {componentName === 'PlaceholderCard' && <PlaceholderCard props={card.body.props} />}
        </div>
      </section>
    );
  }, [currentThemeId, isGlassUI, resolveCardConfig]);

  const presetStyle = themePresets[currentThemeId]?.style || '';

  return (
    <div className="w-full h-full flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/50 relative overflow-hidden">
      {/* ---------- 背景层 ---------- */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-500 overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ${useCustomBg ? '' : presetStyle}`}>
          {useCustomBg && customBgUrl ? (
            customBgType === 'video' ? (
              <video id="main-bg-element" src={customBgUrl} autoPlay loop muted playsInline
                onLoadedData={handleBgLuminanceCheck} className="w-full h-full object-cover scale-105 transition-opacity duration-500" />
            ) : (
              <img id="main-bg-element" src={customBgUrl} onLoad={handleBgLuminanceCheck}
                className="w-full h-full object-cover scale-105 transition-opacity duration-500" alt="Custom" />
            )
          ) : (
            // 所有主题都显示壁纸
            themePresets[currentThemeId]?.wallpaper?.url && (
              <img id="main-bg-element"
                src={themePresets[currentThemeId]!.wallpaper.url}
                className={`w-full h-full object-cover transition-opacity duration-500 scale-105 ${currentThemeId === 'space' ? 'opacity-20 dark:opacity-80' : ''}`}
                alt="Wallpaper" />
            )
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent dark:from-black/20 transition-colors duration-500"></div>
      </div>

      {/* ---------- 顶栏 + 设置面板 ---------- */}
      <Header
        isGlassUI={isGlassUI} setIsGlassUI={setIsGlassUI}
        useCustomBg={useCustomBg} setUseCustomBg={setUseCustomBg}
        customBgUrl={customBgUrl} setCustomBgUrl={setCustomBgUrl}
        customBgType={customBgType} setCustomBgType={setCustomBgType}
        isBgDark={isBgDark} currentThemeId={currentThemeId} setCurrentThemeId={setCurrentThemeId}
        isDark={isDark} toggleDarkMode={toggleDarkMode}
        locale={locale} onLocaleChange={handleLocaleChange}
      />

      {/* ---------- AI 对话 ---------- */}
      <AIChatModule isChatOpen={isChatOpen} isGlassUI={isGlassUI}
        messages={messages} isStreaming={isStreaming}
        sendMessage={sendMessage} locale={locale}
      />

      {/* ---------- 卡片横向滚动区 ---------- */}
      <main id="main-scroll-container" onWheel={handleWheel}
        className={`fixed top-0 bottom-0 left-0 w-full flex flex-row items-end overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar mask-image-top pb-[112px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isChatOpen ? 'opacity-0 -z-10 scale-95 blur-md pointer-events-none' : 'opacity-100 z-40 scale-100 blur-0 pointer-events-auto'}`}>
        <div className="shrink-0" style={{ width: 'calc(50vw - min(186px, 47vw))' }}></div>
        {APP_CONFIG.cards.map((card, idx) => (
          <div key={card.id} className="contents">
            {renderCard(card)}
            {idx < APP_CONFIG.cards.length - 1 && <div className="shrink-0 w-5"></div>}
          </div>
        ))}
        <div className="shrink-0" style={{ width: 'calc(50vw - min(186px, 47vw))' }}></div>
      </main>

      {/* ---------- 底栏导航+音乐播放器 ---------- */}
      <BottomFloatingPill
        activeId={activeSectionId} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}
        isPlaying={isPlaying} isGlassUI={isGlassUI} dispatch={dispatchAction}
        currentThemeId={currentThemeId}
        isPlayerOpen={isPlayerOpen} setIsPlayerOpen={setIsPlayerOpen}
        togglePlay={togglePlay} next={next} prev={prev}
        currentTrack={currentTrack} audioRef={audioRef}
        locale={locale}
      />
    </div>
  );
}