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

  // 1. Initialize LocalPlaybackProvider
  useEffect(() => {
    const provider = new LocalPlaybackProvider({
      onStateChange: (state) => {
        setPlaybackState(state);
        MediaSessionService.setPlaybackState(state === 'playing' ? 'playing' : 'paused');
      },
      onTimeUpdate: (cur, dur) => {
        setCurrentTimeSec(cur);
        if (dur > 0) setDurationSec(dur);
      },
      onTrackEnded: () => {
        handleNextTrack();
      },
      onError: (msg) => {
        console.error('Erro de reprodução de áudio:', msg);
      }
    });

    providerRef.current = provider;
    provider.setVolume(volume / 100);
    provider.setSpeedPitch(speed);

    // Initial default track load
    if (currentTrack) {
      provider.loadTrack(currentTrack);
      MediaSessionService.updateMetadata(currentTrack);
    }

    // Windows SMTC Setup
    MediaSessionService.setupActionHandlers({
      onPlay: () => providerRef.current?.play(),
      onPause: () => providerRef.current?.pause(),
      onPrev: () => handlePrevTrack(),
      onNext: () => handleNextTrack(),
      onSeek: (pos) => providerRef.current?.seek(pos),
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
        const levels = AudioEngine.getInstance().getVuMeterLevels();
        setVuLeftDb(levels.leftDb);
        setVuRightDb(levels.rightDb);
      } else {
        setVuLeftDb(-40);
        setVuRightDb(-40);
      }
      animId = requestAnimationFrame(updateVus);
    };

    animId = requestAnimationFrame(updateVus);
    return () => cancelAnimationFrame(animId);
  }, [playbackState]);

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
    if (providerRef.current) {
      providerRef.current.setVolume(volume / 100);
    }
    LibraryStorage.saveSettings({ volume });
  }, [volume]);

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
  }, [isFullscreen, currentTimeSec, playbackState]);

  // Handlers
  const handlePlayToggle = () => {
    if (!providerRef.current) return;
    if (playbackState === 'playing') {
      providerRef.current.pause();
    } else {
      providerRef.current.play();
    }
  };

  const handlePrevTrack = () => {
    if (currentTimeSec > 3) {
      providerRef.current?.seek(0);
    } else {
      // Volta para faixa anterior se houver
      providerRef.current?.seek(0);
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
      providerRef.current?.seek(0);
    }
  };

  const handleEject = () => {
    providerRef.current?.stop();
    setPlaybackState('empty');
  };

  const handleSelectTrack = async (track: Track, fileBlob?: Blob) => {
    setCurrentTrack(track);
    setCurrentTimeSec(0);
    setDurationSec(track.durationSec || 180);

    const blob = fileBlob || fileBlobsRef.current.get(track.id);
    if (providerRef.current) {
      await providerRef.current.loadTrack(track, blob);
      await providerRef.current.play();
    }

    MediaSessionService.updateMetadata(track);
    setCurrentTab('inicio');
  };

  const handleSeek = (pos: number) => {
    setCurrentTimeSec(pos);
    providerRef.current?.seek(pos);
  };

  // Import local files
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
        }
      };

      // Guarda o arquivo Blob na memória
      fileBlobsRef.current.set(fullTrack.id, file);
      newTracks.push(fullTrack);
    }

    if (newTracks.length > 0) {
      const updatedTracks = [...newTracks, ...tracks];
      setTracks(updatedTracks);
      LibraryStorage.saveTracks(updatedTracks);

      // Agrupa álbum importado
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

      // Coloca a primeira faixa importada no prato imediatamente
      handleSelectTrack(newTracks[0], fileBlobsRef.current.get(newTracks[0].id));
    }
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
      {/* Fullscreen Mode (Audiophile Theatre OSD) */}
      {isFullscreen && (
        <FullscreenView
          playbackState={playbackState}
          speed={speed}
          onSpeedChange={setSpeed}
          currentTrack={currentTrack}
          currentTimeSec={currentTimeSec}
          durationSec={durationSec}
          onSeek={handleSeek}
          onPlayToggle={handlePlayToggle}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          onEject={handleEject}
          onExitFullscreen={() => setIsFullscreen(false)}
          vuLeftDb={vuLeftDb}
          vuRightDb={vuRightDb}
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
            />
          )}

          {currentTab === 'biblioteca' && (
            <LibraryView
              albums={albums}
              onPlayTrack={handleSelectTrack}
              onImportFiles={handleImportFiles}
              onClearLibrary={handleClearLibrary}
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
