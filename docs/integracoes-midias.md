# Guia de Integração de Mídias, Fontes Externas e Windows SMTC — Vitrola Hi-Fi Console

Este documento descreve detalhadamente a arquitetura técnica, as políticas de conformidade legal, o tratamento de erros e os procedimentos de teste para as integrações de **Spotify**, **YouTube / YouTube Music** e **Windows System Media Transport Controls (SMTC)** no console desktop Vitrola.

---

## 1. Links do Spotify (Álbuns e Faixas)

### 1.1 Formatos Suportados e Expressões Regulares
A Vitrola aceita URLs e URIs canônicas do Spotify tanto no campo de link da estante de vinis (`LibraryView`) quanto na seleção de fontes:
* **URLs de Faixa:** `https://open.spotify.com/track/{id}` e URLs regionalizadas `https://open.spotify.com/intl-pt/track/{id}`
* **URIs de Faixa:** `spotify:track:{id}`
* **URLs de Álbum:** `https://open.spotify.com/album/{id}` e `https://open.spotify.com/intl-pt/album/{id}`
* **URIs de Álbum:** `spotify:album:{id}`

A validação sintática e extração dos identificadores é realizada por regex estrita no serviço `SpotifyLinkService.ts`:
```ts
private static readonly TRACK_REGEX =
  /(?:spotify:track:|open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/)([a-zA-Z0-9]{22})/i;

private static readonly ALBUM_REGEX =
  /(?:spotify:album:|open\.spotify\.com\/(?:intl-[a-z]{2}\/)?album\/)([a-zA-Z0-9]{22})/i;
```
Qualquer entrada que não coincida com esses padrões ou possua IDs truncados/inválidos é rejeitada imediatamente com mensagem clara ao usuário.

### 1.2 Resolução de Metadados (Web API e Fallback oEmbed Oficial)
O processamento de metadados opera em duas camadas complementares:
1. **Spotify Web API Oficial (Autenticada):**
   * Caso o usuário tenha conectado sua conta via OAuth PKCE nas configurações de Fontes, a Vitrola consulta diretamente `GET https://api.spotify.com/v1/tracks/{id}` ou `GET https://api.spotify.com/v1/albums/{id}`.
   * Obtém a lista completa de faixas, numeração original, artistas, duração em milissegundos e capa em resolução máxima (640x640).
2. **Spotify oEmbed API Oficial (Fallback Público):**
   * Caso não haja token ou o usuário não esteja logado, a Vitrola consulta a API pública oficial `https://open.spotify.com/oembed?url={originalUrl}`.
   * Não requer autenticação, possui CORS habilitado e retorna título, autor e URL da capa original em formato quadrado.

### 1.3 Apresentação na Biblioteca e Persistência Ética
* **Álbuns:** Ao importar um álbum, todas as suas faixas são indexadas e disponibilizadas na estante, permitindo tocar qualquer faixa individual ou o álbum sequencialmente.
* **Faixas:** Ao importar uma faixa, ela é adicionada à estante com o selo e arte correspondentes.
* **Persistência Segura:** Apenas metadados, identificadores e referências de capa são persistidos no `LibraryStorage` (`localStorage`). A Vitrola **nunca baixa, armazena nem intercepta áudios do Spotify**, operando em conformidade com as diretrizes para desenvolvedores do Spotify.

### 1.4 Exibição da Capa Quadrada Íntegra
* **No Console / Stand de Encarte (`AlbumJacketStand.tsx`):** Exibe a capa física do vinil com proporção `aspect-square` e ajuste `object-contain`, garantindo que nenhuma borda seja cortada ou obscurecida por controles. Inclui atribuição oficial e atalho *"Ouvir no Spotify"*.
* **No Selo Central do Vinil (`VinylDisc.tsx`):** A capa quadrada é embutida no rótulo central do disco giratório, com o pino de fuso metálico passando pelo centro, preservando a identidade visual vintage do console.

### 1.5 Limitações Reais da API e Reprodução Transparente
A reprodução direta de faixas do Spotify via **Spotify Web Playback SDK** ou **Spotify Connect** exige compulsoriamente:
1. Uma **conta Spotify Premium ativa** (exigência estrita da Spotify Developer Policy).
2. O aplicativo oficial do Spotify aberto no computador/celular ou uma sessão ativa do Web Playback SDK.

Quando o usuário clica em reproduzir uma faixa do Spotify sem essas condições, a Vitrola exibe um modal explicativo honesto:
* Informa com clareza o requisito de conta Spotify Premium.
* Fornece link direto para abrir e ouvir a faixa no aplicativo oficial ou Web Player do Spotify.
* Permite manter o disco carregado no prato da Vitrola para inspeção visual e apreciação da arte.

---

## 2. YouTube e YouTube Music

