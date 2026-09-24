import React from 'react';
import { PlayerPlaybackState, Track } from '../../types';
import { Play, Pause, SkipBack, SkipForward, Maximize2, X } from 'lucide-react';

interface MiniPlayerWidgetProps {
  playbackState: PlayerPlaybackState;
  currentTrack: Track | null;
  currentTimeSec: number;
  durationSec: number;
  onPlayToggle: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onRestoreMain?: () => void;
  onClose?: () => void;
  vuDb?: number;
}

export const MiniPlayerWidget: React.FC<MiniPlayerWidgetProps> = ({
  playbackState,
  currentTrack,
  currentTimeSec,
  durationSec,
  onPlayToggle,
  onPrevTrack,
  onNextTrack,
  onRestoreMain,
  onClose,
  vuDb = -12,
}) => {
  const isPlaying = playbackState === 'playing';
  const progressPct = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <div className="w-full max-w-[370px] p-space-sm rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl border border-primary/30 shadow-[0_12px_32px_rgba(0,0,0,0.85)] flex flex-col gap-space-xs select-none">
      {/* Widget Handle & Controls */}
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 cursor-move">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#ffb95f]"></span>
          <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">
            VITROLA MINI DECK
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRestoreMain && (
            <button
              onClick={onRestoreMain}
              aria-label="Restaurar janela principal"
              className="text-outline hover:text-primary transition-colors p-1"
            >
              <Maximize2 size={12} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Fechar mini widget"
              className="text-outline hover:text-error transition-colors p-1"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Core Audio Row: Circular Rotating Disc + Meta */}
      <div className="flex items-center gap-3 py-1">
        {/* Mini Vinyl Spinning Disc */}
        <div className="relative w-14 h-14 rounded-full bg-surface-container-lowest shadow-[0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center shrink-0 border border-primary-container/30">
          <div
            className={`w-full h-full rounded-full bg-[#110e0c] vinyl-grooves-pattern flex items-center justify-center overflow-hidden ${
              isPlaying ? 'animate-vinyl-33' : ''
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[7px] font-bold text-on-secondary-container shadow-inner border border-[#ffddbb]/40">
              VT
            </div>
          </div>
          {/* Mini Tonearm Over Disc */}
          <div className="absolute -top-1 -right-0.5 w-1 h-7 bg-primary-fixed rounded origin-top rotate-[32deg] shadow-sm pointer-events-none"></div>
        </div>

        {/* Info & Progress Bar */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm text-primary font-bold truncate">
              {currentTrack?.title || 'Sem Disco'}
            </span>
            <span className="font-mono text-[9px] text-secondary shrink-0 ml-1">
              FLAC
            </span>
          </div>
          <span className="font-headline text-xs text-on-surface-variant truncate">
            {currentTrack ? `${currentTrack.artist} — ${currentTrack.album}` : 'Aguardando seleção'}
          </span>

          <div className="w-full h-1 bg-surface-container-highest rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-primary shadow-[0_0_8px_#fec486] transition-[width] duration-100"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Widget Transport Controls & Mini VU */}
      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevTrack}
            aria-label="Faixa anterior"
            className="w-7 h-7 rounded bg-surface-container-high/80 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shadow-sm"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            className="w-8 h-8 rounded-full bg-primary-container hover:bg-primary text-on-primary-container flex items-center justify-center shadow-[0_2px_8px_rgba(245,188,126,0.3)] transition-all"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="translate-x-0.5" />}
          </button>
          <button
            onClick={onNextTrack}
            aria-label="Próxima faixa"
            className="w-7 h-7 rounded bg-surface-container-high/80 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shadow-sm"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Mini Dynamic VU Meter */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high/70 shadow-inner border border-outline-variant/20">
          <span className="font-headline text-[8px] text-outline font-bold">VU</span>
          <div className="flex items-end gap-0.5 h-3">
            <span
              className={`w-1 h-1.5 rounded-xs ${
                isPlaying ? 'bg-secondary' : 'bg-outline-variant'
              }`}
            ></span>
            <span
              className={`w-1 h-2 rounded-xs ${
                isPlaying && vuDb > -18 ? 'bg-secondary' : 'bg-outline-variant'
              }`}
            ></span>
            <span
              className={`w-1 h-2.5 rounded-xs ${
                isPlaying && vuDb > -10 ? 'bg-secondary' : 'bg-outline-variant'
              }`}
            ></span>
            <span
              className={`w-1 h-3 rounded-xs ${
                isPlaying && vuDb > -3 ? 'bg-error animate-pulse' : 'bg-outline-variant'
              }`}
            ></span>
          </div>
          <span className="font-mono text-[9px] text-primary font-bold">
            {isPlaying ? `${vuDb.toFixed(0)}dB` : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};
