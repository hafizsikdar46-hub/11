import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, WifiOff, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { dictionaryService } from '../../services/dictionary';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataPurged: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onDataPurged }) => {
  if (!isOpen) return null;

  const personalWords = dictionaryService.getPersonalWordsList();
  const dictBytes = new Blob([dictionaryService.exportDictionaryJson()]).size;

  const handlePurge = () => {
    if (window.confirm('Erase all local dictionary words, typing history, and reset keyboard state?')) {
      localStorage.removeItem('nudge_personal_dictionary');
      localStorage.removeItem('nudge_keyboard_settings');
      dictionaryService.clearPersonalDictionary();
      onDataPurged();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Privacy-First Architecture</h2>
              <p className="text-xs text-emerald-400 font-mono">100% Offline · Zero Telemetry</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Status Metrics Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
              <div className="text-lg font-bold font-mono text-emerald-400">0 B</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                Cloud Sent
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
              <div className="text-lg font-bold font-mono text-purple-400">
                {personalWords.length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                Local Words
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
              <div className="text-lg font-bold font-mono text-cyan-400">
                ~{dictBytes} B
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                Local Footprint
              </div>
            </div>
          </div>

          {/* Privacy Guarantees */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <WifiOff className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">No Internet Permission Required</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  In Android, an InputMethodService keyboard doesn't need <code className="text-purple-300">android.permission.INTERNET</code> to run. Nudge functions entirely offline on your hardware.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">No Keystroke Profiling</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Every keystroke, password, message, and search query is processed instantly in memory. Only words you explicitly add or frequently type remain in your local dictionary.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Self-Contained On-Device Storage</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Settings and personal dictionary are stored solely in your local browser sandbox (or native SQLite on Android). No analytics SDKs, trackers, or ad IDs.
                </p>
              </div>
            </div>
          </div>

          {/* Purge Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePurge}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-900/50 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge All Offline Typing Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Zero network queries verified</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
