import React from 'react';
import { Track } from '../../types';
import { ListMusic } from 'lucide-react';

interface NextTracksProps {
  tracks: Track[];
  currentTrackId?: string;
  onSelectTrack: (track: Track) => void;
}

export const NextTracks: React.FC<NextTracksProps> = ({
  tracks,
  currentTrackId,
  onSelectTrack,
}) => {
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] border border-outline-variant/30 flex flex-col gap-space-xs select-none">
      <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
        <div className="flex items-center gap-1.5">
          <span className="text-primary">
            <ListMusic size={18} />
          </span>
          <span className="font-headline text-xs text-on-surface font-semibold">
            Próximas Faixas do Álbum
          </span>
        </div>
        <span className="font-mono text-[9px] text-outline font-bold">
          FILA DINÂMICA
        </span>
      </div>

      <div className="flex flex-col gap-1 mt-1 max-h-48 overflow-y-auto pr-1">
        {tracks.length === 0 ? (
          <div className="py-4 text-center font-headline text-xs text-outline">
            Nenhuma faixa subsequente na fila.
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isActive = track.id === currentTrackId;
            return (
              <button
                key={track.id || idx}
                onClick={() => onSelectTrack(track)}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded transition-all text-left ${
                  isActive
                    ? 'bg-surface-container-high shadow-sm border border-primary/30'
                    : 'hover:bg-surface-container border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-1 h-5 rounded ${
                      isActive ? 'bg-primary' : 'bg-transparent'
                    }`}
                  ></div>
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-headline text-xs truncate ${
                        isActive ? 'text-primary font-semibold' : 'text-on-surface'
                      }`}
                    >
                      {track.title}
                    </span>
                    <span className="font-headline text-[10px] text-on-surface-variant truncate">
                      {track.artist}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-xs shrink-0 ml-2 ${
                    isActive ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {formatTime(track.durationSec)}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
