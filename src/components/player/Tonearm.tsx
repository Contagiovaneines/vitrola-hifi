import React from 'react';
import { PlayerPlaybackState } from '../../types';

interface TonearmProps {
  playbackState: PlayerPlaybackState;
  onCueToggle?: () => void;
}

export const Tonearm: React.FC<TonearmProps> = ({ playbackState, onCueToggle }) => {
  // Angle logic:
  // empty: 0deg (clamp rest position)
  // paused: 12deg (lifted off groove via cue lift)
  // playing: 21deg (resting in groove)
  let rotationAngle = 0;
  let isLightOn = false;

  if (playbackState === 'playing') {
    rotationAngle = 21;
    isLightOn = true;
  } else if (playbackState === 'paused' || playbackState === 'buffering') {
    rotationAngle = 12;
    isLightOn = false;
  } else {
    rotationAngle = 0;
    isLightOn = false;
  }

  return (
    <div
      className="absolute right-4 sm:right-6 xl:right-10 top-3 bottom-4 w-28 sm:w-36 pointer-events-none flex flex-col items-center justify-start z-20 select-none"
      aria-hidden="true"
    >
      {/* Massive Gimbal & Counterweight Turret */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#4d443c] via-[#221e1a] to-[#141210] shadow-[0_8px_18px_rgba(0,0,0,0.9),inset_0_2px_3px_rgba(254,196,134,0.3)] flex items-center justify-center border border-outline-variant/40">
        {/* Brass Counterweight Ring */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container shadow-md flex items-center justify-center border border-outline-variant/30">
          <div className="w-4 h-4 rounded-full bg-surface-container-lowest shadow-inner"></div>
        </div>
        {/* Anti-skating calibration plaque */}
        <div className="absolute -left-2 top-2 px-1 py-0.5 rounded bg-surface-container-lowest font-mono text-[7px] text-primary border border-outline-variant/30">
          1.75g
        </div>
      </div>

      {/* Tonearm Wand & Headshell (Rotates around top pivot) */}
      <div
        className="relative w-2 h-64 sm:h-72 -mt-2 origin-top transition-transform duration-700 ease-out flex flex-col items-center"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        {/* Brushed Brass Tube */}
        <div className="w-2.5 h-full bg-gradient-to-r from-[#d99f60] via-[#ffd6a2] to-[#8d5e27] shadow-[2px_4px_10px_rgba(0,0,0,0.85)] rounded-full"></div>

        {/* Angled Headshell & Cartridge */}
        <div className="relative -mt-2 w-7 h-12 bg-gradient-to-b from-[#2e2926] to-[#12100f] rounded-t-sm shadow-xl flex flex-col items-center justify-between py-1 transform -rotate-[12deg] border border-outline-variant/40">
          <span className="font-mono text-[6px] text-secondary font-bold tracking-wider">
            SHURE
          </span>
          <div className="w-3.5 h-1.5 rounded bg-primary/30 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
          </div>

          {/* Stylus Contact Tip with Warm Amber Filament Glow */}
          <div
            className={`w-2 h-2 rounded-full bg-secondary transition-opacity duration-300 ${
              isLightOn
                ? 'opacity-100 shadow-[0_0_12px_#ffb95f,0_0_4px_#ffffff] animate-pulse'
                : 'opacity-0'
            }`}
          ></div>
        </div>
      </div>

      {/* Hydraulic Lift Bar Base */}
      <div className="absolute top-20 right-4 flex flex-col items-center gap-1 opacity-70">
        <span className="font-headline text-[7px] text-outline uppercase font-bold tracking-widest">
          CUE
        </span>
        <div className="w-1.5 h-6 bg-surface-container-highest rounded-full shadow-inner"></div>
      </div>
    </div>
  );
};
