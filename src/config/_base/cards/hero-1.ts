import type { CardConfig } from '../../../types/config';

export const hero1: CardConfig = {
  id: 'hero-1',
  sectionId: 'hero',
  visible: true,
  layout: { width: "w-[372px] max-w-[94vw]", height: "h-[35vh] min-h-[280px]" },
  visual: { glassMode: "default", font: "font-sans" },
  body: {
    component: "RichTextIntro",
    props: {
      tag: "Introduction / 01",
      lines: ["你好你好", "我是", "很高兴跟你扩列鸭"],
      avatar: { name: "Claylark", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }
    }
  },
  actions: [
    { label: "了解详细属性", primary: true, action: { type: "NAVIGATE", payload: "attributes" } },
    { label: "立即扩列", primary: false, action: { type: "NAVIGATE", payload: "network" } }
  ],
  themeOverrides: {
    crystal: {
      body: {
        props: {
          lines: ["水晶律动触发", "全息投影：", "UI已深度联控突变"],
          avatar: { name: "Crystalark", src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=100&h=100&fit=crop" }
        }
      }
    }
  }
};