# 01 — Análise Integral de Engenharia e Design: Vitrola Hi-Fi

**Data de Elaboração:** 24 de setembro de 2026  
**Responsável:** Agente 01 (Analista de Arquitetura e Engenharia)  
**Fontes Analisadas:** `referencias/stitch/` (`vitrola_player_principal`, `vitrola_biblioteca_de_vinis`, `vitrola_personaliza_o_e_widget`, `vitrola_modo_tela_cheia`, `vitrola_logo`, `audiophile_analogue_digital_precision/DESIGN.md`).

---

## 1. Inventário de Telas e Componentes

A inspeção do pacote de referência Stitch revela uma arquitetura visual consistente e imersiva baseada na filosofia de **Skeuomorfismo Tátil Moderno (Tactile Skeuomorphic Modernism)**, inspirada em equipamentos hi-fi dos anos 1970 (madeira nobre, latão usinado, iluminação âmbar, agulhas VU e mostradores mecânicos).

### 1.1. Tela Principal (`vitrola_player_principal`)
- **Cabeçalho Global (Header):**
  - Logotipo vetorial Vitrola com disco de vinil estilizado e braço fonocaptor.
  - Título e subtítulo institucional (`Hi-Fi Turntable Console`).
  - Navegação de topo em pílula: Início, Biblioteca, Playlists, Fontes, Aparência.
  - Indicador de status de áudio digital: `ASIO 96k` (com LED âmbar).
  - Avatar de perfil de usuário.
  - Controles de janela estilo Windows desktop: Minimizar (`remove`), Maximizar/Restaurar (`check_box_outline_blank`), Fechar (`close`).
- **Barra Lateral Fixa (Aside / Console Rack):**
  - Navegação vertical numerada (01 Início, 02 Biblioteca, 03 Playlists, 04 Fontes, 05 Aparência).
  - Painel de telemetria `LIVE FEED`: taxa de amostragem (`24b / 96k`), seletor de motor de saída (`ASIO Direct / Tube Amp`), mostrador digital de atenuação master (`Master Attn: -14.5 dB`) e potenciômetro rotativo recartilhado.
- **Console do Toca-Discos (Chassi em Madeira e Metal):**
  - Gabinete de madeira nobre com parafusos de latão nos quatro cantos.
  - Deck rebaixado em alumínio escovado com placa de modelo `MODEL 79-PRO DIRECT DRIVE SUSPENDED CHASSIS`.
  - Estroboscópio óptico com 4 lâmpadas neon simulando calibração em 60Hz.
  - Prato giratório com borda chanfrada, anel de marcas estroboscópicas e esteira antiestática (`ANTI-STATIC MAT`) visível quando sem disco.
  - Disco de vinil com micro-ranhuras radiais e reflexo especular cônico dinâmico.
  - Selo central do disco (ex: Columbia 6-Eye "Kind of Blue - Miles Davis") com pino central de metal.
  - Conjunto mecânico do braço (Tonearm): torre cardânica, contrapeso circular maciço de latão, mostrador de antiskating (1.75g), tubo curvo de latão, cápsula fonocaptora (Shure/MC-9) com LED indicador de contato na agulha e alavanca de elevação hidráulica (Cue lever).
  - Seletor mecânico de velocidade (33 / 45 RPM), alternador de cue (UP/DOWN) e indicador micro de pitch.
  - Painel inferior com grelha acústica tweed, insígnia metálica `CLASS-A TUBE STAGE · 12AX7 DUAL TRIODE` e selo de sinal `Bit-Perfect RIAA Curve`.
- **Painel de Transporte e Busca Analógica:**
  - Metadados da faixa: número da faixa, edição histórica, título grande, artista e álbum, badge de cápsula `Moving Coil 47kΩ`.
  - Barra de progresso / ranhura analógica com agulha de latão usinado e medidores de tempo monoespaçados.
  - Controles de reprodução: Shuffle, Repeat, Faixa Anterior, Play/Pause principal com anel iluminado âmbar pulsante, Próxima Faixa, Botão de Ejetar disco.
