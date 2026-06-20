/**
 * useChatStream - AI 流式聊天 Hook
 *
 * 职责：
 * 1. 管理聊天消息列表（messages state）
 * 2. 通过 sendMessage() 向 DeepSeek API 发送流式请求
 * 3. 接收 SSE token 流并逐字追加到 AI 消息中（打字机效果）
 * 4. Gemini / GPT-4o 预留（当前返回"即将支持"提示）
 *
 * 流式更新原理：
 * - 发送消息时先插入一条 role='ai' text='' 的占位消息
 * - 用 useRef 锁定该消息在数组中的索引（aiIndex）
 * - DeepSeek 每返回一个 token，就更新该消息的 text 字段
 * - React 的 setState 函数式更新保证不会丢失 token
 */
import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, AIModel } from '../types/config';
import { streamDeepSeek } from '../services/chatApi';

export function useChatStream() {
  // 聊天消息列表，初始有一条 AI 问候语
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: '你好你好！我是ClaySeek！很高兴认识你，有什么想问的，尽管问~' }
  ]);

  // 是否正在接收流式输出（用于 UI 显示加载态、禁止重复发送）
  const [isStreaming, setIsStreaming] = useState(false);

  // 用 ref 保存最新的 messages，避免 sendMessage 闭包捕获旧值
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /**
   * 发送消息到 AI
   * @param content - 用户输入的文本
   * @param model - 选择的 AI 模型（DeepSeek / Gemini / GPT-4o）
   * @param isDeepThink - 是否开启深度思考模式（DeepSeek Reasoner）
   */
  const sendMessage = useCallback(async (content: string, model: AIModel, isDeepThink: boolean) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: content };
    const aiMsg: ChatMessage = { role: 'ai', text: '' };

    // 记录发送前的消息列表快照，用于计算 AI 消息索引
    const prevMessages = messagesRef.current;

    // 同时追加用户消息和占位 AI 消息
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);

    // AI 消息在数组中的索引 = 追加前长度 + 1（跳过用户消息）
    const aiIndex = prevMessages.length + 1;

    /**
     * 安全更新 AI 消息文本的辅助函数
     * 使用函数式 setState，基于当前值计算下一个值
     * @param updater - 接收当前 text，返回新的 text
     */
    const updateAi = (updater: (text: string) => string) => {
      setMessages(prev => {
        const updated = [...prev];
        // 防御性检查：确保索引有效且确实是 AI 消息
        if (updated[aiIndex] && updated[aiIndex].role === 'ai') {
          updated[aiIndex] = { ...updated[aiIndex], text: updater(updated[aiIndex].text) };
        }
        return updated;
      });
    };

    try {
      if (model === 'DeepSeek') {
        // DeepSeek V4 Flash 流式请求
        await streamDeepSeek(
          [...prevMessages, userMsg],  // 传入对话历史 + 新用户消息
          isDeepThink,
          (token) => updateAi(t => t + token),   // 每收到一个 token 就追加
          () => setIsStreaming(false),            // 流结束
          (error) => {
            updateAi(() => `[错误] ${error.message}`);
            setIsStreaming(false);
          }
        );
      } else {
        // Gemini / GPT-4o 预留：模拟延迟后显示"即将支持"
        setTimeout(() => {
          updateAi(() => `[${model}] 即将支持，敬请期待！`);
          setIsStreaming(false);
        }, 800);
      }
    } catch (err) {
      updateAi(() => `[错误] ${err instanceof Error ? err.message : '未知错误'}`);
      setIsStreaming(false);
    }
  }, []); // 空依赖：sendMessage 内部通过 ref 获取最新 messages

  return {
    messages,       // ChatMessage[] - 所有聊天消息
    setMessages,    // React.Dispatch - 手动设置消息（用于清空等）
    isStreaming,    // boolean - 是否正在流式输出
    sendMessage,    // (content, model, isDeepThink) => void - 发送消息
  };
}