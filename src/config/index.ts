import type { AppConfig } from '../types/config';
import { themePresets } from './_base/themePresets';
import { sections } from './_base/sections';
import { hero1 } from './_base/cards/hero-1';
import { hero2 } from './_base/cards/hero-2';
import { ghost1 } from './_base/cards/ghost-1';
import { profile1 } from './_base/cards/profile-1';
import { profile2 } from './_base/cards/profile-2';
import { attributes1 } from './_base/cards/attributes-1';
import { attributes2 } from './_base/cards/attributes-2';
import { network1 } from './_base/cards/network-1';
import { history1 } from './_base/cards/history-1';

export const APP_CONFIG: AppConfig = {
  meta: { version: "3.0", appName: "Clay SpaceStation" },
  themeSystem: {
    defaultTheme: "space",
    presets: themePresets,
  },
  sections,
  cards: [hero1, hero2, ghost1, profile1, profile2, attributes1, attributes2, network1, history1],
};

export { themePresets } from './_base/themePresets';
export { sections } from './_base/sections';