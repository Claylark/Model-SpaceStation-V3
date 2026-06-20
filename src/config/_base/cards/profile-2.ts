import type { CardConfig } from '../../../types/config';

export const profile2: CardConfig = {
  id: 'profile-2', sectionId: 'profile', visible: true,
  layout: { width: "w-[340px]", height: "h-[38vh] min-h-[300px]" },
  visual: { glassMode: "force-solid", font: "font-mono", bg: "bg-zinc-900 border-2 border-zinc-700 text-zinc-100 shadow-2xl" },
  body: { component: "PlaceholderCard", props: { title: "隔离极客层", subtitle: "强制实色：无视主题联控" } },
};