import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Sliders,
  BookOpen,
  ShieldCheck,
  Zap,
  RotateCcw,
  Volume2,
  Check,
  Palette,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Layers
} from 'lucide-react';
import { KeyboardSettings, KeyboardTheme } from './types/keyboard';
import { PhoneSimulator } from './components/simulator/PhoneSimulator';
import { TypingBenchmark } from './components/speedtest/TypingBenchmark';
import { SettingsModal } from './components/settings/SettingsModal';
import { DictionaryManager } from './components/dictionary/DictionaryManager';
import { PrivacyModal } from './components/privacy/PrivacyModal';
import { AndroidImeGuideModal } from './components/android/AndroidImeGuideModal';
import { dictionaryService } from './services/dictionary';
import { soundService } from './services/sound';
import { THEME_CONFIGS } from './styles/themeConfig';

const DEFAULT_SETTINGS: KeyboardSettings = {
  theme: 'purple',
  transparentAutocorrect: true,
  autoReplaceOnSpace: true,
  showKeyPreview: true,
  soundOnClick: true,
  soundVolume: 0.35,
  hapticFeedback: true,
  spacebarCursorGlide: true,
  doubleSpacePeriod: true,
  showNumberRowHints: true
};

export default function App() {
  const [settings, setSettings] = useState<KeyboardSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nudge_keyboard_settings');
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // Fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [activeView, setActiveView] = useState<'simulator' | 'benchmark'>('simulator');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState(false);

  const [dictWordCount, setDictWordCount] = useState<number>(0);

  useEffect(() => {
    setDictWordCount(dictionaryService.getPersonalWordsList().length);
  }, [isDictionaryOpen]);

  // Persist settings changes
  const updateSettings = (newSettings: KeyboardSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('nudge_keyboard_settings', JSON.stringify(newSettings));
    } catch {
      // Ignore
    }
  };

  const handleThemeSwitch = (theme: KeyboardTheme) => {
    updateSettings({ ...settings, theme });
    soundService.playKeyClick(settings.soundVolume, 'standard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* 1. TOP BAR CONTRACT: One-row, 3-zone contract */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <span className="text-white font-bold text-sm tracking-tight font-sans">N</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Nudge Keyboard
          </span>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveView('simulator')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'simulator'
                ? 'text-white font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Interactive Phone
          </button>
          <button
            type="button"
            onClick={() => setActiveView('benchmark')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'benchmark'
                ? 'text-white font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Typing Benchmark
          </button>
          <button
            type="button"
            onClick={() => setIsDictionaryOpen(true)}
            className="hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            Personal Dictionary
          </button>
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            Privacy Vault
          </button>
          <button
            type="button"
            onClick={() => setIsAndroidGuideOpen(true)}
            className="hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            Android Setup
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-purple-900/20 active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Column: Interactive Smartphone or Typing Benchmark */}
        <div className="w-full lg:w-[460px] xl:w-[480px] shrink-0 flex flex-col items-center">
          {/* Mobile view selector tabs */}
          <div className="flex items-center gap-1 p-1 mb-4 bg-slate-900 border border-slate-800 rounded-xl w-full max-w-[400px]">
            <button
              type="button"
              onClick={() => setActiveView('simulator')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeView === 'simulator'
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('benchmark')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeView === 'benchmark'
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Speed Benchmark</span>
            </button>
          </div>

          {activeView === 'simulator' ? (
            <PhoneSimulator
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenDictionary={() => setIsDictionaryOpen(true)}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
            />
          ) : (
            <TypingBenchmark
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenDictionary={() => setIsDictionaryOpen(true)}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
            />
          )}
        </div>

        {/* Right Column: Nudge Feature Control Center & Architectural Showcase */}
        <div className="flex-1 w-full space-y-6">
          {/* Feature Introduction Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nudge Keyboard · MVP Release 1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              A private, distraction-free QWERTY keyboard for Android.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed with rectangular keys, transparent autocorrect that respects your intent, an instant 1-tap Undo, personal dictionary, and complete offline privacy.
            </p>

            {/* Quick Spec Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>English QWERTY only</span>
              <span aria-hidden="true">·</span>
              <span>No Voice / No Emojis</span>
              <span aria-hidden="true">·</span>
              <span>Zero Network Permission</span>
              <span aria-hidden="true">·</span>
              <span>3 Themes</span>
            </div>
          </div>

          {/* Quick Theme Switcher Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Three Curated Themes</h3>
              </div>
              <span className="text-xs text-slate-400 uppercase font-mono">
                Active: {settings.theme}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'purple',
                  name: 'Nudge Purple',
                  color: 'bg-[#181124]',
                  keyColor: 'bg-[#291e3e]',
                  text: 'text-purple-200',
                  badge: 'Default'
                },
                {
                  id: 'white',
                  name: 'White',
                  color: 'bg-[#d2d5dc]',
                  keyColor: 'bg-white',
                  text: 'text-slate-900',
                  badge: 'Daylight'
                },
                {
                  id: 'black',
                  name: 'Black',
                  color: 'bg-[#0d0e12]',
                  keyColor: 'bg-[#1c1d24]',
                  text: 'text-white',
                  badge: 'AMOLED'
                }
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleThemeSwitch(th.id as KeyboardTheme)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.theme === th.id
                      ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-full h-8 rounded-lg ${th.color} p-1 mb-2 flex items-center justify-center`}>
                    <div className={`w-6 h-6 rounded-[4px] ${th.keyColor} ${th.text} flex items-center justify-center text-[10px] font-bold shadow-sm`}>
                      Q
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>{th.name}</span>
                    {settings.theme === th.id && (
                      <Check className="w-3 h-3 text-purple-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{th.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Autocorrect & 1-Tap Undo Mechanics */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">
                Transparent Autocorrect & 1-Tap Undo
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike keyboards that silently override unusual words or slang, Nudge presents corrections transparently across 3 distinct zones in the suggestion bar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300 block">1. Left Candidate</span>
                <span className="font-mono text-[11px] text-purple-300">"exact_input"</span>
                <p className="text-[11px] text-slate-400">
                  Tap to keep exactly what you typed. Never gets wiped out.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-purple-900/40 space-y-1 ring-1 ring-purple-500/20">
                <span className="font-semibold text-purple-300 block">2. Center Candidate</span>
                <span className="font-mono text-[11px] text-white font-bold">correction</span>
                <p className="text-[11px] text-slate-400">
                  Top correction. Replaces word if spacebar is pressed with high confidence.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300 block">3. Right Candidate</span>
                <span className="font-mono text-[11px] text-emerald-400">+ Add to Dict</span>
                <p className="text-[11px] text-slate-400">
                  Instantly learns unfamiliar words into your offline personal dictionary.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  Made a mistake? An <strong>Undo banner</strong> appears right above the keys!
                </span>
              </div>
            </div>
          </div>

          {/* Personal Dictionary & Privacy Hub Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Personal Dictionary Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">Personal Dictionary</h3>
                </div>
                <span className="text-xs font-mono text-purple-400">
                  {dictWordCount} learned
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores custom words, shortcuts, and frequently typed terms on-device with zero cloud telemetry.
              </p>
              <button
                type="button"
                onClick={() => setIsDictionaryOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Manage Words & Shortcuts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Privacy Architecture Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Offline Privacy Vault</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                  100% Local
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero network permissions requested. Keystrokes never leave your device or reach cloud servers.
              </p>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Inspect Offline Metrics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Android Activation Guide Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-950/40 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Android InputMethodService Integration
                </h4>
                <p className="text-xs text-slate-400">
                  Ready-to-use Android Manifest & Kotlin IME setup to enable Nudge system-wide.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAndroidGuideOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-purple-900/20"
            >
              <span>View Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* 3. MODALS */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
      />

      <DictionaryManager
        isOpen={isDictionaryOpen}
        onClose={() => {
          setIsDictionaryOpen(false);
          setDictWordCount(dictionaryService.getPersonalWordsList().length);
        }}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onDataPurged={() => {
          setSettings(DEFAULT_SETTINGS);
          setDictWordCount(0);
        }}
      />

      <AndroidImeGuideModal
        isOpen={isAndroidGuideOpen}
        onClose={() => setIsAndroidGuideOpen(false)}
      />

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>
          Nudge Keyboard · English QWERTY MVP · Offline-first, Zero-telemetry, iOS-inspired polish
        </p>
      </footer>
    </div>
  );
}
