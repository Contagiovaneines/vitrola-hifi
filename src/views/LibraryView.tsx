import React, { useState } from 'react';
import { Album, Track } from '../types';
import {
  Search,
  LayoutGrid,
  Disc,
  Layers,
  List,
  Play,
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { SpotifyLinkService } from '../services/providers/spotify/SpotifyLinkService';
import { YouTubePlaybackProvider } from '../services/providers/youtube/YouTubePlaybackProvider';

interface LibraryViewProps {
  albums: Album[];
  onPlayTrack: (track: Track, fileBlob?: Blob) => void;
  onInspectAlbum?: (album: Album) => void;
  onImportFiles?: (files: FileList) => void;
  onClearLibrary?: () => void;
  onAddAlbum?: (album: Album) => void;
  onAddTrack?: (track: Track) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  albums,
  onPlayTrack,
  onImportFiles,
  onClearLibrary,
  onAddAlbum,
  onAddTrack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'shelf' | 'crate' | 'list'>('shelf');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(
    albums.length > 0 ? albums[0] : null
  );

  // Link Import State
  const [linkInput, setLinkInput] = useState('');
  const [isImportingLink, setIsImportingLink] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImportFiles) {
      onImportFiles(e.target.files);
    }
  };

  const handleImportLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = linkInput.trim();
    if (!url) {
      setImportFeedback({
        type: 'error',
        message: 'Por favor, insira uma URL ou URI do Spotify ou YouTube.',
      });
      return;
    }

    setIsImportingLink(true);
    setImportFeedback(null);

    try {
      // 1. Spotify Link
      if (url.includes('spotify') || url.startsWith('spotify:')) {
        const parsed = SpotifyLinkService.parseLink(url);
        const result = await SpotifyLinkService.fetchMetadata(parsed);

        if (result.album && onAddAlbum) {
          onAddAlbum(result.album);
          setSelectedAlbum(result.album);
        } else if (result.track && onAddTrack) {
          onAddTrack(result.track);
        }

        setImportFeedback({
          type: 'success',
          message: result.message,
        });
        setLinkInput('');
        return;
      }

      // 2. YouTube / YouTube Music Link
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const media = YouTubePlaybackProvider.extractMedia(url);
        if (!media) {
          throw new Error('URL do YouTube não reconhecida. Use links válidos de vídeos ou playlists.');
        }

        let title = media.type === 'playlist' ? 'Playlist YouTube Music' : 'Música YouTube';
        let artist = 'YouTube Music';
        let cover = `https://img.youtube.com/vi/${media.id}/hqdefault.jpg`;

        if (media.type === 'video') {
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${media.id}&format=json`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.title) title = data.title;
              if (data.author_name) artist = data.author_name;
              if (data.thumbnail_url) cover = data.thumbnail_url;
            }
          } catch {
            // fallback
          }
        }

        const track: Track = {
          id: `yt-${media.id}`,
          source: 'youtube',
          title,
          artist,
          album: media.type === 'playlist' ? 'Seleção YouTube Music' : 'Transmissão YouTube',
          durationSec: 240,
          uri: media.id,
          coverUri: cover,
          format: {
            codec: 'AAC',
            sampleRate: 48000,
            bitDepth: 24,
            channels: 2,
            isLossless: false,
          },
          addedAt: new Date().toISOString(),
          playCount: 0,
          labelInfo: {
            recordLabel: 'YOUTUBE MUSIC ARCHIVE',
            matrixRpm: 33,
            catalogNumber: `YTM-${media.id.slice(0, 8).toUpperCase()}`,
          },
        };

        const album: Album = {
          id: `yt-album-${media.id}`,
          title,
          artist,
          year: new Date().getFullYear(),
          coverUri: cover,
          trackCount: 1,
          totalDurationSec: 240,
          tracks: [track],
          isHiRes: false,
          source: 'youtube',
        };

        if (onAddAlbum) {
          onAddAlbum(album);
          setSelectedAlbum(album);
        } else if (onAddTrack) {
          onAddTrack(track);
        }

        setImportFeedback({
          type: 'success',
          message: `Mídia "${title}" do YouTube adicionada à estante com sucesso!`,
        });
        setLinkInput('');
        return;
      }

      throw new Error(
        'Formato não reconhecido. Formatos aceitos: open.spotify.com/album/..., open.spotify.com/track/..., spotify:track:... ou links do YouTube/YouTube Music.'
      );
    } catch (err) {
      setImportFeedback({
        type: 'error',
        message: (err as Error).message || 'Falha ao processar link.',
      });
    } finally {
      setIsImportingLink(false);
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded font-headline text-xs font-bold bg-primary text-on-primary shadow-md hover:bg-primary-fixed transition-all cursor-pointer">
              <span>+ Importar Músicas Locais</span>
              <input
                type="file"
                multiple
                accept=".mp3,.flac,.wav,.ogg,.m4a,.aac,audio/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>

            {onClearLibrary && albums.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Deseja realmente limpar todos os discos da biblioteca local?')) {
                    onClearLibrary();
                    setSelectedAlbum(null);
                  }
                }}
                className="px-2.5 py-1.5 rounded font-headline text-xs text-error hover:bg-error-container/20 transition-colors border border-error/30"
                title="Limpar todos os discos da biblioteca"
              >
                Limpar Biblioteca
              </button>
            )}

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

        {/* INPUT DE ADICIONAR LINK (SPOTIFY & YOUTUBE) */}
        <form
          onSubmit={handleImportLink}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-primary/30 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex-1 focus-within:border-primary/60 transition-all">
            <Link2 size={16} className="text-secondary shrink-0" />
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Adicionar link: open.spotify.com/album/..., open.spotify.com/track/..., spotify:track:... ou YouTube..."
              className="w-full bg-transparent font-headline text-xs text-on-surface placeholder:text-outline/60 focus:outline-none"
              disabled={isImportingLink}
            />
          </div>

          <button
            type="submit"
            disabled={isImportingLink || !linkInput.trim()}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-headline text-xs font-bold shadow-md hover:bg-primary-fixed transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0"
          >
            {isImportingLink ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Link2 size={14} />
                <span>Adicionar à Biblioteca</span>
              </>
            )}
          </button>
        </form>

        {/* FEEDBACK BANNER (SUCCESS / ERROR) */}
        {importFeedback && (
          <div
            className={`flex items-center justify-between p-3 rounded-lg border text-xs font-headline transition-all ${
              importFeedback.type === 'success'
                ? 'bg-[#1db954]/15 border-[#1db954]/40 text-[#1db954]'
                : 'bg-error-container/20 border-error/40 text-error'
            }`}
          >
            <div className="flex items-center gap-2">
              {importFeedback.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0" />
              )}
              <span>{importFeedback.message}</span>
            </div>
            <button
              onClick={() => setImportFeedback(null)}
              className="font-mono text-xs opacity-75 hover:opacity-100 ml-4 px-1"
            >
              ✕
            </button>
          </div>
        )}

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
          <button
            onClick={() => setSourceFilter('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-headline text-xs font-semibold transition-all ${
              sourceFilter === 'youtube'
                ? 'bg-secondary-container text-on-secondary-container shadow-md font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff3333]"></span>
            <span>YouTube</span>
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

          {/* Vinyl Crate Grid or Clean Empty State */}
          {filteredAlbums.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-surface-container-low rounded-xl border border-dashed border-outline-variant/40 text-center">
              <Disc size={48} className="text-secondary/60 mb-3" />
              <h3 className="font-display text-base text-primary font-bold">
                Sua estante de vinis está vazia
              </h3>
              <p className="font-headline text-xs text-on-surface-variant max-w-sm mt-1">
                Adicione um álbum ou faixa do Spotify ou YouTube pelo campo acima, ou importe arquivos de áudio locais (FLAC, MP3, WAV, OGG, AAC).
              </p>
              <label className="mt-4 px-4 py-2 rounded bg-primary text-on-primary font-headline text-xs font-bold hover:bg-primary-fixed transition-colors shadow-md cursor-pointer">
                <span>Importar Arquivos Locais</span>
                <input
                  type="file"
                  multiple
                  accept=".mp3,.flac,.wav,.ogg,.m4a,.aac,audio/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              {filteredAlbums.map((album) => {
                const isSelected = selectedAlbum?.id === album.id;
                const primaryTrack = album.tracks[0];
                const isSpotify = album.source === 'spotify';
                const isYouTube = album.source === 'youtube';

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
                        <div className="flex items-center gap-1.5">
                          {isSpotify && (
                            <span className="px-1.5 py-0.2 rounded bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/30 font-mono text-[9px] font-bold">
                              SPOTIFY
                            </span>
                          )}
                          {isYouTube && (
                            <span className="px-1.5 py-0.2 rounded bg-[#ff3333]/20 text-[#ff3333] border border-[#ff3333]/30 font-mono text-[9px] font-bold">
                              YOUTUBE
                            </span>
                          )}
                          {!isSpotify && !isYouTube && (
                            <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-mono text-[9px] font-bold">
                              LOCAL
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-secondary font-bold">
                            {album.tracks.length} {album.tracks.length === 1 ? 'faixa' : 'faixas'}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-outline">
                          {album.year || new Date().getFullYear()}
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
          )}
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
                  <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/30">
                    {selectedAlbum.coverUri ? (
                      <img
                        src={selectedAlbum.coverUri}
                        alt={selectedAlbum.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Disc size={28} className="text-secondary" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-sm text-primary font-bold truncate">
                      {selectedAlbum.title}
                    </span>
                    <span className="font-headline text-xs text-on-surface-variant truncate">
                      {selectedAlbum.artist} ({selectedAlbum.year || new Date().getFullYear()})
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-mono text-[9px] border border-outline-variant/20 font-bold uppercase">
                        {selectedAlbum.source}
                      </span>
                      <span className="font-mono text-[9px] text-outline">
                        {selectedAlbum.tracks.length} faixas
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
                  <span>Tocar Álbum no Prato</span>
                </button>

                {/* Tracklist Preview with all tracks */}
                <div className="flex flex-col gap-1 mt-space-sm border-t border-outline-variant/20 pt-space-xs">
                  <span className="font-headline text-[9px] text-outline uppercase font-bold tracking-wider">
                    Faixas da Prensagem:
                  </span>
                  <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                    {selectedAlbum.tracks.map((trk, i) => (
                      <div
                        key={trk.id || i}
                        onClick={() => onPlayTrack(trk)}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-surface-container cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs text-outline group-hover:text-primary">
                            {String(trk.trackNumber || i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-headline text-xs text-on-surface truncate group-hover:text-primary transition-colors">
                            {trk.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-primary shrink-0 ml-2">
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
