import React, { useState, useRef, useEffect } from 'react';
import { PlayerPlaybackState, Track, AudioSourceType } from '../../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  X,
  Pin,
  PinOff,
  ChevronDown,
  ChevronUp,
  Volume2,
} from 'lucide-react';

interface MiniPlayerWidgetProps {
  playbackState: PlayerPlaybackState;
  currentTrack: Track | null;
  currentTimeSec: number;
  durationSec: number;
  currentSource?: AudioSourceType;
  onPlayToggle: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSeek?: (positionSec: number) => void;
  onRestoreMain?: () => void;
  onClose?: () => void;
  vuDb?: number;
}

export const MiniPlayerWidget: React.FC<MiniPlayerWidgetProps> = ({
  playbackState,
  currentTrack,
  currentTimeSec,
  durationSec,
  currentSource = 'local',
  onPlayToggle,
  onPrevTrack,
  onNextTrack,
  onSeek,
  onRestoreMain,
  onClose,
  vuDb = -40,
}) => {
  const isPlaying = playbackState === 'playing';
  const progressPct = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  // Widget state
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom-right of viewport on first render
  useEffect(() => {
    if (!position && typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 380);
      const defaultY = Math.max(20, window.innerHeight - 200);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag when clicking the header area, not buttons
    if ((e.target as HTMLElement).closest('button')) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position?.x || (window.innerWidth - 380),
      startY: position?.y || (window.innerHeight - 200),
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;

      // Allow dragging freely across multiple monitors
      setPosition({
        x: dragStartRef.current.startX + deltaX,
        y: dragStartRef.current.startY + deltaY,
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || durationSec <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(clickRatio * durationSec);
  };

  const sourceLabels: Record<AudioSourceType, { label: string; color: string; border: string }> = {
    local: { label: 'LOCAL HI-RES', color: '#ffb95f', border: 'border-[#ffb95f]/40' },
    spotify: { label: 'SPOTIFY', color: '#1db954', border: 'border-[#1db954]/40' },
    deezer: { label: 'DEEZER PREVIEW', color: '#a238ff', border: 'border-[#a238ff]/40' },
    youtube: { label: 'YOUTUBE CRT', color: '#ff3333', border: 'border-[#ff3333]/40' },
  };

  const currentSourceInfo = sourceLabels[currentTrack?.source || currentSource] || sourceLabels.local;

  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        zIndex: isAlwaysOnTop ? 99999 : 50,
      }}
      className={`w-[360px] p-3 rounded-xl bg-surface-container-lowest/95 backdrop-blur-xl border border-primary/40 shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_15px_var(--color-glow,rgba(255,185,95,0.15))] flex flex-col gap-2 select-none transition-shadow ${
        isAlwaysOnTop ? 'ring-1 ring-secondary/30' : ''
      }`}
    >
      {/* Widget Drag Handle & Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shadow-sm"
            style={{
              backgroundColor: currentSourceInfo.color,
              boxShadow: `0 0 6px ${currentSourceInfo.color}`,
            }}
          ></span>
          <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">
            VITROLA MINI DECK
          </span>
          <span
            className={`px-1.5 py-0.2 rounded font-mono text-[8px] font-bold border ${currentSourceInfo.border}`}
            style={{ color: currentSourceInfo.color }}
          >
            {currentSourceInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Always on top pin button */}
          <button
            onClick={() => setIsAlwaysOnTop(!isAlwaysOnTop)}
            aria-label={isAlwaysOnTop ? 'Desafixar do topo' : 'Fixar sempre no topo'}
            title={isAlwaysOnTop ? 'Sempre no Topo (Ativo)' : 'Fixar Sempre no Topo'}
            className={`p-1 rounded transition-colors ${
              isAlwaysOnTop
                ? 'text-secondary bg-surface-container-high'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            {isAlwaysOnTop ? <Pin size={11} className="rotate-45" /> : <PinOff size={11} />}
          </button>

          {/* Expand / Collapse details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
            className="text-outline hover:text-on-surface transition-colors p-1"
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Restore main player window */}
          {onRestoreMain && (
            <button
              onClick={onRestoreMain}
              aria-label="Restaurar janela principal da Vitrola"
              title="Restaurar Janela Principal"
              className="text-outline hover:text-primary transition-colors p-1"
            >
              <Maximize2 size={11} />
            </button>
          )}

          {/* Close mini widget */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Fechar mini widget"
              title="Fechar Widget"
              className="text-outline hover:text-error transition-colors p-1"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Core Audio Row: Circular Rotating Disc / Cover + Metadata */}
      <div className="flex items-center gap-3 py-0.5">
        {/* Mini Spinning Vinyl Disc with Cover */}
        <div className="relative w-13 h-13 rounded-full bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,0,0,0.95)] flex items-center justify-center shrink-0 border border-primary-container/30">
          <div
            className={`w-full h-full rounded-full bg-[#110e0c] vinyl-grooves-pattern flex items-center justify-center overflow-hidden ${
              isPlaying ? 'animate-vinyl-33' : ''
            }`}
          >
            {currentTrack?.coverUri ? (
              <img
                src={currentTrack.coverUri}
                alt=""
                className="w-6 h-6 rounded-full object-cover shadow-inner border border-[#ffddbb]/40"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[7px] font-bold text-on-secondary-container shadow-inner border border-[#ffddbb]/40">
                VT
              </div>
            )}
          </div>
          {/* Mini Stylus Tonearm */}
          <div
            className={`absolute -top-1 -right-0.5 w-1 h-6 bg-primary-fixed rounded origin-top shadow-sm pointer-events-none transition-transform duration-500 ${
              isPlaying ? 'rotate-[32deg]' : 'rotate-[8deg]'
            }`}
          ></div>
        </div>

        {/* Info & Progress Bar */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs text-primary font-bold truncate">
              {currentTrack?.title || 'Sem Disco no Prato'}
            </span>
            <span className="font-mono text-[9px] text-secondary shrink-0 ml-1">
              {currentTrack?.format?.codec || 'FLAC'}
            </span>
          </div>
          <span className="font-headline text-[11px] text-on-surface-variant truncate">
            {currentTrack ? `${currentTrack.artist} — ${currentTrack.album}` : 'Aguardando seleção'}
          </span>

          {/* Interactive Mini Scrub Progress Bar */}
          <div
            onClick={handleScrubClick}
            className="w-full h-1.5 bg-surface-container-highest rounded-full mt-1.5 overflow-hidden cursor-pointer hover:h-2 transition-all relative"
            title="Clique para avançar/retroceder"
          >
            <div
              className="h-full bg-primary shadow-[0_0_8px_#fec486] transition-[width] duration-100 rounded-full"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded Controls & Dynamic VU Meter */}
      {isExpanded && (
        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
          {/* Transport buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevTrack}
              aria-label="Faixa anterior"
              className="w-7 h-7 rounded bg-surface-container-high/80 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shadow-sm"
            >
              <SkipBack size={13} />
            </button>
            <button
              onClick={onPlayToggle}
              aria-label={isPlaying ? 'Pausar' : 'Tocar'}
              className="w-8 h-8 rounded-full bg-primary-container hover:bg-primary text-on-primary-container flex items-center justify-center shadow-[0_2px_8px_rgba(245,188,126,0.3)] transition-all"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} className="translate-x-0.5" />}
            </button>
            <button
              onClick={onNextTrack}
              aria-label="Próxima faixa"
              className="w-7 h-7 rounded bg-surface-container-high/80 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shadow-sm"
            >
              <SkipForward size={13} />
            </button>
          </div>

          {/* Real PCM Ballistic Mini VU Meter */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high/70 shadow-inner border border-outline-variant/20">
            <span className="font-headline text-[8px] text-outline font-bold">VU</span>
            <div className="flex items-end gap-0.5 h-3">
              <span
                className={`w-1 h-1.5 rounded-xs transition-colors duration-75 ${
                  isPlaying ? 'bg-secondary' : 'bg-outline-variant/40'
                }`}
              ></span>
              <span
                className={`w-1 h-2 rounded-xs transition-colors duration-75 ${
                  isPlaying && vuDb > -20 ? 'bg-secondary' : 'bg-outline-variant/40'
                }`}
              ></span>
              <span
                className={`w-1 h-2.5 rounded-xs transition-colors duration-75 ${
                  isPlaying && vuDb > -10 ? 'bg-secondary' : 'bg-outline-variant/40'
                }`}
              ></span>
              <span
                className={`w-1 h-3 rounded-xs transition-colors duration-75 ${
                  isPlaying && vuDb > -2 ? 'bg-error animate-pulse' : 'bg-outline-variant/40'
                }`}
              ></span>
            </div>
            <span className="font-mono text-[9px] text-primary font-bold w-9 text-right">
              {isPlaying ? `${vuDb > -40 ? vuDb.toFixed(0) : '-40'}dB` : 'MUTED'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
