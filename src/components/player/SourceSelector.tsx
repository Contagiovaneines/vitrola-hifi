import React from 'react';
import { AudioSourceType } from '../../types';

interface SourceSelectorProps {
  currentSource: AudioSourceType;
  onSourceChange: (source: AudioSourceType) => void;
}

export const SourceSelector: React.FC<SourceSelectorProps> = ({
  currentSource,
  onSourceChange,
}) => {
  const sources: {
    id: AudioSourceType;
    label: string;
    sublabel: string;
    color: string;
  }[] = [
    {
      id: 'local',
      label: 'LOCAL',
      sublabel: 'FLAC / MP3',
      color: '#ffb95f',
    },
    {
      id: 'spotify',
      label: 'SPOTIFY',
      sublabel: 'Connect / SDK',
      color: '#1db954',
    },
    {
      id: 'deezer',
      label: 'DEEZER',
      sublabel: 'Preview 30s',
      color: '#a238ff',
    },
    {
      id: 'youtube',
      label: 'YOUTUBE',
      sublabel: 'IFrame Direct',
      color: '#ff3333',
    },
  ];

  return (
    <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] border border-outline-variant/30 select-none">
      <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-outline-variant/20">
        <span className="font-headline text-[9px] text-outline uppercase tracking-wider font-bold">
          Audio Source Selector
        </span>
        <span className="font-mono text-[9px] text-on-surface-variant font-medium">
          4 BUS ROUTING
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sources.map((s) => {
          const isActive = currentSource === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSourceChange(s.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all border ${
                isActive
                  ? 'bg-surface-container-high border-primary/40 shadow-[inset_0_1px_2px_rgba(254,196,134,0.3)]'
                  : 'bg-surface-container-lowest/80 border-transparent opacity-70 hover:opacity-100 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: isActive ? s.color : '#3c3836',
                    boxShadow: isActive ? `0 0 8px ${s.color}` : 'none',
                  }}
                ></span>
                <span
                  className={`font-headline text-[10px] font-bold uppercase ${
                    isActive ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              <span className="font-mono text-[8px] text-outline truncate w-full text-center">
                {s.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
