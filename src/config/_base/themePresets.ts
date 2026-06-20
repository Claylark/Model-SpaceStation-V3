import type { ThemePreset } from '../../types/config';

export const themePresets: Record<string, ThemePreset> = {
  space: {
    id: 'space',
    label: '星轨航线',
    style: 'bg-[#f4f7fb] dark:bg-gradient-to-b dark:from-indigo-950 dark:via-slate-900 dark:to-indigo-950',
    adaptiveLuminance: true,
    previewCard: 'bg-white/60 dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-800 dark:text-white',
    wallpaper: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop',
    },
    ui: {
      header: "bg-white/40 dark:bg-[#0a0a0a]/40 border-gray-200/50 dark:border-white/5",
      pill: "bg-white/50 dark:bg-[#111111]/60 border-white/50 dark:border-white/10",
      cardDefault: "bg-white/80 dark:bg-[#111111]/70 border-white/50 dark:border-white/10 text-gray-900 dark:text-white",
    },
    domain: 'space',
  },
  crystal: {
    id: 'crystal',
    label: '水晶律动',
    style: 'bg-gradient-to-b from-pink-300 via-purple-300 to-sky-200',
    isDark: false,
    adaptiveLuminance: false,
    previewCard: 'bg-white/60 border-white/40 shadow-sm text-purple-900',
    wallpaper: {
      url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2500&auto=format&fit=crop',
    },
    ui: {
      header: "bg-white/60 border-white/40 text-purple-900",
      pill: "bg-white/80 border-white/40 shadow-xl shadow-purple-500/10",
      cardDefault: "bg-white/60 border-white/40 shadow-[0_20px_40px_-10px_rgba(168,85,247,0.15)] text-purple-900",
    },
    domain: 'crystal',
  },
  solid: {
    id: 'solid',
    label: '极简白昼',
    style: 'bg-[#f4f7fb]',
    isDark: false,
    adaptiveLuminance: false,
    previewCard: 'bg-white border-gray-200 shadow-sm text-gray-880',
    wallpaper: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2500&auto=format&fit=crop',
    },
    ui: {
      header: "bg-white border-gray-200 text-gray-900",
      pill: "bg-white border-gray-200",
      cardDefault: "bg-white border-gray-200 text-gray-800",
    },
    domain: 'solid',
  },
  aurora: {
    id: 'aurora',
    label: '暗夜极光',
    style: 'bg-gradient-to-b from-emerald-950 via-gray-900 to-slate-950',
    isDark: true,
    adaptiveLuminance: false,
    previewCard: 'bg-emerald-900/20 border-emerald-500/20 text-emerald-300',
    wallpaper: {
      url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2500&auto=format&fit=crop',
    },
    ui: {
      header: "bg-emerald-900/40 border-emerald-500/20 text-emerald-100",
      pill: "bg-emerald-900/60 border-emerald-500/20",
      cardDefault: "bg-emerald-900/40 border-emerald-500/20 text-emerald-100",
    },
    domain: 'aurora',
  },
};