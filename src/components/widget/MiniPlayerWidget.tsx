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
  Anchor,
  Sliders,
  Disc,
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

  // Widget presentation: 'dock' (horizontal dock bar) or 'deck' (vertical mini deck console)
  const [widgetMode, setWidgetMode] = useState<'dock' | 'deck'>(() => {
    try {
      return (localStorage.getItem('vitrola_widget_mode') as 'dock' | 'deck') || 'dock';
    } catch {
      return 'dock';
    }
  });

  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);

  // Position state (persisted to localStorage)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('vitrola_dock_position');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Save mode changes
  const handleToggleMode = () => {
    const nextMode = widgetMode === 'dock' ? 'deck' : 'dock';
    setWidgetMode(nextMode);
    try {
      localStorage.setItem('vitrola_widget_mode', nextMode);
    } catch {
      // ignore
    }
  };

  // Helper to snap to bottom center dock position
  const snapToDock = () => {
    if (typeof window === 'undefined') return;
    const widgetWidth = widgetMode === 'dock' ? 460 : 360;
    const widgetHeight = widgetMode === 'dock' ? 68 : 220;
    const dockX = Math.max(10, Math.round((window.innerWidth - widgetWidth) / 2));
    const dockY = Math.max(10, Math.round(window.innerHeight - widgetHeight - 16));
    const newPos = { x: dockX, y: dockY };
    setPosition(newPos);
    try {
      localStorage.setItem('vitrola_dock_position', JSON.stringify(newPos));
    } catch {
      // ignore
    }
  };

  // Initialize position on bottom center or bottom-right of viewport on first render
  useEffect(() => {
    if (!position && typeof window !== 'undefined') {
      snapToDock();
    }
  }, []);

  // Window resize handler to keep inside screen boundaries
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const widgetWidth = widgetMode === 'dock' ? 460 : 360;
        const maxX = Math.max(0, window.innerWidth - widgetWidth);
        const maxY = Math.max(0, window.innerHeight - 70);
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [widgetMode]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, [data-no-drag]')) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position?.x ?? Math.max(20, (window.innerWidth - 460) / 2),
      startY: position?.y ?? Math.max(20, window.innerHeight - 80),
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;
      const newPos = {
        x: dragStartRef.current.startX + deltaX,
        y: dragStartRef.current.startY + deltaY,
      };
      setPosition(newPos);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setPosition((current) => {
          if (current) {
            try {
              localStorage.setItem('vitrola_dock_position', JSON.stringify(current));
            } catch {
              // ignore
            }
          }
          return current;
        });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!onSeek || durationSec <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(clickRatio * durationSec);
  };

  const sourceLabels: Record<AudioSourceType, { label: string; color: string; border: string }> = {
    local: { label: 'LOCAL HI-FI', color: '#ffb95f', border: 'border-[#ffb95f]/40' },
    spotify: { label: 'SPOTIFY', color: '#1db954', border: 'border-[#1db954]/40' },
    deezer: { label: 'DEEZER', color: '#a238ff', border: 'border-[#a238ff]/40' },
    youtube: { label: 'YT MUSIC', color: '#ff3333', border: 'border-[#ff3333]/40' },
  };

  const currentSourceInfo = sourceLabels[currentTrack?.source || currentSource] || sourceLabels.local;

  // Format time mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // RENDER: DOCK HORIZONTAL BAR (Ideal para o Dock do Windows)
  // -------------------------------------------------------------
  if (widgetMode === 'dock') {
    return (
      <div
        ref={widgetRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: position ? `${position.x}px` : undefined,
          top: position ? `${position.y}px` : undefined,
          zIndex: isAlwaysOnTop ? 99999 : 50,
        }}
        className={`w-[450px] max-w-[calc(100vw-20px)] h-[66px] px-3.5 py-2 rounded-2xl bg-[#0c0a08]/95 backdrop-blur-2xl border border-amber-500/35 shadow-[0_12px_36px_rgba(0,0,0,0.92),0_0_20px_rgba(255,185,95,0.18)] flex items-center justify-between gap-3 select-none transition-shadow cursor-grab active:cursor-grabbing ${
          isAlwaysOnTop ? 'ring-1 ring-amber-400/40' : ''
        }`}
        title="Dock Vitrola Hi-Fi (Arraste para posicionar no seu dock)"
      >
        {/* 1. DISQUINHO GIRANDO (VINIL EM MINIATURA) */}
        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center pointer-events-none">
          {/* Prato base / Sombra usinada */}
          <div className="w-12 h-12 rounded-full bg-stone-950 p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.95),inset_0_1px_3px_rgba(255,200,120,0.2)] border border-amber-500/30 flex items-center justify-center">
            {/* Vinil girando com grooves */}
            <div
              className={`relative w-full h-full rounded-full bg-[#120f0d] vinyl-grooves-pattern flex items-center justify-center overflow-hidden transition-transform duration-300 ${
                isPlaying ? 'animate-vinyl-33' : ''
              }`}
              style={{
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 0 2px rgba(255,185,95,0.2)',
              }}
            >
              {/* Reflexo cônico de luz no vinil */}
              <div className="absolute inset-0 rounded-full vinyl-sheen-conic opacity-70 pointer-events-none"></div>

              {/* Ranhuras usinadas concêntricas */}
              <div className="absolute inset-[3px] rounded-full border border-stone-800/40 pointer-events-none"></div>
              <div className="absolute inset-[6px] rounded-full border border-stone-800/50 pointer-events-none"></div>

              {/* Selo Central (Capa do Álbum ou Selo Vitrola) */}
              <div className="relative w-5 h-5 rounded-full overflow-hidden shadow-inner border border-amber-400/50 flex items-center justify-center bg-gradient-to-tr from-amber-900 to-amber-600">
                {currentTrack?.coverUri ? (
                  <img
                    src={currentTrack.coverUri}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Disc size={11} className="text-amber-200" />
                )}
                {/* Pino Central de Latão (Spindle) */}
                <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 border border-stone-900 shadow-xs pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Mini Agulha/Stylus de latão pousada no disco */}
          <div
            className={`absolute -top-0.5 right-0.5 w-1 h-5.5 rounded-xs bg-gradient-to-b from-amber-400 to-amber-600 origin-top shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none transition-transform duration-500 ${
              isPlaying ? 'rotate-[26deg]' : 'rotate-[6deg]'
            }`}
          >
            {/* Ponta da agulha */}
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber-200 rounded-full shadow-xs"></div>
          </div>
        </div>

        {/* 2. INFORMAÇÕES DA FAIXA + MINI BARRA DE PROGRESSO */}
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: currentSourceInfo.color,
                boxShadow: `0 0 6px ${currentSourceInfo.color}`,
              }}
            ></span>
            <span
              className="font-display text-xs text-amber-300 font-bold truncate tracking-wide"
              title={currentTrack?.title || 'Sem Disco no Prato'}
            >
              {currentTrack?.title || 'Sem Disco no Prato'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5">
            <span className="truncate max-w-[170px]" title={currentTrack?.artist || 'Vitrola Console'}>
              {currentTrack?.artist || 'Vitrola Hi-Fi'}
            </span>
            <span className="font-mono text-[9px] text-amber-500/80 shrink-0 ml-1">
              {currentTimeSec > 0 ? formatTime(currentTimeSec) : '0:00'} / {durationSec > 0 ? formatTime(durationSec) : '0:00'}
            </span>
          </div>

          {/* Barra de progresso clicável */}
          <div
            data-no-drag="true"
            onClick={handleScrubClick}
            className="w-full h-1.5 bg-stone-900/90 rounded-full mt-1 overflow-hidden cursor-pointer hover:h-2 transition-all relative border border-stone-800"
            title="Clique para avançar ou voltar"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_8px_#fec486] transition-[width] duration-100 rounded-full"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* 3. BOTÕES PRINCIPAIS DE CONTROLE DO DOCK: [VOLTA] [PAUSA/PLAY] [PASSA PRA FRENTE] */}
        <div className="flex items-center gap-1.5 shrink-0" data-no-drag="true">
          {/* BOTÃO VOLTA (⏮) */}
          <button
            onClick={onPrevTrack}
            aria-label="Voltar faixa"
            title="Voltar Faixa (⏮)"
            className="w-8 h-8 rounded-lg bg-stone-900/90 hover:bg-stone-800 active:scale-95 border border-amber-500/20 hover:border-amber-400/50 flex items-center justify-center text-amber-200 hover:text-amber-100 transition-all shadow-sm"
          >
            <SkipBack size={15} />
          </button>

          {/* BOTÃO PAUSA / PLAY (⏯) COM ILUMINAÇÃO RETRÔ */}
          <button
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pausar reprodução' : 'Iniciar reprodução'}
            title={isPlaying ? 'Pausar (Espaço)' : 'Tocar (Espaço)'}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-[0_2px_12px_rgba(245,188,126,0.4)] ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-[0_0_14px_rgba(245,158,11,0.6)]'
                : 'bg-amber-500/90 hover:bg-amber-400 text-stone-950'
            }`}
          >
            {isPlaying ? (
              <Pause size={17} className="fill-current" />
            ) : (
              <Play size={17} className="fill-current translate-x-0.5" />
            )}
          </button>

          {/* BOTÃO PASSA PRA FRENTE (⏭) */}
          <button
            onClick={onNextTrack}
            aria-label="Avançar faixa"
            title="Passar pra Frente (⏭)"
            className="w-8 h-8 rounded-lg bg-stone-900/90 hover:bg-stone-800 active:scale-95 border border-amber-500/20 hover:border-amber-400/50 flex items-center justify-center text-amber-200 hover:text-amber-100 transition-all shadow-sm"
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* 4. AÇÕES RÁPIDAS DO DOCK (ENCAIXAR, FIXAR, MODO, FECHAR) */}
        <div className="flex items-center gap-1 pl-1 border-l border-amber-500/20 shrink-0" data-no-drag="true">
          {/* Encaixar no Dock Inferior */}
          <button
            onClick={snapToDock}
            aria-label="Encaixar no Dock inferior do Windows"
            title="Encaixar no Dock Inferior (Centro)"
            className="p-1 rounded text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 transition-colors"
          >
            <Anchor size={13} />
          </button>

          {/* Fixar Sempre no Topo */}
          <button
            onClick={() => setIsAlwaysOnTop(!isAlwaysOnTop)}
            aria-label={isAlwaysOnTop ? 'Desafixar do topo' : 'Fixar sempre no topo'}
            title={isAlwaysOnTop ? 'Sempre no Topo (Ativo)' : 'Fixar Sempre no Topo'}
            className={`p-1 rounded transition-colors ${
              isAlwaysOnTop
                ? 'text-amber-400 bg-amber-950/50 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isAlwaysOnTop ? <Pin size={12} className="rotate-45" /> : <PinOff size={12} />}
          </button>

          {/* Alternar para modo Mini Deck */}
          <button
            onClick={handleToggleMode}
            aria-label="Alternar para modo Mini Deck com VU meters"
            title="Modo Mini Deck com Ponteiros VU"
            className="p-1 rounded text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 transition-colors"
          >
            <Sliders size={12} />
          </button>

          {/* Restaurar Janela Principal */}
          {onRestoreMain && (
            <button
              onClick={onRestoreMain}
              aria-label="Restaurar janela principal da Vitrola"
              title="Restaurar Vitrola Principal"
              className="p-1 rounded text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 transition-colors"
            >
              <Maximize2 size={12} />
            </button>
          )}

          {/* Fechar Widget */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Fechar widget"
              title="Fechar Widget"
              className="p-1 rounded text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MODO MINI DECK (Console Vertical com Ponteiros VU)
  // -------------------------------------------------------------
  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        zIndex: isAlwaysOnTop ? 99999 : 50,
      }}
      className={`w-[360px] p-3 rounded-xl bg-surface-container-lowest/95 backdrop-blur-xl border border-primary/40 shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_15px_var(--color-glow,rgba(255,185,95,0.15))] flex flex-col gap-2 select-none transition-shadow cursor-grab active:cursor-grabbing ${
        isAlwaysOnTop ? 'ring-1 ring-secondary/30' : ''
      }`}
    >
      {/* Barra de Título & Arraste */}
      <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
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

        <div className="flex items-center gap-1" data-no-drag="true">
          {/* Encaixar no Dock */}
          <button
            onClick={snapToDock}
            aria-label="Encaixar no Dock inferior do Windows"
            title="Encaixar no Dock Inferior"
            className="p-1 rounded text-outline hover:text-primary transition-colors"
          >
            <Anchor size={12} />
          </button>

          {/* Alternar para Barra Dock */}
          <button
            onClick={handleToggleMode}
            aria-label="Alternar para Barra Dock compacta"
            title="Alternar para Barra Dock Compacta"
            className="p-1 rounded text-outline hover:text-primary transition-colors"
          >
            <Sliders size={12} />
          </button>

          {/* Fixar no Topo */}
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

          {/* Restaurar Janela Principal */}
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

          {/* Fechar mini widget */}
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

      {/* Disquinho girando + Metadados */}
      <div className="flex items-center gap-3 py-0.5">
        {/* Mini Spinning Vinyl Disc */}
        <div className="relative w-14 h-14 rounded-full bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,0,0,0.95)] flex items-center justify-center shrink-0 border border-primary-container/30">
          <div
            className={`w-full h-full rounded-full bg-[#110e0c] vinyl-grooves-pattern flex items-center justify-center overflow-hidden ${
              isPlaying ? 'animate-vinyl-33' : ''
            }`}
          >
            <div className="absolute inset-0 rounded-full vinyl-sheen-conic opacity-60 pointer-events-none"></div>
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

        {/* Metadados e barra de tempo */}
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
            data-no-drag="true"
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

      {/* Controles de Transporte & VU Meter */}
      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20" data-no-drag="true">
        {/* Botão Volta, Pausa/Play, Passa pra Frente */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevTrack}
            aria-label="Voltar faixa anterior"
            title="Voltar Faixa (⏮)"
            className="w-7 h-7 rounded bg-surface-container-high/80 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors shadow-sm"
          >
            <SkipBack size={13} />
          </button>
          <button
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
            title={isPlaying ? 'Pausar' : 'Tocar'}
            className="w-8 h-8 rounded-full bg-primary-container hover:bg-primary text-on-primary-container flex items-center justify-center shadow-[0_2px_8px_rgba(245,188,126,0.3)] transition-all"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="translate-x-0.5" />}
          </button>
          <button
            onClick={onNextTrack}
            aria-label="Passar para próxima faixa"
            title="Passar pra Frente (⏭)"
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
    </div>
  );
};
