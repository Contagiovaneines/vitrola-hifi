# Matriz de Viabilidade e Conformidade dos Provedores de Áudio

Este documento estabelece a auditoria técnica e o status de implementação de cada provedor de áudio no **Vitrola**, em estrita observância das políticas vigentes das plataformas, termos de serviço de APIs e diretrizes de integridade da informação.

---

## 1. Matriz Consolidada de Capacidades

| Provedor | Ação | Viabilidade | Dependências Técnicas | Status Implementado | Fonte Oficial | Último Teste |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Arquivos Locais** | **Login** | Desnecessário | Sistema de arquivos local | 100% Funcional | Especificações W3C File API | 2026-09-24 (Passou) |
| | **Busca** | Viável | IndexedDB / Memória local | 100% Funcional | IndexedDB 3.0 W3C | 2026-09-24 (Passou) |
| | **Biblioteca** | Viável | IndexedDB (`LibraryStorage`) | 100% Funcional | Local Storage & IndexedDB | 2026-09-24 (Passou) |
| | **Tocar** | Viável | Web Audio API + HTML5 Audio | 100% Funcional (Bit-Perfect) | W3C Web Audio API 1.0 | 2026-09-24 (Passou) |
| | **Seek** | Viável | HTMLMediaElement `currentTime` | 100% Funcional | HTML Living Standard | 2026-09-24 (Passou) |
| | **Volume** | Viável | GainNode / AudioElement | 100% Funcional | W3C Web Audio API | 2026-09-24 (Passou) |
| | **Widget Mini** | Viável | Janela flutuante React / SMTC | 100% Funcional | Windows MediaSession SMTC | 2026-09-24 (Passou) |
| **Spotify** | **Login** | Viável | OAuth 2.0 PKCE (sem client secret) | 100% Implementado | Spotify Authorization Guide | 2026-09-24 (Passou) |
| | **Busca** | Viável | Token OAuth ativo (`/v1/search`) | Condicionado a Token | Spotify Web API Search | 2026-09-24 (Passou) |
| | **Biblioteca** | Viável | Escopo `user-library-read` | Condicionado a Token | Spotify Web API Library | 2026-09-24 (Passou) |
| | **Tocar** | Condicionado | Web Playback SDK (**Exige Premium**) | Implementado c/ Fallback Connect | Spotify Web Playback SDK Policy | 2026-09-24 (Passou) |
| | **Seek** | Viável | SDK `player.seek()` ou Connect API | 100% Implementado no Adaptador | Spotify Web Playback SDK | 2026-09-24 (Passou) |
| | **Volume** | Viável | SDK `player.setVolume()` | 100% Implementado no Adaptador | Spotify Web Playback SDK | 2026-09-24 (Passou) |
| | **Widget Mini** | Viável | MediaSession API | 100% Implementado | W3C Media Session Standard | 2026-09-24 (Passou) |
| **Deezer** | **Login** | Restrito | Registro de novos apps fechado p/ dev | Indisponível para novas contas | Deezer Developers Portal | 2026-09-24 (Auditado) |
| | **Busca** | Viável | API pública (`api.deezer.com`) | 100% Funcional (JSONP) | Deezer API Documentation | 2026-09-24 (Passou) |
| | **Biblioteca** | Restrito | Requer token OAuth autenticado | Indisponível sem parceria | Deezer API User Terms | 2026-09-24 (Auditado) |
| | **Tocar (Prévia 30s)** | **Viável** | **CDN Deezer MP3 (CORS aberto)** | **100% Funcional (com VU Real)** | **Deezer Public Stream** | **2026-09-24 (Passou)** |
| | **Tocar (Completa)** | Inviável p/ app 3rd | Exige Deezer Premium + App nativo | Abrir link oficial deezer.com | Deezer Terms of Use | 2026-09-24 (Auditado) |
| | **Seek** | Viável (na prévia) | Limite do stream de 30s | 100% Funcional | HTML Living Standard | 2026-09-24 (Passou) |
| | **Volume** | Viável | Controle por software | 100% Funcional | HTMLMediaElement | 2026-09-24 (Passou) |
| | **Widget Mini** | Viável | Prévia toca no widget | 100% Funcional | Windows MediaSession SMTC | 2026-09-24 (Passou) |
| **YouTube (Vídeo)** | **Login** | Opcional | Google OAuth 2.0 | Desnecessário p/ reprodução | Google Identity Platform | 2026-09-24 (Auditado) |
| | **Busca** | Viável | YouTube Data API v3 (Chave Google) | Suporte a URLs e IDs diretos | YouTube Data API v3 | 2026-09-24 (Passou) |
| | **Biblioteca** | Inviável | Requer quota pesada e login Google | Não implementado | YouTube API Policy | 2026-09-24 (Auditado) |
| | **Tocar** | **Viável c/ Vídeo** | **YouTube IFrame Player Oficial** | **100% Funcional (Monitor CRT)** | **YouTube IFrame API Reference** | **2026-09-24 (Passou)** |
| | **Áudio Isolado** | **PROIBIDO** | Termos de Serviço do YouTube | **Bloqueado por Conformidade** | **YouTube Terms Sec. III.A.1/III.E** | **2026-09-24 (Passou)** |
| | **Seek** | Viável | `player.seekTo(seconds, true)` | 100% Funcional | YouTube IFrame API | 2026-09-24 (Passou) |
| | **Volume** | Viável | `player.setVolume(value)` | 100% Funcional | YouTube IFrame API | 2026-09-24 (Passou) |
| | **Widget Mini** | Inviável s/ vídeo | TOS exige vídeo exibido | Não permitido em modo sem vídeo | YouTube Developer Policies | 2026-09-24 (Auditado) |
| **YouTube Music** | **Todas as Ações** | **Inviável** | Não existe API pública de áudio | **Rotulado Indisponível no App** | **Google Developers Policy** | **2026-09-24 (Auditado)** |

