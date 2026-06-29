import { useState } from 'react';
import Icon from './Icon';
import { APP_CONFIG, themePresets } from '../config/index';
import { locales } from '../i18n/index';
import type { LocaleCode } from '../types/config';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  useCustomBg: boolean; setUseCustomBg: (v: boolean) => void;
  customBgUrl: string; setCustomBgUrl: (v: string) => void;
  customBgType: 'image' | 'video'; setCustomBgType: (v: 'image' | 'video') => void;
  isBgDark: boolean;
}

export default function Header({
  useCustomBg, setUseCustomBg,
  customBgUrl, setCustomBgUrl, customBgType: _customBgType, setCustomBgType,
  isBgDark,
}: HeaderProps) {
  const { state, dispatch } = useAppContext();
  const { locale, currentThemeId, isDark, isGlassUI } = state;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const t = locales[locale];

  const langOptions: { id: LocaleCode; label: string }[] = [
    { id: 'zh-CN', label: '简体中文-中国大陆' }, { id: 'zh-TW', label: '繁體中文-中国台灣' },
    { id: 'zh-HK', label: '繁體中文-中国香港' }, { id: 'en-US', label: 'English-United States' },
    { id: 'fr-FR', label: 'Français-France' }, { id: 'ru-RU', label: 'Русский' },
    { id: 'es-ES', label: 'Español-España' }, { id: 'ar-SA', label: 'العربية-السعودية' },
  ];

  const themePresetList = Object.values(themePresets);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
      setCustomBgType(file.type.startsWith('video/') ? 'video' : 'image');
      setUseCustomBg(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setCustomBgUrl(URL.createObjectURL(file));
      setCustomBgType(file.type.startsWith('video/') ? 'video' : 'image');
      setUseCustomBg(true);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full px-5 h-[68px] flex justify-between items-center backdrop-blur-xl border-b z-50 transition-colors duration-300 ${isGlassUI ? themePresets[currentThemeId]?.ui?.header || '' : 'bg-white/40 dark:bg-[#0a0a0a]/40 border-gray-200/50 dark:border-white/5'} ${isBgDark ? 'text-white' : 'text-gray-800'}`}>
        <div className="flex-shrink-0">
          <span dir="ltr" className="text-[18px] tracking-tight flex items-center select-none drop-shadow-sm">
            <span className="font-normal">{APP_CONFIG.meta.appNameShort}</span><span className="font-semibold ml-1.5">{APP_CONFIG.meta.stationName}</span><span className="ml-2 text-[10px] font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">{APP_CONFIG.meta.version}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => dispatch({ type: 'TOGGLE_DARK' })} title={isDark ? '浅色模式' : '深色模式'} className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm border ${isBgDark ? 'bg-[#1a1a1a]/80 text-white border-[#333]' : 'bg-white/80 text-gray-700 border-gray-200/50'}`}>
            <Icon name={isDark ? "light_mode" : "dark_mode"} className="text-[18px]" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} title={t.settings.title} className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm border ${isBgDark ? 'bg-[#1a1a1a]/80 text-white border-[#333]' : 'bg-white/80 text-gray-700 border-gray-200/50'}`}>
            <Icon name="settings" className="text-[18px]" />
          </button>
        </div>
      </header>

      {isSettingsOpen && <div className="fixed inset-0 z-[60] bg-transparent" onClick={() => setIsSettingsOpen(false)}></div>}

      <div id="settings-panel" className={`fixed top-0 right-0 bottom-0 w-[280px] max-w-[85vw] z-[70] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-l-[32px]
        ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isGlassUI
          ? 'bg-white/[0.02] dark:bg-black/[0.1] backdrop-blur-md saturate-[180%] border-l border-white/[0.35] dark:border-white/[0.12] shadow-[-15px_0_30px_-5px_rgba(0,0,0,0.02)]'
          : (isBgDark ? 'bg-[#121212] border-l border-[#2a2a2a] shadow-[-10px_0_30px_rgba(0,0,0,0.5)]' : 'bg-white border-l border-gray-200 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]')
        }`}>

        <div className={`flex justify-between items-center px-5 h-[68px] shrink-0 border-b ${isBgDark ? 'border-white/[0.1]' : 'border-black/[0.08]'}`}>
          <span className={`font-bold flex items-center gap-2 drop-shadow-sm ${isBgDark ? 'text-white' : 'text-gray-900'}`}>
            <Icon name="tune" className="text-[18px]" /> {t.settings.title}
          </span>
          <button onClick={() => setIsSettingsOpen(false)} title={t.player.close} className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm border ${isBgDark ? 'bg-white/5 text-gray-200 border-white/10' : 'bg-black/5 text-gray-700 border-black/5'}`}>
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col hide-scrollbar relative z-10">
          <div className="mb-6 flex flex-col relative z-[60]">
            <h3 className={`text-[11px] font-bold mb-3 uppercase tracking-widest flex items-center gap-1.5 opacity-80 pl-0.5 ${isBgDark ? 'text-white' : 'text-gray-900'}`}><Icon name="language" className="text-[14px]" /> {t.settings.language}</h3>
            <div className="w-full">
              <button onClick={() => setIsLangOpen(!isLangOpen)} title={t.settings.language} className={`flex items-center justify-between w-full h-10 border text-[12px] font-bold rounded-full pl-4 pr-3 py-2.5 outline-none shadow-sm backdrop-blur-md saturate-[180%] ${isBgDark ? 'bg-white/[0.06] border-white/[0.2] text-gray-200' : 'bg-black/[0.04] border-black/[0.1] text-gray-800'} ${isLangOpen ? 'shadow-md border-blue-400/50' : ''}`}>
                <span>{langOptions.find(o => o.id === locale)?.label}</span>
                <Icon name="expand_more" className={`text-[18px] text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className={`w-full mt-2 border rounded-[20px] shadow-xl overflow-hidden flex flex-col p-1.5 animate-fade-in-up backdrop-blur-xl saturate-[180%] ${isBgDark ? 'bg-white/[0.08] border-white/[0.15]' : 'bg-black/[0.03] border-black/[0.08]'}`}>
                  {langOptions.map(o => (
                    <button key={o.id} onClick={() => { dispatch({ type: 'SET_LOCALE', payload: o.id }); setIsLangOpen(false); }} title={o.label} className={`px-3 py-2.5 text-[12px] font-bold text-left rounded-[14px] transition-all ${locale === o.id ? 'bg-blue-600 text-white shadow-sm' : (isBgDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-800 hover:bg-black/5')}`}>{o.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-col">
            <h3 className={`text-[11px] font-bold mb-3 uppercase tracking-widest flex items-center gap-1.5 opacity-80 pl-0.5 ${isBgDark ? 'text-white' : 'text-gray-900'}`}><Icon name="palette" className="text-[14px]" /> {t.settings.theme}</h3>
            <div className="grid grid-cols-2 gap-3 p-1">
              {themePresetList.map((p) => {
                const isSelected = currentThemeId === p.id && !useCustomBg;
                return (
                  <div key={p.id} onClick={() => { setUseCustomBg(false); dispatch({ type: 'SET_THEME', payload: p.id }); }} title={p.label} className="flex flex-col items-center cursor-pointer group w-full">
                    <div className={`w-full aspect-[4/3] rounded-[14px] p-1.5 flex flex-col justify-between relative overflow-hidden border transition-all shadow-sm group-hover:scale-[1.02] ${p.style} ${isSelected ? 'ring-2 ring-blue-500 border-transparent' : (isBgDark ? 'border-white/10' : 'border-black/5')}`}>
                      <div className={`w-full h-1 rounded-full opacity-30 ${isBgDark ? 'bg-white' : 'bg-black'}`}></div>
                      <div className={`w-3/5 h-1/2 rounded-md mx-auto flex items-center justify-center ${p.previewCard}`}><div className="w-8 h-0.5 rounded-full bg-current opacity-20"></div></div>
                      <div className={`w-1/2 h-1 rounded-full mx-auto opacity-50 ${isBgDark ? 'bg-white' : 'bg-black'}`}></div>
                    </div>
                    <span className={`text-[11px] font-bold mt-1.5 truncate max-w-full select-none pl-0.5 ${isBgDark ? 'text-white' : 'text-gray-900'}`}>{p.label}</span>
                    <button className={`w-4 h-4 rounded-full border mt-1.5 flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-600 text-white scale-105' : (isBgDark ? 'border-white/30 hover:border-white/60' : 'border-gray-400 hover:border-gray-600')}`}>
                      {isSelected && <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <div className={`flex items-center justify-between pl-5 pr-4 h-11 rounded-full border shadow-sm ${isBgDark ? 'bg-white/5 border-white/5 text-white' : 'bg-black/5 border-transparent text-gray-900'}`}>
              <span className="text-[12px] font-bold flex items-center gap-1.5 select-none opacity-90"><Icon name="blur_on" className="text-[16px] text-blue-500" /> {t.settings.forceGlass}</span>
              <button onClick={() => dispatch({ type: 'TOGGLE_GLASS' })} title={t.settings.forceGlass} className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${isGlassUI ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isGlassUI ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col relative z-20">
            <h3 className={`text-[11px] font-bold mb-2.5 uppercase tracking-widest flex items-center gap-1.5 opacity-80 pl-0.5 ${isBgDark ? 'text-white' : 'text-gray-900'}`}><Icon name="dashboard_customize" className="text-[14px]" /> {t.settings.customBg}</h3>
            <div className={`flex items-center justify-between pl-5 pr-4 h-11 rounded-full border shadow-sm mb-3 ${isBgDark ? 'bg-white/5 border-white/5 text-white' : 'bg-black/5 border-transparent text-gray-900'}`}>
              <span className="text-[12px] font-bold flex items-center gap-1.5 select-none opacity-90"><Icon name="wallpaper" className="text-[16px] text-blue-500" /> {t.settings.customBg}</span>
              <button onClick={() => setUseCustomBg(!useCustomBg)} title={t.settings.customBg} className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${useCustomBg ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${useCustomBg ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <label onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-1.5 w-full border-2 border-dashed rounded-[20px] py-4 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98] backdrop-blur-md saturate-[180%] text-[12px] font-bold text-center ${isDragging ? 'border-blue-500 bg-blue-500/10 text-blue-600' : (isBgDark ? 'bg-white/[0.04] border-white/20 text-gray-200 hover:border-white/40' : 'bg-black/[0.02] border-black/10 text-gray-700 hover:border-black/20')}`}>
              <Icon name={isDragging ? "download" : "cloud_upload"} className={`text-[20px] ${isDragging ? 'animate-bounce' : 'text-blue-500'}`} />
              <div className="flex flex-col gap-0.5"><span>{customBgUrl ? t.settings.replaceBg : t.settings.uploadDesc}</span><span className="text-[10px] font-normal opacity-50">{t.settings.uploadHint}</span></div>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleBgUpload} />
            </label>
          </div>

          <div className={`mt-auto pt-4 border-t flex flex-col gap-2 text-[11px] font-medium relative z-[50] ${isBgDark ? 'border-white/[0.1] text-gray-400' : 'border-black/[0.08] text-gray-500'}`}>
            <div className="font-bold tracking-wide flex items-center justify-between"><span>{t.settings.footer}</span></div>
            <a href="https://github.com/Claylark/Clay-SpaceStation/blob/main/License.md" target="_blank" title={t.settings.license} className="text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1.5 py-0.5 text-[10.5px]"><Icon name="description" className="text-[14px]" /> {t.settings.license}</a>
            <a href="https://beian.miit.gov.cn/" target="_blank" title={t.settings.beian} className={`transition-colors flex items-center gap-1.5 py-0.5 ${isBgDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}><Icon name="shield" className="text-[14px]" /> {t.settings.beian}</a>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank" title={t.settings.policeBeian} className={`transition-colors flex items-center gap-1.5 py-0.5 ${isBgDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}><Icon name="local_police" className="text-[14px]" /> {t.settings.policeBeian}</a>
          </div>
        </div>
      </div>
    </>
  );
}