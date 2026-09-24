import React from 'react';
import { PlayerPlaybackState, Track } from '../types';
import { Turntable } from '../components/player/Turntable';
import { Minimize2 } from 'lucide-react';

interface FullscreenViewProps {
  playbackState: PlayerPlaybackState;
  speed: 33 | 45;
  onSpeedChange: (speed: 33 | 45) => void;
  currentTrack: Track | null;
  onExitFullscreen: () => void;
  onPlayToggle?: () => void;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({
  playbackState,
  speed,
  onSpeedChange,
  currentTrack,
  onExitFullscreen,
  onPlayToggle,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#070504] bg-[radial-gradient(ellipse_at_center,_rgba(254,196,134,0.07)_0%,_rgba(12,9,8,0.95)_65%,_#040302_100%)] text-on-surface flex items-center justify-center p-4 sm:p-8 lg:p-12 select-none overflow-hidden">
      {/* Botão flutuante minimalista para sair da tela cheia */}
      <button
        onClick={onExitFullscreen}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-surface-container-lowest/60 hover:bg-surface-container-lowest text-on-surface-variant hover:text-primary backdrop-blur-md border border-outline-variant/20 transition-all opacity-40 hover:opacity-100 flex items-center gap-1.5 shadow-xl group cursor-pointer"
        title="Sair do modo Tela Cheia [ESC ou F]"
        aria-label="Sair de tela cheia"
      >
        <Minimize2 size={18} />
        <span className="font-headline text-[10px] font-bold pr-1 hidden group-hover:inline">
          Sair [ESC]
        </span>
      </button>

      {/* Somente a Vitrola com o Disco Tocando em Destaque Absoluto */}
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-center justify-center drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]">
        <Turntable
          playbackState={playbackState}
          speed={speed}
          onSpeedChange={onSpeedChange}
          currentTrack={currentTrack}
          onCueToggle={onPlayToggle}
        />
      </div>
    </div>
  );
};
