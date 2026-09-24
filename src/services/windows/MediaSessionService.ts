import { Track } from '../../types';

export interface MediaSessionCallbacks {
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (pos: number) => void;
}

export class MediaSessionService {
  public static updateMetadata(track: Track | null): void {
    if (!('mediaSession' in navigator)) return;

    if (!track) {
      navigator.mediaSession.metadata = null;
      return;
    }

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          {
            src: track.coverUri || '/samples/cover-placeholder.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      });
    } catch (err) {
      console.warn('Falha ao atualizar MediaSession metadata:', err);
    }
  }

  public static setPlaybackState(state: 'playing' | 'paused' | 'none'): void {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = state;
    } catch (err) {
      console.warn('Falha ao definir playbackState no MediaSession:', err);
    }
  }

  public static setupActionHandlers(callbacks: MediaSessionCallbacks): void {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => callbacks.onPlay());
      navigator.mediaSession.setActionHandler('pause', () => callbacks.onPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => callbacks.onPrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => callbacks.onNext());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          callbacks.onSeek(details.seekTime);
        }
      });
    } catch (err) {
      console.warn('Falha ao registrar action handlers no MediaSession:', err);
    }
  }
}
