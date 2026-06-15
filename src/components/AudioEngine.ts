/**
 * Web Audio API synthesizer for premium UI interactive sounds
 */
class Synthesizer {
  private ctx: AudioContext | null = null;
  public isEnabled: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggleSound(forceState?: boolean) {
    this.isEnabled = forceState !== undefined ? forceState : !this.isEnabled;
    if (this.isEnabled) {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBeep(880, 0.05, 'triangle', 0.15); // Instant happy chime indicating sound enabled
    }
    return this.isEnabled;
  }

  playBeep(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }
  }

  playSciFiSweep() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const duration = 0.6;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignored
    }
  }

  playClick() {
    this.playBeep(520, 0.08, 'sine', 0.05);
  }

  playHover() {
    this.playBeep(320, 0.04, 'triangle', 0.03);
  }

  playSuccess() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.12);

      osc.start();
      osc.stop(now + 0.4);
    } catch {
      // Ignored
    }
  }
}

export const audioSynthesizer = new Synthesizer();
export default audioSynthesizer;
