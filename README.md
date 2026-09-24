# Vitrola — Hi-Fi Turntable Desktop Console

Console de alta fidelidade para Windows com estética retro de toca-discos analógico dos anos 1970 (madeira nobre, latão usinado, iluminação âmbar de filamento e medidores VU balísticos).

---

## 🎵 Visão Geral e Recursos Principais

- **Arquitetura Local-First:** Prioridade absoluta para reprodução bit-perfect de arquivos locais (FLAC, MP3, WAV, OGG, AAC/M4A) com decodificação direta, leitura nativa de metadados ID3/Vorbis e persistência local sem depender de conexões externas.
- **Importação de Links do Spotify e YouTube:** Campo *"Adicionar link"* na estante de vinis que aceita URLs oficiais e URIs (`open.spotify.com/album/...`, `open.spotify.com/track/...`, `spotify:album:...`, `spotify:track:...` ou links de YouTube / YouTube Music). Extração segura de ID Base62 de 22 caracteres, resolução oficial de metadados e persistência na biblioteca sem armazenar arquivos de áudio protegidos.
- **Encarte & Capa Original Quadrada Íntegra:** Exibição da capa física do álbum sem cortes, distorções ou sobreposições no suporte de madeira nobre ao lado do toca-discos (`AlbumJacketStand`), com atribuição oficial e atalho *"Ouvir no Spotify"*. A capa também é suportada e renderizada com fidelidade no selo central do vinil giratório (`VinylDisc`).
- **Reprodução Honesta e Transparente:** Respeito integral às limitações das APIs oficiais. A reprodução direta de faixas do Spotify via Web Playback SDK / Connect requer conta Spotify Premium ativa; a interface informa com clareza o status e fornece botão de atalho para reprodução no aplicativo oficial do Spotify.
- **Monitor CRT Retrô para YouTube:** Player oficial embutido (IFrame Player API) com vídeo visível, cumprindo integralmente os Termos de Serviço da plataforma (sem extração de áudio ou vídeo oculto). Esclarecimento transparente sobre YouTube Data API v3 vs YouTube Music e inclusão do companion `iniciar-youtube-music.bat`.
- **Controles de Mídia do Windows (SMTC):** Integração com o *System Media Transport Controls* do Windows 10 e Windows 11 (`navigator.mediaSession`). Metadados completos (título, artista, álbum, capa em múltiplas resoluções até 512x512) e sincronização bidirecional da barra de progresso (`setPositionState`), inclusive na **tela de bloqueio (Win+L)** e no **menu flutuante de volume**. Liberação automática de sessão (`clearSession`) para prevenir cartões duplicados quando o usuário estiver usando outros reprodutores.
- **Toca-Discos Tátil com Física Real:** Disco de vinil com micro-ranhuras ópticas e rotação física (33⅓ e 45 RPM) acoplada estritamente ao estado de reprodução (`playing`); braço mecânico (*Tonearm*) articulado foto-realista com agulha fonocaptora iluminada, repouso a 0°, elevação hidráulica (Cue a 12°) e descida no sulco (21° a 32°).
- **Medidores VU Balísticos:** Monitoramento estéreo de canal esquerdo e direito (L/R) calibrado em dBFS com balística analógica autêntica calculada a partir de amostras PCM reais via `AnalyserNode`. Agulhas caem para -40 dBFS ao pausar ou quando o prato estiver sem disco.
- **Equalizador & Pré-Amplificador Valvulado:** Potenciômetros recartilhados para Graves (Low-Shelf 150 Hz), Agudos (High-Shelf 3000 Hz), Saturação Harmônica Valvulada (curva não-linear de triodo 12AX7) e Volume Master.
- **Mini Player Widget Flutuante:** Janela compacta e gadget de área de trabalho com mini disco giratório, indicador da fonte de áudio ativa, atalho *Always on Top* (Sempre no Topo), arraste livre na tela e mini medidor VU dinâmico sincronizado com a janela principal (sem duplicidade de áudio).
- **Modo Tela Cheia (Audiophile Theatre):** Imersão pura no toca-discos em tela inteira, exibindo apenas o prato, o disco girando e a música no centro com controles de transporte.

---

## 🚀 Requisitos e Inicialização

### Pré-requisitos do Sistema:
- **Sistema Operacional:** Windows 10 ou Windows 11 (64-bit)
- **Node.js:** Versão LTS (v20+ ou v24+ recomendada)
- **Microsoft Edge WebView2 Runtime:** Instalado por padrão no Windows 10/11
- **Navegadores Suportados:** Microsoft Edge, Google Chrome ou navegadores baseados em Chromium/WebKit

### Inicialização Rápida no Windows (Um Duplo Clique):
Basta dar um duplo clique no arquivo executável:
```cmd
iniciar-vitrola.bat
```
O script verifica o ambiente, instala dependências se necessário, compila a versão de produção e abre o console da Vitrola no seu navegador/webview automaticamente.

