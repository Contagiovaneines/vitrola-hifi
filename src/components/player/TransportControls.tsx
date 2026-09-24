import React from 'react';
import { PlayerPlaybackState } from '../../types';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Disc } from 'lucide-react';

interface TransportControlsProps {
  playbackState: PlayerPlaybackState;
  onPlayToggle: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onEject: () => void;
  isShuffle?: boolean;
  onShuffleToggle?: () => void;
  isRepeat?: boolean;
  onRepeatToggle?: () => void;
  disabled?: boolean;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  playbackState,
  onPlayToggle,
  onPrevTrack,
  onNextTrack,
  onEject,
  isShuffle = false,
  onShuffleToggle,
  isRepeat = false,
  onRepeatToggle,
  disabled = false
}) => {
  const isPlaying = playbackState === 'playing';

  return (
    <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs select-none">
      {/* Secondary Controls (Shuffle / Repeat) */}
      <div className="flex items-center gap-space-sm">
        <button
          onClick={onShuffleToggle}
          aria-label="Modo aleatório"
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-[0_2px_6px_rgba(0,0,0,0.7)] border border-outline-variant/30 ${
            isShuffle
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[0_0_8px_#ffb95f]'
              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Shuffle size={18} />
        </button>

        <button
          onClick={onRepeatToggle}
          aria-label="Repetir faixa ou disco"
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-[0_2px_6px_rgba(0,0,0,0.7)] border border-outline-variant/30 ${
            isRepeat
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[0_0_8px_#ffb95f]'
              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Repeat size={18} />
        </button>
      </div>

      {/* Primary Transport Trio */}
      <div className="flex items-center gap-space-md">
        {/* Previous Track */}
        <button
          onClick={onPrevTrack}
          disabled={disabled}
          aria-label="Faixa anterior"
          className="w-12 h-12 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface active:translate-y-0.5 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,221,187,0.2)] flex items-center justify-center border border-outline-variant/30 disabled:opacity-50"
        >
          <SkipBack size={22} />
        </button>

        {/* PRIMARY MASTER PLAY/PAUSE: Heavy Turn-Machined Brass Button */}
        <button
          onClick={onPlayToggle}
          disabled={disabled}
          aria-label={isPlaying ? 'Pausar reprodução' : 'Iniciar reprodução'}
          className="relative w-16 h-16 rounded-full bg-gradient-to-b from-[#fec486] via-[#e0a96d] to-[#805521] text-on-primary-fixed shadow-[0_8px_20px_rgba(0,0,0,0.85),0_0_16px_rgba(254,196,134,0.4)] active:translate-y-1 active:shadow-inner transition-all flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
        >
          {/* Outer Amber Glow Ring */}
          <div
            className={`absolute inset-0 rounded-full border border-secondary transition-opacity duration-300 ${
              isPlaying
                ? 'opacity-100 shadow-[0_0_14px_#ffb95f]'
                : 'opacity-40 group-hover:opacity-80'
            }`}
          ></div>

          <span className="text-[#3b2100] drop-shadow">
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
          </span>
        </button>

        {/* Next Track */}
        <button
          onClick={onNextTrack}
          disabled={disabled}
          aria-label="Próxima faixa"
          className="w-12 h-12 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface active:translate-y-0.5 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,221,187,0.2)] flex items-center justify-center border border-outline-variant/30 disabled:opacity-50"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Eject / Tonearm Return Button */}
      <div className="flex items-center gap-space-sm">
        <button
          onClick={onEject}
          aria-label="Ejetar disco e retornar o braço ao descanso"
          className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-headline text-xs font-bold uppercase tracking-wider shadow-[0_2px_6px_rgba(0,0,0,0.7)] border border-outline-variant/30 transition-all"
        >
          <Disc size={16} className="text-tertiary" />
          <span>Ejetar</span>
        </button>
      </div>
    </div>
  );
};
