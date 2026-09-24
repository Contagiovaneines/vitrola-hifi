import React from 'react';
import { PlayerPlaybackState, Track, AudioSourceType } from '../types';
import { Turntable } from '../components/player/Turntable';
import { AnalogScrubBar } from '../components/player/AnalogScrubBar';
import { TrackReadout } from '../components/player/TrackReadout';
import { TransportControls } from '../components/player/TransportControls';
import { BallisticVUMeters } from '../components/player/BallisticVUMeters';
import { PreampKnobs } from '../components/player/PreampKnobs';
import { SourceSelector } from '../components/player/SourceSelector';
import { NextTracks } from '../components/player/NextTracks';
import { YouTubePlayerMonitor } from '../components/player/YouTubePlayerMonitor';
import { AlbumJacketStand } from '../components/player/AlbumJacketStand';
import { Maximize2 } from 'lucide-react';

interface PlayerViewProps {
  playbackState: PlayerPlaybackState;
  setPlaybackState: (state: PlayerPlaybackState) => void;
  speed: 33 | 45;
  setSpeed: (speed: 33 | 45) => void;
  currentTrack: Track | null;
  currentTimeSec: number;
  durationSec: number;
  onSeek: (positionSec: number) => void;
  onPlayToggle: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onEject: () => void;
  queue: Track[];
  onSelectTrack: (track: Track) => void;
  onToggleFullscreen?: () => void;
  // EQ & Knobs
  bassDb: number;
  setBassDb: (v: number) => void;
  trebleDb: number;
  setTrebleDb: (v: number) => void;
  tubeDrive: number;
  setTubeDrive: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  currentSource: AudioSourceType;
  setSource: (s: AudioSourceType) => void;
  // VUs
  vuLeftDb: number;
  vuRightDb: number;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  playbackState,
  setPlaybackState,
  speed,
  setSpeed,
  currentTrack,
  currentTimeSec,
  durationSec,
  onSeek,
  onPlayToggle,
  onPrevTrack,
  onNextTrack,
  onEject,
  queue,
  onSelectTrack,
  onToggleFullscreen,
  bassDb,
  setBassDb,
  trebleDb,
  setTrebleDb,
  tubeDrive,
  setTubeDrive,
  volume,
  setVolume,
  currentSource,
  setSource,
  vuLeftDb,
  vuRightDb,
}) => {
  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Status Banner & Lossless Stream Telemetry */}
      <div className="w-full flex flex-wrap items-center justify-between gap-space-md py-space-sm mb-space-md border-b border-outline-variant/20">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-2 px-space-md py-1 rounded-full bg-surface-container-low shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#ffb95f]"></span>
            <span className="font-headline text-[10px] text-secondary tracking-widest uppercase font-bold">
              ENGINE ONLINE
            </span>
            <span className="text-outline-variant font-mono text-[10px]">/</span>
            <span className="font-mono text-xs text-on-surface-variant font-bold">
              {currentTrack?.format
                ? `${currentTrack.format.codec} ${currentTrack.format.sampleRate / 1000}kHz · ${currentTrack.format.bitDepth || 16}-bit`
                : 'Aguardando seleção de áudio'}
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-space-xs text-outline font-mono text-[10px]">
            <span>SAMPLE RATE: {currentTrack?.format?.sampleRate ? `${currentTrack.format.sampleRate / 1000} kHz` : 'STANDBY'}</span>
            <span>•</span>
            <span>CANAL: {currentTrack?.format?.channels === 1 ? 'MONO' : 'ESTÉREO'}</span>
          </div>
        </div>

        {/* Live Playback State Badge & Tela Cheia Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container-lowest font-headline text-[10px] uppercase tracking-wider font-bold border border-outline-variant/30 text-on-surface-variant">
            <span>STATUS:</span>
            <span className="text-secondary font-mono">{playbackState === 'playing' ? 'TOCANDO' : playbackState === 'paused' ? 'PAUSADO' : 'SEM DISCO'}</span>
          </div>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary font-headline text-[10px] uppercase tracking-wider font-bold shadow-sm transition-all"
              title="Entrar em Tela Cheia [F ou F11]"
            >
              <Maximize2 size={12} />
              <span>Tela Cheia</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary 16-Column Desktop Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-space-lg w-full items-start">
        {/* LEFT / MAIN CONSOLE: Physical Turntable Chassis & Transport Panel (Col 1-10 on xl) */}
        <div className="lg:col-span-7 xl:col-span-10 flex flex-col gap-space-lg">
          {/* THE WALNUT & BRASS TURNTABLE CHASSIS */}
          <Turntable
            playbackState={playbackState}
            speed={speed}
            onSpeedChange={setSpeed}
            currentTrack={currentTrack}
            onCueToggle={() =>
              setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing')
            }
          />

          {/* ANALOG MASTER TRANSPORT & SEEK PANEL */}
          <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] border border-outline-variant/30 flex flex-col gap-space-md">
            {/* Track Title Hierarchy & Artist Meta */}
            <TrackReadout currentTrack={currentTrack} />

            {/* Heavy Brass Inset Scrub / Groove Progress Bar */}
            <AnalogScrubBar
              currentTimeSec={currentTimeSec}
              durationSec={durationSec}
              onSeek={onSeek}
              disabled={playbackState === 'empty'}
            />

            {/* Tactile Machined Transport Buttons */}
            <TransportControls
              playbackState={playbackState}
              onPlayToggle={onPlayToggle}
              onPrevTrack={onPrevTrack}
              onNextTrack={onNextTrack}
              onEject={onEject}
              disabled={playbackState === 'empty'}
            />
          </div>
        </div>

        {/* RIGHT CONSOLE: Analog VU Meters, Sound Stage Knobs, and Source Routing (Col 11-16 on xl) */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col gap-space-lg">
          {/* ANALOG VU METERS */}
          <BallisticVUMeters
            leftDb={vuLeftDb}
            rightDb={vuRightDb}
            isLive={playbackState === 'playing'}
          />

          {/* STAND DE ENCARTE & CAPA ORIGINAL QUADRADA ÍNTEGRA */}
          {currentTrack?.coverUri && (
            <AlbumJacketStand currentTrack={currentTrack} />
          )}

          {/* TACTILE ANALOG PREAMP POTENTIOMETERS */}
          <PreampKnobs
            bassDb={bassDb}
            onBassChange={setBassDb}
            trebleDb={trebleDb}
            onTrebleChange={setTrebleDb}
            tubeDrive={tubeDrive}
            onTubeDriveChange={setTubeDrive}
            volume={volume}
            onVolumeChange={setVolume}
          />

          {/* HORIZONTAL SOURCE SELECTOR */}
          <SourceSelector
            currentSource={currentSource}
            onSourceChange={setSource}
          />

          {/* COMPLIANT YOUTUBE VIDEO MONITOR (MANDATORY WHEN YOUTUBE IS SELECTED) */}
          {currentSource === 'youtube' && (
            <YouTubePlayerMonitor
              currentVideoId={
                currentTrack?.source === 'youtube'
                  ? currentTrack.uri.replace('youtube-', '')
                  : ''
              }
              onPlayTrack={onSelectTrack}
              isCompact={false}
            />
          )}

          {/* UP NEXT / QUEUE PREVIEW */}
          <NextTracks
            tracks={queue}
            currentTrackId={currentTrack?.id}
            onSelectTrack={onSelectTrack}
          />
        </div>
      </div>
    </div>
  );
};
