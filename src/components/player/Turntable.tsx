import React from 'react';
import { PlayerPlaybackState, Track } from '../../types';
import { VinylDisc } from './VinylDisc';
import { Tonearm } from './Tonearm';
import { Activity } from 'lucide-react';

interface TurntableProps {
  playbackState: PlayerPlaybackState;
  speed: 33 | 45;
  onSpeedChange: (speed: 33 | 45) => void;
  currentTrack: Track | null;
  onCueToggle?: () => void;
}

export const Turntable: React.FC<TurntableProps> = ({
  playbackState,
  speed,
  onSpeedChange,
  currentTrack,
  onCueToggle
}) => {
  const isPlaying = playbackState === 'playing';

  return (
    <div className="relative w-full rounded-xl bg-[var(--color-plinth-bg,#20150d)] p-space-md lg:p-space-lg shadow-[inset_0_1px_2px_rgba(255,221,187,0.12),inset_0_20px_45px_rgba(0,0,0,0.95),0_16px_36px_rgba(0,0,0,0.9)] border border-outline-variant/30 select-none overflow-hidden">
      {/* Physical Machined Brass Screws in 4 Corners */}
      <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-primary-fixed to-outline-variant shadow-inner flex items-center justify-center">
        <div className="w-2 h-0.5 bg-surface-container-lowest rotate-45"></div>
      </div>
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-primary-fixed to-outline-variant shadow-inner flex items-center justify-center">
        <div className="w-2 h-0.5 bg-surface-container-lowest -rotate-45"></div>
      </div>
      <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-primary-fixed to-outline-variant shadow-inner flex items-center justify-center">
        <div className="w-2 h-0.5 bg-surface-container-lowest rotate-12"></div>
      </div>
      <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-primary-fixed to-outline-variant shadow-inner flex items-center justify-center">
        <div className="w-2 h-0.5 bg-surface-container-lowest -rotate-12"></div>
      </div>

      {/* Upper Recessed Brushed Metal Deck Bed */}
      <div className="relative w-full rounded-lg bg-gradient-to-b from-surface-container-highest/80 via-surface-container/90 to-surface-container-lowest p-space-md shadow-[inset_0_3px_8px_rgba(0,0,0,0.95),0_1px_1px_rgba(254,196,134,0.15)] border border-outline-variant/20">
        {/* Top Deck Plaque & Optical Neon Strobe */}
        <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-headline text-[10px] text-primary font-bold shadow-inner border border-outline-variant/30 tracking-wider">
              MODEL 79-PRO
            </span>
            <span className="font-mono text-[9px] text-outline tracking-wider hidden sm:inline">
              SUSPENDED CHASSIS DIRECT DRIVE
            </span>
          </div>

          {/* Strobe Neon Indicator */}
          <div className="flex items-center gap-2 bg-surface-container-lowest/80 px-2 py-1 rounded border border-outline-variant/20">
            <span className="font-headline text-[8px] text-outline uppercase tracking-wider font-semibold">
              STROBE 60Hz
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPlaying
                    ? 'bg-secondary shadow-[0_0_6px_#ffb95f]'
                    : 'bg-secondary/30'
                }`}
              ></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary/30"></span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPlaying
                    ? 'bg-secondary shadow-[0_0_6px_#ffb95f]'
                    : 'bg-secondary/30'
                }`}
              ></span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary/30"></span>
            </div>
          </div>
        </div>

        {/* Circular Platter Well & Center Stage */}
        <div className="relative w-full min-h-[340px] sm:min-h-[380px] xl:min-h-[420px] flex items-center justify-center">
          {/* The Vinyl Disc Assembly */}
          <VinylDisc
            playbackState={playbackState}
            speed={speed}
            currentTrack={currentTrack}
          />

          {/* The Mechanical Tonearm Assembly */}
          <Tonearm
            playbackState={playbackState}
            onCueToggle={onCueToggle}
          />

          {/* Deck Plinth Left Controls: 33/45 RPM Lever & Cue */}
          <div className="absolute left-2 sm:left-4 bottom-2 flex items-center gap-space-sm bg-surface-container-lowest/85 p-2 rounded-lg backdrop-blur-sm shadow-lg border border-outline-variant/30">
            {/* Speed Selector */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-headline text-[8px] text-outline uppercase font-bold tracking-wider">
                Speed
              </span>
              <div className="flex items-center gap-1 bg-surface-container-high p-0.5 rounded border border-outline-variant/30">
                <button
                  onClick={() => onSpeedChange(33)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition-all ${
                    speed === 33
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  aria-label="Definir velocidade para 33 RPM"
                >
                  33
                </button>
                <button
                  onClick={() => onSpeedChange(45)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition-all ${
                    speed === 45
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  aria-label="Definir velocidade para 45 RPM"
                >
                  45
                </button>
              </div>
            </div>

            {/* Cue Lever Indicator */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-headline text-[8px] text-outline uppercase font-bold tracking-wider">
                Cue
              </span>
              <button
                onClick={onCueToggle}
                className="px-2 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-secondary font-mono text-[10px] font-bold border border-outline-variant/30 flex items-center gap-1 transition-all"
                title="Alternar alavanca de elevação do braço (Cue)"
              >
                <span>
                  {playbackState === 'playing'
                    ? 'DOWN'
                    : playbackState === 'paused'
                    ? 'LIFT'
                    : 'REST'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section of Plinth: Acoustic Grille Cloth & Tube Badge */}
      <div className="mt-space-sm pt-space-sm flex flex-col md:flex-row items-center justify-between gap-space-sm">
        {/* Tweed Woven Panel */}
        <div className="w-full md:w-3/5 h-12 rounded-lg tweed-grille-pattern shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)] flex items-center justify-between px-space-md border border-outline-variant/20">
          <div className="flex items-center gap-2 bg-surface-container-lowest/85 px-space-sm py-1 rounded shadow-md border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_#fec486]"></span>
            <span className="font-mono text-[9px] text-primary tracking-widest font-bold">
              CLASS-A TUBE STAGE · 12AX7 DUAL TRIODE
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-gradient-to-r from-secondary-container to-primary font-headline text-[9px] text-on-primary font-bold shadow-md">
            VITROLA HI-FI
          </div>
        </div>

        {/* Signal Path Badge */}
        <div className="w-full md:w-2/5 flex items-center justify-end gap-space-sm">
          <div className="flex flex-col text-right">
            <span className="font-headline text-[8px] text-outline uppercase font-bold tracking-wider">
              Signal Processing
            </span>
            <span className="font-mono text-[10px] text-primary font-bold">
              DSP EQ &amp; Tube Saturation
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-inner border border-outline-variant/30 text-secondary">
            <Activity size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
