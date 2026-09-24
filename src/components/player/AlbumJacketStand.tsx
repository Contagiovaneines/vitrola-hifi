import React from 'react';
import { Track } from '../../types';
import { ExternalLink, Disc, Music } from 'lucide-react';

interface AlbumJacketStandProps {
  currentTrack: Track | null;
}

export const AlbumJacketStand: React.FC<AlbumJacketStandProps> = ({ currentTrack }) => {
  if (!currentTrack || !currentTrack.coverUri) {
    return null;
  }

  const isSpotify = currentTrack.source === 'spotify';
  const isYouTube = currentTrack.source === 'youtube';

  const spotifyUrl = isSpotify
    ? currentTrack.uri.startsWith('http')
      ? currentTrack.uri
      : `https://open.spotify.com/track/${currentTrack.uri.replace('spotify:track:', '')}`
    : null;

  return (
    <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30 select-none flex flex-col gap-3">
      {/* Header do Suporte de Capa */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Disc size={15} className="text-secondary" />
          <span className="font-display text-xs text-primary font-bold tracking-wide uppercase">
            Encarte &amp; Capa Original
          </span>
        </div>
        {isSpotify && (
          <span className="px-2 py-0.5 rounded bg-[#1db954]/15 text-[#1db954] border border-[#1db954]/30 font-mono text-[9px] font-bold">
            SPOTIFY OFICIAL
          </span>
        )}
        {isYouTube && (
          <span className="px-2 py-0.5 rounded bg-[#ff3333]/15 text-[#ff3333] border border-[#ff3333]/30 font-mono text-[9px] font-bold">
            YOUTUBE OFICIAL
          </span>
        )}
      </div>

      {/* Capa Quadrada Inteira — Sem Recorte, Sem Deformação e Sem Sobreposição */}
      <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-lg overflow-hidden bg-black/60 shadow-[0_16px_36px_rgba(0,0,0,0.95)] border-2 border-outline-variant/30 p-1 flex items-center justify-center">
        <img
          src={currentTrack.coverUri}
          alt={`Capa do álbum ${currentTrack.album}`}
          className="w-full h-full object-contain aspect-square rounded shadow-inner"
        />
      </div>

      {/* Metadados e Atribuição Legal da Imagem */}
      <div className="flex flex-col gap-1 text-center pt-1 border-t border-outline-variant/10">
        <h4 className="font-display text-xs text-on-surface font-bold truncate">
          {currentTrack.album || currentTrack.title}
        </h4>
        <p className="font-headline text-[10px] text-on-surface-variant truncate">
          {currentTrack.artist}
        </p>

        <div className="flex items-center justify-between text-[10px] font-headline text-outline pt-2">
          <span>
            {isSpotify
              ? 'Arte original • Spotify Web API'
              : isYouTube
              ? 'Miniatura oficial • YouTube API'
              : 'Arte incorporada localmente'}
          </span>

          {isSpotify && spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#1db954] hover:underline font-bold"
              title="Abrir este conteúdo no Spotify oficial"
            >
              <span>Ouvir no Spotify</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
