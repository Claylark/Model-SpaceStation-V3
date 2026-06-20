import type { CardConfig } from '../../../types/config';

export const ghost1: CardConfig = {
  id: 'ghost-1',
  sectionId: 'attributes',
  visible: false,
  layout: { width: "w-[280px]", height: "h-[35vh]" },
  visual: { glassMode: "default" },
  body: { component: "PlaceholderCard", props: {} }
};