- **Painel Direito de Monitoramento e Pré-Amplificação:**
  - Medidores VU Balísticos Analógicos estéreo (Canal Esquerdo / Canal Direito) com escalas de -20 a +3 dB e agulhas móveis.
  - Estágio de Pré-Amplificador com 4 botões rotativos de latão com recartilhado: Graves (+2.0 dB), Agudos (-1.0 dB), Saturação Valvular Tubo Sat (+4.5 dB), Volume Master (78%).
  - Seletor de barramento de fonte de áudio com lâmpadas piloto: Local FLAC, Spotify, Deezer, YouTube Music.
  - Lista de próximas faixas do álbum com identificação de lado (LADO A).

### 1.2. Biblioteca de Vinis (`vitrola_biblioteca_de_vinis`)
- **Rack de Comando Superior:**
  - Breadcrumb e status da estante (`CRATE // 02-VINYL-VAULT - 1.482 TÍTULOS INDEXADOS`).
  - Seletor de modo de visualização: Estante (Grid de capas), Caixote (Digging / carrossel inclinado), Prateleira Detalhada (Lista densa).
  - Barra de busca estilizada como mostrador de sintonia analógica, com atalho `⌘K / Ctrl+K`.
  - Ordenação por recentes, ano de gravação, resolução (Hi-Res primeiro), artista.
  - Filtro de fontes: Todos, Arquivos Locais, Spotify, Deezer, YouTube Direct.
  - Filtros de prensagem física: `[LP 33⅓ RPM]`, `[EP / Single 45 RPM]`, `[Box Sets]`, `[Gravação Direta do Prato / Vinyl Rip]`.
- **Grade da Estante de Discos (Crate Grid):**
  - Cartões com visual de capas de papelão envelhecido (LP jacket) com lombada desgastada.
  - Animação de hover realista: o disco de vinil desliza para fora da capa (82% de tamanho, rotação suave) revelando ranhuras e o selo central colorido de gravadoras clássicas (Columbia, Odeon, Pacific Jazz, Philips).
  - Badges de formato de áudio: `STEREO 6-EYE`, `DSD 11.2MHz MASTER`, `MONO CUT`, `DIRECT VINYL RIP`, `FLAC 96k`.
  - Botão de ação rápida "Colocar no Prato" (`play_arrow`).
- **Baia de Inspeção do Disco (Painel Lateral Direito):**
  - "DISCO EM ANÁLISE": Detalhe macro do selo, Dynamic Range (`DR 14dB`), faixa ativa, botão de reprodução de álbum completo e lista detalhada de faixas.

### 1.3. Personalização e Mini Widget (`vitrola_personaliza_o_e_widget`)
- **Ateliê Acústico (Chassis Studio):**
  - Tela de customização de hardware com pré-visualização em tempo real do gabinete.
  - Iluminação superior ajustável (Overhead glow).
  - Temas Mestres de Fábrica:
    1. *Madeira Clássica (Nostalgia 1974):* Jacarandá nobre avermelhado, latão torneado, sarja tweed bege, lâmpadas 2700K.
    2. *Preto & Ouro 24K (Concerto Royale):* Piano black fosco, folheado a ouro 24k, disco fumê espelhado, fibra de carbono.
    3. *Neon Moderno (Cyber Audiophile):* Grafite mineral jateado, alumínio e titânio usinado, LEDs ciano e magenta.
  - Laboratório de Texturas Físicas:
    - 4 Madeiras: Mogno Imperial, Carvalho Escuro, Nogueira Walnut, Bambu Tratado.
    - 4 Metais: Latão Escovado, Cobre Polido, Cromo Fumê, Ouro Envelhecido.
    - 3 Tecidos de Grade: Sarja Tweed Vintage, Malha Metálica Dourada, Tecido Charcoal Pro.
  - Controles Analógicos de Iluminação:
    - Controle deslizante de brilho da lâmpada do braço (0-100%).
    - Temperatura de cor da lâmpada (2200K a 4000K).
    - Interruptor de luz de fundo dos medidores VU (Ligado/Desligado).
