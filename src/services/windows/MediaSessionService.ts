import { Track } from '../../types';

export interface MediaSessionCallbacks {
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (pos: number) => void;
  onSeekBackward?: (amountSec?: number) => void;
  onSeekForward?: (amountSec?: number) => void;
  onStop?: () => void;
}

export class MediaSessionService {
  private static isSessionActive = false;

  /**
   * Atualiza os metadados da sessão de mídia do Windows SMTC.
   * Suporta arte da capa em múltiplas resoluções para o flyout de volume e tela de bloqueio (Win+L).
   */
  public static updateMetadata(track: Track | null): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (!track) {
      this.clearSession();
      return;
    }

    try {
      const coverUrl = track.coverUri || '/samples/cover-placeholder.png';
      const artwork = [
        { src: coverUrl, sizes: '96x96', type: 'image/png' },
        { src: coverUrl, sizes: '128x128', type: 'image/png' },
        { src: coverUrl, sizes: '192x192', type: 'image/png' },
        { src: coverUrl, sizes: '256x256', type: 'image/png' },
        { src: coverUrl, sizes: '384x384', type: 'image/png' },
        { src: coverUrl, sizes: '512x512', type: 'image/png' },
      ];

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'Vitrola Hi-Fi Master',
        artwork,
      });

      this.isSessionActive = true;
    } catch (err) {
      console.warn('Falha ao atualizar MediaSession metadata:', err);
    }
  }

  /**
   * Atualiza o estado de reprodução do SMTC (playing, paused, none).
   */
  public static setPlaybackState(state: 'playing' | 'paused' | 'none'): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = state;
    } catch (err) {
      console.warn('Falha ao definir playbackState no MediaSession:', err);
    }
  }

  /**
   * Sincroniza a posição na barra de reprodução e duração no Windows SMTC (Win+L e barra de tarefas).
   */
  public static setPositionState(positionSec: number, durationSec: number, playbackRate = 1): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;
    if (!('setPositionState' in navigator.mediaSession)) return;

    if (!Number.isFinite(durationSec) || durationSec <= 0) return;
    const safePos = Math.max(0, Math.min(positionSec, durationSec));

    try {
      navigator.mediaSession.setPositionState({
        duration: durationSec,
        playbackRate: playbackRate,
        position: safePos,
      });
    } catch (err) {
      // Ignora pequenos erros transitórios durante seeks rápidos
    }
  }

  /**
   * Limpa a sessão de mídia do Windows para prevenir conflitos ou cards duplicados
   * quando a Vitrola estiver ociosa ou quando o usuário estiver usando outro reprodutor externo.
   */
  public static clearSession(): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      this.isSessionActive = false;
    } catch (err) {
      console.warn('Falha ao limpar sessão MediaSession:', err);
    }
  }

  /**
   * Configura os manipuladores de ação do Windows SMTC (teclas multimídia, flyout e Win+L).
   */
  public static setupActionHandlers(callbacks: MediaSessionCallbacks): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const registerHandler = (action: MediaSessionAction, handler: (details: MediaSessionActionDetails) => void) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (err) {
        // Alguns navegadores/versões não suportam certas ações opcionais
      }
    };

    registerHandler('play', () => callbacks.onPlay());
    registerHandler('pause', () => callbacks.onPause());
    registerHandler('previoustrack', () => callbacks.onPrev());
    registerHandler('nexttrack', () => callbacks.onNext());

    registerHandler('seekto', (details) => {
      if (details.seekTime !== undefined && Number.isFinite(details.seekTime)) {
        callbacks.onSeek(details.seekTime);
      }
    });

    registerHandler('seekbackward', (details) => {
      const seekOffset = details.seekOffset || 10;
      if (callbacks.onSeekBackward) {
        callbacks.onSeekBackward(seekOffset);
      } else {
        callbacks.onSeek(Math.max(0, (details.seekTime || 0) - seekOffset));
      }
    });

    registerHandler('seekforward', (details) => {
      const seekOffset = details.seekOffset || 10;
      if (callbacks.onSeekForward) {
        callbacks.onSeekForward(seekOffset);
      } else {
        callbacks.onSeek((details.seekTime || 0) + seekOffset);
      }
    });

    registerHandler('stop', () => {
      if (callbacks.onStop) {
        callbacks.onStop();
      } else {
        callbacks.onPause();
      }
    });
  }

  public static isRegistered(): boolean {
    return this.isSessionActive;
  }
}
