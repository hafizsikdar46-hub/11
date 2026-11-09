import React, { useState, useRef, useEffect } from 'react';
import { Delete, ArrowUp, CornerDownLeft, Search, Send, Check } from 'lucide-react';
import { KeyDefinition, InputModeType } from '../../types/keyboard';
import { THEME_CONFIGS, ThemeColors } from '../../styles/themeConfig';

interface KeyCapProps {
  keyDef: KeyDefinition;
  theme: ThemeColors;
  isShifted: boolean;
  isCapsLock: boolean;
  showPreview: boolean;
  inputMode?: InputModeType;
  onKeyPress: (key: KeyDefinition) => void;
  onLongPress?: (key: KeyDefinition) => void;
  onSpaceDrag?: (deltaX: number) => void;
}

export const KeyCap: React.FC<KeyCapProps> = ({
  keyDef,
  theme,
  isShifted,
  isCapsLock,
  showPreview,
  inputMode = 'text',
  onKeyPress,
  onLongPress,
  onSpaceDrag
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number>(0);
  const isDraggingSpaceRef = useRef<boolean>(false);

  // Compute character representation
  const isChar = !keyDef.type || keyDef.type === 'char';
  let charDisplay = keyDef.label;

  if (isChar) {
    charDisplay = (isShifted || isCapsLock) ? keyDef.label.toUpperCase() : keyDef.label.toLowerCase();
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);

    if (keyDef.type === 'space' && onSpaceDrag) {
      touchStartXRef.current = e.clientX;
      isDraggingSpaceRef.current = true;
    }

    // Long press detection for altDisplay (e.g. number hints)
    if (keyDef.altDisplay && onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress(keyDef);
        setIsPressed(false);
      }, 450);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingSpaceRef.current && onSpaceDrag) {
      const deltaX = e.clientX - touchStartXRef.current;
      if (Math.abs(deltaX) > 12) {
        onSpaceDrag(deltaX);
        touchStartXRef.current = e.clientX; // reset delta base
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isPressed) {
      setIsPressed(false);
      // Trigger normal tap
      onKeyPress(keyDef);
    }
    isDraggingSpaceRef.current = false;
  };

  const handlePointerCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsPressed(false);
    isDraggingSpaceRef.current = false;
  };

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  // Determine styling based on key type
  const isModifier = keyDef.type === 'modifier';
  const isAction = keyDef.type === 'action';
  const isSpace = keyDef.type === 'space';

  let bgClass = theme.keyStandardBg;
  let textClass = theme.keyStandardText;
  let shadowClass = theme.keyStandardShadow;

  if (isModifier) {
    bgClass = theme.keyModifierBg;
    textClass = theme.keyModifierText;
    shadowClass = 'shadow-[0_2px_0_rgba(0,0,0,0.25)]';
  } else if (isAction) {
    if (keyDef.code === 'Enter') {
      bgClass = theme.keyActionBg;
      textClass = theme.keyActionText;
      shadowClass = 'shadow-[0_2px_0_rgba(0,0,0,0.3)]';
    } else {
      bgClass = theme.keyModifierBg;
      textClass = theme.keyModifierText;
      shadowClass = 'shadow-[0_2px_0_rgba(0,0,0,0.25)]';
    }
  }

  // Active shift highlight
  if (keyDef.code === 'Shift' && (isShifted || isCapsLock)) {
    bgClass = theme.id === 'white' ? 'bg-[#ffffff]' : 'bg-[#4c3575]';
    textClass = theme.id === 'white' ? 'text-[#4f46e5]' : 'text-white';
  }

  // Render Enter key contextual icon/label
  const renderEnterContent = () => {
    if (inputMode === 'search') {
      return (
        <span className="flex items-center justify-center gap-1 text-xs font-medium">
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </span>
      );
    }
    if (inputMode === 'email') {
      return (
        <span className="flex items-center justify-center gap-1 text-xs font-medium">
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </span>
      );
    }
    return <CornerDownLeft className="w-4 h-4" />;
  };

  return (
    <div
      className={`relative select-none touch-none h-11 sm:h-12 flex items-center justify-center ${
        keyDef.width || 'flex-1'
      }`}
    >
      {/* iOS-style Key Popup Preview on tap */}
      {showPreview && isPressed && isChar && (
        <div
          className={`absolute -top-12 z-50 w-11 h-14 rounded-[8px] flex items-center justify-center pointer-events-none ${theme.previewBg} ${theme.previewText} ${theme.previewShadow} transition-transform scale-110`}
          style={{
            boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)'
          }}
        >
          <span className="text-2xl font-medium">{charDisplay}</span>
          {/* Subtle bottom pointer notch */}
          <div
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${theme.previewBg}`}
          />
        </div>
      )}

      {/* The Rectangular tactile Keycap (Zero-pill, naturally rounded 6px corners) */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`w-full h-full mx-[2.5px] rounded-[6px] relative flex flex-col items-center justify-center transition-all duration-75 active:scale-[0.98] ${bgClass} ${textClass} ${shadowClass} ${
          isPressed ? 'key-touch-active brightness-90 translate-y-[1px]' : ''
        }`}
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.12)'
        }}
        tabIndex={-1}
        aria-label={keyDef.label}
      >
        {/* Subtle top-right number hint on row 1 */}
        {keyDef.altDisplay && (
          <span className="absolute top-0.5 right-1 text-[9px] font-mono opacity-40 select-none">
            {keyDef.altDisplay}
          </span>
        )}

        {/* Content based on Key Type */}
        {keyDef.code === 'Shift' ? (
          <div className="flex flex-col items-center justify-center">
            <ArrowUp
              className={`w-4 h-4 transition-transform ${
                isCapsLock ? 'stroke-[2.5]' : isShifted ? 'stroke-[2.5]' : 'stroke-[1.8]'
              }`}
            />
            {isCapsLock && (
              <span className="w-2.5 h-0.5 bg-current rounded-full mt-0.5" />
            )}
          </div>
        ) : keyDef.code === 'Backspace' ? (
          <Delete className="w-4 h-4" />
        ) : keyDef.code === 'Enter' ? (
          renderEnterContent()
        ) : isSpace ? (
          <span className="text-[11px] font-medium tracking-wider opacity-60 uppercase">
            Nudge
          </span>
        ) : (
          <span
            className={`font-normal select-none ${
              isChar ? 'text-lg leading-none' : 'text-sm font-medium'
            }`}
          >
            {charDisplay}
          </span>
        )}
      </button>
    </div>
  );
};