### 2.1 YouTube Data API v3 vs Restrições do YouTube Music
* **YouTube Data API v3:** O login OAuth oficial do Google permite ler playlists públicas e dados de canais da conta (`youtube.readonly`).
* **YouTube Music API:** A Google **não disponibiliza** um SDK público para desenvolvedores de terceiros extraírem ou reproduzirem fluxos de áudio avulsos do YouTube Music fora do ecossistema oficial.
* **Restrições de Segurança do Google (IFrame & Login):** Devido aos cabeçalhos `X-Frame-Options: SAMEORIGIN` e às políticas de segurança contra clickjacking do Google, formulários de autenticação de contas Google não podem ser renderizados dentro de `<iframe>` ou WebViews incorporadas.

### 2.2 Conformidade com os Termos de Serviço da API do YouTube
Em cumprimento rigoroso aos Termos de Serviço da API do YouTube (Seção III.A.1 e III.E), a Vitrola:
* **Não extrai áudio isolado:** Não realiza downloads, conversões para MP3 ou extração de stream.
* **Não reproduz em segundo plano com vídeo oculto:** O player oficial embutido do YouTube permanece visível no monitor CRT retrô do console.
* **Utiliza a IFrame Player API oficial:** Com parâmetros legais (`enablejsapi=1`, `origin`).

### 2.3 Métodos de Utilização Disponíveis
1. **Playlists e Músicas na Vitrola:** O usuário define uma playlist no YouTube Music como *"Não listada"* ou *"Pública"*, copia o link (`music.youtube.com/playlist?list=...` ou `youtube.com/watch?v=...`) e adiciona na Vitrola. O disco é posicionado no prato, o vídeo é exibido no monitor CRT e os controles do console comandam o player oficial.
2. **Desktop App Companion:** O script `iniciar-youtube-music.bat` na raiz do projeto abre o YouTube Music em janela de aplicativo nativa dedicada (`--app=https://music.youtube.com`) utilizando o Microsoft Edge ou Google Chrome, preservando o login Google com alta fidelidade ativa.

---

## 3. Windows Media Controls (SMTC)

### 3.1 Arquitetura da Integração
A Vitrola utiliza a API padrão moderna `navigator.mediaSession`, suportada nativamente pelo Microsoft Edge WebView2 e navegadores baseados em Chromium no Windows 10 e Windows 11. O sistema operacional mapeia essa interface diretamente para o **System Media Transport Controls (SMTC)** do Windows.

### 3.2 Metadados e Resoluções de Capa
Ao reproduzir um arquivo de áudio local, o `MediaSessionService.ts` publica:
* **Título da Faixa:** Extraído das tags ID3 / Vorbis do arquivo.
* **Nome do Artista e Álbum:** Formatado com precisão.
* **Arte da Capa em Múltiplas Resoluções:** Registrada em tamanhos 96x96, 128x128, 192x192, 256x256, 384x384 e 512x512 para garantir nitidez máxima no flyout de volume e na tela de bloqueio.

### 3.3 Sincronização Bidirecional e Posição da Barra
* **Barra de Reprodução do Windows (`setPositionState`):** Sincronizada em tempo real conforme a música toca e quando o usuário move a agulha analógica no disco ou na barra de scrub.
* **Comandos Multimídia:**
  * `play` e `pause`: Alterna a reprodução e abaixa/levanta o braço mecânico da Vitrola.
  * `previoustrack` e `nexttrack`: Avança ou retrocede faixas na fila.
  * `seekto`: Atualiza a posição da agulha para o segundo solicitado.
  * `seekbackward` e `seekforward`: Salta ±10 segundos.
  * `stop`: Ejeta o disco e zera a sessão.

### 3.4 Prevenção de Conflitos e Sessões Duplicadas
Para evitar que a Vitrola compita ou crie cartões duplicados no SMTC quando o usuário estiver ouvindo Spotify Desktop ou YouTube no navegador:
* A Vitrola publica o SMTC **exclusivamente durante a reprodução de arquivos locais**.
* Ao selecionar fontes externas ou ejetar o disco, a Vitrola chama `MediaSessionService.clearSession()`, liberando o SMTC do Windows para os outros aplicativos.

### 3.5 Como Testar no Windows 10 e Windows 11
1. **Menu Flutuante de Volume:**
   * Inicie a reprodução de um arquivo local na Vitrola.
   * Pressione as teclas de volume do teclado (`Volume Up` / `Volume Down`).
   * Observe o flyout do Windows exibindo o título, artista, capa em alta resolução e botões de transporte.
2. **Tela de Bloqueio (Win + L):**
   * Com o áudio tocando, pressione a tecla de atalho `Win + L` para bloquear o Windows.
   * A tela de bloqueio exibirá o painel multimídia com barra de progresso em tempo real e controles de pausa/avanço.
3. **Teclas Multimídia do Teclado:**
   * Teste as teclas `Play/Pause`, `Next` e `Prev` do teclado para comandar a Vitrola em segundo plano.

---

## 4. Resumo de Homologação e Testes

Todos os requisitos foram validados pela suíte automatizada (`node scripts/run_all_tests.js`):
* **68 testes automatizados** executados com 100% de sucesso.
* Compilação TypeScript e bundle Vite de produção gerados sem erros (`npm run build`).
