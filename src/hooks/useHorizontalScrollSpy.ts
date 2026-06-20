import { useState, useEffect, useMemo } from 'react';
import type { CardStackConfig } from '../types/config';

/**
 * 横向滚动监听：检测当前视口在哪个卡片堆
 * 返回该堆的 sectionId（用于底部导航高亮）和堆索引（用于惰性渲染）
 */
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

  /** 当前激活的堆在 stacks 数组中的索引（用于惰性渲染范围计算） */
  const activeStackIndex = useMemo(
    () => stacks.findIndex(s => s.sectionId === activeSectionId),
    [stacks, activeSectionId],
  );

  return { activeSectionId, activeStackIndex };
}