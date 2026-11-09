import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { KeyboardSettings } from '../../types/keyboard';
import { NudgeKeyboard } from '../keyboard/NudgeKeyboard';

interface TypingBenchmarkProps {
  settings: KeyboardSettings;
  onOpenSettings: () => void;
  onOpenDictionary: () => void;
  onOpenPrivacy: () => void;
}

const SAMPLE_SENTENCES = [
  'Nudge is a simple offline keyboard built for privacy and comfort.',
  'Typing on modern mobile screens should be fast, quiet, and predictable.',
  'Transparent suggestions ensure you never lose the exact word you typed.',
  'With one tap you can undo accidental corrections and keep moving forward.'
];

export const TypingBenchmark: React.FC<TypingBenchmarkProps> = ({
  settings,
  onOpenSettings,
  onOpenDictionary,
  onOpenPrivacy
}) => {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const targetSentence = SAMPLE_SENTENCES[sentenceIndex];

  // Start timer on first keystroke
  const handleTextChange = (newVal: string, newPos: number) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setTypedText(newVal);
    setCursorPos(newPos);

    if (newVal.trim() === targetSentence) {
      setEndTime(Date.now());
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setTypedText('');
    setCursorPos(0);
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
  };

  const handleNextSentence = () => {
    setSentenceIndex((prev) => (prev + 1) % SAMPLE_SENTENCES.length);
    handleRestart();
  };

  // Metrics computation
  const durationSec =
    startTime && endTime ? Math.max((endTime - startTime) / 1000, 1) : 0;
  const wordCount = targetSentence.split(' ').length;
  const wpm = durationSec > 0 ? Math.round((wordCount / durationSec) * 60) : 0;

  // Accuracy computation
  let matches = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === targetSentence[i]) matches++;
  }
  const accuracy =
    typedText.length > 0 ? Math.round((matches / typedText.length) * 100) : 100;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3 space-y-4">
      {/* Benchmark Header Card */}
      <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Nudge Typing Benchmark
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Sentence {sentenceIndex + 1} of {SAMPLE_SENTENCES.length}
          </span>
        </div>

        {/* Target sentence display */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-sm font-medium leading-relaxed tracking-wide select-none">
          {targetSentence.split('').map((char, index) => {
            let colorClass = 'text-slate-400';
            if (index < typedText.length) {
              colorClass =
                typedText[index] === char ? 'text-emerald-400' : 'text-rose-400 bg-rose-950/40';
            }
            return (
              <span key={index} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Live typing input preview */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white min-h-[44px] flex items-center">
          {typedText ? (
            <span>
              {typedText.slice(0, cursorPos)}
              <span className="w-0.5 h-4 bg-purple-400 inline-block animate-pulse align-middle mx-0.5" />
              {typedText.slice(cursorPos)}
            </span>
          ) : (
            <span className="text-slate-500 text-xs">
              Type the sentence above using the keyboard below...
            </span>
          )}
        </div>

        {/* Result banner if finished */}
        {isFinished && (
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7 text-purple-400" />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{wpm} WPM</span>
                  <span className="text-xs text-purple-300 font-normal">
                    · {accuracy}% Accuracy
                  </span>
                </div>
                <p className="text-[11px] text-purple-300">
                  Completed in {durationSec.toFixed(1)}s with transparent correction
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSentence}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-medium text-xs hover:bg-purple-500 transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Nudge Keyboard */}
      <div className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <NudgeKeyboard
          value={typedText}
          cursorPosition={cursorPos}
          inputMode="text"
          settings={settings}
          onChange={handleTextChange}
          onOpenSettings={onOpenSettings}
          onOpenDictionary={onOpenDictionary}
          onOpenPrivacy={onOpenPrivacy}
        />
      </div>
    </div>
  );
};
