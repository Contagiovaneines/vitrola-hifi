import React, { useState, useEffect, useRef } from 'react';
import {
  NavigationTab,
  PlayerPlaybackState,
  Track,
  ThemePreset,
  AudioSourceType,
  Album,
  Playlist,
} from './types';
import { WindowHeader } from './components/layout/WindowHeader';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerView } from './views/PlayerView';
import { LibraryView } from './views/LibraryView';
import { PlaylistsView } from './views/PlaylistsView';
import { SourcesView } from './views/SourcesView';
import { CustomizationView } from './views/CustomizationView';
import { FullscreenView } from './views/FullscreenView';
import { MiniPlayerWidget } from './components/widget/MiniPlayerWidget';
import { LibraryStorage } from './services/library/LibraryStorage';
import { AudioTagReader } from './services/library/AudioTagReader';
import { LocalPlaybackProvider } from './services/providers/LocalPlaybackProvider';
import { AudioEngine } from './services/audio/AudioEngine';
import { MediaSessionService } from './services/windows/MediaSessionService';
import { SpotifyAuth } from './services/providers/spotify/SpotifyAuth';
import { SpotifyPlaybackProvider } from './services/providers/spotify/SpotifyPlaybackProvider';
import { ExternalLink, Disc } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('inicio');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMiniWidgetOpen, setIsMiniWidgetOpen] = useState(false);

  // Stored Library
  const [tracks, setTracks] = useState<Track[]>(() => LibraryStorage.loadTracks());
  const [albums, setAlbums] = useState<Album[]>(() => LibraryStorage.loadAlbums());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => LibraryStorage.loadPlaylists());

  // Stored Settings
  const savedSettings = LibraryStorage.loadSettings();

  // Playback state
  const [playbackState, setPlaybackState] = useState<PlayerPlaybackState>('empty');
  const [speed, setSpeed] = useState<33 | 45>(savedSettings.speed || 33);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0] || null);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(tracks[0]?.durationSec || 0);
  const [queue, setQueue] = useState<Track[]>(tracks.slice(1));
  const [currentSource, setSource] = useState<AudioSourceType>('local');

  // Spotify Honest Playback Notice Modal
  const [spotifyNotice, setSpotifyNotice] = useState<{
    track: Track;
    url: string;
    reason?: string;
  } | null>(null);

  // Preamp & Audio Knobs
  const [bassDb, setBassDb] = useState(savedSettings.bassDb ?? 2.0);
  const [trebleDb, setTrebleDb] = useState(savedSettings.trebleDb ?? -1.0);
  const [tubeDrive, setTubeDrive] = useState(savedSettings.tubeDrive ?? 4.5);
  const [volume, setVolume] = useState(savedSettings.volume ?? 78);

  // VUs
  const [vuLeftDb, setVuLeftDb] = useState(-40);
  const [vuRightDb, setVuRightDb] = useState(-40);

  // Themes & Materials
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(
    (savedSettings.theme as ThemePreset) || 'classica'
  );
  const [selectedWood, setSelectedWood] = useState('mogno');
  const [selectedMetal, setSelectedMetal] = useState('latao');
  const [selectedCloth, setSelectedCloth] = useState('tweed');
  const [armLampBrightness, setArmLampBrightness] = useState(78);
  const [colorTempK, setColorTempK] = useState(2700);
  const [isVuBacklightOn, setIsVuBacklightOn] = useState(true);

  // Local Playback Provider reference
  const providerRef = useRef<LocalPlaybackProvider | null>(null);
  const fileBlobsRef = useRef<Map<string, Blob>>(new Map());

  // 1. Initialize LocalPlaybackProvider & Windows SMTC
  useEffect(() => {
    const provider = new LocalPlaybackProvider({
      onStateChange: (state) => {
        setPlaybackState(state);
        if (currentSource === 'local') {
          MediaSessionService.setPlaybackState(state === 'playing' ? 'playing' : 'paused');
        }
      },
      onTimeUpdate: (cur, dur) => {
        setCurrentTimeSec(cur);
        if (dur > 0) setDurationSec(dur);
        if (currentSource === 'local') {
          MediaSessionService.setPositionState(cur, dur > 0 ? dur : 180);
        }
      },
      onTrackEnded: () => {
        handleNextTrack();
      },
      onError: (msg) => {
        console.error('Erro de reprodução de áudio:', msg);
      },
    });

    providerRef.current = provider;
    provider.setVolume(volume / 100);
    provider.setSpeedPitch(speed);

    // Initial default track load
    if (currentTrack && currentTrack.source === 'local') {
      provider.loadTrack(currentTrack);
      MediaSessionService.updateMetadata(currentTrack);
    }

    // Windows SMTC Setup (System Media Transport Controls)
    MediaSessionService.setupActionHandlers({
      onPlay: () => handlePlayToggle(),
      onPause: () => handlePlayToggle(),
      onPrev: () => handlePrevTrack(),
      onNext: () => handleNextTrack(),
      onSeek: (pos) => handleSeek(pos),
      onSeekBackward: (offset) => handleSeek(currentTimeSec - (offset || 10)),
      onSeekForward: (offset) => handleSeek(currentTimeSec + (offset || 10)),
      onStop: () => handleEject(),
    });

    return () => {
      provider.destroy();
    };
  }, []);

  // 2. Real-time PCM VU Meter Loop
  useEffect(() => {
    let animId: number;

    const updateVus = () => {
      if (playbackState === 'playing') {
        if (currentSource === 'youtube') {
          const t = Date.now() / 140;
          const left = -14 + Math.sin(t * 1.7) * 7 + Math.cos(t * 3.3) * 5;
          const right = -15 + Math.sin(t * 1.5 + 0.6) * 7 + Math.cos(t * 2.9) * 5;
          setVuLeftDb(Math.max(-40, Math.min(3, left)));
          setVuRightDb(Math.max(-40, Math.min(3, right)));
        } else {
          const levels = AudioEngine.getInstance().getVuMeterLevels();
          setVuLeftDb(levels.leftDb);
          setVuRightDb(levels.rightDb);
        }
      } else {
        setVuLeftDb(-40);
        setVuRightDb(-40);
      }
      animId = requestAnimationFrame(updateVus);
    };

    animId = requestAnimationFrame(updateVus);
    return () => cancelAnimationFrame(animId);
  }, [playbackState, currentSource]);

  // 3. Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    LibraryStorage.saveSettings({ theme: currentTheme });
  }, [currentTheme]);

  // 4. Update Engine parameters when knobs change
  useEffect(() => {
    const engine = AudioEngine.getInstance();
    engine.setBassGain(bassDb);
    LibraryStorage.saveSettings({ bassDb });
  }, [bassDb]);

  useEffect(() => {
    const engine = AudioEngine.getInstance();
    engine.setTrebleGain(trebleDb);
    LibraryStorage.saveSettings({ trebleDb });
  }, [trebleDb]);

  useEffect(() => {
    const engine = AudioEngine.getInstance();
    engine.setTubeDrive(tubeDrive);
    LibraryStorage.saveSettings({ tubeDrive });
  }, [tubeDrive]);

  useEffect(() => {
    if (currentSource === 'youtube') {
      const iframe = document.getElementById('vitrola-youtube-player-iframe') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(`{"event":"command","func":"setVolume","args":[${volume}]}`, '*');
    }
    if (providerRef.current) {
      providerRef.current.setVolume(volume / 100);
    }
    LibraryStorage.saveSettings({ volume });
  }, [volume, currentSource]);

  useEffect(() => {
    if (providerRef.current) {
      providerRef.current.setSpeedPitch(speed);
    }
    LibraryStorage.saveSettings({ speed });
  }, [speed]);

  // 5. Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key.toLowerCase() === 'f' || e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handlePlayToggle();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSeek(currentTimeSec + 5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(currentTimeSec - 5);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolume((v) => Math.min(100, v + 5));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolume((v) => Math.max(0, v - 5));
      } else if (e.key.toLowerCase() === 'm') {
        setVolume((v) => (v > 0 ? 0 : 75));
      } else if (e.key === '1') {
        setCurrentTab('inicio');
      } else if (e.key === '2') {
        setCurrentTab('biblioteca');
      } else if (e.key === '3') {
        setCurrentTab('playlists');
      } else if (e.key === '4') {
        setCurrentTab('fontes');
      } else if (e.key === '5') {
        setCurrentTab('aparencia');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentTimeSec, playbackState, currentSource, durationSec]);

  // Handlers
  const handlePlayToggle = () => {
    if (currentSource === 'youtube') {
      const iframe = document.getElementById('vitrola-youtube-player-iframe') as HTMLIFrameElement;
      if (playbackState === 'playing') {
        iframe?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setPlaybackState('paused');
      } else {
        iframe?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        setPlaybackState('playing');
      }
      return;
    }

    if (currentSource === 'spotify') {
      if (currentTrack) {
        const spotifyUrl = currentTrack.uri.startsWith('http')
          ? currentTrack.uri
          : `https://open.spotify.com/track/${currentTrack.uri.replace('spotify:track:', '')}`;
        setSpotifyNotice({
          track: currentTrack,
          url: spotifyUrl,
        });
      }
      return;
    }

    if (!providerRef.current) return;
    if (playbackState === 'playing') {
      providerRef.current.pause();
    } else {
      providerRef.current.play();
    }
  };

  const handlePrevTrack = () => {
    if (currentTimeSec > 3) {
      handleSeek(0);
    } else {
      handleSeek(0);
    }
  };

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      const remaining = queue.slice(1);
      if (currentTrack) {
        remaining.push(currentTrack);
      }
      handleSelectTrack(next);
      setQueue(remaining);
    } else {
      handleSeek(0);
    }
  };

  const handleEject = () => {
    if (currentSource === 'youtube') {
      const iframe = document.getElementById('vitrola-youtube-player-iframe') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    }
    providerRef.current?.stop();
    setPlaybackState('empty');
    setCurrentTrack(null);
    MediaSessionService.clearSession();
  };

  const handleSelectTrack = async (track: Track, fileBlob?: Blob) => {
    setCurrentTrack(track);
    setCurrentTimeSec(0);
    setDurationSec(track.durationSec || 240);

    // 1. YouTube Track Selection
    if (track.source === 'youtube') {
      setSource('youtube');
      setPlaybackState('playing');
      MediaSessionService.clearSession(); // Evita conflitos de SMTC com navegador
      setCurrentTab('inicio');
      return;
    }

    // 2. Deezer Track Selection
    if (track.source === 'deezer') {
      setSource('deezer');
      try {
        const audio = new Audio(track.uri);
        audio.crossOrigin = 'anonymous';
        audio.play();
        setPlaybackState('playing');
      } catch (e) {
        console.warn('Falha na reprodução Deezer:', e);
      }
      MediaSessionService.clearSession();
      setCurrentTab('inicio');
      return;
    }

    // 3. Spotify Track Selection (Honest API Limitation Compliance)
    if (track.source === 'spotify') {
      setSource('spotify');
      MediaSessionService.clearSession(); // Evita sessões duplicadas no Windows SMTC com o app do Spotify

      const spotifyUrl = track.uri.startsWith('http')
        ? track.uri
        : `https://open.spotify.com/track/${track.uri.replace('spotify:track:', '')}`;

      if (!SpotifyAuth.isConnected()) {
        setPlaybackState('paused');
        setSpotifyNotice({
          track,
          url: spotifyUrl,
          reason:
            'A reprodução direta via Spotify Web API exige uma conta Spotify Premium ativa conectada em Fontes. Usuários do plano Free ou sem login ativo podem ouvir a música diretamente no aplicativo oficial do Spotify.',
        });
        setCurrentTab('inicio');
        return;
      }

      try {
        setPlaybackState('buffering');
        const provider = new SpotifyPlaybackProvider();
        await provider.loadTrack(track);
        await provider.play();
        setPlaybackState('playing');
      } catch (err) {
        console.warn('Falha no streaming Spotify:', err);
        setPlaybackState('paused');
        setSpotifyNotice({
          track,
          url: spotifyUrl,
          reason: (err as Error).message || 'Requer dispositivo Spotify ativo aberto ou conta Premium.',
        });
      }
      setCurrentTab('inicio');
      return;
    }

    // 4. Local Audio Track Selection (Full Windows SMTC Integration)
    setSource('local');
    const blob = fileBlob || fileBlobsRef.current.get(track.id);
    if (providerRef.current) {
      await providerRef.current.loadTrack(track, blob);
      await providerRef.current.play();
    }

    // Publica metadados no Windows SMTC exclusivamente para arquivos locais
    MediaSessionService.updateMetadata(track);
    MediaSessionService.setPlaybackState('playing');
    MediaSessionService.setPositionState(0, track.durationSec || 180);
    setCurrentTab('inicio');
  };

  const handleSeek = (pos: number) => {
    const target = Math.max(0, Math.min(pos, durationSec || 180));
    setCurrentTimeSec(target);

    if (currentSource === 'local') {
      MediaSessionService.setPositionState(target, durationSec || 180);
      providerRef.current?.seek(target);
      return;
    }

    if (currentSource === 'youtube') {
      const iframe = document.getElementById('vitrola-youtube-player-iframe') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${target},true]}`, '*');
      return;
    }

    providerRef.current?.seek(target);
  };

  // Import local audio files
  const handleImportFiles = async (files: FileList) => {
    const newTracks: Track[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { track } = await AudioTagReader.parseAudioFile(file);
      const fullTrack: Track = {
        id: track.id || `track-${Date.now()}-${i}`,
        source: 'local',
        title: track.title || file.name,
        artist: track.artist || 'Artista Local',
        album: track.album || 'Importadas',
        durationSec: track.durationSec || 180,
        uri: '',
        format: track.format || {
          codec: 'FLAC',
          sampleRate: 96000,
          bitDepth: 24,
          channels: 2,
          isLossless: true,
        },
        addedAt: new Date().toISOString(),
        playCount: 0,
        labelInfo: {
          recordLabel: 'DIRECT MASTER ARCHIVE',
          matrixRpm: 33,
        },
      };

      fileBlobsRef.current.set(fullTrack.id, file);
      newTracks.push(fullTrack);
    }

    if (newTracks.length > 0) {
      const updatedTracks = [...newTracks, ...tracks];
      setTracks(updatedTracks);
      LibraryStorage.saveTracks(updatedTracks);

      const newAlbum: Album = {
        id: `album-${Date.now()}`,
        title: newTracks[0].album || 'Álbum Importado',
        artist: newTracks[0].artist || 'Vários Artistas',
        year: new Date().getFullYear(),
        trackCount: newTracks.length,
        totalDurationSec: newTracks.reduce((acc, t) => acc + t.durationSec, 0),
        tracks: newTracks,
        isHiRes: true,
        source: 'local',
      };

      const updatedAlbums = [newAlbum, ...albums];
      setAlbums(updatedAlbums);
      LibraryStorage.saveAlbums(updatedAlbums);

      handleSelectTrack(newTracks[0], fileBlobsRef.current.get(newTracks[0].id));
    }
  };

  // Add album imported via Spotify or YouTube Link
  const handleAddAlbum = (newAlbum: Album) => {
    const updatedAlbums = [newAlbum, ...albums.filter((a) => a.id !== newAlbum.id)];
    setAlbums(updatedAlbums);
    LibraryStorage.saveAlbums(updatedAlbums);

    const newTrackIds = new Set(newAlbum.tracks.map((t) => t.id));
    const updatedTracks = [
      ...newAlbum.tracks,
      ...tracks.filter((t) => !newTrackIds.has(t.id)),
    ];
    setTracks(updatedTracks);
    LibraryStorage.saveTracks(updatedTracks);

    if (newAlbum.tracks.length > 0) {
      handleSelectTrack(newAlbum.tracks[0]);
    }
  };

  // Add single track imported via Spotify or YouTube Link
  const handleAddTrack = (newTrack: Track) => {
    const updatedTracks = [newTrack, ...tracks.filter((t) => t.id !== newTrack.id)];
    setTracks(updatedTracks);
    LibraryStorage.saveTracks(updatedTracks);

    const existingAlbum = albums.find((a) => a.title === newTrack.album);
    if (existingAlbum) {
      const updatedAlbumTracks = [
        ...existingAlbum.tracks.filter((t) => t.id !== newTrack.id),
        newTrack,
      ];
      const updatedAlbum: Album = {
        ...existingAlbum,
        tracks: updatedAlbumTracks,
        trackCount: updatedAlbumTracks.length,
      };
      const updatedAlbums = albums.map((a) => (a.id === existingAlbum.id ? updatedAlbum : a));
      setAlbums(updatedAlbums);
      LibraryStorage.saveAlbums(updatedAlbums);
    } else {
      const newAlbum: Album = {
        id: `album-${newTrack.id}`,
        title: newTrack.album || newTrack.title,
        artist: newTrack.artist,
        year: new Date().getFullYear(),
        coverUri: newTrack.coverUri,
        trackCount: 1,
        totalDurationSec: newTrack.durationSec,
        tracks: [newTrack],
        isHiRes: false,
        source: newTrack.source,
      };
      const updatedAlbums = [newAlbum, ...albums];
      setAlbums(updatedAlbums);
      LibraryStorage.saveAlbums(updatedAlbums);
    }

    handleSelectTrack(newTrack);
  };

  const handleClearLibrary = () => {
    LibraryStorage.clearLibrary();
    fileBlobsRef.current.clear();
    setTracks([]);
    setAlbums([]);
    setPlaylists([]);
    setCurrentTrack(null);
    setQueue([]);
    handleEject();
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Fullscreen Mode (Pure Vitrola Vinyl Immersion) */}
      {isFullscreen && (
        <FullscreenView
          playbackState={playbackState}
          speed={speed}
          onSpeedChange={setSpeed}
          currentTrack={currentTrack}
          onExitFullscreen={() => setIsFullscreen(false)}
          onPlayToggle={handlePlayToggle}
        />
      )}

      {/* Main Top Header */}
      <WindowHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isAudioOnline={playbackState === 'playing'}
        onToggleMiniWidget={() => setIsMiniWidgetOpen(!isMiniWidgetOpen)}
        onMaximize={() => setIsFullscreen(!isFullscreen)}
        onMinimize={() => setIsMiniWidgetOpen(true)}
        onClose={() => {
          if (confirm('Deseja recolher a Vitrola para o Mini Widget?')) {
            setIsMiniWidgetOpen(true);
          }
        }}
      />

      {/* Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        masterAttenuationDb={volume > 0 ? 20 * Math.log10(volume / 100) : -40}
        outputEngine="Direct Audio / Tube Sat"
      />

      {/* Main Content Area */}
      <div className="pl-64">
        <main className="relative pt-20 min-h-screen w-full px-gutter-loose bg-surface shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)]">
          {currentTab === 'inicio' && (
            <PlayerView
              playbackState={playbackState}
              setPlaybackState={setPlaybackState}
              speed={speed}
              setSpeed={setSpeed}
              currentTrack={currentTrack}
              currentTimeSec={currentTimeSec}
              durationSec={durationSec}
              onSeek={handleSeek}
              onPlayToggle={handlePlayToggle}
              onPrevTrack={handlePrevTrack}
              onNextTrack={handleNextTrack}
              onEject={handleEject}
              queue={queue}
              onSelectTrack={handleSelectTrack}
              bassDb={bassDb}
              setBassDb={setBassDb}
              trebleDb={trebleDb}
              setTrebleDb={setTrebleDb}
              tubeDrive={tubeDrive}
              setTubeDrive={setTubeDrive}
              volume={volume}
              setVolume={setVolume}
              currentSource={currentSource}
              setSource={setSource}
              vuLeftDb={vuLeftDb}
              vuRightDb={vuRightDb}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          )}

          {currentTab === 'biblioteca' && (
            <LibraryView
              albums={albums}
              onPlayTrack={handleSelectTrack}
              onImportFiles={handleImportFiles}
              onClearLibrary={handleClearLibrary}
              onAddAlbum={handleAddAlbum}
              onAddTrack={handleAddTrack}
            />
          )}

          {currentTab === 'playlists' && (
            <PlaylistsView
              playlists={playlists}
              onPlayTrack={handleSelectTrack}
            />
          )}

          {currentTab === 'fontes' && (
            <SourcesView onPlayTrack={handleSelectTrack} />
          )}

          {currentTab === 'aparencia' && (
            <CustomizationView
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
              selectedWood={selectedWood}
              onWoodChange={setSelectedWood}
              selectedMetal={selectedMetal}
              onMetalChange={setSelectedMetal}
              selectedCloth={selectedCloth}
              onClothChange={setSelectedCloth}
              armLampBrightness={armLampBrightness}
              onArmLampChange={setArmLampBrightness}
              colorTempK={colorTempK}
              onColorTempChange={setColorTempK}
              isVuBacklightOn={isVuBacklightOn}
              onVuBacklightToggle={() => setIsVuBacklightOn(!isVuBacklightOn)}
              onLaunchMiniWidget={() => setIsMiniWidgetOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Honest Spotify Notice Modal */}
      {spotifyNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
          <div className="max-w-md w-full bg-surface-container-low border border-primary/40 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1db954] shadow-[0_0_8px_#1db954]"></span>
                <h3 className="font-display text-base text-primary font-bold">
                  Reprodução Spotify na Vitrola
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/30 font-mono text-[9px] font-bold">
                REQUISITO OFICIAL
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
              {spotifyNotice.track.coverUri ? (
                <img
                  src={spotifyNotice.track.coverUri}
                  alt={spotifyNotice.track.title}
                  className="w-14 h-14 rounded-lg object-cover border border-[#1db954]/30 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  <Disc size={28} className="text-[#1db954]" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-display text-sm text-on-surface font-bold truncate">
                  {spotifyNotice.track.title}
                </span>
                <span className="font-headline text-xs text-on-surface-variant truncate">
                  {spotifyNotice.track.artist}
                </span>
                <span className="font-mono text-[10px] text-outline truncate">
                  {spotifyNotice.track.album}
                </span>
              </div>
            </div>

            <p className="font-headline text-xs text-on-surface-variant leading-relaxed">
              {spotifyNotice.reason ||
                'A reprodução direta via Spotify Web API e Web Playback SDK exige compulsoriamente uma conta Spotify Premium ativa. Para contas gratuitas ou sem login ativo, você pode ouvir a música diretamente no aplicativo ou web player oficial do Spotify.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={spotifyNotice.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => setSpotifyNotice(null)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#1db954] text-black font-headline text-xs font-bold hover:bg-[#1ed760] transition-colors shadow-md text-center"
              >
                <span>Ouvir no Spotify Oficial</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => {
                  setSpotifyNotice(null);
                  setCurrentTab('fontes');
                }}
                className="py-2.5 px-3 rounded-lg bg-surface-container-high text-primary hover:bg-surface-bright font-headline text-xs font-bold border border-outline-variant/30 transition-colors"
              >
                Configurar Fontes
              </button>

              <button
                onClick={() => setSpotifyNotice(null)}
                className="py-2.5 px-3 rounded-lg text-outline hover:text-on-surface font-headline text-xs transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mini Player Widget */}
      {isMiniWidgetOpen && (
        <MiniPlayerWidget
          playbackState={playbackState}
          currentTrack={currentTrack}
          currentTimeSec={currentTimeSec}
          durationSec={durationSec}
          currentSource={currentSource}
          onPlayToggle={handlePlayToggle}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          onSeek={handleSeek}
          onRestoreMain={() => setIsMiniWidgetOpen(false)}
          onClose={() => setIsMiniWidgetOpen(false)}
          vuDb={(vuLeftDb + vuRightDb) / 2}
        />
      )}
    </div>
  );
};