### Inicialização via Linha de Comando (PowerShell / Terminal):

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:5173`.

3. **Compilar para produção:**
   ```bash
   npm run build
   ```
   Os artefatos otimizados serão gerados no diretório `dist/`.

4. **Executar a suíte de testes de homologação:**
   ```bash
   node scripts/run_all_tests.js
   ```

---

## 📂 Como Adicionar Músicas e Álbuns

### 1. Adicionar via Link do Spotify ou YouTube:
1. Acesse a aba **Biblioteca** ou pressione `2`.
2. No campo **"Adicionar link"**, cole a URL ou URI desejada:
   - Exemplo de álbum Spotify: `https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3`
   - Exemplo de faixa Spotify: `https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT` ou `spotify:track:4cOdK2wGLETKBW3PvgPWqT`
   - Exemplo de playlist YouTube Music: `https://music.youtube.com/playlist?list=LRSRQx02e7rqScsFPoLEH4UzxOGSVnpDM_08Q`
3. Clique em **"Adicionar à Biblioteca"**.
4. O álbum ou faixa é catalogado com metadados oficiais e capa quadrada íntegra.

### 2. Importar Arquivos Locais:
1. Na aba **Biblioteca**, clique em **"+ Importar Músicas Locais"** ou arraste seus arquivos de áudio para a janela.
2. A Vitrola lê instantaneamente as tags (título, artista, álbum, arte da capa e formato PCM/FLAC) e persiste os registros no `LibraryStorage`.
3. Ao tocar uma faixa local, os metadados são transmitidos em tempo real para os Controles de Mídia do Windows (SMTC).

---

## 🌐 Configuração e Políticas dos Provedores de Áudio

O Vitrola adota uma política de **transparência e conformidade estrita** com as plataformas de streaming:

| Provedor | Modo Suportado | Limitações e Conformidade |
| :--- | :--- | :--- |
| **Arquivos Locais** | **100% Funcional** (FLAC, MP3, WAV, OGG, AAC) | Sem restrições. Reprodução bit-perfect direta com medidores VU analógicos reais e sincronização completa com Windows SMTC (Win+L). |
| **Spotify** | **Entrada de Links + OAuth 2.0 PKCE / oEmbed** | Indexa faixas e álbuns completos com capas quadradas originais. **Exige Spotify Premium ativo** para streaming direto no SDK; modal transparente orienta e disponibiliza botão de abertura oficial no Spotify. Consulte `docs/integracoes-midias.md`. |
| **Deezer** | **Busca Pública + Prévia Oficial de 30s** | Prévias de 30s funcionam diretamente com VU balístico. Faixas completas exigem plano pago e são abertas na plataforma oficial deezer.com. |
| **YouTube** | **IFrame Player Oficial com Vídeo Visível** | Em conformidade com os Termos de Serviço da API do YouTube (Seção III.A.1/III.E), **não há extração de áudio isolado nem reprodução em segundo plano com vídeo oculto**. O vídeo permanece visível no monitor CRT integrado. |
| **YouTube Music** | **Companion Dedicado (`.bat`)** | Acesso às playlists e músicas da sua conta Google via janela dedicada de alta fidelidade executando `iniciar-youtube-music.bat`. |

---

## 🎛️ Atalhos de Teclado Globais

| Tecla | Ação |
| :--- | :--- |
| **Barra de Espaço** | Alternar Reprodução / Pausa (Play / Pause) |
| **Seta Direita (→)** | Avançar 5 segundos na faixa (*Seek Ahead*) |
| **Seta Esquerda (←)** | Retroceder 5 segundos na faixa (*Seek Back*) |
| **Seta Cima (↑)** | Aumentar Volume em 5% |
| **Seta Baixo (↓)** | Diminuir Volume em 5% |
| **M** | Alternar Mudo / Desmudo rápido |
| **F ou F11** | Alternar Modo Tela Cheia (Audiophile Turntable) |
| **1** | Ir para aba **Início** (Toca-Discos Principal) |
| **2** | Ir para aba **Biblioteca** |
| **3** | Ir para aba **Playlists** |
| **4** | Ir para aba **Fontes de Áudio** |
| **5** | Ir para aba **Aparência / Ateliê** |
| **ESC** | Sair do modo **Tela Cheia** |

---

## 📖 Documentação Técnica Complementar

- `docs/integracoes-midias.md` — Guia aprofundado sobre extração de links do Spotify, diretrizes do YouTube e integração técnica do Windows SMTC.
- `docs/06-spotify-config.md` — Registro de aplicativo no Spotify Developer Dashboard e fluxo OAuth 2.0 PKCE.
- `docs/07-matriz-provedores.md` — Matriz completa de capacidades dos adaptadores de mídia.
- `docs/10-testes.md` — Registro e homologação dos testes automatizados.