- **Configuração do Mini Widget Flutuante para Windows:**
  - Mockup de tela do Windows 11 com papel de parede escuro e barra de tarefas.
  - Mini player desacoplado estilo "Gadget":
    - Mini disco de vinil giratório contínuo com capa miniatura e micro-braço fonocaptor sobreposto.
    - Metadados compactos da faixa, badge de resolução, barra de progresso fina.
    - Controles de transporte compactos (Anterior, Play/Pause, Próximo, Mute).
    - VU meter digital mini em tempo real (4 barras com indicador numérico de pico).
  - Opções de Formato: Compacto (fita de barra de tarefas), Médio (mini deck padrão 370px), Estendido (capa expandida + VU duplo).
  - Transparência ajustável do material Acrílico/Mica (30% a 100%).
  - Alternadores: "Sempre no Topo" (Always-on-top) e "Sincronizar Madeira".
  - Botão de ação: "Destacar Widget no Desktop".

### 1.4. Modo Tela Cheia (`vitrola_modo_tela_cheia`)
- **Experiência OSD de Sala de Audição (Audiophile Theatre):**
  - Ocultação da barra de navegação e menu lateral.
  - Fundo escurecido com iluminação volumétrica suave simétrica aos tubos e prato.
  - Cabeçalho minimalista OSD com telemetria analógica: status térmico dos tubos (`TUBE RAILS: 48.2°C`), tensão de polarização (`BIAS: OPTIMAL 1.8V`), controle de dimerização retro e botão "Sair [ESC]".
  - Chassi de grandes dimensões centralizado ocupando o palco com máxima fidelidade estética.
  - Grande medidor VU estéreo e mostrador dinâmico de espectro sonoro com ranhura iluminada.

### 1.5. Logotipo (`vitrola_logo`)
- SVG vetorial de alta definição com chassi arredondado escuro (`#1C1815`), borda circular de latão (`#D4A373`), ranhuras concêntricas, selo central em cobre queimado (`#C86432`), agulha fonocaptora em latão dourado (`#E0A96D`).

---

## 2. Tokens Visuais do Sistema de Design

Baseado em `referencias/stitch/audiophile_analogue_digital_precision/DESIGN.md` e nos arquivos `code.html`:

### 2.1. Paleta de Cores
| Token | Valor Hex | Uso Principal |
|---|---|---|
| `surface` / `background` | `#161311` | Fundo principal da janela (espresso escuro acetinado) |
| `surface-dim` | `#161311` | Fundo escurecido |
| `surface-bright` | `#3c3836` | Destaques de superfície e elevações secundárias |
| `surface-container-lowest` | `#100e0c` | Baixa cavidade, fundo dos VUs, interior do prato |
| `surface-container-low` | `#1e1b19` | Placas e módulos de hardware rebaixados |
| `surface-container` | `#221f1d` | Placas e decks padrão |
| `surface-container-high` | `#2d2927` | Botões elevados e chips de hardware |
| `surface-container-highest` | `#383432` | Bordas elevadas, seletores ativos |
| `primary` | `#fec486` | Latão escovado claro / botões ativos e títulos de destaque |
| `primary-container` | `#e0a96d` | Latão nobre torneado (cor base de identidade) |
| `secondary` | `#ffb95f` | Âmbar de filamento incandescente / LEDs e agulhas VU |
| `secondary-container` | `#ee9800` | Brilho intenso de filamento / destaques de estado ativo |
| `tertiary` | `#ffc2a7` | Cobre polido / detalhes de aterramento e ejeção |
| `tertiary-container` | `#ff9a6b` | Cobre acentuado |
| `on-surface` | `#e9e1dd` | Branco creme quente (Warm Bone Cream) para máxima legibilidade |
| `on-surface-variant` | `#d4c4b5` | Linho fosco (Muted Linen) para legendas e metadados |
| `outline` | `#9d8e81` | Marcações técnicas e legendas de engenharia |
| `outline-variant` | `#50453a` | Linhas de divisão do chassi e parafusos |
| `error` | `#ffb4ab` | Zona de saturação (+3dB) do VU meter |

