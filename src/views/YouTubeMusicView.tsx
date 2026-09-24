import React, { useState, useEffect } from 'react';
import { Tv, Globe, ShieldCheck, ExternalLink, Disc, Sparkles, AlertCircle } from 'lucide-react';
import { YouTubePlayerMonitor } from '../components/player/YouTubePlayerMonitor';
import { Track } from '../types';

interface YouTubeMusicViewProps {
  onPlayTrack: (track: Track) => void;
  currentTrack: Track | null;
}

export const YouTubeMusicView: React.FC<YouTubeMusicViewProps> = ({
  onPlayTrack,
  currentTrack,
}) => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron')) {
      setIsElectron(true);
    }
  }, []);

  const handleOpenBrowserWindow = () => {
    window.open(
      'https://music.youtube.com',
      'YouTubeMusicBrowserWindow',
      'width=1200,height=800,menubar=no,toolbar=no,location=yes,status=no'
    );
  };

  return (
    <div className="flex flex-col w-full pb-space-xl select-none">
      {/* Top Header */}
      <div className="flex flex-col py-space-md border-b border-outline-variant/20 mb-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff3333] shadow-[0_0_8px_#ff3333]"></span>
              <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">
                Navegador YouTube Music
              </h2>
            </div>
            <p className="font-headline text-xs text-on-surface-variant mt-1">
              Acesse sua conta Google, músicas curtidas e playlists para tocar diretamente no prato da Vitrola
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenBrowserWindow}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ff3333] text-white font-headline text-xs font-bold hover:bg-[#e62e2e] transition-all shadow-md cursor-pointer"
            >
              <Globe size={15} />
              <span>Abrir Navegador YouTube Music (Login Google)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left: Monitor & Player Oficial (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          {isElectron ? (
            /* Modo Electron Desktop com WebView Embutida */
            <div className="w-full h-[650px] rounded-xl overflow-hidden bg-black border-2 border-outline-variant/40 shadow-2xl relative">
              {/* @ts-ignore */}
              <webview
                src="https://music.youtube.com"
                // @ts-ignore
                partition="persist:vitrola_session"
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* Modo Web com Monitor CRT e Player Oficial */
            <YouTubePlayerMonitor
              currentVideoId={
                currentTrack?.source === 'youtube'
                  ? currentTrack.uri.replace('youtube-', '')
                  : ''
              }
              onPlayTrack={onPlayTrack}
              isCompact={false}
            />
          )}
        </div>

        {/* Right: Informações de Integração & Disco Ativo (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Card do Disco em Reprodução no Console */}
          <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
              <div className="flex items-center gap-2">
                <Disc size={16} className="text-secondary" />
                <span className="font-headline text-[10px] text-primary tracking-widest uppercase font-bold">
                  Disco na Vitrola
                </span>
              </div>
              <span className="font-mono text-[9px] text-[#ff3333] font-bold">
                SINCRONIZADO
              </span>
            </div>

            {currentTrack ? (
              <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                {currentTrack.coverUri ? (
                  <img
                    src={currentTrack.coverUri}
                    alt={currentTrack.title}
                    className="w-16 h-16 rounded-lg object-cover border border-[#ff3333]/30 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <Disc size={28} className="text-[#ff3333]" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-sm text-on-surface font-bold truncate">
                    {currentTrack.title}
                  </span>
                  <span className="font-headline text-xs text-on-surface-variant truncate">
                    {currentTrack.artist}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[#ff3333] font-mono text-[9px] font-bold border border-[#ff3333]/30 uppercase">
                      {currentTrack.source}
                    </span>
                    <span className="font-mono text-[9px] text-outline">
                      Refletido no selo do vinil
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 font-headline text-xs text-outline">
                Nenhum disco colocado no prato da Vitrola.
              </div>
            )}
          </div>

          {/* Guia Rápido: Como Usar com sua Conta Google */}
          <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30 gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Sparkles size={16} className="text-secondary" />
              <h3 className="font-display text-xs text-primary font-bold uppercase tracking-wider">
                Como Ouvir Suas Músicas Pessoais
              </h3>
            </div>

            <ol className="flex flex-col gap-2.5 font-headline text-xs text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-[10px] text-primary font-bold shrink-0">
                  1
                </span>
                <span>
                  Clique no botão <strong>"Abrir Navegador YouTube Music"</strong> acima para acessar a plataforma com sua conta Google.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-[10px] text-primary font-bold shrink-0">
                  2
                </span>
                <span>
                  Faça login normalmente com sua conta Google para carregar suas <em>Músicas Curtidas</em>, <em>Álbuns Salvos</em> e <em>Playlists Pessoais</em>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-[10px] text-primary font-bold shrink-0">
                  3
                </span>
                <span>
                  Dê play em qualquer música ou copie o link da faixa/playlist para o campo do monitor da Vitrola para ver o disco girar com o nome da música no centro!
                </span>
              </li>
            </ol>

            <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/20 text-[11px] text-outline flex items-center gap-2">
              <ShieldCheck size={16} className="text-secondary shrink-0" />
              <span>
                Para rodar em modo Desktop Nativo sem janelas auxiliares, execute <code className="text-secondary font-mono text-[10px]">iniciar-vitrola-desktop.bat</code>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
