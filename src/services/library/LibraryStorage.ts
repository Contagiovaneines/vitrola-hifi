import { Album, Playlist, Track } from '../../types';
import { initialAlbums, initialPlaylists, initialTracks } from '../../data/mockData';

const STORAGE_KEYS = {
  TRACKS: 'vitrola_tracks_v1',
  ALBUMS: 'vitrola_albums_v1',
  PLAYLISTS: 'vitrola_playlists_v1',
  SETTINGS: 'vitrola_settings_v1',
};

export interface UserSettings {
  volume: number;
  theme: string;
  speed: 33 | 45;
  bassDb: number;
  trebleDb: number;
  tubeDrive: number;
  lastTrackId?: string;
}

export class LibraryStorage {
  public static loadTracks(): Track[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRACKS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Falha ao ler tracks do localStorage:', e);
    }
    return initialTracks;
  }

  public static saveTracks(tracks: Track[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
    } catch (e) {
      console.warn('Falha ao salvar tracks no localStorage:', e);
    }
  }

  public static addTrack(track: Track): void {
    const tracks = this.loadTracks();
    const updated = [track, ...tracks.filter((t) => t.id !== track.id)];
    this.saveTracks(updated);
  }

  public static removeTrack(trackId: string): void {
    const tracks = this.loadTracks();
    const updated = tracks.filter((t) => t.id !== trackId);
    this.saveTracks(updated);
  }

  public static loadAlbums(): Album[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALBUMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Falha ao ler albums do localStorage:', e);
    }
    return initialAlbums;
  }

  public static saveAlbums(albums: Album[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
    } catch (e) {
      console.warn('Falha ao salvar albums no localStorage:', e);
    }
  }

  public static loadPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Falha ao ler playlists do localStorage:', e);
    }
    return initialPlaylists;
  }

  public static savePlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.warn('Falha ao salvar playlists no localStorage:', e);
    }
  }

  public static loadSettings(): UserSettings {
    const defaults: UserSettings = {
      volume: 78,
      theme: 'classica',
      speed: 33,
      bassDb: 2.0,
      trebleDb: -1.0,
      tubeDrive: 4.5,
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...defaults, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Falha ao ler settings do localStorage:', e);
    }
    return defaults;
  }

  public static saveSettings(settings: Partial<UserSettings>): void {
    try {
      const current = this.loadSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Falha ao salvar settings no localStorage:', e);
    }
  }
}
