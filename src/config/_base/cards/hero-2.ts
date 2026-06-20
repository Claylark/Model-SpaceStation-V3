import type { CardConfig } from '../../../types/config';

export const hero2: CardConfig = {
  id: 'hero-2',
  sectionId: 'hero',
  visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[35vh] min-h-[280px]" },
  visual: { glassMode: "default", font: "font-sans" },
  body: {
    component: "ElasticSpace",
    props: {
      tag: "Architecture / 02",
      title: "🚀 低代码全特性版",
      desc: "这次不仅还原了原生UI，连幽灵卡片(Ghost)、霓虹高自定卡片全都加回配置树里了！向左滑动查看效果。",
      hashtags: ["#幽灵卡片", "#高度自定义"]
    }
  }
};