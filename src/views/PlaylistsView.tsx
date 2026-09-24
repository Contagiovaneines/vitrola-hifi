import React from 'react';
import { Playlist, Track } from '../types';
import { Radio, Plus, Play, Clock, Sparkles } from 'lucide-react';

interface PlaylistsViewProps {
  playlists: Playlist[];
  onSelectPlaylist?: (playlist: Playlist) => void;
  onPlayTrack: (track: Track) => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  onSelectPlaylist,
}) => {
  return (
    <div className="flex flex-col w-full pb-space-xl select-none">
      <div className="flex items-center justify-between py-space-md border-b border-outline-variant/20 mb-space-md">
        <div>
          <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">
            Playlists &amp; Seleções Temáticas
          </h2>
          <p className="font-headline text-xs text-on-surface-variant mt-1">
            Caixotes de prensagens organizadas por atmosfera e época
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-space-md py-2 rounded bg-primary-container text-on-primary-container font-headline text-xs font-bold shadow-md hover:bg-primary transition-all">
          <Plus size={16} />
          <span>Nova Seleção de Vinil</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => onSelectPlaylist?.(pl)}
            className="group flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="relative w-full aspect-video rounded-lg bg-surface-container-lowest p-3 flex items-center justify-between overflow-hidden border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary/30">
                  {pl.isSmart ? <Sparkles size={24} /> : <Radio size={24} />}
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-base text-primary-fixed font-bold">
                    {pl.name}
                  </span>
                  <span className="font-mono text-[10px] text-outline">
                    {pl.trackIds.length} faixas selecionadas
                  </span>
                </div>
              </div>

              <button
                className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95"
                title="Tocar seleção inteira"
                aria-label={`Tocar ${pl.name}`}
              >
                <Play size={18} className="translate-x-0.5" />
              </button>
            </div>

            <p className="font-headline text-xs text-on-surface-variant mt-space-sm line-clamp-2">
              {pl.description || 'Seleção musical com dinâmica acústica ajustada para agulha fonocaptora.'}
            </p>

            <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-outline-variant/20 font-mono text-[10px] text-outline">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>Criada em {new Date(pl.createdAt).toLocaleDateString('pt-BR')}</span>
              </span>
              <span className="text-secondary font-bold">
                {pl.isSmart ? 'SMART' : 'MANUAL'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
