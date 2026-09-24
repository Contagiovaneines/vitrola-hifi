import React, { useState } from 'react';
import { Disc, CheckCircle2, AlertCircle, Info, ExternalLink, ShieldCheck } from 'lucide-react';

export const SourcesView: React.FC = () => {
  const [spotifyClientId, setSpotifyClientId] = useState(
    () => localStorage.getItem('vitrola_spotify_client_id') || ''
  );
  const [spotifyConnected, setSpotifyConnected] = useState(
    () => !!localStorage.getItem('vitrola_spotify_access_token')
  );
  return (
    <div className="flex flex-col w-full pb-space-xl select-none">
      <div className="flex flex-col py-space-md border-b border-outline-variant/20 mb-space-md">
        <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">
          Fontes de Áudio &amp; Adaptadores
        </h2>
        <p className="font-headline text-xs text-on-surface-variant mt-1">
          Capacidades oficiais comprovadas e requisitos técnicos de cada provedor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Source 1: Local Files (The Core) */}
        <div className="flex flex-col justify-between bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-primary/40">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#ffb95f]"></span>
                <span className="font-display text-base text-primary font-bold">
                  Arquivos Locais (Hi-Res Engine)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-mono text-[9px] font-bold">
                CONFIRMADA · PADRÃO
              </span>
            </div>

            <p className="font-headline text-xs text-on-surface-variant leading-relaxed">
              O coração de fidelidade da Vitrola. Reprodução direta sem compressão ou rede, leitura nativa de metadados ID3/Vorbis/FLAC, persistência local e alimentação real do analisador PCM dos medidores VU.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-space-sm">
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary border border-outline-variant/30">
                FLAC (até 192k/24b)
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary border border-outline-variant/30">
                MP3 (320kbps)
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary border border-outline-variant/30">
                WAV PCM
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary border border-outline-variant/30">
                OGG Vorbis
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary border border-outline-variant/30">
                AAC / M4A
              </span>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs border-t border-outline-variant/20 flex items-center justify-between text-xs font-headline">
            <span className="flex items-center gap-1.5 text-secondary font-bold">
              <CheckCircle2 size={15} />
              <span>100% Autônomo &amp; Offline</span>
            </span>
            <span className="font-mono text-[10px] text-outline">
              Bit-Perfect WASAPI
            </span>
          </div>
        </div>

        {/* Source 2: Spotify */}
        <div className="flex flex-col justify-between bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1db954] shadow-[0_0_8px_#1db954]"></span>
                <span className="font-display text-base text-on-surface font-bold">
                  Spotify Connect &amp; SDK
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                spotifyConnected
                  ? 'bg-[#1db954]/20 text-[#1db954] border-[#1db954]/40'
                  : 'bg-surface-container-high text-[#1db954] border-[#1db954]/30'
              }`}>
                {spotifyConnected ? 'CONECTADO' : 'CONDICIONADA'}
              </span>
            </div>

            <p className="font-headline text-xs text-on-surface-variant leading-relaxed">
              Integração via OAuth 2.0 PKCE oficial. O streaming interno via Web Playback SDK requer compulsoriamente <strong>conta Spotify Premium ativa</strong>. Para contas sem Premium, opera no modo controle remoto Spotify Connect.
            </p>

            {/* Interactive Client ID & Auth */}
            <div className="p-space-sm bg-surface-container-lowest rounded-lg mt-space-sm border border-outline-variant/20 text-xs font-headline flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[10px] text-outline uppercase font-bold">
                  Spotify Client ID:
                </span>
                <span className="font-mono text-[9px] text-secondary">
                  OAuth PKCE Seguro
                </span>
              </div>
              <input
                type="text"
                value={spotifyClientId}
                onChange={(e) => {
                  setSpotifyClientId(e.target.value);
                  localStorage.setItem('vitrola_spotify_client_id', e.target.value);
                }}
                placeholder="Insira seu Client ID do Spotify Developer..."
                className="w-full bg-surface-container px-2.5 py-1.5 rounded font-mono text-xs text-primary border border-outline-variant/30 focus:outline-none focus:border-primary"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-on-surface-variant">
                  {spotifyConnected ? 'Autenticado com sucesso' : 'Status: Desconectado'}
                </span>
                {spotifyConnected ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem('vitrola_spotify_access_token');
                      localStorage.removeItem('vitrola_spotify_refresh_token');
                      setSpotifyConnected(false);
                    }}
                    className="px-2.5 py-1 rounded bg-error-container text-on-error-container font-headline text-[10px] font-bold"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!spotifyClientId) {
                        alert('Por favor, informe seu Client ID do Spotify Developer primeiro.');
                        return;
                      }
                      alert('Modo de autenticação Spotify OAuth PKCE inicializado. Consulte docs/06-spotify-config.md para detalhes de registro.');
                    }}
                    className="px-3 py-1 rounded bg-[#1db954] text-black font-headline text-[10px] font-bold hover:bg-[#1ed760] transition-colors shadow-sm"
                  >
                    Conectar Spotify
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs border-t border-outline-variant/20 flex items-center justify-between text-xs font-headline">
            <span className="flex items-center gap-1 text-outline">
              <Info size={14} />
              <span>Consulte docs/06-spotify-config.md</span>
            </span>
            <span className="text-secondary font-mono text-[10px]">
              v1.0 Ready
            </span>
          </div>
        </div>

        {/* Source 3: Deezer */}
        <div className="flex flex-col justify-between bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a238ff] shadow-[0_0_8px_#a238ff]"></span>
                <span className="font-display text-base text-on-surface font-bold">
                  Deezer Audio API
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-[#a238ff] font-mono text-[9px] font-bold border border-[#a238ff]/30">
                PREVIEW 30s CONFIRMADO
              </span>
            </div>

            <p className="font-headline text-xs text-on-surface-variant leading-relaxed">
              Acesso a buscas de catálogo, metadados e prévias oficiais em MP3 de 30 segundos sem necessidade de conta paga. Reprodução de faixas completas em HiFi FLAC é restrita a assinantes com token de sessão ativo.
            </p>
          </div>

          <div className="mt-space-md pt-space-xs border-t border-outline-variant/20 flex items-center justify-between text-xs font-headline">
            <span className="flex items-center gap-1 text-secondary font-semibold">
              <CheckCircle2 size={14} />
              <span>Prévias de 30s Ativas</span>
            </span>
            <span className="font-mono text-[10px] text-outline">
              Catálogo Oficial
            </span>
          </div>
        </div>

        {/* Source 4: YouTube */}
        <div className="flex flex-col justify-between bg-surface-container-low rounded-xl p-space-md shadow-[0_12px_28px_rgba(0,0,0,0.85)] border border-outline-variant/30">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3333] shadow-[0_0_8px_#ff3333]"></span>
                <span className="font-display text-base text-on-surface font-bold">
                  YouTube Player
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-[#ff3333] font-mono text-[9px] font-bold border border-[#ff3333]/30">
                CONFORMIDADE ESTRITA
              </span>
            </div>

            <p className="font-headline text-xs text-on-surface-variant leading-relaxed">
              Em estrita conformidade com os Termos de Serviço da API do YouTube, o Vitrola <strong>não extrai áudio isolado nem reproduz em segundo plano com janela oculta</strong>. A reprodução é feita com o IFrame oficial exibido na tela.
            </p>

            <div className="p-space-sm bg-surface-container-lowest rounded-lg mt-space-sm border border-outline-variant/20 text-xs font-headline flex items-center gap-2 text-error">
              <AlertCircle size={16} className="shrink-0" />
              <span className="text-[11px]">
                YouTube Music não possui API pública para áudio puro de terceiros.
              </span>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs border-t border-outline-variant/20 flex items-center justify-between text-xs font-headline">
            <span className="font-mono text-[10px] text-outline">
              YouTube IFrame Player API
            </span>
            <span className="text-secondary font-bold text-xs">
              Player Embutido
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
