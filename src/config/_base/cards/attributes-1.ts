import type { CardConfig } from '../../../types/config';

export const attributes1: CardConfig = {
  id: 'attributes-1', sectionId: 'attributes', visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[35vh] min-h-[280px]" },
  visual: { glassMode: "default" },
  body: { component: "PlaceholderCard", props: { sectionId: "ATTRIBUTES", title: "详细属性", subtitle: "Content Layer" } }
};