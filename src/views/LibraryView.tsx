import React, { useState } from 'react';
import { Album, Track } from '../types';
import { Search, Grid, LayoutGrid, List, Play, Disc, Layers } from 'lucide-react';

interface LibraryViewProps {
  albums: Album[];
  onPlayTrack: (track: Track, fileBlob?: Blob) => void;
  onInspectAlbum?: (album: Album) => void;
  onImportFiles?: (files: FileList) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  albums,
  onPlayTrack,
  onImportFiles,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'shelf' | 'crate' | 'list'>('shelf');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(
    albums.length > 0 ? albums[0] : null
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImportFiles) {
      onImportFiles(e.target.files);
    }
  };

  // Filtro
  const filteredAlbums = albums.filter((alb) => {
    const matchesSearch =
      alb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alb.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource =
      sourceFilter === 'all' ? true : alb.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl select-none">
      {/* Top Command Rack */}
      <section className="flex flex-col gap-space-md py-space-md border-b border-outline-variant/20">
        {/* Breadcrumb & Crate Status */}
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-low rounded border border-outline-variant/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#ffb95f]"></span>
              <span className="font-headline text-[10px] text-primary tracking-widest uppercase font-bold">
                Estante / Coleção Ativa
              </span>
            </div>
            <span className="font-mono text-xs text-outline font-semibold">
              CRATE // 02-VINYL-VAULT
            </span>
            <span className="font-mono text-xs text-on-surface-variant font-bold">
              {filteredAlbums.length} TÍTULOS DISPONÍVEIS
            </span>
          </div>

          {/* View Selector Buttons */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded font-headline text-xs font-bold bg-primary text-on-primary shadow-md hover:bg-primary-fixed transition-all cursor-pointer">
              <span>+ Importar Músicas</span>
              <input
                type="file"
                multiple
                accept=".mp3,.flac,.wav,.ogg,.m4a,.aac,audio/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>

            <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border border-outline-variant/30">
              <button
                onClick={() => setViewMode('shelf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-headline text-xs font-semibold transition-all ${
                  viewMode === 'shelf'
                    ? 'bg-surface-container-high text-primary shadow-[0_2px_6px_rgba(0,0,0,0.6)]'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <LayoutGrid size={15} />
                <span>Estante</span>
              </button>
              <button
                onClick={() => setViewMode('crate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-headline text-xs font-semibold transition-all ${
                  viewMode === 'crate'
                    ? 'bg-surface-container-high text-primary shadow-[0_2px_6px_rgba(0,0,0,0.6)]'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <Disc size={15} />
                <span>Caixote (Digging)</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-headline text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-surface-container-high text-primary shadow-[0_2px_6px_rgba(0,0,0,0.6)]'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <List size={15} />
                <span>Prateleira</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chiseled Search Bar & Sort Deck */}
        <div className="grid grid-cols-12 gap-space-md items-center bg-surface-container-low p-space-md rounded-xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_4px_12px_rgba(0,0,0,0.5)] border border-outline-variant/30">
          {/* Search Slot */}
          <div className="col-span-12 lg:col-span-8 flex items-center bg-surface-container-lowest rounded-lg px-space-md py-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] border border-outline-variant/30 group focus-within:border-primary/60 transition-all">
            <Search size={18} className="text-secondary mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por álbum, artista, prensagem, gênero ou matriz..."
              className="w-full bg-transparent text-on-surface placeholder:text-outline/60 focus:outline-none font-headline text-sm"
            />
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px] border border-outline-variant/30">
              ⌘K
            </kbd>
          </div>

          {/* Quick Sort Options */}
          <div className="col-span-12 lg:col-span-4 flex items-center justify-end gap-space-md">
            <span className="font-headline text-[10px] text-outline uppercase font-bold tracking-wider">
              Ordenar:
            </span>
            <select className="bg-surface-container-lowest text-primary font-headline text-xs px-space-sm py-1.5 rounded shadow-inner border border-outline-variant/30 focus:outline-none cursor-pointer">
              <option>Adicionados Recentemente</option>
              <option>Ano de Gravação (Decrescente)</option>
              <option>Taxa de Amostragem (Hi-Res Primeiro)</option>
              <option>Artista (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Source Matrix Buttons */}
        <div className="flex flex-wrap items-center gap-space-xs pt-1">
          <span className="font-headline text-[10px] text-outline uppercase mr-2 tracking-widest font-bold">
            Fontes:
          </span>
          <button
            onClick={() => setSourceFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-headline text-xs font-semibold transition-all ${
              sourceFilter === 'all'
                ? 'bg-secondary-container text-on-secondary-container shadow-md font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers size={14} />
            <span>Todos</span>
            <span className="font-mono text-[9px] px-1.5 rounded-full bg-surface-container-lowest/40 ml-1">
              {albums.length}
            </span>
          </button>
          <button
            onClick={() => setSourceFilter('local')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-headline text-xs font-semibold transition-all ${
              sourceFilter === 'local'
                ? 'bg-secondary-container text-on-secondary-container shadow-md font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Disc size={14} className="text-secondary" />
            <span>Arquivos Locais</span>
          </button>
          <button
            onClick={() => setSourceFilter('spotify')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-headline text-xs font-semibold transition-all ${
              sourceFilter === 'spotify'
                ? 'bg-secondary-container text-on-secondary-container shadow-md font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1db954]"></span>
            <span>Spotify</span>
          </button>
        </div>
      </section>

      {/* Main Crate Digging & Vinyl Shelf Console Grid */}
      <div className="grid grid-cols-12 gap-space-lg items-start mt-space-md">
        {/* Left / Center: Interactive Crate Wall (8 cols) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
            <h2 className="font-display text-lg text-on-surface font-bold tracking-tight">
              Estante de Vinis Selecionados
            </h2>
            <span className="font-mono text-xs text-outline font-medium">
              Mostrando {filteredAlbums.length} prensagens
            </span>
          </div>

          {/* Vinyl Crate Grid with realistic jacket and vinyl slide out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {filteredAlbums.map((album) => {
              const isSelected = selectedAlbum?.id === album.id;
              const primaryTrack = album.tracks[0];
              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className={`group relative flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-primary shadow-[0_0_15px_rgba(254,196,134,0.3)]'
                      : 'border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  {/* Album Jacket & Sliding Out Vinyl Record Area */}
                  <div className="relative w-full aspect-square bg-surface-container-lowest rounded-lg p-2 overflow-hidden flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] border border-outline-variant/20">
                    {/* Simulated Realistic Vinyl Record (Sliding out to the right on hover) */}
                    <div className="absolute right-2 w-[82%] h-[82%] rounded-full bg-[#0a0908] shadow-[0_10px_25px_rgba(0,0,0,0.95)] flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-7 group-hover:rotate-12 border border-outline-variant/30">
                      <div className="w-full h-full rounded-full vinyl-grooves-pattern flex items-center justify-center">
                        <div className="w-[34%] h-[34%] rounded-full bg-secondary-container shadow-inner flex flex-col items-center justify-center p-1 text-center border border-[#ffddbb]/40">
                          <span className="font-headline text-[7px] text-on-secondary-container font-extrabold uppercase leading-none truncate max-w-full">
                            {album.tracks[0]?.labelInfo?.recordLabel || 'VITROLA'}
                          </span>
                          <span className="font-mono text-[6px] text-on-secondary-container font-bold leading-none mt-0.5">
                            {album.tracks[0]?.labelInfo?.matrixRpm || 33} RPM
                          </span>
                          <div className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest mt-1 shadow-inner"></div>
                        </div>
                      </div>
                    </div>

                    {/* Cardboard Album Sleeve Jacket with Spine Highlights */}
                    <div className="relative z-10 w-[78%] h-[92%] mr-auto rounded bg-surface-container-high shadow-[4px_0_14px_rgba(0,0,0,0.85)] overflow-hidden border border-outline-variant/40 flex items-center justify-center">
                      {album.coverUri ? (
                        <img
                          src={album.coverUri}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        /* Generative Classic Jazz Sleeve */
                        <div className="w-full h-full bg-gradient-to-br from-[#2a221b] via-[#1a1512] to-[#100d0b] p-space-md flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[8px] text-primary uppercase font-bold tracking-widest bg-surface-container-lowest/80 px-1 py-0.5 rounded border border-outline-variant/20">
                              {album.isHiRes ? 'HI-RES MASTER' : 'VINYL PRESS'}
                            </span>
                            <span className="font-mono text-[8px] text-outline">
                              {album.year || '1974'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-display text-base text-primary-fixed font-bold leading-tight drop-shadow">
                              {album.title}
                            </h4>
                            <p className="font-headline text-xs text-on-surface-variant font-medium mt-0.5">
                              {album.artist}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Album Info & Action */}
                  <div className="flex flex-col gap-1 mt-space-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-secondary font-bold">
                        {album.tracks.length} faixas · {album.isHiRes ? 'FLAC Hi-Res' : 'Stereo Master'}
                      </span>
                      <span className="font-mono text-[10px] text-outline">
                        {album.year || '1959'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-display text-base text-on-surface font-bold group-hover:text-primary transition-colors truncate">
                          {album.title}
                        </h3>
                        <p className="font-headline text-xs text-on-surface-variant font-medium truncate">
                          {album.artist}
                        </p>
                      </div>

                      {/* Colocar no Prato Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (primaryTrack) onPlayTrack(primaryTrack);
                        }}
                        className="w-9 h-9 rounded bg-surface-bright text-on-surface hover:bg-primary-container hover:text-on-primary-container shadow-[0_4px_10px_rgba(0,0,0,0.6)] border border-outline-variant/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0"
                        title="Colocar disco no prato e tocar"
                        aria-label={`Colocar ${album.title} no prato`}
                      >
                        <Play size={18} className="translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Turntable Inspection Bay (4 cols) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-space-md">
          <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30">
            {/* Bay Heading */}
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#ffb95f]"></span>
                <span className="font-headline text-[10px] text-primary tracking-widest uppercase font-bold">
                  DISCO EM ANÁLISE
                </span>
              </div>
              <span className="font-mono text-[9px] text-outline font-bold">
                MATRIZ HI-FI
              </span>
            </div>

            {selectedAlbum ? (
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center gap-3 p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                  <div className="w-14 h-14 rounded bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/30">
                    <Disc size={28} className="text-secondary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-sm text-primary font-bold truncate">
                      {selectedAlbum.title}
                    </span>
                    <span className="font-headline text-xs text-on-surface-variant truncate">
                      {selectedAlbum.artist} ({selectedAlbum.year || '1959'})
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-mono text-[9px] border border-outline-variant/20 font-bold">
                        FLAC 192k/24b
                      </span>
                      <span className="font-mono text-[9px] text-outline">
                        DR 14dB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Play Full Album Button */}
                <button
                  onClick={() => {
                    if (selectedAlbum.tracks[0]) onPlayTrack(selectedAlbum.tracks[0]);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded bg-primary text-on-primary font-headline text-xs font-bold shadow-[0_4px_12px_rgba(254,196,134,0.3)] hover:bg-primary-fixed transition-all"
                >
                  <Play size={16} />
                  <span>Tocar Álbum Completo no Prato</span>
                </button>

                {/* Tracklist Preview */}
                <div className="flex flex-col gap-1 mt-space-sm border-t border-outline-variant/20 pt-space-xs">
                  <span className="font-headline text-[9px] text-outline uppercase font-bold tracking-wider">
                    Faixas da Prensagem:
                  </span>
                  <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                    {selectedAlbum.tracks.map((trk, i) => (
                      <div
                        key={trk.id || i}
                        onClick={() => onPlayTrack(trk)}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs text-outline">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-headline text-xs text-on-surface truncate">
                            {trk.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-primary">
                          {Math.floor(trk.durationSec / 60)}:
                          {String(Math.floor(trk.durationSec % 60)).padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center font-headline text-xs text-outline">
                Selecione um álbum da estante para inspecionar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
