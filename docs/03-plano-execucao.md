# 03 — Plano de Execução Detalhado: Vitrola Hi-Fi

**Data:** 24 de setembro de 2026  
**Responsável:** Agente 03 (Planejamento de Execução)  
**Documentos de Entrada:** `docs/01-analise.md`, `docs/02-arquitetura.md`, `docs/handoff/01.md`, `docs/handoff/02.md`

---

## 1. Inventário de Pré-requisitos do Ambiente Windows

| Pré-requisito | Status Atual no Sistema | Versão Detectada | Observações |
|---|---|---|---|
| **Node.js (LTS)** | Instalado e Ativo | `v24.21.0` | Gerenciado via nvm |
| **npm** | Instalado e Ativo | `v11.19.0` | Gerenciador de pacotes padrão |
| **Microsoft Edge WebView2** | Instalado | `152.0.4191.66` | Em `C:\Program Files (x86)\Microsoft\EdgeWebView\Application` |
| **Python** | Instalado | `3.12` | Disponível para utilitários de build e automação |
| **Git** | Instalado e Ativo | `2.x` | Repositório inicializado com commits por estágio |
| **Rust / Cargo** | Ausente | — | Requer MSVC C++ Build Tools para compilação nativa Tauri `cargo build` |
| **Visual Studio C++ Build Tools** | Ausente | — | Não instalado nesta máquina |

### Estratégia de Execução e Empacotamento Desktop Windows:
- A aplicação é construída com **React 19 / 18 + TypeScript + Vite + Tailwind CSS**, seguindo rigorosamente a arquitetura local-first.
- Para a interface com o sistema operacional no ambiente Windows, a aplicação conta com a camada de abstração de I/O de arquivos locais, suporte nativo de áudio via Web Audio Graph e empacotamento desktop executável para Windows.

---

## 2. Marcos de Demonstração (Milestones)

1. **Marco 1 — Shell Visual e Navegação (Fim do Estágio 04):**
   - Aplicação inicializa com `npm run dev` e compila sem erros com `npm run build`.
   - Navegação completa entre Início (Player), Biblioteca, Playlists, Fontes e Aparência.
   - Componentes visuais fiéis às referências Stitch: Toca-discos em madeira nobre e latão, braço com agulha fonocaptora, medidores VU duplos, knobs recartilhados e estante de discos.
   - Controles legíveis e dimensionados para janelas 1366×768 e 1920×1080, sem texto microscópico nem rolagem excessiva.
2. **Marco 2 — Primeira Música Local Audível (Fim do Estágio 05):**
   - Importação de arquivo de áudio local (MP3, FLAC, WAV, OGG).
   - Reprodução com áudio real saindo nos alto-falantes/fones de ouvido.
   - Braço desce suavemente na borda do disco; disco gira em velocidade proporcional; agulha acende iluminação quente.
   - Medidores VU respondem aos dados PCM do áudio real.
   - Teclado (Espaço para play/pause, setas para seek) e Windows Media Session (SMTC) integrados.
3. **Marco 3 — Biblioteca Persistente e Resiliente (Fim do Estágio 05):**
   - Indexação de pasta local com extração de metadados (título, artista, álbum, ano, duração) e capas de álbuns.
   - Ao reiniciar a aplicação, a biblioteca recarrega instantaneamente do armazenamento local sem perda de faixas.
   - Tratamento suave para arquivos renomeados ou inexistentes (aviso claro, sem travar a interface).
4. **Marco 4 — Mini Player e Ateliê de Temas (Fim do Estágio 08):**
   - Alternância fluida entre os temas: *Madeira Clássica*, *Preto & Ouro 24K* e *Neon Moderno*.
   - Modo Mini Player e Janela de Widget compacto com controles de transporte e mini disco giratório sincronizado.
5. **Marco 5 — Adaptador Oficial Spotify (Fim do Estágio 06):**
   - Painel de configuração com guia passo a passo para registro de app no Spotify Developer Dashboard.
   - Implementação do fluxo OAuth PKCE com tratamento específico para conta sem Premium ou ausência de dispositivo.
