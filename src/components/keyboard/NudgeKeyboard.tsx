import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Sliders, BookOpen, ShieldCheck, Palette } from 'lucide-react';
import {
  KeyDefinition,
  KeyLayoutMode,
  Suggestion,
  CorrectionHistoryItem,
  KeyboardSettings,
  InputModeType
} from '../../types/keyboard';
import { QWERTY_ROWS, NUMBERS_ROWS, MORE_SYMBOLS_ROWS } from '../../config/keyboardLayouts';
import { THEME_CONFIGS } from '../../styles/themeConfig';
import { KeyCap } from './KeyCap';
import { SuggestionBar } from './SuggestionBar';
import { dictionaryService } from '../../services/dictionary';
import { soundService } from '../../services/sound';

interface NudgeKeyboardProps {
  value: string;
  cursorPosition: number;
  inputMode?: InputModeType;
  settings: KeyboardSettings;
  onChange: (newValue: string, newCursorPos: number) => void;
  onEnter?: () => void;
  onClose?: () => void;
  onOpenSettings?: () => void;
  onOpenDictionary?: () => void;
  onOpenPrivacy?: () => void;
}

export const NudgeKeyboard: React.FC<NudgeKeyboardProps> = ({
  value,
  cursorPosition,
  inputMode = 'text',
  settings,
  onChange,
  onEnter,
  onClose,
  onOpenSettings,
  onOpenDictionary,
  onOpenPrivacy
}) => {
  const [layoutMode, setLayoutMode] = useState<KeyLayoutMode>('letters');
  const [shiftState, setShiftState] = useState<0 | 1 | 2>(0); // 0 = normal, 1 = shifted, 2 = caps lock
  const [lastShiftTapTime, setLastShiftTapTime] = useState<number>(0);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [lastCorrection, setLastCorrection] = useState<CorrectionHistoryItem | null>(null);

  const backspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const theme = THEME_CONFIGS[settings.theme] || THEME_CONFIGS.purple;

  // Extract the current word being typed at cursor position
  const extractCurrentToken = useCallback(() => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/([a-zA-Z0-9'’]+)$/);
    if (match) {
      return match[1];
    }
    return '';
  }, [value, cursorPosition]);

  // Update suggestions whenever text or cursor changes
  useEffect(() => {
    const token = extractCurrentToken();
    setCurrentWord(token);

    if (token.length > 0) {
      const list = dictionaryService.getSuggestions(token);
      setSuggestions(list);
    } else {
      setSuggestions([]);
    }
  }, [value, cursorPosition, extractCurrentToken]);

  // Trigger feedback sounds and haptics
  const playFeedback = (type: 'standard' | 'space' | 'backspace' | 'enter' = 'standard') => {
    if (settings.soundOnClick) {
      soundService.playKeyClick(settings.soundVolume, type);
    }
    if (settings.hapticFeedback) {
      soundService.triggerHaptic(12);
    }
  };

  // Handle character insertions
  const insertText = (text: string) => {
    const before = value.slice(0, cursorPosition);
    const after = value.slice(cursorPosition);
    const newValue = before + text + after;
    const newPos = cursorPosition + text.length;
    onChange(newValue, newPos);
    setLastCorrection(null); // Clear undo on new keystroke
  };

  // Handle backspace action with Undo restoration
  const handleBackspace = () => {
    playFeedback('backspace');

    // Smart undo: If user presses backspace immediately after an autocorrect, restore original!
    if (lastCorrection && cursorPosition === lastCorrection.cursorIndex) {
      const before = value.slice(0, cursorPosition - (lastCorrection.corrected.length + 1));
      const after = value.slice(cursorPosition);
      const restoredValue = before + lastCorrection.original + after;
      const newPos = before.length + lastCorrection.original.length;
      onChange(restoredValue, newPos);
      setLastCorrection(null);
      return;
    }

    if (cursorPosition > 0) {
      const before = value.slice(0, cursorPosition - 1);
      const after = value.slice(cursorPosition);
      onChange(before + after, cursorPosition - 1);
    }
  };

  // Space key with transparent autocorrect handling
  const handleSpace = () => {
    playFeedback('space');

    const token = currentWord;
    const centerSuggestion = suggestions[1];

    // Check if auto-replace on space applies
    if (
      settings.autoReplaceOnSpace &&
      token &&
      centerSuggestion &&
      centerSuggestion.isAutocorrect &&
      centerSuggestion.confidence >= 0.85
    ) {
      const before = value.slice(0, cursorPosition - token.length);
      const after = value.slice(cursorPosition);
      const correctedWord = centerSuggestion.word;
      const newValue = before + correctedWord + ' ' + after;
      const newPos = before.length + correctedWord.length + 1;

      // Save for 1-tap Undo
      setLastCorrection({
        original: token,
        corrected: correctedWord,
        timestamp: Date.now(),
        cursorIndex: newPos
      });

      dictionaryService.recordWordUsage(correctedWord);
      onChange(newValue, newPos);
      return;
    }

    // Double space for period
    if (settings.doubleSpacePeriod && cursorPosition >= 2) {
      const lastTwo = value.slice(cursorPosition - 2, cursorPosition);
      if (lastTwo.endsWith(' ') && !lastTwo.startsWith('.')) {
        const before = value.slice(0, cursorPosition - 1);
        const after = value.slice(cursorPosition);
        onChange(before + '. ', cursorPosition + 1);
        return;
      }
    }

    // Normal space
    insertText(' ');
  };

  // Spacebar horizontal gliding to adjust cursor position
  const handleSpaceDrag = (deltaX: number) => {
    if (!settings.spacebarCursorGlide) return;

    // Move cursor left or right
    if (deltaX > 0 && cursorPosition < value.length) {
      onChange(value, cursorPosition + 1);
      playFeedback('standard');
    } else if (deltaX < 0 && cursorPosition > 0) {
      onChange(value, cursorPosition - 1);
      playFeedback('standard');
    }
  };

  // Handle single suggestion tap
  const handleSelectSuggestion = (word: string, isOriginal?: boolean) => {
    playFeedback('standard');
    const clean = word.replace(/^"(.*)"$/, '$1');
    const token = currentWord;

    const before = value.slice(0, cursorPosition - token.length);
    const after = value.slice(cursorPosition);

    const replacement = clean + ' ';
    const newValue = before + replacement + after;
    const newPos = before.length + replacement.length;

    if (!isOriginal && token && clean.toLowerCase() !== token.toLowerCase()) {
      setLastCorrection({
        original: token,
        corrected: clean,
        timestamp: Date.now(),
        cursorIndex: newPos
      });
    } else {
      setLastCorrection(null);
    }

    dictionaryService.recordWordUsage(clean);
    onChange(newValue, newPos);
  };

  // Handle Undo Last Correction
  const handleUndoCorrection = () => {
    if (!lastCorrection) return;
    playFeedback('standard');

    // Find where the corrected word is right before current cursor or recorded position
    const correctedWithSpace = lastCorrection.corrected + ' ';
    const beforeCorrection = value.slice(0, lastCorrection.cursorIndex - correctedWithSpace.length);
    const afterCorrection = value.slice(lastCorrection.cursorIndex);

    const restoredValue = beforeCorrection + lastCorrection.original + ' ' + afterCorrection;
    const restoredPos = beforeCorrection.length + lastCorrection.original.length + 1;

    onChange(restoredValue, restoredPos);
    setLastCorrection(null);
  };

  // Handle Add to Personal Dictionary
  const handleAddToDictionary = (word: string) => {
    playFeedback('standard');
    dictionaryService.addPersonalWord(word);
    handleSelectSuggestion(word, true);
  };

  // Handle KeyPress dispatcher
  const handleKeyPress = (keyDef: KeyDefinition) => {
    // Modifier or mode switch
    if (keyDef.code === 'ModeSymbols') {
      playFeedback('standard');
      setLayoutMode('numbers');
      return;
    }
    if (keyDef.code === 'ModeMoreSymbols') {
      playFeedback('standard');
      setLayoutMode('symbols');
      return;
    }
    if (keyDef.code === 'ModeLetters') {
      playFeedback('standard');
      setLayoutMode('letters');
      return;
    }

    // Shift toggle
    if (keyDef.code === 'Shift') {
      playFeedback('standard');
      const now = Date.now();
      if (now - lastShiftTapTime < 350) {
        // Double tap -> Caps Lock
        setShiftState(2);
      } else {
        // Single tap -> Cycle normal / shift
        setShiftState(prev => (prev === 0 ? 1 : 0));
      }
      setLastShiftTapTime(now);
      return;
    }

    // Backspace
    if (keyDef.code === 'Backspace') {
      handleBackspace();
      return;
    }

    // Space
    if (keyDef.code === 'Space') {
      handleSpace();
      return;
    }

    // Enter
    if (keyDef.code === 'Enter') {
      playFeedback('enter');
      if (onEnter) {
        onEnter();
      } else {
        insertText('\n');
      }
      return;
    }

    // Standard Character
    playFeedback('standard');
    let charToInsert = keyDef.label;
    if (layoutMode === 'letters') {
      const isUpper = shiftState === 1 || shiftState === 2;
      charToInsert = isUpper ? keyDef.label.toUpperCase() : keyDef.label.toLowerCase();

      // Reset single shift after typing a character
      if (shiftState === 1) {
        setShiftState(0);
      }
    }

    insertText(charToInsert);
  };

  // Long press for number hints
  const handleLongPress = (keyDef: KeyDefinition) => {
    if (keyDef.altDisplay) {
      playFeedback('standard');
      insertText(keyDef.altDisplay);
    }
  };

  // Select active layout rows
  const currentRows =
    layoutMode === 'symbols'
      ? MORE_SYMBOLS_ROWS
      : layoutMode === 'numbers'
      ? NUMBERS_ROWS
      : QWERTY_ROWS;

  return (
    <div
      className={`w-full select-none flex flex-col ${theme.chassisBg} shadow-2xl transition-colors duration-200 border-t border-black/10`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Utility & Control Strip */}
      <div className="h-8 px-2 flex items-center justify-between border-b border-black/10 text-xs opacity-70">
        <div className="flex items-center gap-3">
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1 rounded hover:bg-black/10 active:scale-95 transition-all text-inherit"
              title="Keyboard Settings & Themes"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
          {onOpenDictionary && (
            <button
              type="button"
              onClick={onOpenDictionary}
              className="p-1 rounded hover:bg-black/10 active:scale-95 transition-all text-inherit flex items-center gap-1"
              title="Personal Dictionary"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Dictionary</span>
            </button>
          )}
          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="p-1 rounded hover:bg-black/10 active:scale-95 transition-all text-inherit flex items-center gap-1"
              title="Offline Privacy Vault"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 hidden sm:inline">100% Offline</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
            {settings.theme}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-black/10 active:scale-95 transition-all text-inherit"
              title="Dismiss Keyboard"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Transparent Autocorrect Suggestion Bar */}
      <SuggestionBar
        suggestions={suggestions}
        currentWord={currentWord}
        theme={theme}
        lastCorrection={lastCorrection}
        onSelectSuggestion={handleSelectSuggestion}
        onUndoLastCorrection={handleUndoCorrection}
        onAddToDictionary={handleAddToDictionary}
      />

      {/* Physical Key Grid Container */}
      <div className="px-1 py-1.5 flex flex-col gap-1.5 sm:gap-2">
        {currentRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center justify-center w-full">
            {row.map((keyDef) => (
              <KeyCap
                key={keyDef.code}
                keyDef={keyDef}
                theme={theme}
                isShifted={shiftState === 1}
                isCapsLock={shiftState === 2}
                showPreview={settings.showKeyPreview}
                inputMode={inputMode}
                onKeyPress={handleKeyPress}
                onLongPress={handleLongPress}
                onSpaceDrag={handleSpaceDrag}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Subtle Android Bottom Gesture Bar Area */}
      <div className="h-3 sm:h-4 w-full flex items-center justify-center opacity-30">
        <div className="w-28 h-1 bg-current rounded-full" />
      </div>
    </div>
  );
};
