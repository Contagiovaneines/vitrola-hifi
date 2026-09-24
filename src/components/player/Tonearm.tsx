import React from 'react';
import { PlayerPlaybackState } from '../../types';

interface TonearmProps {
  playbackState: PlayerPlaybackState;
  onCueToggle?: () => void;
}

export const Tonearm: React.FC<TonearmProps> = ({ playbackState, onCueToggle }) => {
  // Mechanical arm angles:
  // - empty (repouso no clamp de estacionamento): 0deg
  // - paused / buffering (elevado pelo cue lift): 12deg
  // - playing (reproduzindo no sulco do vinil): 21deg
  let rotationAngle = 0;
  let isCueLifted = false;
  let isLightOn = false;

  if (playbackState === 'playing') {
    rotationAngle = 21; // 21deg sulco de vinil
    isCueLifted = false;
    isLightOn = true;
  } else if (playbackState === 'paused' || playbackState === 'buffering') {
    rotationAngle = 12; // 12deg cue lift
    isCueLifted = true;
    isLightOn = false;
  } else {
    rotationAngle = 0; // 0deg repouso
    isCueLifted = false;
    isLightOn = false;
  }

  return (
    <div
      className="absolute right-2 sm:right-4 md:right-6 xl:right-8 top-1 bottom-2 w-32 sm:w-40 md:w-44 pointer-events-none select-none z-20 flex flex-col items-center justify-start"
      aria-hidden="true"
    >
      {/* 1. Base Fixa de Montagem do Braço no Chassi (Machined Brass Base Collar) */}
      <div className="absolute top-1 sm:top-2 right-4 sm:right-6 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-br from-[#2a2420] via-[#151210] to-[#0a0807] shadow-[inset_0_2px_5px_rgba(255,221,187,0.15),0_10px_25px_rgba(0,0,0,0.95)] border-2 border-outline-variant/40 flex items-center justify-center">
        {/* Anel de Escala de VTA & Anti-Skating */}
        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border border-dashed border-[#d99f60]/40 flex items-center justify-center bg-gradient-to-tr from-[#1b1714] to-[#362e27]">
          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-[#524538] to-[#120e0b] shadow-inner border border-outline-variant/30 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-primary/60"></span>
          </div>
        </div>

        {/* Etiqueta de Precisão Mecânica */}
        <div className="absolute -bottom-2 px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono text-[7px] text-primary-fixed border border-outline-variant/40 shadow-md">
          ANTISKATE 1.8g
        </div>
      </div>

      {/* 2. Suporte de Repouso do Braço (Tonearm Rest & Latch Clip) */}
      <div className="absolute top-36 sm:top-40 right-10 sm:right-12 flex items-center gap-1 z-10 pointer-events-none opacity-80">
        <div className="w-2 h-6 sm:h-7 rounded-sm bg-gradient-to-r from-[#201c18] via-[#4d443c] to-[#141210] shadow-md border border-outline-variant/30 flex flex-col items-center justify-center">
          <div className="w-3 h-1 bg-[#d99f60] rounded-xs shadow-inner"></div>
        </div>
      </div>

      {/* 3. Braço Fotorealista de Alta Precisão (S-Shaped High-End Tonearm) */}
      <div
        className="relative w-full h-[320px] sm:h-[360px] xl:h-[390px] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          transformOrigin: '63.6% 24.6%',
          transform: `rotate(${rotationAngle}deg)`,
        }}
      >
        <img
          src="/images/tonearm.png"
          alt="Braço fonocaptor analógico em S"
          className="w-full h-full object-contain filter drop-shadow-[6px_16px_14px_rgba(0,0,0,0.85)] brightness-[1.03] contrast-[1.06]"
          draggable={false}
        />

        {/* 4. Luz de Mira da Agulha / Glow Quente no Sulco de Vinil (Quando em Reprodução) */}
        <div
          className={`absolute left-4 sm:left-6 bottom-2 w-3 h-3 rounded-full transition-opacity duration-500 pointer-events-none ${
            isLightOn
              ? 'opacity-100 bg-[#ffddaa] shadow-[0_0_16px_#ffb95f,0_0_6px_#ffffff] animate-pulse'
              : 'opacity-0'
          }`}
          title="Iluminação da agulha fonocaptora no sulco"
        />
      </div>

      {/* 5. Alavanca Manual de Cueing (Elevador Hidráulico) */}
      <div
        onClick={onCueToggle}
        className="absolute top-24 sm:top-28 right-2 sm:right-3 pointer-events-auto cursor-pointer group flex items-center gap-1 bg-surface-container-lowest/80 px-1.5 py-1 rounded border border-outline-variant/30 shadow-md hover:border-primary/50 transition-all"
        title="Alternar elevação hidráulica do braço (Cue Lever)"
      >
        <div className="flex flex-col items-center">
          <span className="font-headline text-[7px] text-outline uppercase font-bold tracking-wider">
            CUE
          </span>
          <span
            className={`font-mono text-[8px] font-bold ${
              isCueLifted ? 'text-secondary' : 'text-primary'
            }`}
          >
            {isCueLifted ? 'UP (12deg)' : 'DOWN (21deg)'}
          </span>
        </div>
      </div>
    </div>
  );
};
