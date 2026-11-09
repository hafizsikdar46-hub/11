import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  FileText,
  Search,
  FlaskConical,
  Send,
  Wifi,
  Battery,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Check,
  Plus
} from 'lucide-react';
import { KeyboardSettings, InputModeType } from '../../types/keyboard';
import { NudgeKeyboard } from '../keyboard/NudgeKeyboard';

interface PhoneSimulatorProps {
  settings: KeyboardSettings;
  onOpenSettings: () => void;
  onOpenDictionary: () => void;
  onOpenPrivacy: () => void;
}

type SimulatorApp = 'messages' | 'notes' | 'search' | 'lab';

interface ChatMessage {
  id: string;
  sender: 'me' | 'maya';
  text: string;
  time: string;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  settings,
  onOpenSettings,
  onOpenDictionary,
  onOpenPrivacy
}) => {
  const [activeApp, setActiveApp] = useState<SimulatorApp>('messages');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);

  // Active input state across apps
  const [messagesInput, setMessagesInput] = useState('');
  const [messagesCursor, setMessagesCursor] = useState(0);

  const [notesTitle, setNotesTitle] = useState('Meeting Notes');
  const [notesContent, setNotesContent] = useState('Nudge is an offline-first keyboard for Android.\n\nKey advantages:\n- Zero telemetry\n- Transparent autocorrect\n- 1-tap undo');
  const [notesCursor, setNotesCursor] = useState(notesContent.length);
  const [activeNoteField, setActiveNoteField] = useState<'title' | 'content'>('content');

  const [searchInput, setSearchInput] = useState('');
  const [searchCursor, setSearchCursor] = useState(0);

  const [labInput, setLabInput] = useState('I definately love teh new keyboard');
  const [labCursor, setLabCursor] = useState(labInput.length);

  // Chat conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'maya', text: 'Hey! Did you check out Nudge Keyboard?', time: '09:38' },
    { id: '2', sender: 'me', text: 'Yes, testing the first MVP right now!', time: '09:39' },
    { id: '3', sender: 'maya', text: 'Try typing common typos like "teh" or "adn" to see the transparent autocorrect in action!', time: '09:40' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (activeApp === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeApp]);

  // Current active value and setter based on app
  const getCurrentValueAndCursor = (): {
    value: string;
    cursor: number;
    mode: InputModeType;
    setter: (val: string, cursor: number) => void;
  } => {
    switch (activeApp) {
      case 'messages':
        return {
          value: messagesInput,
          cursor: messagesCursor,
          mode: 'email', // triggers Send button
          setter: (v, c) => {
            setMessagesInput(v);
            setMessagesCursor(c);
          }
        };
      case 'notes':
        if (activeNoteField === 'title') {
          return {
            value: notesTitle,
            cursor: notesTitle.length,
            mode: 'text',
            setter: (v, c) => setNotesTitle(v)
          };
        }
        return {
          value: notesContent,
          cursor: notesCursor,
          mode: 'text',
          setter: (v, c) => {
            setNotesContent(v);
            setNotesCursor(c);
          }
        };
      case 'search':
        return {
          value: searchInput,
          cursor: searchCursor,
          mode: 'search',
          setter: (v, c) => {
            setSearchInput(v);
            setSearchCursor(c);
          }
        };
      case 'lab':
      default:
        return {
          value: labInput,
          cursor: labCursor,
          mode: 'text',
          setter: (v, c) => {
            setLabInput(v);
            setLabCursor(c);
          }
        };
    }
  };

  const { value: activeValue, cursor: activeCursor, mode: activeInputMode, setter: activeSetter } =
    getCurrentValueAndCursor();

  // Send message in Chat app
  const handleSendMessage = () => {
    if (!messagesInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: messagesInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setMessagesInput('');
    setMessagesCursor(0);

    // Friendly automated replies for realistic chat experience
    setTimeout(() => {
      const replies = [
        'Awesome! Notice how smooth the spacebar cursor glide is?',
        'And if you make an autocorrect mistake, the 1-tap Undo brings it right back!',
        'Also check out the personal dictionary in settings.',
        'Super clean iOS-inspired polish with rectangular keys!'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'maya',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Smartphone Chassis Container */}
      <div
        className="w-full max-w-[390px] sm:max-w-[410px] h-[780px] sm:h-[820px] bg-slate-950 rounded-[44px] sm:rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_8px_#1e293b,0_0_0_10px_#0f172a] flex flex-col relative overflow-hidden border border-slate-700/50"
      >
        {/* Smartphone Screen Inner */}
        <div className="w-full h-full bg-slate-900 rounded-[34px] sm:rounded-[38px] flex flex-col overflow-hidden relative border border-slate-800">
          {/* Top Status Bar (Android Standard) */}
          <div className="h-9 px-6 flex items-center justify-between text-[11px] font-medium text-slate-300 select-none z-20 shrink-0 bg-slate-900/90 backdrop-blur-sm">
            <span className="font-mono">09:41</span>
            {/* Front Camera Punch Hole */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-purple-400 font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Switcher Tabs within Phone */}
          <div className="h-10 px-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-around text-xs shrink-0 z-10">
            <button
              type="button"
              onClick={() => {
                setActiveApp('messages');
                setIsKeyboardOpen(true);
              }}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                activeApp === 'messages'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveApp('notes');
                setIsKeyboardOpen(true);
              }}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                activeApp === 'notes'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveApp('search');
                setIsKeyboardOpen(true);
              }}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                activeApp === 'search'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveApp('lab');
                setIsKeyboardOpen(true);
              }}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                activeApp === 'lab'
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Lab</span>
            </button>
          </div>

          {/* APP VIEWPORT CONTAINER */}
          <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-900">
            {/* APP 1: MESSAGES */}
            {activeApp === 'messages' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Top Bar */}
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
                      M
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Maya Rivera</div>
                      <div className="text-[10px] text-emerald-400">Active now</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Encrypted
                  </span>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'me' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[78%] px-3 py-2 rounded-2xl ${
                          msg.sender === 'me'
                            ? 'bg-purple-600 text-white rounded-br-sm'
                            : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700/60'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-2 border-t border-slate-800 bg-slate-950/70 flex items-center gap-1.5 shrink-0">
                  <div
                    onClick={() => setIsKeyboardOpen(true)}
                    className="flex-1 min-h-[38px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white flex items-center cursor-text relative"
                  >
                    {messagesInput ? (
                      <span className="truncate">
                        {messagesInput.slice(0, messagesCursor)}
                        <span className="w-0.5 h-3.5 bg-purple-400 inline-block animate-pulse align-middle mx-0.5" />
                        {messagesInput.slice(messagesCursor)}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center">
                        Tap here to type with Nudge...
                        <span className="w-0.5 h-3.5 bg-purple-400 inline-block animate-pulse align-middle ml-1" />
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!messagesInput.trim()}
                    className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* APP 2: NOTES */}
            {activeApp === 'notes' && (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                    Quick Memo
                  </span>
                  <span className="text-[10px] text-purple-400">
                    {notesContent.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                {/* Title */}
                <div
                  onClick={() => {
                    setActiveNoteField('title');
                    setIsKeyboardOpen(true);
                  }}
                  className="cursor-text"
                >
                  <label className="text-[10px] text-slate-500 uppercase">Title</label>
                  <div className="text-base font-bold text-white border-b border-transparent hover:border-slate-700 py-0.5">
                    {notesTitle}
                    {activeNoteField === 'title' && (
                      <span className="w-0.5 h-4 bg-purple-400 inline-block animate-pulse align-middle ml-1" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div
                  onClick={() => {
                    setActiveNoteField('content');
                    setIsKeyboardOpen(true);
                  }}
                  className="flex-1 min-h-[140px] p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed cursor-text relative"
                >
                  {notesContent.slice(0, notesCursor)}
                  {activeNoteField === 'content' && (
                    <span className="w-0.5 h-3.5 bg-purple-400 inline-block animate-pulse align-middle mx-0.5" />
                  )}
                  {notesContent.slice(notesCursor)}
                </div>
              </div>
            )}

            {/* APP 3: WEB SEARCH */}
            {activeApp === 'search' && (
              <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
                <div className="text-center pt-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    Nudge Search
                  </span>
                  <p className="text-[11px] text-slate-400">Offline private web gateway</p>
                </div>

                {/* Search Bar Input */}
                <div
                  onClick={() => setIsKeyboardOpen(true)}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white flex items-center gap-2 cursor-text shadow-sm"
                >
                  <Search className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="flex-1 truncate">
                    {searchInput ? (
                      <span>
                        {searchInput.slice(0, searchCursor)}
                        <span className="w-0.5 h-3.5 bg-purple-400 inline-block animate-pulse align-middle mx-0.5" />
                        {searchInput.slice(searchCursor)}
                      </span>
                    ) : (
                      <span className="text-slate-500">Search anything or type a URL...</span>
                    )}
                  </div>
                </div>

                {/* Simulated Results */}
                <div className="space-y-2.5">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Instant Results Preview
                  </div>
                  {[
                    {
                      title: 'Nudge Keyboard: Architecture of a zero-cloud Android IME',
                      snippet: 'How local-first token prediction and Levenshtein distance enable instantaneous typing without server latency.'
                    },
                    {
                      title: 'Transparent Autocorrect: Why users prefer choice over force',
                      snippet: 'Examining user retention when suggestions remain non-intrusive and 1-tap undo is always accessible.'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-1 text-xs"
                    >
                      <h4 className="font-semibold text-purple-300 hover:underline cursor-pointer">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 leading-normal text-[11px]">
                        {item.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APP 4: AUTOCORRECT LAB */}
            {activeApp === 'lab' && (
              <div className="flex-1 flex flex-col p-3 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                    <span>Autocorrect Lab & Inspector</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded-full font-mono">
                    Live
                  </span>
                </div>

                {/* Test sentence area */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">
                    Editable Input Field
                  </label>
                  <div
                    onClick={() => setIsKeyboardOpen(true)}
                    className="mt-1 p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white cursor-text min-h-[50px] relative"
                  >
                    {labInput.slice(0, labCursor)}
                    <span className="w-0.5 h-3.5 bg-purple-400 inline-block animate-pulse align-middle mx-0.5" />
                    {labInput.slice(labCursor)}
                  </div>
                </div>

                {/* Diagnostic metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/50">
                    <span className="text-slate-400 text-[10px] block">Current Word / Token</span>
                    <span className="font-mono text-purple-300 font-semibold truncate block">
                      {labInput.slice(0, labCursor).match(/([a-zA-Z0-9'’]+)$/)?.[1] || '(none)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/50">
                    <span className="text-slate-400 text-[10px] block">Cursor Index</span>
                    <span className="font-mono text-white font-semibold">
                      {labCursor} / {labInput.length}
                    </span>
                  </div>
                </div>

                {/* Interactive Typo Quick Tests */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Test Common Typos (Click to load)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { typo: 'teh', correct: 'the' },
                      { typo: 'definately', correct: 'definitely' },
                      { typo: 'recieve', correct: 'receive' },
                      { typo: 'adn', correct: 'and' },
                      { typo: 'wont', correct: "won't" }
                    ].map((sample) => (
                      <button
                        key={sample.typo}
                        type="button"
                        onClick={() => {
                          setLabInput(`Check this: ${sample.typo}`);
                          setLabCursor(`Check this: ${sample.typo}`.length);
                          setIsKeyboardOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] border border-slate-700 transition-colors font-mono"
                      >
                        {sample.typo} &rarr; {sample.correct}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC KEYBOARD DRAWER */}
          {isKeyboardOpen ? (
            <div className="w-full shrink-0 z-30 transition-all duration-200">
              <NudgeKeyboard
                value={activeValue}
                cursorPosition={activeCursor}
                inputMode={activeInputMode}
                settings={settings}
                onChange={activeSetter}
                onEnter={() => {
                  if (activeApp === 'messages') {
                    handleSendMessage();
                  } else {
                    activeSetter(activeValue + '\n', activeCursor + 1);
                  }
                }}
                onClose={() => setIsKeyboardOpen(false)}
                onOpenSettings={onOpenSettings}
                onOpenDictionary={onOpenDictionary}
                onOpenPrivacy={onOpenPrivacy}
              />
            </div>
          ) : (
            <div className="h-12 w-full bg-slate-950 border-t border-slate-800 flex items-center justify-center shrink-0">
              <button
                type="button"
                onClick={() => setIsKeyboardOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:bg-purple-600/40 transition-colors flex items-center gap-1.5"
              >
                <span>Open Nudge Keyboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
