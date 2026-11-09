import { KeyboardTheme } from '../types/keyboard';

export interface ThemeColors {
  name: string;
  id: KeyboardTheme;
  description: string;
  chassisBg: string;
  keyStandardBg: string;
  keyStandardShadow: string;
  keyStandardText: string;
  keyModifierBg: string;
  keyModifierText: string;
  keyActionBg: string;
  keyActionText: string;
  suggestionBg: string;
  suggestionText: string;
  suggestionMuted: string;
  suggestionDivider: string;
  suggestionHighlight: string;
  previewBg: string;
  previewText: string;
  previewShadow: string;
  undoBannerBg: string;
  undoBannerText: string;
}

export const THEME_CONFIGS: Record<KeyboardTheme, ThemeColors> = {
  purple: {
    name: 'Nudge Purple',
    id: 'purple',
    description: 'Signature deep royal violet with soft luminous accents',
    chassisBg: 'bg-[#181124]',
    keyStandardBg: 'bg-[#291e3e]',
    keyStandardShadow: 'shadow-[0_2px_0_#120b1c]',
    keyStandardText: 'text-[#f5f3ff]',
    keyModifierBg: 'bg-[#372852]',
    keyModifierText: 'text-[#e9d5ff]',
    keyActionBg: 'bg-[#8b5cf6]',
    keyActionText: 'text-white',
    suggestionBg: 'bg-[#1f1730]',
    suggestionText: 'text-[#f5f3ff]',
    suggestionMuted: 'text-[#a78bfa]',
    suggestionDivider: 'divide-[#372852]',
    suggestionHighlight: 'text-[#c084fc] font-semibold',
    previewBg: 'bg-[#372852]',
    previewText: 'text-white',
    previewShadow: 'shadow-[0_8px_20px_rgba(0,0,0,0.5)]',
    undoBannerBg: 'bg-[#2d1b4e]',
    undoBannerText: 'text-[#d8b4fe]'
  },
  white: {
    name: 'White',
    id: 'white',
    description: 'Clean, iOS-inspired daylight light gray with crisp tactile keycaps',
    chassisBg: 'bg-[#d2d5dc]',
    keyStandardBg: 'bg-[#ffffff]',
    keyStandardShadow: 'shadow-[0_2px_0_#9da2ad]',
    keyStandardText: 'text-[#1e293b]',
    keyModifierBg: 'bg-[#b6bac4]',
    keyModifierText: 'text-[#1e293b]',
    keyActionBg: 'bg-[#4f46e5]',
    keyActionText: 'text-white',
    suggestionBg: 'bg-[#e3e6ec]',
    suggestionText: 'text-[#1e293b]',
    suggestionMuted: 'text-[#64748b]',
    suggestionDivider: 'divide-[#cbcfd8]',
    suggestionHighlight: 'text-[#4f46e5] font-semibold',
    previewBg: 'bg-[#ffffff]',
    previewText: 'text-[#1e293b]',
    previewShadow: 'shadow-[0_8px_20px_rgba(0,0,0,0.2)]',
    undoBannerBg: 'bg-[#dce0e8]',
    undoBannerText: 'text-[#4338ca]'
  },
  black: {
    name: 'Black',
    id: 'black',
    description: 'Pure pitch dark AMOLED with high-contrast slate keys',
    chassisBg: 'bg-[#0d0e12]',
    keyStandardBg: 'bg-[#1c1d24]',
    keyStandardShadow: 'shadow-[0_2px_0_#07080a]',
    keyStandardText: 'text-[#f9fafb]',
    keyModifierBg: 'bg-[#272932]',
    keyModifierText: 'text-[#e2e8f0]',
    keyActionBg: 'bg-[#6366f1]',
    keyActionText: 'text-white',
    suggestionBg: 'bg-[#13141a]',
    suggestionText: 'text-[#f9fafb]',
    suggestionMuted: 'text-[#94a3b8]',
    suggestionDivider: 'divide-[#242630]',
    suggestionHighlight: 'text-[#a5b4fc] font-semibold',
    previewBg: 'bg-[#272932]',
    previewText: 'text-[#f9fafb]',
    previewShadow: 'shadow-[0_8px_20px_rgba(0,0,0,0.7)]',
    undoBannerBg: 'bg-[#1e2029]',
    undoBannerText: 'text-[#c7d2fe]'
  }
};
