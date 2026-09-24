import React from 'react';
import { NavigationTab } from '../../types';
import { Disc, Layers, Radio, Palette, Sliders } from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  masterAttenuationDb?: number;
  outputEngine?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  masterAttenuationDb = -14.5,
  outputEngine = 'Direct Audio / Tube Sat'
}) => {
  const navItems: { id: NavigationTab; num: string; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', num: '01', label: 'Início', icon: <Disc size={18} /> },
    { id: 'biblioteca', num: '02', label: 'Biblioteca', icon: <Layers size={18} /> },
    { id: 'playlists', num: '03', label: 'Playlists', icon: <Radio size={18} /> },
    { id: 'fontes', num: '04', label: 'Fontes', icon: <Sliders size={18} /> },
    { id: 'aparencia', num: '05', label: 'Aparência', icon: <Palette size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest/90 backdrop-blur-md z-40 flex flex-col justify-between p-space-md shadow-[4px_0_24px_rgba(0,0,0,0.7)] border-r border-outline-variant/30 select-none">
      <div className="flex flex-col gap-space-lg">
        {/* Section Title */}
        <div className="px-space-sm pt-space-xs">
          <div className="font-headline text-[10px] text-outline uppercase tracking-widest font-bold">
            Deck Controls
          </div>
          <div className="font-display text-base text-primary font-bold mt-1 tracking-tight">
            Console Rack
          </div>
        </div>

        {/* Numbered Rack Nav Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Menu do Console">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-space-md py-2.5 rounded-lg transition-all font-headline text-sm text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-on-primary-container' : 'text-primary-container'}>
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </div>
                <span
                  className={`font-mono text-xs ${
                    isActive ? 'text-on-primary-container/80' : 'text-outline'
                  }`}
                >
                  {item.num}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Telemetry Bay: Live Feed & Master Attenuation */}
      <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_#ffb95f,0_0_2px_#ffffff]"></span>
            <span className="font-headline text-[10px] text-secondary tracking-widest uppercase font-bold">
              LIVE FEED
            </span>
          </div>
          <span className="font-mono text-[11px] text-primary font-bold">
            24b / 96k
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <div className="font-headline text-[9px] text-outline uppercase tracking-wider font-semibold">
            Output Engine
          </div>
          <div className="px-2 py-1 rounded bg-surface-container-high shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] font-mono text-[10px] text-primary truncate border border-outline-variant/20">
            {outputEngine}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
          <div className="flex flex-col">
            <span className="font-headline text-[9px] text-outline uppercase font-semibold">
              Master Attn
            </span>
            <span className="font-mono text-sm text-primary font-bold">
              {masterAttenuationDb.toFixed(1)} dB
            </span>
          </div>
          {/* Decorative Master Knob */}
          <div className="w-9 h-9 rounded-full bg-surface-bright flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,221,187,0.3)] relative border border-outline-variant/40">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary absolute top-1 shadow-[0_0_4px_#ffb95f]"></div>
            <div className="w-4 h-4 rounded-full bg-surface-container-lowest shadow-inner"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
