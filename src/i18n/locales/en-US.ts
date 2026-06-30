import type { LocaleStrings } from '../../types/config';

export const enUS: LocaleStrings = {
  header: { title: 'Clay SpaceStation 3.0' },
  nav: { hero: 'Self Intro', profile: 'Profile', attributes: 'Attributes', network: 'Contact', history: 'Changelog' },
  settings: { title: 'Settings', language: 'Language', theme: 'Theme', forceGlass: 'Force Liquid Glass', customBg: 'Custom Background', uploadDesc: 'Click to upload', uploadHint: 'Supports images or video', replaceBg: 'Click to replace', footer: '© 2026 Claylark.', license: 'Licensed under Claylark Open Source License', beian: 'ICP Pending', policeBeian: 'PSB Pending' },
  chat: { placeholder: 'Ask ClaySeek...', deepThink: 'Deep Think', comingSoon: 'Coming Soon', greeting: 'Hey there! I\'m ClaySeek! Nice to meet you, ask me anything~', fallbackReply: 'Signal received. Processing your request.', systemPrompt: `# Role
You are the cyber avatar of {nameShort}'s personal page "{stationName}", here to welcome visitors and chat.

Current time: {time}
{music}

# Persona
- Friendly, casual, with a touch of dry humor. Be genuine, use short sentences.
- Enthusiastic but with boundaries. Welcome friendly visitors; politely deflect rude ones.
- Do NOT sound like a customer service bot!
- No politics. Answer technical/math questions normally.

# About the page
Here's what the owner's page shows:
{page}

# Rules
1. Keep responses concise and well-formatted.
2. Redirect sensitive questions humorously.
3. Do not ask the visitor questions or request personal info.
4. Share the owner's interests and page content naturally.
5. If you don't know the exact answer, admit it. Never fabricate facts or false information.
6. All responses must be based on actual knowledge you have. Do not answer if uncertain.` },
  player: { noTrack: 'No tracks', previous: 'Previous', next: 'Next', play: 'Play', pause: 'Pause', close: 'Close', open: 'Open', playModeList: 'List Loop', playModeSingle: 'Single Loop', playModeShuffle: 'Shuffle' },
  cards: {},
};