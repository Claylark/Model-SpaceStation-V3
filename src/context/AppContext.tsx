import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import type { AppContextValue, AppAction, LocaleCode, AIModel, CardStackConfig } from '../types/config';
import { useTheme } from '../hooks/useTheme';
import { usePlaylist } from '../hooks/usePlaylist';
import { useChatStream } from '../hooks/useChatStream';
import { useHorizontalScrollSpy } from '../hooks/useHorizontalScrollSpy';
import { useRouteTheme } from '../hooks/useRouteTheme';
import { setLocale as applyLocale } from '../i18n/index';

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
  stacks: CardStackConfig[];
  containerId: string;
}

export function AppProvider({ children, stacks, containerId }: AppProviderProps) {
  const { locale: routeLocale } = useRouteTheme();
  const theme = useTheme();
  const playlist = usePlaylist();
  const chat = useChatStream();
  const { activeSectionId } = useHorizontalScrollSpy(stacks, containerId);
  const [locale, setLocale] = useState<LocaleCode>(routeLocale);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentStacks, setCurrentStacks] = useState<CardStackConfig[]>(stacks);

  useEffect(() => {
    if (routeLocale) {
      setLocale(routeLocale);
      applyLocale(routeLocale);
    }
  }, [routeLocale]);

  const dispatch = useCallback((action: AppAction) => {
    switch (action.type) {
      case 'NAVIGATE_SECTION': {
        const firstStack = currentStacks.find(s => s.sectionId === action.payload);
        if (firstStack) {
          const el = document.getElementById(firstStack.id);
          const container = document.getElementById(containerId);
          if (el && container) {
            container.style.scrollSnapType = 'none';
            const targetLeft = el.offsetLeft - (container.clientWidth / 2) + (el.clientWidth / 2);
            container.scrollTo({ left: targetLeft, behavior: 'smooth' });
            setTimeout(() => { container.style.scrollSnapType = ''; }, 600);
          }
        }
        break;
      }
      case 'TOGGLE_PLAY':
        playlist.togglePlay();
        break;
      case 'NEXT_TRACK':
        playlist.next();
        break;
      case 'PREV_TRACK':
        playlist.prev();
        break;
      case 'TOGGLE_CHAT':
        setIsChatOpen(prev => !prev);
        break;
      case 'TOGGLE_PLAYER':
        setIsPlayerOpen(prev => !prev);
        break;
      case 'SET_THEME':
        theme.setCurrentThemeId(action.payload);
        if (action.payload === 'solid') theme.setIsGlassUI(false);
        else theme.setIsGlassUI(true);
        break;
      case 'SET_LOCALE': {
        setLocale(action.payload);
        applyLocale(action.payload);
        break;
      }
      case 'TOGGLE_DARK':
        theme.toggleDarkMode();
        break;
      case 'TOGGLE_GLASS':
        theme.setIsGlassUI(prev => !prev);
        break;
    }
  }, [currentStacks, containerId, playlist, theme]);

  const updateCardProps = useCallback((cardId: string, key: string, value: unknown) => {
    setCurrentStacks(prev => prev.map(stack => ({
      ...stack,
      cards: stack.cards.map(card =>
        card.id === cardId
          ? { ...card, body: { ...card.body, props: { ...card.body.props, [key]: value } } }
          : card
      ),
    })));
  }, []);

  const moveCard = useCallback((cardId: string, sourceStackId: string, targetStackId: string, targetIndex: number) => {
    setCurrentStacks(prev => {
      const sourceStack = prev.find(s => s.id === sourceStackId);
      const targetStack = prev.find(s => s.id === targetStackId);
      if (!sourceStack || !targetStack) return prev;
      const cardToMove = sourceStack.cards.find(c => c.id === cardId);
      if (!cardToMove) return prev;

      const newSourceCards = sourceStack.cards.filter(c => c.id !== cardId);
      const newTargetCards = [...targetStack.cards];
      newTargetCards.splice(targetIndex, 0, cardToMove);

      return prev.map(s => {
        if (s.id === sourceStackId) return { ...s, cards: newSourceCards };
        if (s.id === targetStackId) return { ...s, cards: newTargetCards };
        return s;
      });
    });
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setCurrentStacks(prev => prev.map(s => ({
      ...s,
      cards: s.cards.filter(c => c.id !== cardId),
    })));
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    state: {
      locale,
      currentThemeId: theme.currentThemeId,
      isDark: theme.isDark,
      isGlassUI: theme.isGlassUI,
      isChatOpen,
      isPlayerOpen,
      isPlaying: playlist.isPlaying,
      currentTrack: playlist.currentTrack,
      messages: chat.messages,
      isStreaming: chat.isStreaming,
      activeSectionId,
      isDesignMode: false,
    },
    dispatch,
    sendMessage: chat.sendMessage,
    updateCardProps,
    moveCard,
    deleteCard,
  }), [locale, theme.currentThemeId, theme.isDark, theme.isGlassUI, isChatOpen, isPlayerOpen, playlist.isPlaying, playlist.currentTrack, chat.messages, chat.isStreaming, activeSectionId, dispatch, chat.sendMessage, updateCardProps, moveCard, deleteCard]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export { type AIModel };