### 2.2. Tipografia
- **Display & Títulos Heroicos:** `Syne` (pesos 600 e 700). Traz peso escultural e industrial para títulos de faixas, álbuns e logotipo.
- **Interface e Conteúdo (Workhorse):** `Plus Jakarta Sans` (pesos 400, 600, 700). Utilizada para árvores de diretórios, metadados de artistas, listas de músicas, menus e diálogos.
- **Telemetria e Instrumentação Técnica:** `Space Mono` (pesos 400 e 700). Utilizada para contadores de tempo (`03:42`), escalas dos VUs (`-20, -10, -3, 0, +3`), taxas de amostragem (`24-bit / 192kHz`) e atenuação em dB.
- **Rótulos de Hardware (`label-hardware`):** Caixa alta com `letter-spacing: 0.15em`, fonte de 10px a 11px, simulando relevo estampado em placas de latão.

### 2.3. Espaçamento e Formas
- **Raio de borda (Radii):** Linha base estrita de `0.25rem` (4px) a `0.5rem` (8px) para painéis, módulos e botões, preservando a silhueta de gabinetes metálicos usinados. Dials, prato e botões giratórios são círculos estritos (100%).
- **Elevação e Sombras:** Não utiliza desfoques difusos genéricos da web. Utiliza sombras duplas chanfradas:
  - Borda chanfrada superior: `inset 0 1px 1px rgba(255,221,187,0.2)`
  - Sombra projetada pesada inferior: `0 8px 24px rgba(0,0,0,0.85)`
  - Brilho volumétrico de filamento: `box-shadow: 0 0 12px #ffb95f`

---

## 3. Mapa de Navegação e Estados

### 3.1. Navegação Principal
```
[ Início (Player Principal) ] <=======> [ Biblioteca de Vinis ]
             ^                                     ^
             |                                     |
             v                                     v
[ Aparência & Customização ] <=======> [ Modo Tela Cheia (Theatre) ]
             |
             v
[ Mini Widget Flutuante ]
```

### 3.2. Estados Operacionais da Vitrola
1. **Estado Sem Disco (`empty`):**
   - Braço no descanso lateral (rotação 0°).
   - LED da agulha apagado.
   - Feltro antiestático exposto no prato, sem ranhuras nem selo central.
   - Indicador de Cue: `REST`.
   - Botão Play/Pause inativo ou em repouso.
2. **Estado Tocando (`playing`):**
   - Braço posicionado sobre as ranhuras do disco (rotação ~21°).
   - LED da agulha aceso com pulso luminoso quente.
   - Prato e disco girando na velocidade selecionada (33 ou 45 RPM).
   - Agulhas dos medidores VU oscilando dinamicamente com picos e balística analógica.
   - Contador de tempo avançando, barra de ranhura preenchendo suavemente.
   - Halo âmbar ativo no botão Master Play.
3. **Estado Pausado (`paused`):**
   - Braço levantado ligeiramente acima do disco pela alavanca hidráulica (rotação ~13°).
   - Rotação do prato cessada.
   - LED da agulha apagado.
   - Agulhas do VU voltam à posição de repouso (-28°).
   - Indicador de Cue: `LIFTED`.

---

## 4. Auditoria de Ações Decorativas vs. Reais nos Protótipos HTML

Os arquivos HTML do Stitch representam protótipos visuais avançados, contendo tanto interações funcionais de demonstração quanto elementos meramente cenográficos:

