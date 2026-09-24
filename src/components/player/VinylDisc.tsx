import React from 'react';
import { PlayerPlaybackState, Track } from '../../types';

interface VinylDiscProps {
  playbackState: PlayerPlaybackState;
  speed: 33 | 45;
  currentTrack: Track | null;
}

export const VinylDisc: React.FC<VinylDiscProps> = ({
  playbackState,
  speed,
  currentTrack
}) => {
  const isPlaying = playbackState === 'playing';
  const isEmpty = playbackState === 'empty';

  // Rotation class
  const animationClass = isPlaying
    ? speed === 33
      ? 'animate-vinyl-33'
      : 'animate-vinyl-45'
    : '';

  return (
    <div className="relative w-[300px] sm:w-[350px] md:w-[380px] xl:w-[410px] aspect-square rounded-full bg-surface-container-lowest shadow-[inset_0_10px_30px_rgba(0,0,0,0.95),0_1px_2px_rgba(254,196,134,0.1)] flex items-center justify-center p-2.5">
      {/* Aluminum Strobe Ring Rim */}
      <div className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-[#3a342e] via-[#655d54] to-[#25211e] p-[5px] shadow-[0_6px_16px_rgba(0,0,0,0.85)] flex items-center justify-center border border-outline-variant/30">
        {/* Strobe pattern ticks */}
        <div className="absolute inset-0 rounded-full border-dashed border-outline-variant/30 [border-width:2px]"></div>

        {/* VINYL DISC CONTAINER */}
        <div
          className={`relative w-full aspect-square rounded-full bg-[#0d0c0b] shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-700 ease-out ${animationClass}`}
        >
          {isEmpty ? (
            /* Felt Anti-Static Mat (Empty State) */
            <div className="absolute inset-0 rounded-full bg-[#181412] flex items-center justify-center border border-outline-variant/20">
              <div className="w-3/4 aspect-square rounded-full border border-dashed border-outline-variant/30 flex items-center justify-center">
                <div className="text-center select-none">
                  <span className="font-display text-xl text-primary/40 uppercase tracking-widest block font-bold">
                    VITROLA
                  </span>
                  <span className="font-mono text-[10px] text-outline/50 tracking-wider">
                    ANTI-STATIC FELT MAT
                  </span>
                  <span className="font-mono text-[8px] text-outline-variant/40 block mt-1">
                    Insira um disco da biblioteca
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Active Vinyl Record */
            <>
              {/* Concentric Grooves Texture */}
              <div className="absolute inset-0 rounded-full vinyl-grooves-pattern opacity-95"></div>

              {/* Conic Light Sheen Refraction */}
              <div className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen vinyl-sheen-conic opacity-30"></div>

              {/* Center Album Label */}
              <div
                className="relative z-10 w-[38%] aspect-square rounded-full bg-gradient-to-tr from-[#1f2839] via-[#2f3e5b] to-[#151c2a] shadow-[0_4px_14px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center p-2 text-center border-[3px] border-[#a57f43]"
                style={{
                  backgroundColor: currentTrack?.source === 'local' ? undefined : '#221d19'
                }}
              >
                {/* Archival Label Text */}
                <span className="font-headline text-[7px] text-[#ffddbb] uppercase tracking-widest font-extrabold leading-tight opacity-90">
                  {currentTrack?.labelInfo?.recordLabel || 'COLUMBIA STEREO 6-EYE'}
                </span>
                <span className="font-display text-[11px] text-primary-fixed font-bold leading-tight mt-0.5 drop-shadow-sm truncate max-w-[90%]">
                  {currentTrack?.album || 'KIND OF BLUE'}
                </span>
                <span className="font-headline text-[9px] text-tertiary-fixed font-semibold tracking-wider uppercase -mt-0.5 truncate max-w-[90%]">
                  {currentTrack?.artist || 'MILES DAVIS'}
                </span>

                <div className="my-0.5 px-2 py-[1px] bg-surface-container-lowest/80 rounded font-mono text-[8px] text-secondary font-bold border border-outline-variant/30">
                  SIDE 1 · {speed} RPM
                </div>

                <span className="font-mono text-[7px] text-on-surface-variant/70 tracking-tighter truncate max-w-[90%]">
                  {currentTrack?.labelInfo?.catalogNumber || 'CL 1355 / XSM 47326'}
                </span>

                {/* Metal Center Spindle Pin */}
                <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-gradient-to-br from-on-surface via-outline to-surface-container-lowest shadow-[0_2px_6px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-surface-bright"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
