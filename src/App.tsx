import { useEffect, useRef, useCallback } from 'react';
import { APP_CONFIG, themePresets } from './config/index';
import { mergeCardConfig } from './config/merge';
import { useTheme } from './hooks/useTheme';
import { usePlaylist } from './hooks/usePlaylist';
import { useRouteTheme } from './hooks/useRouteTheme';
import { AppProvider, useAppContext } from './context/AppContext';
import componentRegistry from './config/_base/componentRegistry';
import type { LocaleCode, AIModel } from './types/config';
import CardErrorBoundary from './components/CardErrorBoundary';
import Header from './components/Header';
import AIChatModule from './components/AIChatModule';
import BottomFloatingPill from './components/BottomFloatingPill';
import type { CardConfig, CardStackConfig } from './types/config';

const THEME_DRIVEN_GLASS = (ui: { cardDefault: string }) =>
  `${ui.cardDefault} backdrop-blur-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)]`;
const ABSOLUTE_FALLBACK_GLASS =
  'bg-white/80 dark:bg-[#111111]/70 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] text-gray-900 dark:text-white';
const SOLID_MATERIAL =
  'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] shadow-[0_12px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] text-gray-900 dark:text-white';

function AppShell() {
  const { state, dispatch, sendMessage } = useAppContext();
  const { locale, currentThemeId, isDark, isGlassUI, isChatOpen, activeSectionId } = state;
  const { useCustomBg, setUseCustomBg, customBgUrl, setCustomBgUrl, customBgType, setCustomBgType, isBgDark, setIsBgDark } = useTheme();
  const { audioRef } = usePlaylist();
  const { theme: routeTheme } = useRouteTheme();
  const scrollLockRef = useRef(false);

  useEffect(() => {
    if (routeTheme && routeTheme !== currentThemeId) {
      dispatch({ type: 'SET_THEME', payload: routeTheme });
    }
  }, [routeTheme, currentThemeId, dispatch]);

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
        } catch { }
      }
    }, 500);
  }, [isDark, useCustomBg, customBgUrl, currentThemeId]);

  useEffect(() => { handleBgLuminanceCheck(); }, [handleBgLuminanceCheck]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (scrollLockRef.current) return;
    const container = document.getElementById('main-scroll-container');
    if (!container) return;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let currentIndex = 0;
    let minDistance = Infinity;

    APP_CONFIG.stacks.forEach((stack, index) => {
      const el = document.getElementById(stack.id);
      if (el) {
        const distance = Math.abs(scrollCenter - (el.offsetLeft + el.clientWidth / 2));
        if (distance < minDistance) { minDistance = distance; currentIndex = index; }
      }
    });

    let nextIndex = currentIndex;
    if (e.deltaY > 15) nextIndex = Math.min(currentIndex + 1, APP_CONFIG.stacks.length - 1);
    else if (e.deltaY < -15) nextIndex = Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      scrollLockRef.current = true;
      const el = document.getElementById(APP_CONFIG.stacks[nextIndex].id);
      if (el) {
        const targetLeft = el.offsetLeft - (container.clientWidth / 2) + (el.clientWidth / 2);
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
      setTimeout(() => { scrollLockRef.current = false; }, 600);
    }
  }, []);

  useEffect(() => {
    const a11yData = {
      stacks: APP_CONFIG.stacks.map(s => ({
        id: s.id,
        sectionId: s.sectionId,
        cards: s.cards.map(c => ({
          id: c.id,
          title: (c.body.props as Record<string, unknown>)?.title as string || '',
          subtitle: (c.body.props as Record<string, unknown>)?.subtitle as string || '',
          lines: (c.body.props as Record<string, unknown>)?.lines as string[] || [],
          tag: (c.body.props as Record<string, unknown>)?.tag as string || '',
        }))
      })),
    };
    sessionStorage.setItem('A11Y_DATA', JSON.stringify(a11yData));
  }, [locale]);

  const resolveCardConfig = useCallback((baseCard: CardConfig, themeId: string): CardConfig => {
    if (!baseCard.themeOverrides || !baseCard.themeOverrides[themeId]) return baseCard;
    return mergeCardConfig(baseCard, baseCard.themeOverrides[themeId]);
  }, []);

  const renderCard = useCallback((rawCard: CardConfig) => {
    const card = resolveCardConfig(rawCard, currentThemeId);

    if (!card.visible) {
      return (
        <div key={card.id}
          className={`${card.layout.width} ${card.layout.height} opacity-0 pointer-events-none select-none`}>
        </div>
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
    const entry = componentRegistry[componentName];
    const CardComponent = entry?.component;

    return (
      <div key={card.id}
        className={`${card.layout.width} ${card.layout.height} relative box-border`}>
        <div className={`w-full h-full rounded-[32px] flex flex-col relative overflow-hidden transition-all duration-300 transform-gpu ${finalBgStyle} ${card.visual.font || 'font-sans'}`}>
          <CardErrorBoundary cardId={card.id}>
            {CardComponent ? (
              <CardComponent props={card.body.props} actions={card.actions} dispatch={dispatch} />
            ) : (
              <div className="p-4 text-[12px] text-gray-400 italic">Unknown component: {componentName}</div>
            )}
          </CardErrorBoundary>
        </div>
      </div>
    );
  }, [currentThemeId, isGlassUI, resolveCardConfig, dispatch]);

  const renderStackPlaceholder = useCallback((stack: CardStackConfig) => (
    <section id={stack.id} key={stack.id}
      className={`snap-center shrink-0 ${stack.stackWidth} ${stack.stackMaxWidth || ''} h-[calc(100dvh-160px)] box-border`}>
    </section>
  ), []);

  const renderStack = useCallback((stack: CardStackConfig) => {
    if (!stack.visible) {
      return (
        <section id={stack.id} key={stack.id}
          className={`snap-center shrink-0 ${stack.stackWidth} ${stack.stackMaxWidth || ''} h-[calc(100dvh-160px)] opacity-0 pointer-events-none select-none box-border`}>
        </section>
      );
    }

    return (
      <section id={stack.id} key={stack.id}
        className={`snap-center shrink-0 ${stack.stackWidth} ${stack.stackMaxWidth || ''} h-[calc(100dvh-160px)] relative box-border`}>

        <div
          className={`absolute -inset-x-10 -inset-y-8 px-10 pt-8 flex flex-wrap content-end ${stack.gap || 'gap-4'} overflow-y-auto hide-scrollbar`}
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)'
          }}
        >
          {stack.cards.map((card) => renderCard(card))}

          <div className="w-full h-8 shrink-0 pointer-events-none"></div>
        </div>
      </section>
    );
  }, [renderCard]);

  const presetStyle = themePresets[currentThemeId]?.style || '';

  return (
    <>
    <a href="/a11y.html"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-bold">
      跳转到纯文字介绍页
    </a>
    <div className="w-full h-full flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/50 relative overflow-hidden">
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

      <Header
        useCustomBg={useCustomBg} setUseCustomBg={setUseCustomBg}
        customBgUrl={customBgUrl} setCustomBgUrl={setCustomBgUrl}
        customBgType={customBgType} setCustomBgType={setCustomBgType}
        isBgDark={isBgDark}
      />

      <AIChatModule />

      <main id="main-scroll-container" onWheel={handleWheel}
        className={`fixed top-0 bottom-0 left-0 w-full flex flex-row items-end overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar mask-image-top pb-[112px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isChatOpen ? 'opacity-0 -z-10 scale-95 blur-md pointer-events-none' : 'opacity-100 z-40 scale-100 blur-0 pointer-events-auto'}`}>
        <div className="shrink-0" style={{ width: 'calc(50vw - min(186px, 47vw))' }}></div>
        {APP_CONFIG.stacks.map((stack, idx) => {
          const activeStackIndex = APP_CONFIG.stacks.findIndex(s => s.sectionId === activeSectionId);
          const isInViewport = Math.abs(idx - activeStackIndex) <= 2;
          return (
            <div key={stack.id} className="contents">
              {isInViewport ? renderStack(stack) : renderStackPlaceholder(stack)}
              {idx < APP_CONFIG.stacks.length - 1 && <div className="shrink-0 w-5"></div>}
            </div>
          );
        })}
        <div className="shrink-0" style={{ width: 'calc(50vw - min(186px, 47vw))' }}></div>
      </main>

      <BottomFloatingPill audioRef={audioRef} />
    </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider stacks={APP_CONFIG.stacks} containerId="main-scroll-container">
      <AppShell />
    </AppProvider>
  );
}