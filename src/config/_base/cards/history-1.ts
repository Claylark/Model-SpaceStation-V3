import type { CardConfig } from '../../../types/config';

export const history1: CardConfig = {
  id: 'history-1', sectionId: 'history', visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[35vh] min-h-[280px]" },
  visual: { glassMode: "default" },
  body: { component: "PlaceholderCard", props: { sectionId: "HISTORY", title: "更新历史", subtitle: "Content Layer" } }
};