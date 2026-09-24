import React, { useEffect } from 'react';
import { PlayerPlaybackState, Track } from '../types';
import { Turntable } from '../components/player/Turntable';

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
  // Listener de tecla ESC para sair instantaneamente da tela cheia
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExitFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitFullscreen]);

  return (
    <div
      onClick={(e) => {
        // Se clicar no fundo escuro fora do chassi da vitrola, sai da tela cheia
        if (e.target === e.currentTarget) {
          onExitFullscreen();
        }
      }}
      className="fixed inset-0 z-50 bg-[#050403] bg-[radial-gradient(ellipse_at_center,_rgba(254,196,134,0.06)_0%,_rgba(10,8,7,0.98)_65%,_#020202_100%)] text-on-surface flex items-center justify-center p-0 m-0 select-none overflow-hidden cursor-default animate-fade-in"
    >
      {/* SOMENTE A VITROLA COM O DISCO TOCANDO E O NOME DA MÚSICA NO CENTRO — MAIS NADA NA TELA */}
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl flex flex-col items-center justify-center drop-shadow-[0_35px_70px_rgba(0,0,0,0.98)]">
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
