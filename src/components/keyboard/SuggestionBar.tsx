import React from 'react';
import { RotateCcw, Plus, BookmarkCheck } from 'lucide-react';
import { Suggestion, CorrectionHistoryItem } from '../../types/keyboard';
import { ThemeColors } from '../../styles/themeConfig';

interface SuggestionBarProps {
  suggestions: Suggestion[];
  currentWord: string;
  theme: ThemeColors;
  lastCorrection: CorrectionHistoryItem | null;
  onSelectSuggestion: (word: string, isOriginal?: boolean) => void;
  onUndoLastCorrection: () => void;
  onAddToDictionary: (word: string) => void;
}

export const SuggestionBar: React.FC<SuggestionBarProps> = ({
  suggestions,
  currentWord,
  theme,
  lastCorrection,
  onSelectSuggestion,
  onUndoLastCorrection,
  onAddToDictionary
}) => {
  // If user just had an autocorrect, show the Undo prompt
  if (lastCorrection && !currentWord) {
    return (
      <div
        className={`h-11 w-full px-3 flex items-center justify-between border-b border-black/10 transition-all ${theme.undoBannerBg} ${theme.undoBannerText}`}
      >
        <div className="flex items-center gap-2 text-xs truncate">
          <span className="opacity-75">Corrected to:</span>
          <span className="font-semibold underline decoration-dotted">
            {lastCorrection.corrected}
          </span>
        </div>
        <button
          type="button"
          onClick={onUndoLastCorrection}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-[4px] bg-black/15 hover:bg-black/25 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo "{lastCorrection.original}"</span>
        </button>
      </div>
    );
  }

  // If no suggestions and no typing, show clean idle state
  if (!suggestions.length || !currentWord) {
    return (
      <div
        className={`h-11 w-full px-4 flex items-center justify-center border-b border-black/10 select-none ${theme.suggestionBg}`}
      >
        <span className="text-xs tracking-wider opacity-40 font-mono">
          NUDGE PRIVACY-FIRST KEYBOARD
        </span>
      </div>
    );
  }

  return (
    <div
      className={`h-11 w-full px-1 flex items-center divide-x border-b border-black/10 select-none ${theme.suggestionBg} ${theme.suggestionDivider}`}
    >
      {suggestions.map((item, index) => {
        const isCenter = index === 1;
        const isLeft = index === 0;
        const isRight = index === 2;

        const isAddAction = item.word.startsWith('+ Add');
        const cleanWord = isAddAction
          ? item.word.replace(/^\+ Add "(.*)"$/, '$1')
          : item.word.replace(/^"(.*)"$/, '$1');

        return (
          <div
            key={`${item.word}-${index}`}
            className="flex-1 h-full flex items-center justify-center px-1 overflow-hidden"
          >
            {isAddAction ? (
              <button
                type="button"
                onClick={() => onAddToDictionary(cleanWord)}
                className="w-full h-8 flex items-center justify-center gap-1.5 px-2 text-xs font-medium rounded-[4px] bg-purple-500/15 hover:bg-purple-500/25 active:scale-95 text-purple-400 hover:text-purple-300 transition-all truncate"
                title={`Add "${cleanWord}" to your personal offline dictionary`}
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Add "{cleanWord}"</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectSuggestion(item.word, item.isOriginal)}
                className={`w-full h-8 px-2 flex items-center justify-center rounded-[4px] transition-all truncate active:scale-95 ${
                  isCenter
                    ? `${theme.suggestionHighlight} bg-white/5`
                    : isLeft && item.isOriginal
                    ? 'text-xs opacity-75 font-mono'
                    : 'text-sm opacity-85 hover:opacity-100'
                }`}
              >
                {item.isLearned && (
                  <BookmarkCheck className="w-3 h-3 mr-1 text-emerald-400 shrink-0" />
                )}
                <span className="truncate">{item.word}</span>
                {item.isAutocorrect && (
                  <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                    auto
                  </span>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
