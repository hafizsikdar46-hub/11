import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, Download, Upload, BookOpen, Sparkles, Check, AlertCircle } from 'lucide-react';
import { PersonalWord } from '../../types/keyboard';
import { dictionaryService } from '../../services/dictionary';

interface DictionaryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DictionaryManager: React.FC<DictionaryManagerProps> = ({ isOpen, onClose }) => {
  const [words, setWords] = useState<PersonalWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newShortcut, setNewShortcut] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWords();
    }
  }, [isOpen]);

  const loadWords = () => {
    const list = dictionaryService.getPersonalWordsList();
    setWords(list);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;

    const success = dictionaryService.addPersonalWord(newWord.trim(), newShortcut.trim() || undefined);
    if (success) {
      showToast(`Added "${newWord.trim()}" to your dictionary!`);
      setNewWord('');
      setNewShortcut('');
      loadWords();
    }
  };

  const handleDeleteWord = (word: string) => {
    dictionaryService.removePersonalWord(word);
    showToast(`Removed "${word}"`);
    loadWords();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire personal dictionary?')) {
      dictionaryService.clearPersonalDictionary();
      showToast('Personal dictionary cleared');
      loadWords();
    }
  };

  const handleExport = () => {
    const jsonStr = dictionaryService.exportDictionaryJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nudge-personal-dictionary-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported dictionary file');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = dictionaryService.importDictionaryJson(content);
        if (result.success) {
          showToast(`Successfully imported ${result.count} words!`);
          loadWords();
        } else {
          showToast(result.error || 'Failed to import JSON', 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  if (!isOpen) return null;

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.shortcut && w.shortcut.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Personal Dictionary</h2>
              <p className="text-xs text-slate-400">
                {words.length} custom learned {words.length === 1 ? 'word' : 'words'} · 100% On-Device
              </p>
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

        {/* Notification Toast */}
        {notification && (
          <div
            className={`px-4 py-2 text-xs flex items-center gap-2 ${
              notification.type === 'error'
                ? 'bg-rose-950/80 text-rose-300 border-b border-rose-800'
                : 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Add Word Form */}
          <form onSubmit={handleAddWord} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>Teach Nudge a New Word</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Word or Phrase <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bhalo, Kire"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Optional Shortcut
                </label>
                <input
                  type="text"
                  placeholder="e.g. dhk, bh, omw"
                  value={newShortcut}
                  onChange={(e) => setNewShortcut(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!newWord.trim()}
              className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Dictionary</span>
            </button>
          </form>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleExport}
                className="p-1.5 text-xs rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1"
                title="Export JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <label className="p-1.5 text-xs rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {words.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="p-1.5 text-xs rounded-lg border border-rose-900/40 text-rose-400 hover:bg-rose-950/50 transition-colors flex items-center gap-1"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Word List */}
          <div className="space-y-1.5">
            {filteredWords.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                {searchQuery ? `No words match "${searchQuery}"` : 'No personal words added yet.'}
              </div>
            ) : (
              filteredWords.map((item) => (
                <div
                  key={item.word}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{item.word}</span>
                    {item.shortcut && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                        {item.shortcut}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">
                      used {item.frequency} {item.frequency === 1 ? 'time' : 'times'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteWord(item.word)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Remove word"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Words persist across browser reloads</span>
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
