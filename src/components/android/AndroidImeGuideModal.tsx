import React, { useState } from 'react';
import { X, Smartphone, Code, Copy, Check, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface AndroidImeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidImeGuideModal: React.FC<AndroidImeGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const ANDROID_MANIFEST_SNIPPET = `<!-- AndroidManifest.xml: Zero network permissions for true privacy -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nudge.keyboard">

    <!-- CRITICAL: No android.permission.INTERNET requested -->

    <application
        android:label="Nudge Keyboard"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/Theme.NudgeKeyboard">

        <!-- Declares Nudge as an InputMethodService (IME) -->
        <service
            android:name=".NudgeInputMethodService"
            android:label="Nudge Keyboard"
            android:permission="android.permission.BIND_INPUT_METHOD"
            android:exported="true">
            <intent-filter>
                <action android:name="android.view.InputMethod" />
            </intent-filter>
            <meta-data
                android:name="android.view.im"
                android:resource="@xml/method" />
        </service>

        <!-- Companion Settings Activity -->
        <activity
            android:name=".SettingsActivity"
            android:label="Nudge Keyboard Settings"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const SERVICE_SNIPPET = `// NudgeInputMethodService.kt
package com.nudge.keyboard

import android.inputmethodservice.InputMethodService
import android.view.View
import android.view.inputmethod.EditorInfo

class NudgeInputMethodService : InputMethodService() {
    private lateinit var keyboardView: NudgeKeyboardView

    override fun onCreateInputView(): View {
        keyboardView = layoutInflater.inflate(R.layout.keyboard_view, null) as NudgeKeyboardView
        keyboardView.setOnKeyEventListener { char, isAction ->
            val inputConnection = currentInputConnection ?: return@setOnKeyEventListener
            when (char) {
                "BACKSPACE" -> inputConnection.deleteSurroundingText(1, 0)
                "ENTER" -> sendKeyChar('\\n')
                "SPACE" -> inputConnection.commitText(" ", 1)
                else -> inputConnection.commitText(char, 1)
            }
        }
        return keyboardView
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        // Setup transparent suggestions and active field type
    }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Android IME System Architecture</h2>
              <p className="text-xs text-slate-400">
                Native InputMethodService configuration · Zero Cloud Footprint
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Quick Explanation */}
          <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-200 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">How Nudge runs across all Android Apps:</strong>
              Android uses the <code className="bg-purple-900/40 px-1 py-0.5 rounded text-purple-300 font-mono">InputMethodService</code> system daemon. Once installed as an APK, the system prompts the user to enable it in Settings. After enabling, any app (WhatsApp, Telegram, Chrome, Notes, Gmail) will automatically invoke Nudge whenever an input field is tapped.
            </div>
          </div>

          {/* Code Snippet 1: Manifest */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-[11px] uppercase tracking-wider">
                1. AndroidManifest.xml (Privacy-First IME)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(ANDROID_MANIFEST_SNIPPET, 'manifest')}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300"
              >
                {copiedKey === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'manifest' ? 'Copied' : 'Copy XML'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px] overflow-x-auto leading-relaxed">
              {ANDROID_MANIFEST_SNIPPET}
            </pre>
          </div>

          {/* Code Snippet 2: Service */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-[11px] uppercase tracking-wider">
                2. NudgeInputMethodService.kt
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(SERVICE_SNIPPET, 'service')}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300"
              >
                {copiedKey === 'service' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'service' ? 'Copied' : 'Copy Kotlin'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px] overflow-x-auto leading-relaxed">
              {SERVICE_SNIPPET}
            </pre>
          </div>

          {/* Step by Step Activation */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
            <span className="font-semibold text-white text-[11px] uppercase tracking-wider block">
              3. Activation & Setup Steps
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Compile Nudge via Android Studio or run directly in Web preview.</li>
              <li>Open phone <strong className="text-white">Settings &gt; System &gt; Languages &amp; input</strong>.</li>
              <li>Tap <strong className="text-white">On-screen keyboard &gt; Manage keyboards</strong>.</li>
              <li>Toggle switch for <strong className="text-white">Nudge Keyboard</strong> to ON.</li>
              <li>Tap any chat or text area and switch input method to Nudge.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Targeting Android 12 to 15 (API 31+)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
