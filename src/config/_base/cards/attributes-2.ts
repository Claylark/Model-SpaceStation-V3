import type { CardConfig } from '../../../types/config';

export const attributes2: CardConfig = {
  id: 'attributes-2', sectionId: 'attributes', visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[32vh]" },
  visual: { glassMode: "force-glass", bg: "bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 border border-purple-500/40 text-purple-100 shadow-lg" },
  body: { component: "PlaceholderCard", props: { title: "赛博霓虹矩阵", subtitle: "强制玻璃态 + 自定义渐变色" } }
};