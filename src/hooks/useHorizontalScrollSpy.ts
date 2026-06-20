import { useState, useEffect } from 'react';
import type { CardConfig } from '../types/config';

export function useHorizontalScrollSpy(cards: CardConfig[], containerId: string) {
  const [activeSectionId, setActiveSectionId] = useState(cards[0]?.sectionId || '');

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        const scrollCenter = container.scrollLeft + container.clientWidth / 2;
        let closestCard = cards[0];
        let minDistance = Infinity;

        for (const card of cards) {
          const el = document.getElementById(card.id);
          if (el) {
            const distance = Math.abs(scrollCenter - (el.offsetLeft + el.clientWidth / 2));
            if (distance < minDistance) {
              minDistance = distance;
              closestCard = card;
            }
          }
        }
        setActiveSectionId(closestCard?.sectionId || '');
        timeoutId = null;
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [cards, containerId]);

  return activeSectionId;
}