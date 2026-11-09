// Procedural audio synthesizer for tactile key clicks using Web Audio API

class SoundService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  playKeyClick(volume = 0.3, type: 'standard' | 'space' | 'backspace' | 'enter' = 'standard') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      let freq = 1200;
      let duration = 0.015;
      let vol = volume * 0.12;

      if (type === 'space') {
        freq = 600;
        duration = 0.025;
        vol = volume * 0.16;
      } else if (type === 'backspace') {
        freq = 450;
        duration = 0.02;
        vol = volume * 0.14;
      } else if (type === 'enter') {
        freq = 800;
        duration = 0.03;
        vol = volume * 0.18;
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + duration);

      // Fast attack, swift exponential decay
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay policy or unavailable, silently handle
    }
  }

  triggerHaptic(duration = 10) {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } catch {
      // Ignore if not supported
    }
  }
}

export const soundService = new SoundService();
