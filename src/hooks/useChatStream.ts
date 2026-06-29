import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, AIModel, LocaleCode } from '../types/config';
import { streamDeepSeek } from '../services/chatApi';

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: '你好你好！我是ClaySeek！很高兴认识你，有什么想问的，尽管问~' }
  ]);

  const [isStreaming, setIsStreaming] = useState(false);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const sendMessage = useCallback(async (content: string, model: AIModel, isDeepThink: boolean, locale: LocaleCode, currentTrackInfo?: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: content };
    const aiMsg: ChatMessage = { role: 'ai', text: '', reasoning: '' };

    const prevMessages = messagesRef.current;

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);

    const aiIndex = prevMessages.length + 1;

    const updateAi = (updater: (text: string) => string) => {
      setMessages(prev => {
        const updated = [...prev];
        if (updated[aiIndex] && updated[aiIndex].role === 'ai') {
          updated[aiIndex] = { ...updated[aiIndex], text: updater(updated[aiIndex].text) };
        }
        return updated;
      });
    };

    const updateReasoning = (updater: (text: string) => string) => {
      setMessages(prev => {
        const updated = [...prev];
        if (updated[aiIndex] && updated[aiIndex].role === 'ai') {
          updated[aiIndex] = {
            ...updated[aiIndex],
            reasoning: updater(updated[aiIndex].reasoning || ''),
          };
        }
        return updated;
      });
    };

    try {
      await streamDeepSeek(
        model,
        [...prevMessages, userMsg],
        isDeepThink,
        currentTrackInfo || '',
        locale,
        (token, type) => {
          if (type === 'reasoning') {
            updateReasoning(t => t + token);
          } else {
            updateAi(t => t + token);
          }
        },
        () => setIsStreaming(false),
        (error) => {
          updateAi(() => `[错误] ${error.message}`);
          setIsStreaming(false);
        }
      );
    } catch (err) {
      updateAi(() => `[错误] ${err instanceof Error ? err.message : '未知错误'}`);
      setIsStreaming(false);
    }
  }, []);

  return {
    messages,
    setMessages,
    isStreaming,
    sendMessage,
  };
}
