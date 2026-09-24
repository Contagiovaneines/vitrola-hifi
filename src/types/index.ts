export type AudioSourceType = 'local' | 'spotify' | 'deezer' | 'youtube';

export interface AudioFormatInfo {
  codec: 'FLAC' | 'MP3' | 'WAV' | 'OGG' | 'AAC' | 'ALAC';
  sampleRate: number;      // ex: 44100, 96000, 192000
  bitDepth?: number;       // ex: 16, 24
  bitrateKbps?: number;    // ex: 320, 1411
  channels: 1 | 2;         // Mono / Stereo
  isLossless: boolean;
}

export interface Track {
  id: string;
  source: AudioSourceType;
  title: string;
  artist: string;
  album: string;
  albumArtist?: string;
  year?: number;
  genre?: string[];
  trackNumber?: number;
  discNumber?: number;
  durationSec: number;
  uri: string;
  coverUri?: string;
  format: AudioFormatInfo;
  addedAt: string;
  lastPlayedAt?: string;
  playCount: number;
  dynamicRangeScore?: number;
  labelInfo?: {
    catalogNumber?: string;
    recordLabel?: string;
    matrixRpm: 33 | 45;
  };
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  coverUri?: string;
  trackCount: number;
  totalDurationSec: number;
  tracks: Track[];
  isHiRes: boolean;
  source: AudioSourceType;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  trackIds: string[];
  coverUri?: string;
  isSmart: boolean;
}

export interface ProviderCapabilities {
  canSeek: boolean;
  canAdjustSpeedPitch: boolean;
  canReadPCM: boolean;
  canExtractCoverArt: boolean;
  canRepeat: boolean;
  canShuffle: boolean;
  hasTrackDuration: boolean;
  isOfflineCapable: boolean;
  isFullTrackAvailable: boolean;
  restrictionsNotice?: string;
}

export interface PlaybackProvider {
  readonly id: AudioSourceType;
  readonly name: string;
  readonly capabilities: ProviderCapabilities;

  initialize(): Promise<void>;
  loadTrack(track: Track, fileBlob?: Blob): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(positionSec: number): Promise<void>;
  setVolume(volume: number): void;
  setSpeedPitch(rpm: 33 | 45, pitchRatio?: number): void;
  stop(): Promise<void>;
  destroy(): Promise<void>;
}

export type PlayerPlaybackState = 'empty' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';

export type NavigationTab = 'inicio' | 'biblioteca' | 'playlists' | 'fontes' | 'aparencia' | 'ytmusic';

export type ThemePreset = 'classica' | 'pretodourado' | 'neonmoderno';

