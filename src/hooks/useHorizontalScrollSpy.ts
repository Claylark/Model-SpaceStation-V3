import { useState, useEffect, useMemo } from 'react';
import type { CardStackConfig } from '../types/config';

export function useHorizontalScrollSpy(stacks: CardStackConfig[], containerId: string) {
  const [activeSectionId, setActiveSectionId] = useState(stacks[0]?.sectionId || '');

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        const scrollCenter = container.scrollLeft + container.clientWidth / 2;
        let closestStack = stacks[0];
        let minDistance = Infinity;

        for (const stack of stacks) {
          const el = document.getElementById(stack.id);
          if (el) {
            const distance = Math.abs(scrollCenter - (el.offsetLeft + el.clientWidth / 2));
            if (distance < minDistance) {
              minDistance = distance;
              closestStack = stack;
            }
          }
        }
        setActiveSectionId(closestStack?.sectionId || '');
        timeoutId = null;
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stacks, containerId]);

  const activeStackIndex = useMemo(
    () => stacks.findIndex(s => s.sectionId === activeSectionId),
    [stacks, activeSectionId],
  );

  return { activeSectionId, activeStackIndex };
}