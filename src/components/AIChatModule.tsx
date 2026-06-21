import { useState } from 'react';
import Icon from './Icon';
import type { ChatMessage, AIModel, LocaleCode } from '../types/config';
import { locales } from '../i18n/index';

interface AIChatModuleProps {
  isChatOpen: boolean;
  isGlassUI: boolean;
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (content: string, model: AIModel, isDeepThink: boolean) => void;
  locale: LocaleCode;
}

export default function AIChatModule({ isChatOpen, isGlassUI, messages, isStreaming, sendMessage, locale }: AIChatModuleProps) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<AIModel>('DeepSeek');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);

  const t = locales[locale].chat;

  const models: { id: AIModel; label: string; status: string }[] = [
    { id: 'DeepSeek', label: 'DeepSeek', status: 'active' },
    { id: 'Gemini', label: 'Gemini', status: 'coming-soon' },
    { id: 'GPT-4o', label: 'GPT-4o', status: 'coming-soon' },
  ];

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim(), model, isDeepThink);
    setInput('');
  };

  return (
    <div className={`fixed top-[68px] bottom-[112px] left-0 w-full flex flex-col items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
      ${isChatOpen ? 'z-[45]' : '-z-10 pointer-events-none'}`}
    >
      <div className={`w-[372px] max-w-[94vw] flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-4 px-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isChatOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="mt-auto flex flex-col justify-end">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex w-full mb-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-[20px] text-[13px] leading-relaxed transition-all duration-300 animate-fade-in-up
                ${m.role === 'user' ? 'rounded-br-[6px]' : 'rounded-bl-[6px]'}
                ${m.role === 'user'
                  ? (isGlassUI
                    ? 'bg-blue-500/[0.25] dark:bg-blue-500/[0.35] backdrop-blur-md saturate-[180%] text-blue-950 dark:text-blue-100 border border-blue-400/40 shadow-sm'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 border border-blue-200 dark:border-blue-900/50 shadow-sm')
                  : (isGlassUI
                    ? 'bg-white/[0.05] dark:bg-black/[0.2] backdrop-blur-md saturate-[180%] text-gray-800 dark:text-gray-200 border border-white/[0.35] dark:border-white/[0.12] shadow-sm'
                    : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-800 dark:text-gray-200 shadow-sm')
                }`}
              >
                {m.text}{m.role === 'ai' && isStreaming && idx === messages.length - 1 && <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse align-text-bottom" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`shrink-0 w-[372px] max-w-[94vw] h-[15vh] min-h-[140px] rounded-[32px] flex flex-col p-4 box-border transition-all duration-500 delay-75
        ${isChatOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}
        ${isGlassUI
          ? 'bg-blue-500/[0.02] dark:bg-blue-500/[0.06] backdrop-blur-md saturate-[180%] border border-white/[0.35] dark:border-white/[0.12] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]'
          : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] shadow-[0_15px_35px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
        }`}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={t.placeholder}
          title={t.placeholder}
          className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-500 overflow-y-auto hide-scrollbar leading-relaxed pl-1"
        ></textarea>

        <div className="flex justify-between items-center mt-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center overflow-visible">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title={`选择模型: ${model}`}
                className={`flex items-center justify-between w-[96px] h-9 border text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-full pl-3.5 pr-2 py-1.5 outline-none shadow-sm hover:shadow-md transition-all active:scale-95 z-20 overflow-visible
                  ${isGlassUI ? 'bg-white/[0.05] dark:bg-black/[0.2] backdrop-blur-md saturate-[180%] border-white/[0.35] dark:border-white/[0.12]' : 'bg-gray-50 dark:bg-[#222] border-gray-200 dark:border-[#333]'}`}
              >
                <span>{model}</span>
                <Icon name="expand_more" className={`text-[16px] text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className={`absolute bottom-[calc(100%+8px)] left-0 w-[120px] border rounded-[16px] z-50 overflow-hidden flex flex-col p-1 animate-fade-in-up
                    ${isGlassUI
                      ? 'bg-white/[0.08] dark:bg-black/[0.2] backdrop-blur-2xl saturate-[180%] border-white/[0.35] dark:border-white/[0.12] shadow-xl'
                      : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] shadow-xl'}`}>
                    {models.map(m => (
                      <button key={m.id} onClick={() => { if (m.status === 'active') { setModel(m.id); setIsDropdownOpen(false); } }}
                        title={m.status === 'active' ? `切换到 ${m.label}` : t.comingSoon}
                        className={`px-3 py-2 text-[11px] font-bold text-left rounded-[12px] transition-all duration-200 ${model === m.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'}`}>
                        {m.label}{m.status === 'coming-soon' && <span className="text-[9px] ml-1 opacity-50">（{t.comingSoon}）</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsDeepThink(!isDeepThink)}
              title={t.deepThink}
              className={`flex items-center justify-center gap-1.5 h-9 border text-[11px] font-bold rounded-full pl-3 pr-3.5 outline-none shadow-sm transition-all active:scale-95
                ${isDeepThink
                  ? (isGlassUI ? 'bg-blue-600/90 backdrop-blur-md border-blue-400/30 text-white shadow-sm' : 'bg-blue-600 border-transparent text-white')
                  : (isGlassUI
                    ? 'bg-white/[0.05] dark:bg-black/[0.2] text-gray-700 dark:text-gray-300 backdrop-blur-md saturate-[180%] border-white/[0.35] dark:border-white/[0.12] hover:shadow-md'
                    : 'bg-gray-50 dark:bg-[#222] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#333] hover:shadow-md'
                  )
                }`}
            >
              <Icon name="bolt" className={`text-[16px] ${isDeepThink ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              <span>{t.deepThink}</span>
            </button>
          </div>

          <button onClick={handleSend}
            title="发送消息"
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all duration-300
              ${input.trim().length > 0
                ? (isGlassUI ? 'bg-blue-600/90 backdrop-blur-xl border border-blue-400/30 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]' : 'bg-blue-600 text-white border border-transparent shadow-[0_4px_12px_rgba(37,99,235,0.4)]')
                : (isGlassUI ? 'bg-white/[0.05] dark:bg-black/[0.2] backdrop-blur-md saturate-[180%] text-gray-500 border border-white/[0.35] dark:border-white/[0.12]' : 'bg-white dark:bg-[#222] text-gray-400 border border-transparent dark:border-[#333]')
              }`}>
            <Icon name="arrow_upward" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}