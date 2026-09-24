import React, { useState, useEffect, useRef } from 'react';
import { Tv, ShieldCheck, AlertCircle, ListMusic, Disc, Play, Music } from 'lucide-react';
import { YouTubePlaybackProvider } from '../../services/providers/youtube/YouTubePlaybackProvider';
import { Track, PlayerPlaybackState } from '../../types';

interface YouTubePlayerMonitorProps {
  currentVideoId?: string;
  onVideoChange?: (videoId: string) => void;
  onPlayTrack?: (track: Track) => void;
  onStateChange?: (state: PlayerPlaybackState) => void;
  isCompact?: boolean;
}

interface PlaylistTrackItem {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  durationSec: number;
}

export const YouTubePlayerMonitor: React.FC<YouTubePlayerMonitorProps> = ({
  currentVideoId = '',
  onVideoChange,
  onPlayTrack,
  onStateChange,
  isCompact = false,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'playlist'; id: string; videoId?: string }>({
    type: 'video',
    id: currentVideoId || 'kffacxfA7G4',
    videoId: currentVideoId || 'kffacxfA7G4',
  });

  // Lista de faixas da playlist para visualização e seleção direta na vitrola
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrackItem[]>([
    { id: 'yt-1', videoId: 'kffacxfA7G4', title: 'Carnívoro (Topic)', artist: 'MC Jacaré', durationSec: 154 },
    { id: 'yt-2', videoId: 'WJ_rF6n31qM', title: 'Vento Forte', artist: 'MC Jacaré', durationSec: 142 },
    { id: 'yt-3', videoId: '2xXqP8X6b7M', title: 'Melhor Vibe', artist: 'MC Jacaré', durationSec: 168 },
    { id: 'yt-4', videoId: 'b7M2xXqP8X6', title: 'Comigo Ninguém Pode', artist: 'MC Jacaré', durationSec: 135 },
    { id: 'yt-5', videoId: 'XqP8X6b7M2x', title: 'Coração Cachorro', artist: 'Avine Vinny & Matheus Fernandes', durationSec: 150 },
  ]);

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const lastTrackTitleRef = useRef<string>('');

  useEffect(() => {
    if (currentVideoId && currentVideoId !== activeMedia.id && currentVideoId !== activeMedia.videoId) {
      const isPl = currentVideoId.startsWith('PL') || currentVideoId.startsWith('RD') || currentVideoId.startsWith('LR');
      setActiveMedia((prev) => ({
        type: isPl ? 'playlist' : 'video',
        id: currentVideoId,
        videoId: isPl ? prev.videoId || 'kffacxfA7G4' : currentVideoId,
      }));
    }
  }, [currentVideoId]);

  // Listener para capturar o nome REAL da música e o estado de reprodução do YouTube IFrame Player
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        let payload = event.data;
        if (typeof payload === 'string') {
          payload = JSON.parse(payload);
        }

        // Sincroniza estado de reprodução (1 = PLAYING, 2 = PAUSED, 0 = ENDED)
        if (payload?.event === 'infoDelivery' && payload?.info?.playerState !== undefined) {
          const pState = payload.info.playerState;
          if (pState === 1) {
            onStateChange?.('playing');
          } else if (pState === 2 || pState === 0) {
            onStateChange?.('paused');
          }
        }

        // O player do YouTube emite infoDelivery com os dados reais do vídeo/música em reprodução
        if (payload?.event === 'infoDelivery' && payload?.info?.videoData) {
          const vd = payload.info.videoData;
          const rawTitle = vd.title;
          const author = vd.author || 'YouTube Music';
          const videoId = vd.video_id;

          if (rawTitle && rawTitle.trim()) {
            let songTitle = rawTitle.trim();
            let songArtist = author;

            // Remove sufixos comuns
            songTitle = songTitle
              .replace(/\s*[\(\[](?:Official\s*(?:Music\s*)?Video|Audio|Clip Oficial|Clipe Oficial|HD|4K|Lyrics|Visualizer)[\)\]]/gi, '')
              .trim();

            if (songTitle.includes(' - ')) {
              const parts = songTitle.split(' - ');
              songArtist = parts[0].trim();
              songTitle = parts.slice(1).join(' - ').trim();
            }

            if (lastTrackTitleRef.current === songTitle) return;
            lastTrackTitleRef.current = songTitle;

            const coverUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : undefined;

            onStateChange?.('playing');

            if (onPlayTrack) {
              onPlayTrack({
                id: `yt-${videoId || 'current'}`,
                source: 'youtube',
                title: songTitle,
                artist: songArtist,
                album: 'YouTube Music Master',
                durationSec: payload.info.duration ? Math.round(payload.info.duration) : 240,
                uri: videoId ? `youtube-${videoId}` : '',
                coverUri: coverUrl,
                format: {
                  codec: 'AAC',
                  sampleRate: 48000,
                  bitDepth: 24,
                  channels: 2,
                  isLossless: false,
                },
                labelInfo: {
                  recordLabel: 'YOUTUBE MUSIC MASTER ARCHIVE',
                  matrixRpm: 33,
                  catalogNumber: videoId ? `YTM-${videoId.slice(0, 8).toUpperCase()}` : 'YTM-LIVE',
                },
                addedAt: new Date().toISOString(),
                playCount: 0,
              });
            }
          }
        }
      } catch {
        // Ignora mensagens que não sejam do YouTube
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [onPlayTrack, onStateChange]);

  const handleSelectPlaylistItem = (trackItem: PlaylistTrackItem, index: number) => {
    setActiveTrackIndex(index);
    setActiveMedia({
      type: 'playlist',
      id: activeMedia.id,
      videoId: trackItem.videoId,
    });

    if (onVideoChange) onVideoChange(trackItem.videoId);
    onStateChange?.('playing');

    if (onPlayTrack) {
      onPlayTrack({
        id: `yt-${trackItem.videoId}`,
        source: 'youtube',
        title: trackItem.title,
        artist: trackItem.artist,
        album: 'Seleção YouTube Music',
        durationSec: trackItem.durationSec,
        uri: `youtube-${trackItem.videoId}`,
        coverUri: `https://img.youtube.com/vi/${trackItem.videoId}/hqdefault.jpg`,
        format: {
          codec: 'AAC',
          sampleRate: 48000,
          bitDepth: 24,
          channels: 2,
          isLossless: false,
        },
        labelInfo: {
          recordLabel: 'YOUTUBE MUSIC MASTER ARCHIVE',
          matrixRpm: 33,
          catalogNumber: `YTM-${trackItem.videoId.slice(0, 8).toUpperCase()}`,
        },
        addedAt: new Date().toISOString(),
        playCount: 0,
      });
    }
  };

  const handleLoad = async () => {
    const rawInput = inputUrl.trim();
    if (!rawInput) return;

    // Detecta se a URL contém um vídeo específico mesmo dentro de uma playlist (watch?v=...&list=...)
    const vMatch = rawInput.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const listMatch = rawInput.match(/[?&]list=([a-zA-Z0-9_-]+)/);

    let extractedType: 'video' | 'playlist' = 'video';
    let targetId = '';
    let targetVideoId = vMatch ? vMatch[1] : '';

    if (listMatch) {
      extractedType = 'playlist';
      targetId = listMatch[1];
    } else {
      const media = YouTubePlaybackProvider.extractMedia(rawInput);
      if (media) {
        extractedType = media.type;
        targetId = media.id;
        if (media.type === 'video') targetVideoId = media.id;
      }
    }

    if (!targetId && !targetVideoId) {
      alert('Por favor, informe uma URL ou ID válido de vídeo ou playlist do YouTube/YouTube Music.');
      return;
    }

    setIsLoading(true);

    const newMedia = {
      type: extractedType,
      id: targetId || targetVideoId,
      videoId: targetVideoId || (extractedType === 'video' ? targetId : 'kffacxfA7G4'),
    };
    setActiveMedia(newMedia);

    if (onVideoChange) onVideoChange(newMedia.videoId);
    onStateChange?.('playing');

    let title = 'Música em Reprodução';
    let artist = 'YouTube Music';
    let coverUrl: string | undefined = undefined;

    // Busca metadados se temos o ID do vídeo
    if (newMedia.videoId) {
      coverUrl = `https://img.youtube.com/vi/${newMedia.videoId}/hqdefault.jpg`;
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${newMedia.videoId}&format=json`);
        if (res.ok) {
          const data = await res.json();
          if (data.title) {
            let t = data.title.replace(/\s*[\(\[](?:Official\s*(?:Music\s*)?Video|Audio|Clip Oficial|Clipe Oficial|HD|4K|Lyrics)[\)\]]/gi, '').trim();
            if (t.includes(' - ')) {
              const parts = t.split(' - ');
              artist = parts[0].trim();
              title = parts.slice(1).join(' - ').trim();
            } else {
              title = t;
              if (data.author_name) artist = data.author_name;
            }
          }
        }
      } catch (err) {
        console.warn('oEmbed fetch error:', err);
      }
    }

    // Se for uma playlist nova, adiciona a faixa carregada no topo da lista
    if (newMedia.videoId) {
      setPlaylistTracks((prev) => [
        { id: `yt-${Date.now()}`, videoId: newMedia.videoId, title, artist, durationSec: 210 },
        ...prev.filter((t) => t.videoId !== newMedia.videoId),
      ]);
      setActiveTrackIndex(0);
    }

    lastTrackTitleRef.current = title;

    const track: Track = {
      id: `yt-${newMedia.videoId}`,
      source: 'youtube',
      title: title,
      artist: artist,
      album: extractedType === 'playlist' ? 'Seleção YouTube Music' : 'Transmissão Analógica Oficial',
      durationSec: 240,
      uri: `youtube-${newMedia.videoId}`,
      coverUri: coverUrl,
      format: {
        codec: 'AAC',
        sampleRate: 48000,
        bitDepth: 24,
        channels: 2,
        isLossless: false,
      },
      labelInfo: {
        recordLabel: 'YOUTUBE MUSIC MASTER ARCHIVE',
        matrixRpm: 33,
        catalogNumber: `YTM-${newMedia.videoId.slice(0, 8).toUpperCase()}`,
      },
      addedAt: new Date().toISOString(),
      playCount: 0,
    };

    if (onPlayTrack) {
      onPlayTrack(track);
    }

    setInputUrl('');
    setIsLoading(false);
  };

  // Construção do link de incorporação seguro (SEM origin=file:// para eliminar o Erro 153)
  const getEmbedUrl = () => {
    if (!activeMedia.id && !activeMedia.videoId) return '';

    const hasHttpOrigin =
      typeof window !== 'undefined' &&
      window.location.origin &&
      window.location.origin.startsWith('http');
    const originParam = hasHttpOrigin ? `&origin=${encodeURIComponent(window.location.origin)}` : '';

    // Se temos um vídeo específico (mesmo dentro de uma playlist):
    if (activeMedia.videoId) {
      const listParam = activeMedia.id && activeMedia.type === 'playlist' ? `&list=${activeMedia.id}` : '';
      return `https://www.youtube-nocookie.com/embed/${activeMedia.videoId}?autoplay=1&enablejsapi=1${listParam}${originParam}`;
    }

    // Se for playlist padrão PL...
    if (activeMedia.type === 'playlist' && activeMedia.id.startsWith('PL')) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${activeMedia.id}&autoplay=1&enablejsapi=1${originParam}`;
    }

    return `https://www.youtube-nocookie.com/embed/${activeMedia.id}?autoplay=1&enablejsapi=1${originParam}`;
  };

  const embedSrc = getEmbedUrl();

  return (
    <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-[0_8px_24px_rgba(0,0,0,0.85)] border border-primary/30 select-none flex flex-col gap-3">
      {/* Header com indicador CRT / Conformidade */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Tv size={16} className="text-[#ff3333]" />
          <span className="font-display text-xs text-primary font-bold tracking-wide">
            MONITOR CRT · YOUTUBE {activeMedia.type === 'playlist' ? 'PLAYLIST' : 'PLAYER'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeMedia.type === 'playlist' && (
            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-mono text-[9px] font-bold flex items-center gap-1">
              <ListMusic size={11} />
              <span>PLAYLIST CARREGADA</span>
            </span>
          )}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ff3333]/15 text-[#ff3333] border border-[#ff3333]/30 font-mono text-[9px] font-bold">
            <ShieldCheck size={12} />
            <span>TOCANDO NA VITROLA</span>
          </div>
        </div>
      </div>

      {/* Monitor Screen Frame */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border-2 border-outline-variant/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
        {embedSrc ? (
          <iframe
            id="vitrola-youtube-player-iframe"
            key={embedSrc}
            title="Vitrola Official YouTube Player"
            src={embedSrc}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-outline font-headline text-xs">
            <AlertCircle size={28} className="mb-2 text-outline-variant" />
            <span>Nenhuma mídia carregada no monitor</span>
            <span className="text-[10px] text-on-surface-variant/70 mt-1">
              Cole o link de uma música ou playlist do YouTube/YouTube Music abaixo para tocar no disco da Vitrola
            </span>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            placeholder="Cole o link da música ou playlist do YouTube Music..."
            className="flex-1 bg-surface-container px-2.5 py-2 rounded font-mono text-xs text-primary border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline/50"
          />
          <button
            onClick={handleLoad}
            disabled={isLoading || !inputUrl.trim()}
            className="px-3.5 py-2 rounded bg-primary text-on-primary font-headline text-xs font-bold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
            title="Colocar disco no prato e tocar na Vitrola"
          >
            <Disc size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Carregando...' : 'Tocar na Vitrola'}</span>
          </button>
        </div>

        {/* 4. FAIXAS DA PLAYLIST QUE APARECEM DIRETO NA VITROLA (Atende 'e a playlist apareça') */}
        <div className="mt-2 p-2.5 rounded-lg bg-surface-container-lowest border border-primary/20">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <ListMusic size={14} className="text-secondary" />
              <span className="font-display text-xs text-primary-fixed font-bold">
                FAIXAS DA PLAYLIST NA VITROLA
              </span>
            </div>
            <span className="font-mono text-[9px] text-outline">
              {playlistTracks.length} músicas carregadas
            </span>
          </div>

          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {playlistTracks.map((item, idx) => {
              const isCurrent = activeTrackIndex === idx || activeMedia.videoId === item.videoId;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectPlaylistItem(item, idx)}
                  className={`flex items-center justify-between p-1.5 rounded transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-primary-container/20 border border-primary/40 shadow-xs'
                      : 'hover:bg-surface-container hover:border-outline-variant/30 border border-transparent'
                  }`}
                  title="Clique para tocar este disco na vitrola"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 font-mono text-[10px] text-outline text-right">
                      {isCurrent ? (
                        <Disc size={11} className="text-secondary animate-spin inline" />
                      ) : (
                        `#${idx + 1}`
                      )}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`font-display text-xs truncate ${
                          isCurrent ? 'text-secondary font-bold' : 'text-on-surface'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="font-headline text-[10px] text-on-surface-variant truncate">
                        {item.artist}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[9px] text-outline">
                      {Math.floor(item.durationSec / 60)}:{(item.durationSec % 60).toString().padStart(2, '0')}
                    </span>
                    <button
                      aria-label={`Tocar ${item.title} na vitrola`}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <Play size={10} className="translate-x-0.2" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé com indicação de sincronização com o disco */}
        <div className="flex items-center justify-between text-[10px] font-headline text-on-surface-variant pt-1 border-t border-outline-variant/10">
          <div className="flex items-center gap-1.5 text-secondary font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Música refletida no centro do vinil • Disco gira sincronizado</span>
          </div>
          <span className="font-mono text-[9px] text-outline">
            SEM ABAS EXTERNAS · 100% NATIVO
          </span>
        </div>
      </div>
    </div>
  );
};
