import React, { useState } from 'react';
import { Tv, ShieldCheck, ExternalLink, Play, AlertCircle, ListMusic } from 'lucide-react';
import { YouTubePlaybackProvider } from '../../services/providers/youtube/YouTubePlaybackProvider';

interface YouTubePlayerMonitorProps {
  currentVideoId?: string;
  onVideoChange?: (videoId: string) => void;
  isCompact?: boolean;
}

export const YouTubePlayerMonitor: React.FC<YouTubePlayerMonitorProps> = ({
  currentVideoId = 'jfKfPfyJRdk', // Lofi hip hop / vinyl stream id de exemplo
  onVideoChange,
  isCompact = false,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'playlist'; id: string }>({
    type: 'video',
    id: currentVideoId,
  });

  const handleLoad = () => {
    const extracted = YouTubePlaybackProvider.extractMedia(inputUrl.trim());
    if (extracted) {
      setActiveMedia(extracted);
      if (onVideoChange) onVideoChange(extracted.id);
      setInputUrl('');
    } else {
      alert('Por favor, informe uma URL ou ID válido de vídeo ou playlist do YouTube/YouTube Music.');
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedSrc = activeMedia.type === 'playlist'
    ? `https://www.youtube.com/embed/videoseries?list=${activeMedia.id}&enablejsapi=1&origin=${origin}`
    : `https://www.youtube.com/embed/${activeMedia.id}?enablejsapi=1&origin=${origin}`;

  const externalUrl = activeMedia.type === 'playlist'
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
            <span>TERMOS CUMPRIDOS</span>
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
          </div>
        )}
      </div>

      {/* URL Input and Presets */}
      {!isCompact && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
              placeholder="Cole link de vídeo ou playlist (YouTube / YouTube Music)..."
              className="flex-1 bg-surface-container px-2.5 py-1.5 rounded font-mono text-xs text-primary border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline/50"
            />
            <button
              onClick={handleLoad}
              className="px-3 py-1.5 rounded bg-[#ff3333] text-white font-headline text-xs font-bold hover:bg-[#ff4d4d] transition-colors flex items-center gap-1"
            >
              <Play size={12} />
              <span>Carregar</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-headline text-on-surface-variant pt-1 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-secondary">
                <span>● Vídeo 100% visível na tela</span>
              </span>
              <span className="text-outline hidden sm:inline">
                (Suporte a vídeos e playlists)
              </span>
            </div>
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#ff3333] hover:underline"
              title="Abrir no YouTube oficial em nova aba"
            >
              <span>Abrir no YouTube</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
