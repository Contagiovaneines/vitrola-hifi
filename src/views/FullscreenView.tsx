import React from 'react';
import { PlayerPlaybackState, Track } from '../types';
import { Turntable } from '../components/player/Turntable';
import { BallisticVUMeters } from '../components/player/BallisticVUMeters';
import { AnalogScrubBar } from '../components/player/AnalogScrubBar';
import { TransportControls } from '../components/player/TransportControls';
import { Minimize2, Lightbulb, Thermometer, Zap } from 'lucide-react';

interface FullscreenViewProps {
  playbackState: PlayerPlaybackState;
  speed: 33 | 45;
  onSpeedChange: (speed: 33 | 45) => void;
  currentTrack: Track | null;
  currentTimeSec: number;
  durationSec: number;
  onSeek: (positionSec: number) => void;
  onPlayToggle: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onEject: () => void;
  onExitFullscreen: () => void;
  vuLeftDb: number;
  vuRightDb: number;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({
  playbackState,
  speed,
  onSpeedChange,
  currentTrack,
  currentTimeSec,
  durationSec,
  onSeek,
  onPlayToggle,
  onPrevTrack,
  onNextTrack,
  onEject,
  onExitFullscreen,
  vuLeftDb,
  vuRightDb,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0d0b0a] text-on-surface flex flex-col justify-between p-space-md select-none overflow-hidden">
      {/* Top HUD Bar: Audiophile OSD */}
      <div className="w-full flex items-center justify-between pb-space-sm border-b border-outline-variant/20 z-10">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-high rounded-full shadow-inner border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#ffb95f]"></span>
            <span className="font-headline text-[10px] text-primary font-bold tracking-widest uppercase">
              AUDIOPHILE THEATRE // TELA CHEIA
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-on-surface-variant">
            <span className="text-primary font-bold">FLAC DIRECT MASTER</span>
            <span>•</span>
            <span>192kHz / 24-bit</span>
            <span>•</span>
            <span className="text-secondary font-bold">BIT-PERFECT DSD ENGINE</span>
          </div>
        </div>

        {/* Center Tube Rail Diagnostics */}
        <div className="hidden md:flex items-center gap-space-md font-mono text-[10px] text-on-surface-variant">
          <div className="flex items-center gap-1 text-secondary">
            <Thermometer size={14} />
            <span>TUBES: 48.2°C</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Zap size={14} />
            <span>BIAS: 1.8V OPTIMAL</span>
          </div>
        </div>

        {/* Exit Fullscreen Button */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={onExitFullscreen}
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded bg-primary-container text-on-primary-container font-headline text-xs font-bold shadow-md hover:bg-primary transition-all"
            title="Sair do modo Tela Cheia (ESC)"
          >
            <Minimize2 size={16} />
            <span>Sair [ESC]</span>
          </button>
        </div>
      </div>

      {/* Center Stage: The Turntable Chassis */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-space-sm">
        <div className="w-full scale-95 lg:scale-100 transition-transform">
          <Turntable
            playbackState={playbackState}
            speed={speed}
            onSpeedChange={onSpeedChange}
            currentTrack={currentTrack}
          />
        </div>

        {/* Scrubber & Title Bar in Fullscreen */}
        <div className="w-full mt-space-md flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <h2 className="font-display text-xl text-primary font-bold truncate">
                {currentTrack?.title || 'Vitrola Hi-Fi Console'}
              </h2>
              <p className="font-headline text-xs text-on-surface-variant">
                {currentTrack ? `${currentTrack.artist} — ${currentTrack.album}` : 'Aguardando seleção'}
              </p>
            </div>
            <span className="font-mono text-xs text-secondary font-bold">
              {currentTrack?.format ? `${currentTrack.format.codec} Hi-Res` : 'Stereo Master'}
            </span>
          </div>

          <AnalogScrubBar
            currentTimeSec={currentTimeSec}
            durationSec={durationSec}
            onSeek={onSeek}
            disabled={playbackState === 'empty'}
          />

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

      {/* Bottom Meter Strip */}
      <div className="w-full max-w-2xl mx-auto">
        <BallisticVUMeters
          leftDb={vuLeftDb}
          rightDb={vuRightDb}
          isLive={playbackState === 'playing'}
        />
      </div>
    </div>
  );
};