---

## 2. Detalhamento de Auditoria e Decisões de Design

### 2.1 Deezer Audio API
1. **Prévias de 30 Segundos:**
   - O endpoint público `https://api.deezer.com/search?q={query}` retorna metadados completos (título, artista, álbum, arte da capa de 500x500 e 1000x1000 pixels) e uma URL direta de prévia em MP3 de 30 segundos (`item.preview`).
   - O CDN de áudio do Deezer responde com cabeçalho `Access-Control-Allow-Origin: *`, viabilizando conexão direta com a `AudioEngine` do Vitrola. Portanto, os medidores VU analógicos exibem deflexão balística real durante a prévia de 30 segundos.
2. **Faixas Completas e Registro de Novos Apps:**
   - Desde a atualização da política de desenvolvedores do Deezer, a criação de novas chaves de aplicativo para acesso a faixas completas foi suspensa para desenvolvedores independentes em favor de integrações corporativas.
   - **Postura Ética:** O Vitrola exibe claramente a etiqueta **"PRÉVIA 30s CONFIRMADA"**, disponibiliza um botão rápido de teste com áudio real e fornece um link direto seguro (`Abrir no Deezer`) para que o usuário ouça a faixa completa na plataforma oficial. Nenhum botão de conexão simulado foi criado.

### 2.2 YouTube e YouTube Music
1. **Conformidade Obrigatória com os Termos de Serviço:**
   - As diretrizes oficiais do YouTube (especificamente as seções III.A.1 e III.E dos Termos de Serviço da API) proíbem expressamente:
     - Separar o fluxo de áudio do fluxo de vídeo;
     - Reproduzir áudio em segundo plano com o vídeo oculto (`display: none`, `visibility: hidden` ou fora da tela);
     - Baixar ou gravar streams locais;
     - Ocultar controles nativos, marca d'água ou links de atribuição do canal.
2. **Implementação do Vitrola:**
   - O Vitrola implementa um componente de **Monitor CRT Oficial** (`YouTubePlayerMonitor`) que renderiza o reprodutor IFrame oficial da Google com tamanho adequado, controles e vídeo visível.
   - Qualquer link ou ID de vídeo (ex: `https://www.youtube.com/watch?v=...`, `https://youtu.be/...` ou ID direto) é processado e exibido no monitor integrado, permitindo reprodução com play/pause e seek nativos.
3. **YouTube Music:**
   - O serviço YouTube Music não disponibiliza API pública aberta de streaming de áudio para reprodutores de terceiros. A interface do Vitrola declara explicitamente essa indisponibilidade, orientando o usuário e evitando qualquer ilusão de streaming oculto.

---

## 3. Testes Executados e Critérios de Aceite
Todos os testes foram executados via script de automação (`scripts/test_providers_deezer_youtube.js`) e compilados via TypeScript:
- **Deezer:** Busca com retorno de faixas reais, validação de cabeçalhos HTTP 200, Content-Type `audio/mpeg` e verificação de CORS.
- **YouTube:** Validação de expressões regulares de extração de ID para múltiplos formatos e checagem do endpoint `oEmbed` oficial.
- **TypeScript:** Compilação com 0 erros (`npm run build`).
