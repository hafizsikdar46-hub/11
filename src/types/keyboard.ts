export type KeyboardTheme = 'purple' | 'white' | 'black';

export type KeyLayoutMode = 'letters' | 'numbers' | 'symbols';

export interface Suggestion {
  word: string;
  isOriginal?: boolean;
  isAutocorrect?: boolean;
  isLearned?: boolean;
  confidence: number; // 0 to 1
}

export interface PersonalWord {
  word: string;
  frequency: number;
  addedAt: number;
  shortcut?: string;
}

export interface CorrectionHistoryItem {
  original: string;
  corrected: string;
  timestamp: number;
  cursorIndex: number;
}

export interface KeyboardSettings {
  theme: KeyboardTheme;
  transparentAutocorrect: boolean;
  autoReplaceOnSpace: boolean;
  showKeyPreview: boolean;
  soundOnClick: boolean;
  soundVolume: number;
  hapticFeedback: boolean;
  spacebarCursorGlide: boolean;
  doubleSpacePeriod: boolean;
  showNumberRowHints: boolean;
}

export interface KeyDefinition {
  label: string;
  code: string;
  display?: string;
  altDisplay?: string;
  width?: string; // e.g. 'flex-1', 'w-12', 'w-14'
  type?: 'char' | 'action' | 'modifier' | 'space';
  icon?: string;
}

export type InputModeType = 'text' | 'search' | 'email' | 'url';
