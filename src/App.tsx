import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  PlayerPlaybackState,
  Track,
  ThemePreset,
  AudioSourceType,
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
import { initialAlbums, initialPlaylists, initialTracks } from './data/mockData';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('inicio');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMiniWidgetOpen, setIsMiniWidgetOpen] = useState(false);

  // Playback state
  const [playbackState, setPlaybackState] = useState<PlayerPlaybackState>('playing');
  const [speed, setSpeed] = useState<33 | 45>(33);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(initialTracks[0]);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(222); // 03:42
  const [durationSec, setDurationSec] = useState<number>(562); // 09:22
  const [queue, setQueue] = useState<Track[]>(initialTracks.slice(1));
  const [currentSource, setSource] = useState<AudioSourceType>('local');

  // Preamp & Audio Knobs
  const [bassDb, setBassDb] = useState(2.0);
  const [trebleDb, setTrebleDb] = useState(-1.0);
  const [tubeDrive, setTubeDrive] = useState(4.5);
  const [volume, setVolume] = useState(78);

  // VUs
  const [vuLeftDb, setVuLeftDb] = useState(-4.2);
  const [vuRightDb, setVuRightDb] = useState(-3.8);

  // Themes & Materials
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>('classica');
  const [selectedWood, setSelectedWood] = useState('mogno');
  const [selectedMetal, setSelectedMetal] = useState('latao');
  const [selectedCloth, setSelectedCloth] = useState('tweed');
  const [armLampBrightness, setArmLampBrightness] = useState(78);
  const [colorTempK, setColorTempK] = useState(2700);
  const [isVuBacklightOn, setIsVuBacklightOn] = useState(true);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setPlaybackState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Simulated ticker for playing progress & organic VU needle ballistics
  useEffect(() => {
    if (playbackState !== 'playing') {
      setVuLeftDb(-26);
      setVuRightDb(-26);
      return;
    }

    const interval = setInterval(() => {
      // Advance playback time
      setCurrentTimeSec((prev) => {
        if (durationSec > 0 && prev >= durationSec) {
          return 0;
        }
        return prev + 1;
      });

      // Organic ballistics needle movement
      const jitterL = -6 + Math.random() * 5.5;
      const jitterR = -5.5 + Math.random() * 5.2;
      setVuLeftDb(jitterL);
      setVuRightDb(jitterR);
    }, 1000);

    return () => clearInterval(interval);
  }, [playbackState, durationSec]);

  // Handlers
  const handlePlayToggle = () => {
    if (playbackState === 'playing') {
      setPlaybackState('paused');
    } else {
      setPlaybackState('playing');
    }
  };

  const handlePrevTrack = () => {
    setCurrentTimeSec(0);
  };

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      const remaining = queue.slice(1);
      if (currentTrack) {
        remaining.push(currentTrack);
      }
      setCurrentTrack(next);
      setQueue(remaining);
      setCurrentTimeSec(0);
      setDurationSec(next.durationSec);
      setPlaybackState('playing');
    } else {
      setCurrentTimeSec(0);
    }
  };

  const handleEject = () => {
    setPlaybackState('empty');
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTimeSec(0);
    setDurationSec(track.durationSec);
    setPlaybackState('playing');
    // Switch to player view to show track loaded on platter
    setCurrentTab('inicio');
  };

  const handleSeek = (pos: number) => {
    setCurrentTimeSec(pos);
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
        onMaximize={() => setIsFullscreen(!isFullscreen)}
        onMinimize={() => setIsMiniWidgetOpen(true)}
        onClose={() => {
          if (confirm('Deseja minimizar a Vitrola para a barra de tarefas?')) {
            setIsMiniWidgetOpen(true);
          }
        }}
      />

      {/* Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        masterAttenuationDb={-14.5}
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
              albums={initialAlbums}
              onPlayTrack={handleSelectTrack}
            />
          )}

          {currentTab === 'playlists' && (
            <PlaylistsView
              playlists={initialPlaylists}
              onPlayTrack={handleSelectTrack}
            />
          )}

          {currentTab === 'fontes' && <SourcesView />}

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

      {/* Floating Mini Player Widget (When activated) */}
      {isMiniWidgetOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <MiniPlayerWidget
            playbackState={playbackState}
            currentTrack={currentTrack}
            currentTimeSec={currentTimeSec}
            durationSec={durationSec}
            onPlayToggle={handlePlayToggle}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            onRestoreMain={() => setIsMiniWidgetOpen(false)}
            onClose={() => setIsMiniWidgetOpen(false)}
            vuDb={vuLeftDb}
          />
        </div>
      )}
    </div>
  );
};