| Componente no Protótipo | Comportamento no HTML | Status Real no Produto |
|---|---|---|
| Rotação do disco | `setInterval` a cada 1000ms incrementando graus | **Implementar**: Animação contínua CSS acoplada ao estado do motor de áudio |
| Balística dos VUs | Rotação aleatória de agulhas (`Math.random()`) | **Implementar**: Conexão com Web Audio API (`AnalyserNode`) com RMS real dos canais L/R |
| Braço do toca-discos | Transição CSS via classe de ângulo estático | **Implementar**: Interação tátil de arrastar agulha (seek) e retorno suave |
| Telemetria de tubos/bias | Valores de texto fixos ("48.2°C", "1.8V", "108 dB") | **Tratar**: Manter como estética retro-analógica explícita de calibração, sem fingir telemetria de hardware inexistente |
| Botões de controle de janela | `<button>` com ícones de fechar/minimizar sem ação | **Implementar**: Integrar com a API nativa da janela Tauri/SO |
| Sliders de graves/agudos | Rotação randômica ao clicar (`tweakKnob`) | **Implementar**: BiquadFilterNodes reais (lowshelf/highshelf) do Web Audio |
| Fontes Spotify/Deezer/YT | Alternância visual de classe CSS e cor de lâmpada | **Implementar**: Adaptadores reais de provedor de reprodução com fallback documentado |
| Mini Widget | Moldura de preview dentro do layout | **Implementar**: Janela secundária Tauri real borderless e always-on-top |

---

## 5. Assets Remotos, Fontes e Direitos de Uso

1. **Fontes Web:**
   - O protótipo carrega `Syne`, `Plus Jakarta Sans`, `Space Mono` e `Material Symbols Outlined` via `fonts.googleapis.com`.
   - **Requisito para Produção Desktop:** Todas as fontes devem ser instaladas e empacotadas localmente (woff2/ttf) para garantir operação 100% offline e sem latência de renderização inicial.
2. **Imagens e Capas de Álbuns:**
   - No protótipo, capas como *Kind of Blue*, *Clube da Esquina*, *Chet Baker Sings* e *Elis & Tom* usam links temporários `lh3.googleusercontent.com`.
   - **Direitos de Uso:** No produto final, a biblioteca local indexará as capas incorporadas nos próprios arquivos de áudio do usuário (tags ID3 / Vorbis Comments / FLAC picture blocks) ou imagens locais (`cover.jpg`, `folder.jpg`). Para amostras de fábrica empacotadas, usar ativos livres de royalties ou amostras sob domínio público/Creative Commons.
3. **Logotipo Vitrola:**
   - Criado em SVG vetorial autônomo, 100% proprietário do projeto Vitrola, sem dependências externas.
4. **Tailwind CSS:**
   - Carregado no protótipo via script de CDN (`cdn.tailwindcss.com`).
   - **Requisito para Produção:** Compilação em tempo de build via Vite + PostCSS/Tailwind, eliminando o CDN.

---

## 6. Riscos Técnicos e Oportunidades de Simplificação

1. **Risco de Desempenho em Renderização Gráfica Contínua:**
   - Prato giratório com gradientes cônicos pesados + ranhuras radiais repetitivas + 2 agulhas VU com SVG oscilando a 60 FPS podem sobrecarregar a GPU se não utilizarem aceleração de hardware (`transform: translateZ(0)` ou Canvas/WebGL).
   - *Mitigação:* Usar camadas CSS desacopladas com composição por GPU (`will-change: transform`) para o prato e o braço; para os VUs, usar Canvas 2D ultra-leve ou transformações CSS puras.
2. **Risco de Complexidade de Áudio Nativo (ASIO/WASAPI):**
   - O protótipo exibe "ASIO Direct / Tube Amp". Na webview do Windows (WebView2 / Edge), a saída padrão de áudio utiliza WASAPI compartilhado. Acesso direto a drivers ASIO dedicados com baixa latência exigiria pipelines complexos em C++/Rust (CPAL).
   - *Mitigação:* Utilizar a robusta pilha do Web Audio API / HTML5 Audio nativo para a primeira versão funcional com equalizador analógico real e analisador de espectro, rotulando os drivers de saída adequadamente.
