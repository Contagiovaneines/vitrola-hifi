import React, { useState, useEffect, useRef } from 'react';
import { Tv, ShieldCheck, ExternalLink, AlertCircle, ListMusic, Disc, Globe } from 'lucide-react';
import { YouTubePlaybackProvider } from '../../services/providers/youtube/YouTubePlaybackProvider';
import { Track } from '../../types';

interface YouTubePlayerMonitorProps {
  currentVideoId?: string;
  onVideoChange?: (videoId: string) => void;
  onPlayTrack?: (track: Track) => void;
  isCompact?: boolean;
}

export const YouTubePlayerMonitor: React.FC<YouTubePlayerMonitorProps> = ({
  currentVideoId = '',
  onVideoChange,
  onPlayTrack,
  isCompact = false,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'playlist'; id: string; videoId?: string }>({
    type: 'video',
    id: currentVideoId,
  });

  const lastTrackTitleRef = useRef<string>('');

  useEffect(() => {
    if (currentVideoId && currentVideoId !== activeMedia.id) {
      const isPl = currentVideoId.startsWith('PL') || currentVideoId.startsWith('RD') || currentVideoId.startsWith('LR');
      setActiveMedia({
        type: isPl ? 'playlist' : 'video',
        id: currentVideoId,
      });
    }
  }, [currentVideoId]);

  // Listener para capturar o nome REAL da música tocando no YouTube IFrame Player
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        let payload = event.data;
        if (typeof payload === 'string') {
          payload = JSON.parse(payload);
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

            // Remove sufixos como (Official Video), (Audio), [Official Music Video], etc.
            songTitle = songTitle
              .replace(/\s*[\(\[](?:Official\s*(?:Music\s*)?Video|Audio|Clip Oficial|Clipe Oficial|HD|4K|Lyrics|Visualizer)[\)\]]/gi, '')
              .trim();

            // Se o título for no padrão "Artista - Nome da Música", separa com elegância
            if (songTitle.includes(' - ')) {
              const parts = songTitle.split(' - ');
              songArtist = parts[0].trim();
              songTitle = parts.slice(1).join(' - ').trim();
            }

            // Evita disparos redundantes para o mesmo título
            if (lastTrackTitleRef.current === songTitle) return;
            lastTrackTitleRef.current = songTitle;

            const coverUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : undefined;

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
  }, [onPlayTrack]);

  const handleLoad = async () => {
    const rawInput = inputUrl.trim();
    if (!rawInput) return;

    // Detecta se a URL contém um vídeo específico mesmo dentro de uma playlist (watch?v=...&list=...)
    const vMatch = rawInput.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const extracted = YouTubePlaybackProvider.extractMedia(rawInput);
    if (!extracted) {
      alert('Por favor, informe uma URL ou ID válido de vídeo ou playlist do YouTube/YouTube Music.');
      return;
    }

    setIsLoading(true);
    setActiveMedia(extracted);
    if (onVideoChange) onVideoChange(extracted.id);

    let title = 'Música em Reprodução';
    let artist = 'YouTube Music';
    let coverUrl: string | undefined = undefined;

    // Se temos o ID do vídeo (direto ou na playlist), busca metadados oficiais via oEmbed
    const targetVideoId = (extracted.type === 'video' ? extracted.id : vMatch ? vMatch[1] : null);
    if (targetVideoId) {
      coverUrl = `https://img.youtube.com/vi/${targetVideoId}/hqdefault.jpg`;
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${targetVideoId}&format=json`);
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

    lastTrackTitleRef.current = title;

    const track: Track = {
      id: `yt-${targetVideoId || extracted.id}`,
      source: 'youtube',
      title: title,
      artist: artist,
      album: extracted.type === 'playlist' ? 'Seleção YouTube Music' : 'Transmissão Analógica Oficial',
      durationSec: 240,
      uri: targetVideoId ? `youtube-${targetVideoId}` : extracted.id,
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
        catalogNumber: targetVideoId ? `YTM-${targetVideoId.slice(0, 8).toUpperCase()}` : `YTM-PL`,
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

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedSrc = activeMedia.type === 'playlist'
    ? `https://www.youtube.com/embed/videoseries?list=${activeMedia.id}&enablejsapi=1&autoplay=1&origin=${origin}`
    : `https://www.youtube.com/embed/${activeMedia.id}?enablejsapi=1&autoplay=1&origin=${origin}`;

  const externalUrl = !activeMedia.id
    ? 'https://music.youtube.com'
    : activeMedia.type === 'playlist'
      ? `https://music.youtube.com/playlist?list=${activeMedia.id}`
      : `https://www.youtube.com/watch?v=${activeMedia.id}`;

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
              <span>PLAYLIST ATIVA</span>
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
        {activeMedia.id ? (
          <iframe
            id="vitrola-youtube-player-iframe"
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

      {/* URL Input and Presets */}
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

        {/* Banner do Navegador Integrado com Login Google */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-container-lowest border border-[#ff3333]/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse"></span>
            <div className="flex flex-col">
              <span className="font-headline text-xs text-on-surface font-bold">
                Navegador YouTube Music (Login Google)
              </span>
              <span className="text-[10px] text-on-surface-variant">
                Acesse sua conta Google para ver suas playlists, músicas curtidas e biblioteca
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              window.open(
                'https://music.youtube.com',
                'YouTubeMusicBrowser',
                'width=1120,height=750,menubar=no,toolbar=no,location=yes,status=no'
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff3333] text-white font-headline text-[11px] font-bold hover:bg-[#e62e2e] transition-all shadow-md shrink-0 cursor-pointer"
            title="Abrir o YouTube Music como navegador para fazer login na sua conta Google"
          >
            <Globe size={13} />
            <span>Abrir Navegador YouTube Music</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] font-headline text-on-surface-variant pt-1 border-t border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-secondary font-bold">
              <span>● Música atual refletida no centro do vinil</span>
            </span>
            <span className="text-outline hidden sm:inline">
              (Sincronização dinâmica de título)
            </span>
          </div>
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#ff3333] hover:underline"
            title="Abrir no YouTube Music em nova aba"
          >
            <span>Ver no YouTube Music</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
