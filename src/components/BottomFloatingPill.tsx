import Icon from './Icon';
import { SVGIcons } from './SVGIcons';
import { themePresets } from '../config/_base/themePresets';
import { locales } from '../i18n/index';
import type { Track, LocaleCode } from '../types/config';

interface BottomFloatingPillProps {
  activeId: string;
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  isPlaying: boolean;
  isGlassUI: boolean;
  dispatch: (a: { type: string; payload: string }) => void;
  currentThemeId: string;
  isPlayerOpen: boolean;
  setIsPlayerOpen: (v: boolean) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  currentTrack: Track | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  locale: LocaleCode;
}

export default function BottomFloatingPill({
  activeId, isChatOpen, setIsChatOpen, isPlaying,
  isGlassUI, dispatch, currentThemeId,
  isPlayerOpen, setIsPlayerOpen, togglePlay, next, prev, currentTrack,
  locale,
}: BottomFloatingPillProps) {
  const t = locales[locale];
  const sections = Object.keys(t.nav);
  const themeUI = themePresets[currentThemeId]?.ui;

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] p-[6px] flex items-center justify-between rounded-[32px] w-[372px] max-w-[94vw] h-[64px] box-border transition-all duration-300
      ${isGlassUI
        ? (themeUI?.pill || '') + ' backdrop-blur-2xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]'
        : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Chat 切换 */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        title={isChatOpen ? '关闭 AI 对话' : '打开 AI 对话'}
        className={`w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center transition-all duration-300 select-none shadow-sm border active:scale-90 z-20
          ${isChatOpen ? 'bg-blue-600 text-white border-transparent shadow-[0_4px_12px_rgba(37,99,235,0.4)]' : 'bg-white/80 dark:bg-[#1a1a1a]/80 border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300'}`}
      >
        {isChatOpen ? (
          <Icon name="keyboard_arrow_down" className="text-[28px] animate-fade-in" />
        ) : (
          <div className="w-5 h-5 animate-fade-in"><SVGIcons.StarSparkle /></div>
        )}
      </button>

      {/* Nav / Player 双面板 */}
      <div className="flex-1 max-w-[244px] h-[52px] mx-[6px] relative overflow-hidden bg-black/5 dark:bg-[#000000]/50 rounded-[26px] border border-white/20 dark:border-white/5 box-border">
        {/* ---- 导航 ---- */}
        <nav className={`absolute inset-0 w-full h-full flex items-center justify-between p-[4px] transition-all duration-500 ease-in-out ${isPlayerOpen ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'}`}>
          {sections.map(id => {
            const isSelected = activeId === id;
            const label = (t.nav[id] || id) as string;
            return (
              <button
                key={id}
                onClick={(e) => {
                  e.preventDefault();
                  if (isChatOpen) setIsChatOpen(false);
                  dispatch({ type: 'NAVIGATE_SECTION', payload: id });
                }}
                title={label}
                className={`w-[44px] h-[44px] shrink-0 flex flex-col items-center justify-center rounded-full transition-all duration-300 select-none
                  ${isSelected
                    ? 'bg-white dark:bg-[#2a2a2a] text-blue-600 dark:text-blue-400 shadow-[0_4px_10px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.8)] scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
              >
                <span className="text-[10px] font-bold leading-[1.1] tracking-widest translate-x-[0.5px]">{label.slice(0, 2)}</span>
                <span className="text-[10px] font-bold leading-[1.1] tracking-widest translate-x-[0.5px]">{label.slice(2, 4)}</span>
              </button>
            );
          })}
        </nav>

        {/* ---- 播放器 ---- */}
        <div className={`absolute inset-0 w-full h-full flex items-center justify-between p-[5px] transition-all duration-500 ease-in-out ${isPlayerOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="flex-1 flex flex-col justify-center pl-2 min-w-0 text-left">
            <span className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight mb-[1px]">{currentTrack?.title || t.player.noTrack}</span>
            <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 truncate leading-tight">{currentTrack?.artist || ''}</span>
          </div>
          <div className="w-[36px] h-[36px] shrink-0 rounded-lg overflow-hidden border border-white/40 dark:border-[#333] shadow-sm mx-1.5">
            <img src={currentTrack?.cover || 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=100&h=100&fit=crop'} className="w-full h-full object-cover" alt="cover" />
          </div>
          <div className="flex items-center gap-1 shrink-0 pr-0.5">
            <button onClick={prev} title={t.player.previous} className="w-[28px] h-[28px] shrink-0 flex items-center justify-center rounded-full bg-white/50 dark:bg-[#222]/60 hover:bg-white dark:hover:bg-[#333] shadow-sm active:scale-95 transition-all text-gray-600 dark:text-gray-300 border border-transparent dark:border-white/5">
              <Icon name="skip_previous" className="text-[16px]" />
            </button>
            <button onClick={togglePlay} title={isPlaying ? t.player.pause : t.player.play} className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#222] shadow-sm hover:scale-105 active:scale-95 transition-all text-blue-600 dark:text-blue-400 border border-transparent dark:border-white/5">
              <Icon name={isPlaying ? "pause" : "play_arrow"} className="text-[18px]" />
            </button>
            <button onClick={next} title={t.player.next} className="w-[28px] h-[28px] shrink-0 flex items-center justify-center rounded-full bg-white/50 dark:bg-[#222]/60 hover:bg-white dark:hover:bg-[#333] shadow-sm active:scale-95 transition-all text-gray-600 dark:text-gray-300 border border-transparent dark:border-white/5">
              <Icon name="skip_next" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>

      {/* 音乐切换 */}
      <div className="w-[52px] h-[52px] shrink-0 z-20">
        <button
          onClick={() => setIsPlayerOpen(!isPlayerOpen)}
          title={isPlayerOpen ? t.player.close : t.player.open}
          className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 relative active:scale-90 shadow-sm border border-gray-200/50 dark:border-white/10
            ${isPlayerOpen ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-white' : 'bg-white/80 dark:bg-[#1a1a1a]/80 text-gray-700 dark:text-gray-300'}`}
        >
          {isPlayerOpen ? <Icon name="close" className="text-[22px]" /> : <Icon name="music_note" className={`text-[22px] ${isPlaying ? 'text-blue-600 dark:text-blue-400 animate-pulse' : ''}`} />}
          {isPlaying && !isPlayerOpen && (
            <div className="absolute inset-x-0 bottom-1.5 flex justify-center items-end gap-[1.5px] h-2.5 pointer-events-none">
              <span className="wave-bar w-[1.5px] bg-blue-500 rounded-full opacity-80"></span>
              <span className="wave-bar w-[1.5px] bg-blue-500 rounded-full opacity-80" style={{ animationDelay: '0.2s' }}></span>
              <span className="wave-bar w-[1.5px] bg-blue-500 rounded-full opacity-80" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}