3. **Risco de Dependência de Plataformas Externas:**
   - Mudanças nas APIs do Spotify, Deezer ou YouTube podem quebrar a aplicação se o núcleo depender delas.
   - *Mitigação:* O núcleo do Vitrola é um reprodutor de arquivos locais de altíssima fidelidade. Plataformas externas entram exclusivamente como adaptadores desacoplados (`PlaybackProvider`).

---

## 7. Comparativo de Viewports: Prototipação Vertical vs. Windows Desktop

### 7.1. Análise Dimensional dos Protótipos
- `vitrola_player_principal`: **1027 × 1600 px** (proporção vertical ~1:1.55)
- `vitrola_biblioteca_de_vinis`: **1205 × 1600 px** (proporção vertical ~1:1.32)
- `vitrola_personaliza_o_e_widget`: **972 × 1600 px** (proporção vertical ~1:1.64)
- `vitrola_modo_tela_cheia`: **1600 × 1280 px** (proporção horizontal ~1.25:1)

### 7.2. Alvos Reais de Janela no Windows
- Padrão HD: **1366 × 768 px** (16:9 widescreen)
- Padrão Full HD: **1920 × 1080 px** (16:9 widescreen)
- Janela padrão com bordas/barra de tarefas: ~**1280 × 720 px** a **1440 × 900 px**

### 7.3. Proposta de Adaptação de Layout (Sem texto microscópico e sem rolagem excessiva)
Os protótipos do Stitch foram gerados em telas muito altas (1600px de altura), o que, se exibido diretamente em uma tela típica de notebook (768px de altura), exigiria rolagens verticais profundas para ver os controles de transporte ou os botões de equalização.

**Solução de Arquitetura de Layout para Desktop:**
1. **Estrutura Horizontal em 3 Colunas Integradas:**
   - **Coluna 1 (Navegação & Telemetria):** 240px de largura fixa. Menu retrátil ou compacto, preservando espaço útil.
   - **Coluna 2 (Toca-Discos Central & Transporte):** Área principal flexível. O toca-discos físico mantém proporção 1:1 circular bem calibrada (320px a 400px de diâmetro) com o painel de transporte (título, scrub bar, botões) logo abaixo.
   - **Coluna 3 (Instrumentação & Fila):** 360px a 420px de largura fixa à direita. Abriga os 2 medidores VU, os knobs de equalização analógica e a fila "Up Next" em um painel lateral limpo, visível simultaneamente sem rolagem.
2. **Dimensionamento Responsivo em Altura (`min-h-0` e `flex-1`):**
   - Em telas Full HD (1080p), o console expande sua área de visualização e revela detalhes ricos de textura.
   - Em telas HD (768p), o chassi reduz sua margem externa e os mostradores de equalização se organizam em grade 2x2 compacta, mantendo todo o controle de áudio e o disco visíveis sem rolagem de tela.

---

## 8. Distinção: Mini Player Interno vs. Widget Flutuante Windows

Para evitar qualquer ambiguidade arquitetural:

1. **Mini Player Interno (In-App):**
   - É um modo de exibição interno da própria janela principal da aplicação Vitrola.
   - Substitui a visão de estante ou chassi completo por uma barra inferior persistente ou modo colapsado para economizar espaço de tela enquanto o usuário explora sua biblioteca de arquivos.
2. **Widget Flutuante Windows (Desktop Gadget):**
   - É uma janela secundária nativa do sistema operacional Windows (`tauri::WebviewWindow` ou janela independente).
   - Funcionalidades exclusivas do widget externo:
     - Janela sem bordas padrão (`decorations: false`).
     - Propriedade "Sempre visível" (`always_on_top: true`).
     - Arrastável pela barra de manuseio com o mouse (`window.startDragging()`).
     - Fundo acrílico translúcido aproveitando o compositor DWM do Windows 11.
     - Comunicação bidirecional de eventos com a janela principal via bus de eventos local.

---

## 9. Matriz Oficial de Capacidades de Integrações de Streaming

*Data da Consulta e Verificação nas Políticas Oficiais:* 24 de setembro de 2026.

