import React from 'react';
import { VitrolaLogo } from '../../assets/VitrolaLogo';
import { NavigationTab } from '../../types';
import { Minus, Square, X, Music, PictureInPicture2 } from 'lucide-react';

interface WindowHeaderProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isAudioOnline?: boolean;
  onToggleMiniWidget?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  currentTab,
  onTabChange,
  isAudioOnline = true,
  onToggleMiniWidget,
  onMinimize,
  onMaximize,
  onClose
}) => {
  const tabs: { id: NavigationTab; label: string }[] = [
    { id: 'inicio', label: 'Início' },
    { id: 'biblioteca', label: 'Biblioteca' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'fontes', label: 'Fontes' },
    { id: 'aparencia', label: 'Aparência' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.85)] flex items-center justify-between px-space-md border-b border-outline-variant/30 select-none">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-space-md h-full">
        <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => onTabChange('inicio')}>
          <VitrolaLogo size={32} />
          <span className="font-display text-lg text-primary tracking-wider uppercase font-bold">
            VITROLA
          </span>
        </div>
        <div className="h-4 w-[1px] bg-outline-variant/40 hidden sm:block"></div>
        <span className="font-mono text-[11px] text-on-surface-variant/80 hidden sm:inline-block tracking-widest uppercase">
          Hi-Fi Turntable Console
        </span>
      </div>

      {/* Main Top Nav Pills */}
      <nav
        className="hidden md:flex items-center gap-1 bg-surface-container-low/80 p-1 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-outline-variant/20"
        aria-label="Navegação Principal"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-1.5 rounded-full font-headline text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Windows Controls & Status */}
      <div className="flex items-center gap-space-md">
        {/* Audio Engine Online Status */}
        <div className="hidden lg:flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-high/60 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] border border-outline-variant/20">
          <span
            className={`w-2 h-2 rounded-full ${
              isAudioOnline
                ? 'bg-secondary shadow-[0_0_8px_#ffb95f]'
                : 'bg-outline-variant'
            }`}
          ></span>
          <span className="font-mono text-[10px] text-secondary tracking-widest uppercase font-bold">
            DSP 24b/96k
          </span>
        </div>

        {/* Windows Standard Title Bar Buttons */}
        <div className="flex items-center gap-1 ml-2">
          {onToggleMiniWidget && (
            <button
              onClick={onToggleMiniWidget}
              aria-label="Destacar Mini Widget Flutuante"
              title="Destacar Mini Widget Flutuante"
              className="w-7 h-7 rounded bg-surface-container-high/70 hover:bg-surface-bright flex items-center justify-center text-secondary hover:text-primary transition-colors"
            >
              <PictureInPicture2 size={13} />
            </button>
          )}
          <button
            onClick={onMinimize}
            aria-label="Minimizar janela"
            className="w-7 h-7 rounded bg-surface-container-high/70 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Minus size={13} />
          </button>
          <button
            onClick={onMaximize}
            aria-label="Maximizar ou restaurar janela"
            className="w-7 h-7 rounded bg-surface-container-high/70 hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Square size={11} />
          </button>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-7 h-7 rounded bg-surface-container-high/70 hover:bg-error-container hover:text-on-error-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
