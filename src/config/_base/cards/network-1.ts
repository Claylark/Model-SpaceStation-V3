import type { CardConfig } from '../../../types/config';

export const network1: CardConfig = {
  id: 'network-1', sectionId: 'network', visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[35vh] min-h-[280px]" },
  visual: { glassMode: "default" },
  body: { component: "PlaceholderCard", props: { sectionId: "NETWORK", title: "联系方式", subtitle: "Content Layer" } }
};