6. **Marco 6 — Provas de Viabilidade Deezer e YouTube (Fim do Estágio 07):**
   - Deezer com preview oficial de 30s comprovado.
   - YouTube com modo de conformidade IFrame Player documentado (sem simulação enganosa de áudio sem vídeo).
7. **Marco 7 — Empacotamento, Testes e Entrega Windows (Fim dos Estágios 10 e 11):**
   - Suíte de testes automatizados executada e aprovada.
   - Script de lançamento `iniciar-vitrola.bat` e empacotamento Windows gerado.
   - ZIP limpo do projeto fonte e documentação de entrega em `docs/11-entrega.md`.

---

## 3. Backlog Ordenado de Tarefas (Estágios 04 a 11)

### Estágio 04 — Design & Frontend
- **Tarefa 04.1 — Scaffolding do Projeto Frontend com Vite + React + TS + Tailwind**
  - *Entrada:* `referencias/stitch/`, `docs/01-analise.md`, `docs/02-arquitetura.md`.
  - *Arquivos Prováveis:* `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `src/index.css`.
  - *Resultado Observável:* Projeto configurado com fontes e ícones locais, Tailwind com os tokens de `DESIGN.md`.
  - *Comando de Verificação:* `npm run build`
  - *Dependência:* Nenhuma.
- **Tarefa 04.2 — Componentes Base de Layout e Navegação**
  - *Entrada:* Layout horizontal de 3 colunas para Windows.
  - *Arquivos Prováveis:* `src/components/layout/WindowHeader.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/MainLayout.tsx`.
  - *Resultado Observável:* Header com botões Windows e status, barra lateral numerada e roteamento de abas.
  - *Comando de Verificação:* `npm run build`
  - *Dependência:* 04.1.
- **Tarefa 04.3 — Módulo do Toca-Discos (Turntable, Platter, Tonearm, Stylus)**
  - *Entrada:* CSS e SVG do toca-discos de `vitrola_player_principal/code.html`.
  - *Arquivos Prováveis:* `src/components/player/Turntable.tsx`, `src/components/player/Tonearm.tsx`, `src/components/player/VinylDisc.tsx`.
  - *Resultado Observável:* Chassi em jacarandá, parafusos chanfrados, disco de vinil giratório (somente quando `playing`), braço animado em repouso/execução.
  - *Comando de Verificação:* Teste visual no navegador.
  - *Dependência:* 04.2.
- **Tarefa 04.4 — Painel de Transporte, Scrub Analógico e Leitura de Faixa**
  - *Entrada:* Especificação de transportes e scrub bar de latão.
  - *Arquivos Prováveis:* `src/components/player/TransportControls.tsx`, `src/components/player/AnalogScrubBar.tsx`, `src/components/player/TrackReadout.tsx`.
  - *Resultado Observável:* Botões de Play/Pause com anel de halo âmbar, Previous, Next, Ejetar, mostrador de tempo em `Space Mono`.
  - *Comando de Verificação:* Interação com o mock de estado.
  - *Dependência:* 04.3.
- **Tarefa 04.5 — Painel de Instrumentação: Medidores VU e Equalizador**
  - *Entrada:* SVGs dos medidores VU e knobs de equalização.
  - *Arquivos Prováveis:* `src/components/player/BallisticVUMeters.tsx`, `src/components/player/PreampKnobs.tsx`, `src/components/player/SourceSelector.tsx`.
  - *Resultado Observável:* Dois VUs estéreo com escalas calibradas e 4 seletores rotativos de graves/agudos/tubo/volume.
  - *Comando de Verificação:* `npm run build`
  - *Dependência:* 04.4.
- **Tarefa 04.6 — Telas de Biblioteca, Personalização e Tela Cheia**
  - *Entrada:* Telas Stitch de biblioteca de vinis, ateliê e modo teatro.
  - *Arquivos Prováveis:* `src/views/LibraryView.tsx`, `src/views/CustomizationView.tsx`, `src/views/FullscreenView.tsx`.
  - *Resultado Observável:* Capas de vinil com efeito de slide out do disco ao passar o mouse, ateliê de madeiras e modo escuro imersivo OSD.
  - *Comando de Verificação:* Navegação entre todas as 5 rotas sem erros de console.
  - *Dependência:* 04.5.

### Estágio 05 — Player Local & Áudio Real
- **Tarefa 05.1 — Motor de Áudio Web Audio Graph & Medição PCM Real**
  - *Entrada:* Arquitetura DSP de `docs/02-arquitetura.md`.
  - *Arquivos Prováveis:* `src/services/audio/AudioEngine.ts`, `src/services/audio/VUMeterNode.ts`.
  - *Resultado Observável:* Grafo de áudio com `AnalyserNode` calculando RMS real de canal esquerdo e direito, e `BiquadFilterNode` para EQ de graves/agudos.
  - *Comando de Verificação:* Teste de áudio audível com oscilação física verídica dos ponteiros dos VUs.
  - *Dependência:* 04.6.
- **Tarefa 05.2 — Provedor de Arquivos Locais (`LocalPlaybackProvider`)**
  - *Entrada:* Contrato `PlaybackProvider`.
  - *Arquivos Prováveis:* `src/services/providers/LocalPlaybackProvider.ts`, `src/store/usePlaybackStore.ts`.
  - *Resultado Observável:* Controle total de ciclo de vida: play, pause, seek, volume, speed (33/45 RPM).
  - *Comando de Verificação:* Teste com faixas de teste MP3 e WAV.
  - *Dependência:* 05.1.
- **Tarefa 05.3 — Indexador de Metadados e Persistência de Biblioteca**
  - *Entrada:* Esquema de dados `Track` e `Album`.
  - *Arquivos Prováveis:* `src/services/library/TagReader.ts`, `src/services/library/LibraryStorage.ts`, `src/store/useLibraryStore.ts`.
  - *Resultado Observável:* Diálogo de seleção de arquivos/pastas, extração de metadados de tags de áudio, geração de capas locais e persistência de dados.
  - *Comando de Verificação:* Recarregar a página/app e verificar se as faixas continuam na biblioteca.
  - *Dependência:* 05.2.
- **Tarefa 05.4 — Integração com Windows SMTC & Atalhos de Teclado**
  - *Entrada:* `MediaSession API` e listener global de teclado.
  - *Arquivos Prováveis:* `src/services/windows/WindowsMediaControls.ts`, `src/hooks/useKeyboardShortcuts.ts`.
  - *Resultado Observável:* Teclas de atalho funcionais (Espaço = Play/Pause, M = Mute, Setas = Seek/Volume, 1-5 = Telas). Flyout do Windows exibe metadados.
  - *Comando de Verificação:* Testar atalhos e verificar `navigator.mediaSession.playbackState`.
  - *Dependência:* 05.3.

### Estágio 06 — Adaptador Spotify
- **Tarefa 06.1 — Módulo de Autenticação OAuth 2.0 PKCE**
  - *Entrada:* Especificação de OAuth do Spotify com PKCE.
  - *Arquivos Prováveis:* `src/services/providers/spotify/SpotifyAuth.ts`.
  - *Resultado Observável:* Geração de code verifier e challenge; fluxo de login seguro sem client secret no binário.
  - *Comando de Verificação:* Teste unitário de geração PKCE.
  - *Dependência:* 05.4.
- **Tarefa 06.2 — Adaptador Spotify (`SpotifyPlaybackProvider`) & Tela de Configuração**
  - *Entrada:* Contrato `PlaybackProvider` e documentação de configuração.
  - *Arquivos Prováveis:* `src/services/providers/spotify/SpotifyPlaybackProvider.ts`, `src/views/SourcesView.tsx`, `docs/06-spotify-config.md`.
  - *Resultado Observável:* Interface clara de conexão, indicação de necessidade de conta Premium para Web Playback SDK, suporte a Spotify Connect e guia do desenvolvedor.
  - *Comando de Verificação:* `npm run build`
  - *Dependência:* 06.1.

### Estágio 07 — Prova de Viabilidade Deezer e YouTube
- **Tarefa 07.1 — Adaptador Deezer com Limite de 30s Documentado**
  - *Entrada:* API pública do Deezer.
  - *Arquivos Prováveis:* `src/services/providers/deezer/DeezerProvider.ts`.
  - *Resultado Observável:* Busca no catálogo Deezer, metadados e reprodução honesta de prévias oficiais de 30 segundos, com selo de preview.
  - *Comando de Verificação:* Busca e execução de preview Deezer.
  - *Dependência:* 06.2.
- **Tarefa 07.2 — Adaptador YouTube em Modo de Conformidade IFrame**
  - *Entrada:* Termos de Serviço da API do YouTube.
  - *Arquivos Prováveis:* `src/services/providers/youtube/YouTubeProvider.ts`, `docs/07-matriz-provedores.md`.
  - *Resultado Observável:* Exibição de player oficial do YouTube com vídeo visível, bloqueio formal de execução em segundo plano ou áudio isolado sem vídeo.
  - *Comando de Verificação:* Validação da matriz em `docs/07-matriz-provedores.md`.
  - *Dependência:* 07.1.

### Estágio 08 — Temas & Mini Player
- **Tarefa 08.1 — Mecanismo de Temas Customizados e Persistência**
  - *Entrada:* Temas Madeira Clássica, Preto & Ouro, Neon Moderno.
  - *Arquivos Prováveis:* `src/store/useThemeStore.ts`, `src/styles/themes.ts`.
  - *Resultado Observável:* Troca instantânea de tema, alterando cores, acabamento de metal e madeira, preservando legibilidade e contraste.
  - *Comando de Verificação:* Alternar temas e recarregar o app para checar persistência.
  - *Dependência:* 07.2.
- **Tarefa 08.2 — Mini Player Interno e Janela de Widget Desacoplado**
  - *Entrada:* Especificação de Mini Widget do Windows.
  - *Arquivos Prováveis:* `src/components/widget/MiniPlayerWidget.tsx`, `src/views/MiniWidgetWindow.tsx`.
  - *Resultado Observável:* Modo compacto de visualização com mini vinil animado, controles essenciais, VU simplificado e barra de arraste.
  - *Comando de Verificação:* Alternar para o modo mini player e verificar sincronização de áudio bidirecional.
  - *Dependência:* 08.1.

### Estágio 09 — Revisão de Código e Integridade
- **Tarefa 09.1 — Auditoria de Legibilidade, Acessibilidade e Segurança**
  - *Entrada:* Código fonte completo do projeto.
  - *Arquivos Prováveis:* `docs/09-revisao.md`.
  - *Resultado Observável:* Verificação de contraste de cores, suporte a `prefers-reduced-motion`, ausência de segredos ou URLs inseguras, rótulos honestos nos controles.
  - *Comando de Verificação:* `npm run lint` / `npm run build`
  - *Dependência:* 08.2.

### Estágio 10 — Testes de Ponta a Ponta
- **Tarefa 10.1 — Testes Automatizados Unitários e de Integração**
  - *Entrada:* Casos de teste de indexação, estado de playback e provedores.
  - *Arquivos Prováveis:* `src/__tests__/audioEngine.test.ts`, `src/__tests__/libraryStore.test.ts`, `docs/10-testes.md`.
  - *Resultado Observável:* Execução e aprovação de todos os testes unitários.
  - *Comando de Verificação:* `npm run test`
  - *Dependência:* 09.1.
- **Tarefa 10.2 — Validação de Resolução e Escala Windows**
  - *Entrada:* Matriz de viewport (1366×768, 1920×1080) e escala (100%, 125%, 150%).
  - *Arquivos Prováveis:* `docs/10-testes.md`.
  - *Resultado Observável:* Interface perfeitamente legível sem sobreposição de controles em todas as escalas.
  - *Dependência:* 10.1.

### Estágio 11 — Entrega e Empacotamento
- **Tarefa 11.1 — Scripts de Lançamento e Build de Produção**
  - *Entrada:* Build otimizada do Vite.
  - *Arquivos Prováveis:* `iniciar-vitrola.bat`, `package.json`, `README.md`.
  - *Resultado Observável:* Execução autônoma com duplo clique em `iniciar-vitrola.bat`.
  - *Comando de Verificação:* `npm run build`
  - *Dependência:* 10.2.
- **Tarefa 11.2 — Geração do Pacote ZIP Limpo e Relatório de Entrega**
  - *Entrada:* Raiz do projeto.
  - *Arquivos Prováveis:* `vitrola-dist.zip`, `docs/11-entrega.md`, `docs/handoff/11.md`.
  - *Resultado Observável:* Arquivo ZIP gerado sem `node_modules` nem arquivos temporários.
  - *Comando de Verificação:* `python -m zipfile ...`
  - *Dependência:* 11.1.

---

## 4. Matriz de Estados de Interface por Tela

Toda tela deve tratar formalmente quatro estados vitais:

| Tela | Estado Carregando (`loading`) | Estado Vazio (`empty`) | Estado de Erro (`error`) | Estado Desconectado (`offline`) |
|---|---|---|---|---|
| **Início (Toca-Discos)** | Brilho suave nos tubos, prato estático com agulha suspensa | Braço no descanso, feltro antiestático aparente, texto "Selecione uma faixa da biblioteca" | Agulha volta ao descanso, mensagem em vermelho suave no display técnico | Mantém reprodução local ativa; se faixa externa, exibe aviso e pausa |
| **Biblioteca de Vinis** | Grade de esqueletos (skeletons) com brilho de pulso | Estante de madeira limpa com botão destacado "Importar Pasta de Músicas" | Mensagem de erro de leitura de diretório com botão "Tentar Novamente" | Continua exibindo todo o acervo local indexado sem nenhuma restrição |
| **Playlists** | Indicador de leitura de playlists | Caixa de vinil vazia com botão "Criar Nova Seleção" | Mensagem de erro ao salvar arquivo de playlist | Playlists locais totalmente funcionais offline |
| **Fontes** | Verificando status dos adaptadores | Nenhuma conta externa configurada; foco em arquivos locais | Erro de autenticação com descrição do código (401/403/429) | Ícones externos com badge cinza "Sem Conexão"; Local 100% ativo |
| **Aparência (Ateliê)** | Renderizando materiais de textura | Carregando perfil padrão de fábrica | Falha ao aplicar perfil; restaura tema padrão de segurança | 100% funcional offline |

---

## 5. Matriz de Resoluções e Escalas do Windows

| Resolução Alvo | Proporção | Escala DPI Windows | Ajuste de Layout no Vitrola |
|---|---|---|---|
| **1366 × 768** | 16:9 | 100% | Colunas laterais compactas (220px nav, 340px VU/EQ); prato com 320px de diâmetro. Sem rolagem na tela principal. |
| **1366 × 768** | 16:9 | 125% | Barra de navegação colapsa para ícones; painel direito reorganiza botões em grade 2x2. |
| **1920 × 1080** | 16:9 | 100% | Espaçamento generoso (`space-lg`), prato com 420px de diâmetro, VUs expandidos e detalhes de textura de madeira evidentes. |
| **1920 × 1080** | 16:9 | 125% / 150% | Escalonamento perfeito via unidades `rem` do Tailwind. Preserva proporção dos componentes sem cortes. |

---

## 6. Conclusão do Agente 03 e Critérios de Aceite
- Plano de execução estruturado em tarefas atômicas sequenciais sem lacunas conceituais.
- Marcos de demonstração estabelecidos para cada estágio do desenvolvimento.
- Critérios de aceite e matriz de estados definidos para cada tela.
- Preparado para execução imediata do Agente 04 (Design / Frontend).
