import React, { useState } from 'react';
import { X, Check, Volume2, Smartphone, Shield, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { KeyboardSettings, KeyboardTheme } from '../../types/keyboard';
import { THEME_CONFIGS } from '../../styles/themeConfig';
import { soundService } from '../../services/sound';

interface SettingsModalProps {
  isOpen: boolean;
  settings: KeyboardSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: KeyboardSettings) => void;
  onOpenDictionary: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onOpenDictionary
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'typing' | 'sound' | 'android'>('themes');

  if (!isOpen) return null;

  const handleThemeChange = (theme: KeyboardTheme) => {
    onUpdateSettings({ ...settings, theme });
    soundService.playKeyClick(settings.soundVolume, 'standard');
  };

  const handleToggle = (key: keyof KeyboardSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
    soundService.playKeyClick(settings.soundVolume, 'standard');
  };

  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({ ...settings, soundVolume: vol });
    soundService.playKeyClick(vol, 'standard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Nudge Settings</h2>
              <p className="text-xs text-slate-400">English QWERTY · Android IME MVP</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'themes', label: 'Themes (3)' },
            { id: 'typing', label: 'Typing & Correction' },
            { id: 'sound', label: 'Audio & Tactile' },
            { id: 'android', label: 'Android Setup' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* THEMES TAB */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select Theme
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose from the 3 curated visual themes for Nudge Keyboard.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Nudge Purple (Default) */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('purple')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex items-center justify-between ${
                    settings.theme === 'purple'
                      ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/50'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#181124] border border-[#372852] flex items-center justify-center p-1.5 shadow-inner">
                      <div className="w-full h-full bg-[#291e3e] rounded-[3px] shadow-[0_1px_0_#120b1c] flex items-center justify-center text-[10px] text-purple-200 font-bold">
                        Q
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Nudge Purple</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-medium">
                          Default
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Deep royal violet chassis with soft luminous accents
                      </p>
                    </div>
                  </div>
                  {settings.theme === 'purple' && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {/* White Theme */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('white')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex items-center justify-between ${
                    settings.theme === 'white'
                      ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/50'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d2d5dc] border border-[#b6bac4] flex items-center justify-center p-1.5 shadow-inner">
                      <div className="w-full h-full bg-white rounded-[3px] shadow-[0_1px_0_#9da2ad] flex items-center justify-center text-[10px] text-slate-800 font-bold">
                        Q
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-white">White</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Crisp daylight light gray with high-contrast tactile keycaps
                      </p>
                    </div>
                  </div>
                  {settings.theme === 'white' && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>

                {/* Black Theme */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('black')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex items-center justify-between ${
                    settings.theme === 'black'
                      ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/50'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d0e12] border border-[#272932] flex items-center justify-center p-1.5 shadow-inner">
                      <div className="w-full h-full bg-[#1c1d24] rounded-[3px] shadow-[0_1px_0_#07080a] flex items-center justify-center text-[10px] text-white font-bold">
                        Q
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-white">Black</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Pure AMOLED pitch black with sleek dark charcoal keys
                      </p>
                    </div>
                  </div>
                  {settings.theme === 'black' && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TYPING & AUTOCORRECT TAB */}
          {activeTab === 'typing' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Autocorrect & Suggestions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transparent, non-aggressive correction behavior.
                </p>
              </div>

              <div className="space-y-3">
                {/* Transparent Autocorrect */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Transparent Suggestions</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Show potential corrections in the suggestion bar without forced changes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('transparentAutocorrect')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.transparentAutocorrect ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.transparentAutocorrect ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Replace on Space */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Auto-Replace on Space</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Replace obvious typos when tapping spacebar, with instant 1-tap Undo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoReplaceOnSpace')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.autoReplaceOnSpace ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.autoReplaceOnSpace ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Spacebar Cursor Glide */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Spacebar Cursor Glide</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Slide your finger across the spacebar to smoothly steer the text cursor.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('spacebarCursorGlide')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.spacebarCursorGlide ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.spacebarCursorGlide ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Double Space Period */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Double-space Period</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Quickly pressing spacebar twice inserts a period followed by a space.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('doubleSpacePeriod')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.doubleSpacePeriod ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.doubleSpacePeriod ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Personal Dictionary Quick Link */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDictionary();
                }}
                className="w-full p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Manage Personal Dictionary</span>
                </div>
                <span className="text-xs underline">Open</span>
              </button>
            </div>
          )}

          {/* AUDIO & TACTILE TAB */}
          {activeTab === 'sound' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Feedback & Polish
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tactile feedback and keypress animations.
                </p>
              </div>

              <div className="space-y-3">
                {/* Key Popups Preview */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Key Press Popup Bubbles</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Show floating magnified letter previews above keys when pressed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('showKeyPreview')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.showKeyPreview ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.showKeyPreview ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound on Keypress */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Audio Click Sound</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Crisp procedural mechanical click on each keystroke.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('soundOnClick')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.soundOnClick ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.soundOnClick ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Volume Slider */}
                {settings.soundOnClick && (
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Click Volume</span>
                      <span className="font-mono text-purple-400">
                        {Math.round(settings.soundVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={settings.soundVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Haptic Feedback */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">Haptic Vibration</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gentle haptic pulse on compatible Android and mobile touch devices.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('hapticFeedback')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.hapticFeedback ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ANDROID SETUP WALKTHROUGH TAB */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs">
                <Smartphone className="w-5 h-5 shrink-0" />
                <span>
                  Nudge Keyboard is architected to function as a native Android InputMethodService (IME). Follow these standard Android steps to enable it on your phone:
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Open Android Settings</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Go to <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">Settings &gt; System &gt; Languages &amp; input</code>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Enable On-screen Keyboard</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">On-screen keyboard &gt; Manage keyboards</code> and toggle on <strong className="text-white">Nudge Keyboard</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Switch Input Method (IME)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      In any text field (WhatsApp, Chrome, Notes), tap the small keyboard icon in the bottom right navigation bar and select <strong className="text-white">Nudge Keyboard</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Zero Cloud Permissions Required</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Unlike other keyboards, Nudge requests NO network permission (<code className="text-emerald-300 bg-emerald-950/50 px-1 py-0.5 rounded">INTERNET = false</code>). Your typing data remains strictly local and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Nudge v1.0 MVP · Offline</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
