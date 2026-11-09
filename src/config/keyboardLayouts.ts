import { KeyDefinition } from '../types/keyboard';

export const QWERTY_ROWS: KeyDefinition[][] = [
  // Row 1
  [
    { label: 'q', code: 'KeyQ', altDisplay: '1' },
    { label: 'w', code: 'KeyW', altDisplay: '2' },
    { label: 'e', code: 'KeyE', altDisplay: '3' },
    { label: 'r', code: 'KeyR', altDisplay: '4' },
    { label: 't', code: 'KeyT', altDisplay: '5' },
    { label: 'y', code: 'KeyY', altDisplay: '6' },
    { label: 'u', code: 'KeyU', altDisplay: '7' },
    { label: 'i', code: 'KeyI', altDisplay: '8' },
    { label: 'o', code: 'KeyO', altDisplay: '9' },
    { label: 'p', code: 'KeyP', altDisplay: '0' },
  ],
  // Row 2
  [
    { label: 'a', code: 'KeyA' },
    { label: 's', code: 'KeyS' },
    { label: 'd', code: 'KeyD' },
    { label: 'f', code: 'KeyF' },
    { label: 'g', code: 'KeyG' },
    { label: 'h', code: 'KeyH' },
    { label: 'j', code: 'KeyJ' },
    { label: 'k', code: 'KeyK' },
    { label: 'l', code: 'KeyL' },
  ],
  // Row 3: Shift, Z-M, Backspace
  [
    { label: 'shift', code: 'Shift', type: 'modifier', width: 'w-[14%] sm:w-[13%]' },
    { label: 'z', code: 'KeyZ' },
    { label: 'x', code: 'KeyX' },
    { label: 'c', code: 'KeyC' },
    { label: 'v', code: 'KeyV' },
    { label: 'b', code: 'KeyB' },
    { label: 'n', code: 'KeyN' },
    { label: 'm', code: 'KeyM' },
    { label: 'backspace', code: 'Backspace', type: 'action', width: 'w-[14%] sm:w-[13%]' },
  ],
  // Row 4: ?123, Comma, Space, Period, Enter
  [
    { label: '?123', code: 'ModeSymbols', type: 'modifier', width: 'w-[15%]' },
    { label: ',', code: 'Comma', width: 'w-[10%]' },
    { label: 'space', code: 'Space', type: 'space', width: 'flex-1' },
    { label: '.', code: 'Period', width: 'w-[10%]' },
    { label: 'enter', code: 'Enter', type: 'action', width: 'w-[18%]' },
  ]
];

export const NUMBERS_ROWS: KeyDefinition[][] = [
  // Row 1
  [
    { label: '1', code: 'Digit1' },
    { label: '2', code: 'Digit2' },
    { label: '3', code: 'Digit3' },
    { label: '4', code: 'Digit4' },
    { label: '5', code: 'Digit5' },
    { label: '6', code: 'Digit6' },
    { label: '7', code: 'Digit7' },
    { label: '8', code: 'Digit8' },
    { label: '9', code: 'Digit9' },
    { label: '0', code: 'Digit0' },
  ],
  // Row 2
  [
    { label: '-', code: 'Minus' },
    { label: '/', code: 'Slash' },
    { label: ':', code: 'Colon' },
    { label: ';', code: 'Semicolon' },
    { label: '(', code: 'ParenLeft' },
    { label: ')', code: 'ParenRight' },
    { label: '$', code: 'Dollar' },
    { label: '&', code: 'Ampersand' },
    { label: '@', code: 'At' },
    { label: '"', code: 'Quote' },
  ],
  // Row 3
  [
    { label: '=/<', code: 'ModeMoreSymbols', type: 'modifier', width: 'w-[14%]' },
    { label: '.', code: 'Period' },
    { label: ',', code: 'Comma' },
    { label: '?', code: 'Question' },
    { label: '!', code: 'Exclamation' },
    { label: "'", code: 'Apostrophe' },
    { label: 'backspace', code: 'Backspace', type: 'action', width: 'w-[14%]' },
  ],
  // Row 4
  [
    { label: 'ABC', code: 'ModeLetters', type: 'modifier', width: 'w-[16%]' },
    { label: ',', code: 'Comma', width: 'w-[10%]' },
    { label: 'space', code: 'Space', type: 'space', width: 'flex-1' },
    { label: '.', code: 'Period', width: 'w-[10%]' },
    { label: 'enter', code: 'Enter', type: 'action', width: 'w-[18%]' },
  ]
];

export const MORE_SYMBOLS_ROWS: KeyDefinition[][] = [
  // Row 1
  [
    { label: '[', code: 'BracketLeft' },
    { label: ']', code: 'BracketRight' },
    { label: '{', code: 'BraceLeft' },
    { label: '}', code: 'BraceRight' },
    { label: '#', code: 'Hash' },
    { label: '%', code: 'Percent' },
    { label: '^', code: 'Caret' },
    { label: '*', code: 'Asterisk' },
    { label: '+', code: 'Plus' },
    { label: '=', code: 'Equal' },
  ],
  // Row 2
  [
    { label: '_', code: 'Underscore' },
    { label: '\\', code: 'Backslash' },
    { label: '|', code: 'Pipe' },
    { label: '~', code: 'Tilde' },
    { label: '<', code: 'Less' },
    { label: '>', code: 'Greater' },
    { label: '€', code: 'Euro' },
    { label: '£', code: 'Pound' },
    { label: '¥', code: 'Yen' },
    { label: '•', code: 'Bullet' },
  ],
  // Row 3
  [
    { label: '?123', code: 'ModeSymbols', type: 'modifier', width: 'w-[14%]' },
    { label: '.', code: 'Period' },
    { label: ',', code: 'Comma' },
    { label: '?', code: 'Question' },
    { label: '!', code: 'Exclamation' },
    { label: "'", code: 'Apostrophe' },
    { label: 'backspace', code: 'Backspace', type: 'action', width: 'w-[14%]' },
  ],
  // Row 4
  [
    { label: 'ABC', code: 'ModeLetters', type: 'modifier', width: 'w-[16%]' },
    { label: ',', code: 'Comma', width: 'w-[10%]' },
    { label: 'space', code: 'Space', type: 'space', width: 'flex-1' },
    { label: '.', code: 'Period', width: 'w-[10%]' },
    { label: 'enter', code: 'Enter', type: 'action', width: 'w-[18%]' },
  ]
];
