/**
 * AudioEngine - Web Audio API DSP Graph
 * Proporciona processamento de áudio analógico em tempo real:
 * - Filtros Biquad para Graves (LowShelf) e Agudos (HighShelf)
 * - Curva de saturação harmônica valvular (WaveShaper)
 * - Atenuação e ganho master
 * - Medição legítima de sinal PCM via AnalyserNode para canais L e R (VU Meters)
 */

export class AudioEngine {
  private static instance: AudioEngine;
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  private tubeShaper: WaveShaperNode | null = null;
  private masterGain: GainNode | null = null;
  private splitter: ChannelSplitterNode | null = null;
  private analyserL: AnalyserNode | null = null;
  private analyserR: AnalyserNode | null = null;
  private pcmBufferL: Float32Array = new Float32Array(512);
  private pcmBufferR: Float32Array = new Float32Array(512);
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public init(audioElement: HTMLAudioElement): void {
    if (this.isConnected) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Source node from audio element
      this.sourceNode = this.ctx.createMediaElementSource(audioElement);

      // Bass EQ: Low-shelf at 150 Hz
      this.bassFilter = this.ctx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 150;
      this.bassFilter.gain.value = 2.0;

      // Treble EQ: High-shelf at 3000 Hz
      this.trebleFilter = this.ctx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.value = 3000;
      this.trebleFilter.gain.value = -1.0;

      // Tube Saturation WaveShaper
      this.tubeShaper = this.ctx.createWaveShaper();
      this.tubeShaper.curve = this.makeTubeDistortionCurve(4.5) as any;
      this.tubeShaper.oversample = '4x';

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.78;

      // Channel Splitter & Analysers for stereo VU
      this.splitter = this.ctx.createChannelSplitter(2);
      this.analyserL = this.ctx.createAnalyser();
      this.analyserL.fftSize = 512;
      this.analyserL.smoothingTimeConstant = 0.3; // 300ms balística

      this.analyserR = this.ctx.createAnalyser();
      this.analyserR.fftSize = 512;
      this.analyserR.smoothingTimeConstant = 0.3;

      // Signal Routing:
      // Source -> Bass -> Treble -> TubeSat -> MasterGain -> Destination
      //                                      -> Splitter -> AnalyserL / AnalyserR
      this.sourceNode.connect(this.bassFilter);
      this.bassFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.tubeShaper);
      this.tubeShaper.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Splitter connection for metering
      this.masterGain.connect(this.splitter);
      this.splitter.connect(this.analyserL, 0);
      this.splitter.connect(this.analyserR, 1);

      this.isConnected = true;
    } catch (err) {
      console.warn('Web Audio API Graph initialization deferred:', err);
    }
  }

  public async resume(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public setBassGain(db: number): void {
    if (this.bassFilter) {
      this.bassFilter.gain.setValueAtTime(db, this.ctx?.currentTime || 0);
    }
  }

  public setTrebleGain(db: number): void {
    if (this.trebleFilter) {
      this.trebleFilter.gain.setValueAtTime(db, this.ctx?.currentTime || 0);
    }
  }

  public setTubeDrive(driveDb: number): void {
    if (this.tubeShaper) {
      this.tubeShaper.curve = this.makeTubeDistortionCurve(driveDb) as any;
    }
  }

  public setMasterGain(gain0to1: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(gain0to1, this.ctx?.currentTime || 0);
    }
  }

  /**
   * Medição real de PCM legítimo dos canais L e R.
   * Retorna valores em dBFS (-40 dB a +3 dB).
   */
  public getVuMeterLevels(): { leftDb: number; rightDb: number } {
    if (!this.analyserL || !this.analyserR) {
      return { leftDb: -40, rightDb: -40 };
    }

    this.analyserL.getFloatTimeDomainData(this.pcmBufferL as any);
    this.analyserR.getFloatTimeDomainData(this.pcmBufferR as any);

    const calcRmsDb = (buf: Float32Array): number => {
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        sum += buf[i] * buf[i];
      }
      const rms = Math.sqrt(sum / buf.length);
      if (rms <= 0.0001) return -40; // Silêncio
      const db = 20 * Math.log10(rms);
      return Math.max(-40, Math.min(3, db + 6)); // Ajuste de ganho para escala VU
    };

    return {
      leftDb: calcRmsDb(this.pcmBufferL),
      rightDb: calcRmsDb(this.pcmBufferR)
    };
  }

  /**
   * Gera curva não-linear simétrica simulando compressão e saturação harmônica de válvula triodo (12AX7).
   */
  private makeTubeDistortionCurve(amount: number): Float32Array {
    const k = Math.max(0, amount) * 2;
    const n = 4096;
    const curve = new Float32Array(n);
    const deg = Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      if (k === 0) {
        curve[i] = x;
      } else {
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
    }
    return curve;
  }
}
