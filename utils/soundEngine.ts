import { ToolType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy initialization handled in init()
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.4; // Initial volume
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.4, this.ctx?.currentTime || 0);
    }
  }

  playToolSound(tool: ToolType) {
    if (this.isMuted || !this.ctx) return;
    
    switch (tool) {
      case ToolType.ROCKET:
        this.playRocketSound();
        break;
      case ToolType.SHREDDER:
        this.playShredderSound();
        break;
      case ToolType.BUBBLE:
        this.playBubbleSound();
        break;
      case ToolType.BLACK_HOLE:
        this.playBlackHoleSound();
        break;
    }
  }

  playHealSound() {
    if (this.isMuted || !this.ctx) return;
    this.playChime();
  }

  // --- Synthesizers ---

  private createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playRocketSound() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Pink Noise for thrust
    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(200, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(1000, t + 2);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.8, t + 0.2);
    noiseGain.gain.linearRampToValueAtTime(0, t + 3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
    noise.stop(t + 3.1);

    // Sine sweep for "taking off" whistle
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 3);
    
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.1, t);
    oscGain.gain.linearRampToValueAtTime(0, t + 3);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 3.1);
  }

  private playShredderSound() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const duration = 2.5;

    // Grinding Noise
    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    // AM Modulation for "crunchy" texture
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sawtooth';
    lfo.frequency.value = 15; // Rattling speed

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 500; // Filter modulation depth

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.1);
    gain.gain.setValueAtTime(0.5, t + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + duration);
    lfo.stop(t + duration);
  }

  private playBubbleSound() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Play multiple distinct pops
    for(let i=0; i<8; i++) {
        const offset = i * 0.3 + Math.random() * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.frequency.setValueAtTime(400 + Math.random() * 400, t + offset);
        osc.frequency.exponentialRampToValueAtTime(1200 + Math.random() * 400, t + offset + 0.1);
        
        gain.gain.setValueAtTime(0, t + offset);
        gain.gain.linearRampToValueAtTime(0.3, t + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t + offset);
        osc.stop(t + offset + 0.2);
    }
  }

  private playBlackHoleSound() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const duration = 3;

    // Low deep thrum
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + duration); // Pitch drop

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.6, t + 0.5);
    gain.gain.linearRampToValueAtTime(0, t + duration);

    // Wobbly effect
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.3;
    
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start(t);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + duration);
    lfo.stop(t + duration);
  }

  private playChime() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Major chord: C, E, G
    const freqs = [523.25, 659.25, 783.99, 1046.50]; 
    
    freqs.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.1 + (i * 0.05)); // Staggered entry
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 3.1);
    });
  }
}

export const soundEngine = new SoundEngine();