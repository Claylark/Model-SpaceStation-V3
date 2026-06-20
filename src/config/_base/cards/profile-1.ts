import type { CardConfig } from '../../../types/config';

export const profile1: CardConfig = {
  id: 'profile-1', sectionId: 'profile', visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[35vh] min-h-[280px]" },
  visual: { glassMode: "default" },
  body: { component: "PlaceholderCard", props: { sectionId: "PROFILE", title: "资料简介 P1", subtitle: "Content Layer" } }
};