| Provedor / Serviço | Recurso Planejado | Status Oficial | Exigência de Conta | Escopos / Permissões | Restrições e Políticas Oficiais |
|---|---|---|---|---|---|
| **Arquivos Locais** (FLAC, MP3, WAV, OGG, M4A, DSD) | Reprodução completa, metadados ID3, capas, equalização real | **Confirmada** | Nenhuma (Offline) | Acesso a diretórios locais | Execução 100% autônoma, bit-perfect, sem limitações de rede ou DRM. |
| **Spotify** | Controle de reprodução remota (Connect) e busca no catálogo | **Confirmada** | Spotify Free / Premium | `user-read-playback-state`, `user-modify-playback-state` | Permite controlar dispositivos Spotify ativos e ler dados da faixa tocando via Web API. |
| **Spotify** | Streaming direto do áudio dentro do Vitrola | **Condicionada** | **Spotify Premium Obrigatório** | `streaming`, `user-read-email`, `user-read-private` | O Spotify Web Playback SDK exige conta Premium ativa; não funciona para contas Free. Requer suporte a Widevine DRM na WebView. |
| **Deezer** | Busca de catálogo e metadados de artistas/faixas | **Confirmada** | Nenhuma / Gratuita | Deezer API pública | Endpoints REST oficiais para catálogo, álbuns e artistas. |
| **Deezer** | Prévia de áudio (30 segundos) | **Confirmada** | Nenhuma (Acesso anônimo/Free) | Nenhuma | URL `preview` em MP3 (30s) fornecida diretamente pelo payload JSON da faixa. |
| **Deezer** | Faixa completa em alta fidelidade (FLAC/HiFi) | **Condicionada** | **Deezer Premium / HiFi** | Deezer OAuth + JS SDK | Exige autenticação de usuário pagante e o player oficial Deezer. Sem autenticação, o player limita compulsoriamente a 30s. |
| **YouTube** | Busca de vídeos e metadados musicais | **Confirmada** | Nenhuma (Chave de API do desenvolvedor) | YouTube Data API v3 | Retorna títulos, miniaturas e canais. Cota diária restrita. |
| **YouTube** | Reprodução de vídeo com player embutido | **Confirmada** | Nenhuma (Gratuito com anúncios) | YouTube IFrame Player API | O iframe oficial deve ser exibido visualmente na tela com controles e marca oficial preservados. |
| **YouTube / YouTube Music** | Player de áudio puro (sem vídeo / áudio isolado) | **Indisponível** | — | — | **Estritamente proibido** pelos Termos de Serviço da API do YouTube (Seção II.8 e Políticas do Desenvolvedor). É vedado separar o áudio do vídeo ou extrair fluxos brutos de áudio (Opus/AAC). |
| **YouTube** | Reprodução em segundo plano (com app minimizado) | **Indisponível** | — | — | **Estritamente proibido** pelas Políticas de Desenvolvedor do YouTube. O vídeo deve pausar obrigatoriamente se não estiver visível na tela. Não há API pública oficial do YouTube Music que autorize streaming de áudio livre em players de terceiros. |

### 9.1. Conclusão da Análise de Streaming
Para a entrega do Vitrola:
1. O produto **não deve simular nem prometer reprodução de áudio invisível do YouTube Music**. Qualquer integração de YouTube será oferecida no modo estrito de visualização de vídeo oficial embutido ou desabilitada com aviso de conformidade regulatória.
2. Spotify e Deezer exibirão seus adaptadores com identificação clara de requisitos (necessidade de conta Premium para streaming contínuo ou limitação a 30 segundos no caso do Deezer Free).
3. Músicas e álbuns locais são a espinha dorsal de fidelidade incondicional do aplicativo.

---

## 10. Conclusão do Agente 01 e Critérios de Aceite
- Análise integral e detalhada dos arquivos reais do repositório Stitch realizada com sucesso.
- Matriz completa de capacidades oficiais e restrições legais documentada com fontes oficiais.
- Nenhum código de produção alterado nesta etapa, respeitando estritamente o contrato da fase 01.
