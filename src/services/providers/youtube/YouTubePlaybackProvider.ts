import { PlaybackProvider, ProviderCapabilities, Track, PlayerPlaybackState } from '../../../types';

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

export class YouTubePlaybackProvider implements PlaybackProvider {
  readonly id = 'youtube' as const;
  readonly name = 'YouTube IFrame Player (Conformidade Estrita)';
  readonly capabilities: ProviderCapabilities = {
    canSeek: true,
    canAdjustSpeedPitch: false,
    canReadPCM: false, // O áudio do YouTube corre isolado no IFrame; não há acesso aos dados PCM por proteção de DRM/TOS
    canExtractCoverArt: true,
    canRepeat: true,
    canShuffle: false,
    hasTrackDuration: true,
    isOfflineCapable: false,
    isFullTrackAvailable: true,
    restrictionsNotice: 'Reprodução oficial obrigatória via IFrame com vídeo visível. Extração de áudio, reprodução em segundo plano sem vídeo e acesso à biblioteca do YouTube Music são terminantemente proibidos pelas políticas do YouTube.',
  };

  private player: YTPlayerInstance | null = null;
  private containerId = 'vitrola-youtube-player-container';
  private currentTrack: Track | null = null;
  private isApiReady = false;
  private timePollInterval: number | null = null;

  private onStateChange?: (state: PlayerPlaybackState) => void;
  private onTimeUpdate?: (currentSec: number, durationSec: number) => void;
  private onTrackEnded?: () => void;
  private onError?: (message: string) => void;

  constructor(callbacks?: {
    containerId?: string;
    onStateChange?: (state: PlayerPlaybackState) => void;
    onTimeUpdate?: (currentSec: number, durationSec: number) => void;
    onTrackEnded?: () => void;
    onError?: (message: string) => void;
  }) {
    if (callbacks?.containerId) {
      this.containerId = callbacks.containerId;
    }
    if (callbacks) {
      this.onStateChange = callbacks.onStateChange;
      this.onTimeUpdate = callbacks.onTimeUpdate;
      this.onTrackEnded = callbacks.onTrackEnded;
      this.onError = callbacks.onError;
    }
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isApiReady = true;
      return;
    }

    return new Promise((resolve) => {
      const existingScript = document.getElementById('youtube-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        this.isApiReady = true;
        resolve();
      };
    });
  }

  /**
   * Vincula ou atualiza a instância do YT.Player dentro do elemento HTML visível.
   */
  async mountPlayer(targetElementId: string, videoId: string): Promise<void> {
    await this.initialize();

    if (!window.YT) {
      this.onError?.('A biblioteca YouTube IFrame API não pôde ser carregada.');
      return;
    }

    if (this.player) {
      try {
        this.player.destroy();
      } catch (err) {
        console.warn('Erro ao destruir player YouTube anterior:', err);
      }
      this.player = null;
    }

    return new Promise((resolve) => {
      this.player = new window.YT!.Player(targetElementId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1, // Exige controles nativos visíveis conforme diretrizes
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            resolve();
          },
          onStateChange: (event) => {
            this.handlePlayerStateChange(event.data);
          },
          onError: (event) => {
            const errCode = event.data;
            let msg = `Erro no player YouTube (Código ${errCode})`;
            if (errCode === 101 || errCode === 150) {
              msg = 'Este vídeo não permite reprodução incorporada em players externos.';
            } else if (errCode === 100) {
              msg = 'Vídeo não encontrado ou removido pelo YouTube.';
            }
            this.onError?.(msg);
            this.onStateChange?.('error');
          },
        },
      });

      this.startTimePolling();
    });
  }

  private handlePlayerStateChange(stateCode: number) {
    if (!window.YT) return;

    switch (stateCode) {
      case window.YT.PlayerState.PLAYING:
        this.onStateChange?.('playing');
        break;
      case window.YT.PlayerState.PAUSED:
        this.onStateChange?.('paused');
        break;
      case window.YT.PlayerState.BUFFERING:
        this.onStateChange?.('buffering');
        break;
      case window.YT.PlayerState.ENDED:
        this.onStateChange?.('ended');
        this.onTrackEnded?.();
        break;
      case window.YT.PlayerState.CUED:
        this.onStateChange?.('paused');
        break;
    }
  }

  private startTimePolling() {
    if (this.timePollInterval) clearInterval(this.timePollInterval);

    this.timePollInterval = window.setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const current = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        if (!isNaN(current) && !isNaN(duration) && duration > 0) {
          this.onTimeUpdate?.(current, duration);
        }
      }
    }, 500);
  }

  async loadTrack(track: Track): Promise<void> {
    this.currentTrack = track;
    const videoId = YouTubePlaybackProvider.extractVideoId(track.uri) || track.id.replace('youtube-', '');
    if (videoId) {
      await this.mountPlayer(this.containerId, videoId);
    }
  }

  async play(): Promise<void> {
    if (!this.player) return;
    this.player.playVideo();
  }

  async pause(): Promise<void> {
    if (!this.player) return;
    this.player.pauseVideo();
  }

  async seek(positionSec: number): Promise<void> {
    if (!this.player) return;
    this.player.seekTo(positionSec, true);
  }

  setVolume(volume: number): void {
    if (!this.player) return;
    this.player.setVolume(Math.round(volume * 100));
  }

  setSpeedPitch(): void {
    // A API do YouTube não permite controle arbitrário de pitch microtonal de vinil
    // Mantemos a taxa original ou avisamos restrição de conformidade
  }

  async stop(): Promise<void> {
    if (!this.player) return;
    this.player.stopVideo();
    this.onStateChange?.('empty');
  }

  async destroy(): Promise<void> {
    if (this.timePollInterval) {
      clearInterval(this.timePollInterval);
      this.timePollInterval = null;
    }
    if (this.player) {
      try {
        this.player.destroy();
      } catch (e) {
        console.warn('Erro ao destruir player YouTube:', e);
      }
      this.player = null;
    }
  }

  /**
   * Extrai o identificador e tipo de mídia (vídeo ou playlist) a partir de URL do YouTube ou YouTube Music.
   */
  static extractMedia(urlOrId: string): { type: 'video' | 'playlist'; id: string } | null {
    if (!urlOrId) return null;

    // 1. Extração de Playlist (YouTube e YouTube Music: music.youtube.com/playlist?list=...)
    const playlistMatch = urlOrId.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (playlistMatch) {
      return { type: 'playlist', id: playlistMatch[1] };
    }
    if (/^(?:PL|RD|OLAK5uy_|LR|LM|FL)[a-zA-Z0-9_-]+$/.test(urlOrId)) {
      return { type: 'playlist', id: urlOrId };
    }

    // 2. Extração de Vídeo único
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
      return { type: 'video', id: urlOrId };
    }

    const videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = urlOrId.match(videoRegex);
    if (match) {
      return { type: 'video', id: match[1] };
    }

    return null;
  }

  /**
   * Extrai o ID de 11 caracteres de um link do YouTube ou retorna o próprio identificador.
   */
  static extractVideoId(urlOrId: string): string | null {
    const media = YouTubePlaybackProvider.extractMedia(urlOrId);
    return media && media.type === 'video' ? media.id : null;
  }
}
