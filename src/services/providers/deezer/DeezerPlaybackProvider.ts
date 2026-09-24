import { PlaybackProvider, ProviderCapabilities, Track, PlayerPlaybackState } from '../../../types';
import { AudioEngine } from '../../audio/AudioEngine';

export interface DeezerTrackRaw {
  id: number;
  title: string;
  title_short: string;
  link: string;
  duration: number;
  preview: string;
  artist: {
    id: number;
    name: string;
    picture_medium?: string;
  };
  album: {
    id: number;
    title: string;
    cover_medium?: string;
    cover_big?: string;
  };
}

export class DeezerPlaybackProvider implements PlaybackProvider {
  readonly id = 'deezer' as const;
  readonly name = 'Deezer Audio API';
  readonly capabilities: ProviderCapabilities = {
    canSeek: true,
    canAdjustSpeedPitch: true,
    canReadPCM: true,
    canExtractCoverArt: true,
    canRepeat: true,
    canShuffle: true,
    hasTrackDuration: true,
    isOfflineCapable: false,
    isFullTrackAvailable: false,
    restrictionsNotice: 'Reprodução oficial limitada a prévias de 30 segundos (MP3 128 kbps). Faixas completas em HiFi FLAC exigem assinatura Deezer Premium e aplicativo oficial.',
  };

  private audioElement: HTMLAudioElement | null = null;
  private currentTrack: Track | null = null;
  private onStateChange?: (state: PlayerPlaybackState) => void;
  private onTimeUpdate?: (currentSec: number, durationSec: number) => void;
  private onTrackEnded?: () => void;
  private onError?: (message: string) => void;

  constructor(callbacks?: {
    onStateChange?: (state: PlayerPlaybackState) => void;
    onTimeUpdate?: (currentSec: number, durationSec: number) => void;
    onTrackEnded?: () => void;
    onError?: (message: string) => void;
  }) {
    if (callbacks) {
      this.onStateChange = callbacks.onStateChange;
      this.onTimeUpdate = callbacks.onTimeUpdate;
      this.onTrackEnded = callbacks.onTrackEnded;
      this.onError = callbacks.onError;
    }
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (!this.audioElement) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';

      audio.addEventListener('play', () => this.onStateChange?.('playing'));
      audio.addEventListener('pause', () => this.onStateChange?.('paused'));
      audio.addEventListener('waiting', () => this.onStateChange?.('buffering'));
      audio.addEventListener('ended', () => {
        this.onStateChange?.('ended');
        this.onTrackEnded?.();
      });
      audio.addEventListener('timeupdate', () => {
        this.onTimeUpdate?.(audio.currentTime, audio.duration || 30);
      });
      audio.addEventListener('error', () => {
        const error = audio.error;
        const msg = error ? `Erro Deezer CDN (${error.code}): ${error.message}` : 'Erro desconhecido ao carregar áudio Deezer';
        this.onError?.(msg);
        this.onStateChange?.('error');
      });

      this.audioElement = audio;

      // Conecta ao AudioEngine para medição real de VU e processamento valvulado
      try {
        const engine = AudioEngine.getInstance();
        engine.init(audio);
      } catch (err) {
        console.warn('Conexão Web Audio com Deezer preview efetuada em modo direto:', err);
      }
    }
  }

  async loadTrack(track: Track): Promise<void> {
    await this.initialize();
    if (!this.audioElement) return;

    this.currentTrack = track;
    this.audioElement.src = track.uri;
    this.audioElement.load();
    this.onStateChange?.('paused');
    this.onTimeUpdate?.(0, 30);
  }

  async play(): Promise<void> {
    if (!this.audioElement) return;
    try {
      const engine = AudioEngine.getInstance();
      await engine.resume();
      await this.audioElement.play();
    } catch (err) {
      this.onError?.('Falha ao iniciar reprodução Deezer: ' + (err as Error).message);
    }
  }

  async pause(): Promise<void> {
    if (!this.audioElement) return;
    this.audioElement.pause();
  }

  async seek(positionSec: number): Promise<void> {
    if (!this.audioElement) return;
    const clamped = Math.max(0, Math.min(positionSec, this.audioElement.duration || 30));
    this.audioElement.currentTime = clamped;
  }

  setVolume(volume: number): void {
    if (!this.audioElement) return;
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  setSpeedPitch(rpm: 33 | 45, pitchRatio?: number): void {
    if (!this.audioElement) return;
    const baseRate = rpm === 45 ? 45 / 33.333 : 1.0;
    this.audioElement.playbackRate = baseRate * (pitchRatio || 1.0);
  }

  async stop(): Promise<void> {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.onStateChange?.('empty');
  }

  async destroy(): Promise<void> {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
  }

  /**
   * Busca no catálogo público oficial do Deezer utilizando JSONP para contornar restrições de CORS
   * em navegadores ou webviews convencionais.
   */
  static search(query: string, limit = 15): Promise<Track[]> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve([]);
        return;
      }

      const callbackName = `deezer_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const script = document.createElement('script');
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Tempo limite excedido na busca do Deezer API.'));
      }, 8000);

      const cleanup = () => {
        clearTimeout(timeoutId);
        if (script.parentNode) script.parentNode.removeChild(script);
        delete (window as unknown as Record<string, unknown>)[callbackName];
      };

      (window as unknown as Record<string, unknown>)[callbackName] = (response: { data?: DeezerTrackRaw[] }) => {
        cleanup();
        if (!response || !response.data) {
          resolve([]);
          return;
        }

        const tracks: Track[] = response.data.map((item) => ({
          id: `deezer-${item.id}`,
          source: 'deezer',
          title: item.title,
          artist: item.artist?.name || 'Artista Desconhecido',
          album: item.album?.title || 'Single / EP',
          durationSec: 30, // Duração exata da prévia legal do Deezer
          uri: item.preview,
          coverUri: item.album?.cover_big || item.album?.cover_medium,
          format: {
            codec: 'MP3',
            sampleRate: 44100,
            bitDepth: 16,
            bitrateKbps: 128,
            channels: 2,
            isLossless: false,
          },
          addedAt: new Date().toISOString(),
          playCount: 0,
          labelInfo: {
            catalogNumber: `DEEZER-${item.id}`,
            recordLabel: 'Deezer Official Audio API',
            matrixRpm: 45,
          },
        }));

        resolve(tracks);
      };

      script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}&output=jsonp&callback=${callbackName}`;
      script.onerror = () => {
        cleanup();
        reject(new Error('Falha de rede ao conectar à API do Deezer.'));
      };

      document.body.appendChild(script);
    });
  }
}
