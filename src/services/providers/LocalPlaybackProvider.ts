import {
  AudioSourceType,
  PlaybackProvider,
  PlayerPlaybackState,
  ProviderCapabilities,
  Track
} from '../../types';
import { AudioEngine } from '../audio/AudioEngine';

export interface LocalProviderCallbacks {
  onStateChange: (state: PlayerPlaybackState) => void;
  onTimeUpdate: (currentTimeSec: number, durationSec: number) => void;
  onTrackEnded: () => void;
  onError: (errorMessage: string) => void;
}

export class LocalPlaybackProvider implements PlaybackProvider {
  public readonly id: AudioSourceType = 'local';
  public readonly name: string = 'Arquivos Locais (Hi-Res Engine)';
  public readonly capabilities: ProviderCapabilities = {
    canSeek: true,
    canAdjustSpeedPitch: true,
    canReadPCM: true,
    canExtractCoverArt: true,
    canRepeat: true,
    canShuffle: true,
    hasTrackDuration: true,
    isOfflineCapable: true,
    isFullTrackAvailable: true,
  };

  private audio: HTMLAudioElement;
  private currentObjectUrl: string | null = null;
  private callbacks: LocalProviderCallbacks;
  private isInitialized: boolean = false;
  private currentTrack: Track | null = null;

  constructor(callbacks: LocalProviderCallbacks) {
    this.callbacks = callbacks;
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.audio.addEventListener('play', () => {
      this.callbacks.onStateChange('playing');
    });

    this.audio.addEventListener('pause', () => {
      if (this.audio.currentTime < this.audio.duration) {
        this.callbacks.onStateChange('paused');
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.callbacks.onTimeUpdate(this.audio.currentTime, this.audio.duration || 0);
    });

    this.audio.addEventListener('ended', () => {
      this.callbacks.onTrackEnded();
    });

    this.audio.addEventListener('waiting', () => {
      this.callbacks.onStateChange('buffering');
    });

    this.audio.addEventListener('error', () => {
      const err = this.audio.error;
      let msg = 'Erro desconhecido ao decodificar arquivo de áudio.';
      if (err) {
        switch (err.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            msg = 'A reprodução foi abortada.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            msg = 'Falha de rede ao carregar a mídia.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            msg = 'Codec de áudio não suportado ou arquivo corrompido.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            msg = 'Formato de áudio não suportado pelo sistema operacional.';
            break;
        }
      }
      this.callbacks.onStateChange('error');
      this.callbacks.onError(msg);
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    const engine = AudioEngine.getInstance();
    engine.init(this.audio);
    this.isInitialized = true;
  }

  public async loadTrack(track: Track, fileBlob?: Blob): Promise<void> {
    await this.initialize();

    // Revoga URL antiga se houver
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    this.currentTrack = track;

    if (fileBlob) {
      this.currentObjectUrl = URL.createObjectURL(fileBlob);
      this.audio.src = this.currentObjectUrl;
    } else if (track.uri) {
      this.audio.src = track.uri;
    } else {
      // Fallback para amostras de fábrica empacotadas
      if (track.title.toLowerCase().includes('so what')) {
        this.audio.src = '/samples/miles-davis-so-what-sample.wav';
      } else if (track.title.toLowerCase().includes('clube')) {
        this.audio.src = '/samples/clube-da-esquina-sample.wav';
      } else {
        this.audio.src = '/samples/miles-davis-so-what-sample.wav';
      }
    }

    this.audio.load();
  }

  public async play(): Promise<void> {
    try {
      const engine = AudioEngine.getInstance();
      await engine.resume();
      await this.audio.play();
    } catch (err) {
      console.warn('Falha no play automático (política de autoplay):', err);
      this.callbacks.onStateChange('paused');
    }
  }

  public async pause(): Promise<void> {
    this.audio.pause();
  }

  public async seek(positionSec: number): Promise<void> {
    if (isNaN(positionSec)) return;
    this.audio.currentTime = Math.max(0, Math.min(this.audio.duration || 0, positionSec));
  }

  public setVolume(volume: number): void {
    // 0.0 a 1.0
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
    AudioEngine.getInstance().setMasterGain(clamped);
  }

  public setSpeedPitch(rpm: 33 | 45, pitchRatio: number = 0): void {
    // 33 RPM = taxa base 1.0
    // 45 RPM = 45 / 33.333 = 1.35
    const baseRate = rpm === 45 ? 1.35 : 1.0;
    const finalRate = Math.max(0.5, Math.min(2.0, baseRate * (1 + pitchRatio)));
    this.audio.playbackRate = finalRate;
  }

  public async stop(): Promise<void> {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.callbacks.onStateChange('empty');
  }

  public getAudioElement(): HTMLAudioElement {
    return this.audio;
  }

  public async destroy(): Promise<void> {
    this.audio.pause();
    this.audio.src = '';
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}
