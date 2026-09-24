import React from 'react';
import { Track } from '../../types';
import { Disc3 } from 'lucide-react';

interface TrackReadoutProps {
  currentTrack: Track | null;
}

export const TrackReadout: React.FC<TrackReadoutProps> = ({ currentTrack }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-space-sm select-none">
      <div className="flex flex-col min-w-0 max-w-full">
        {/* Track Number & Era Chip */}
        <div className="flex items-center gap-space-sm">
          <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-mono text-[10px] font-bold shadow-sm">
            {currentTrack?.trackNumber
              ? `TRACK ${String(currentTrack.trackNumber).padStart(2, '0')}`
              : 'TRACK 01'}
          </span>
          <span className="font-mono text-[11px] text-outline font-medium tracking-wider">
            {currentTrack?.year
              ? `STEREO LP MASTERS · ${currentTrack.year}`
              : 'STEREO LP MASTERS 1959'}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-2xl lg:text-3xl text-primary-fixed font-bold tracking-tight truncate mt-1">
          {currentTrack?.title || 'Selecione uma faixa da estante'}
        </h1>

        {/* Artist & Album */}
        <p className="font-headline text-sm text-on-surface-variant font-medium truncate">
          {currentTrack ? (
            <>
              {currentTrack.artist} —{' '}
              <span className="text-on-surface">{currentTrack.album}</span>
            </>
          ) : (
            'Nenhum disco em reprodução na bandeja'
          )}
        </p>
      </div>

      {/* Cartridge Load & Audio Quality Badge */}
      <div className="flex items-center gap-space-xs bg-surface-container-highest/80 px-space-md py-space-xs rounded-lg shadow-inner border border-outline-variant/30">
        <span className="text-secondary">
          <Disc3 size={20} />
        </span>
        <div className="flex flex-col text-right">
          <span className="font-headline text-[9px] text-outline uppercase font-bold tracking-wider">
            Cartridge Load
          </span>
          <span className="font-mono text-xs text-secondary font-bold">
            Moving Coil 47kΩ
          </span>
        </div>
      </div>
    </div>
  );
};
