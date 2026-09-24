# Vitrola — Hi-Fi Turntable Desktop Console

Console de alta fidelidade para Windows com estética retro de toca-discos analógico dos anos 1970 (madeira nobre, latão usinado, iluminação âmbar de filamento e medidores VU balísticos).

---

## 🎵 Visão Geral e Recursos Principais

- **Arquitetura Local-First:** Prioridade absoluta para reprodução bit-perfect de arquivos locais (FLAC, MP3, WAV, OGG, AAC/M4A) com decodificação direta, leitura nativa de metadados ID3/Vorbis e persistência local sem depender de conexões externas.
- **Importação de Links do Spotify e YouTube:** Campo *"Adicionar link"* na estante de vinis que aceita URLs oficiais e URIs (`open.spotify.com/album/...`, `open.spotify.com/track/...`, `spotify:album:...`, `spotify:track:...` ou links de YouTube / YouTube Music). Extração segura de ID Base62 de 22 caracteres, resolução oficial de metadados e persistência na biblioteca sem armazenar arquivos de áudio protegidos.
- **Aba Nativa YouTube Music com Login Google:** Reprodução direta integrada do YouTube Music com suporte a login na conta Google e persistência de sessão entre reinicializações no aplicativo Desktop.
- **Widget de Dock do Windows (Modo Dock):** Barra horizontal compacta e elegante (formato dock pill) projetada para repousar acima da barra de tarefas do Windows ou em docks desktop (Nexus, RocketDock, MyDockFinder), com:
  - 💿 **Disquinho Girando:** Miniatura com sulcos de vinil ópticos e rotação física a 33 ⅓ RPM quando tocando.
  - ⏮ **Botão Volta:** Retorna para a faixa anterior.
  - ⏯ **Botão Pausa/Play:** Botão com halo âmbar incandescente que brilha quando ativo.
  - ⏭ **Botão Passa pra Frente:** Avança instantaneamente para a próxima faixa.
  - ⚓ **Encaixe Magnético no Dock:** Posicionamento automático no centro inferior com 1 clique.
  - 📌 **Always on Top:** Fixação sobre qualquer janela ou jogo.
- **Controles Nativos na Barra de Tarefas do Windows (Thumbnail Toolbar):** Botões integrados na miniatura ao passar o mouse sobre o ícone da barra de tarefas do Windows (`[⏮ Volta]`, `[⏯ Pausa/Play]`, `[⏭ Passa pra Frente]`).
- **Encarte & Capa Original Quadrada Íntegra:** Exibição da capa física do álbum sem cortes no suporte de madeira nobre (`AlbumJacketStand`), com atribuição oficial. A capa é renderizada com fidelidade no selo central do vinil giratório (`VinylDisc`).
- **Toca-Discos Tátil com Física Real:** Disco de vinil com micro-ranhuras ópticas e rotação física (33⅓ e 45 RPM) acoplada estritamente ao estado de reprodução (`playing`); braço mecânico (*Tonearm*) articulado foto-realista com agulha fonocaptora iluminada, repouso a 0°, elevação hidráulica (Cue a 12°) e descida no sulco (21° a 32°).
- **Medidores VU Balísticos:** Monitoramento estéreo (L/R) calibrado em dBFS com balística analógica calculada a partir de amostras PCM reais via `AnalyserNode`.
- **Equalizador & Pré-Amplificador Valvulado:** Potenciômetros para Graves (Low-Shelf 150 Hz), Agudos (High-Shelf 3000 Hz), Saturação Harmônica Valvulada (curva não-linear de triodo 12AX7) e Volume Master.
- **Modo Tela Cheia (Audiophile Theatre):** Imersão pura no toca-discos em tela inteira, exibindo apenas o prato, o vinil girando e a música no centro com controles de transporte. Sair pressionando `ESC`.

---

## 🚀 Instalação e Inicialização no Windows

### 1. Instalador Oficial Executável (.exe)
Execute o instalador oficial gerado para o Windows:
```cmd
Vitrola-Setup.exe
```
* Cria o atalho com ícone de vinil na **Área de Trabalho**.
* Cria entrada no **Menu Iniciar** do Windows.
* Registra o aplicativo no Windows (**Configurações > Aplicativos > Aplicativos Instalados**).

### 2. Inicializador Rápido (.bat)
Dê um duplo clique em:
```cmd
instalar-vitrola.bat
```
ou para abrir diretamente o aplicativo desktop:
```cmd
iniciar-vitrola-desktop.bat
```

---

## 🛠️ Comandos de Desenvolvimento

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:5173`.

3. **Compilar para produção:**
   ```bash
   npm run build
   ```

4. **Executar como App Desktop (Electron):**
   ```bash
   npm run desktop
   ```

5. **Gerar instalador Windows (.exe com NSIS):**
   ```bash
   npm run package:win
   ```

6. **Executar a suíte de testes de homologação:**
   ```bash
   node scripts/run_all_tests.js
   ```

---

## 🎛️ Atalhos de Teclado Globais

| Tecla | Ação |
| :--- | :--- |
| **Barra de Espaço** | Alternar Reprodução / Pausa (Play / Pause) |
| **D** | Abrir / Fechar **Widget de Dock do Windows** |
| **Seta Direita (→)** | Avançar 5 segundos na faixa (*Seek Ahead*) |
| **Seta Esquerda (←)** | Retroceder 5 segundos na faixa (*Seek Back*) |
| **Seta Cima (↑)** | Aumentar Volume em 5% |
| **Seta Baixo (↓)** | Diminuir Volume em 5% |
| **M** | Alternar Mudo / Desmudo rápido |
| **F ou F11** | Alternar Modo Tela Cheia (Toca-Discos Puro) |
| **ESC** | Sair do modo Tela Cheia |
| **1** | Ir para aba **Início** (Toca-Discos Principal) |
| **2** | Ir para aba **Biblioteca** |
| **3** | Ir para aba **Playlists** |
| **4** | Ir para aba **YouTube Music** |
| **5** | Ir para aba **Fontes de Áudio** |
| **6** | Ir para aba **Aparência / Ateliê** |

---

## 📂 Estrutura de Pastas do Projeto

```text
vitrola/
├── dist/                      # Artefatos compilados de produção
├── docs/                      # Documentação de arquitetura, integrações e testes
│   ├── 01-analise.md
│   ├── 02-arquitetura.md
│   ├── 06-spotify-config.md
│   ├── 07-matriz-provedores.md
│   ├── 12-instalador-e-dock-widget.md
│   ├── handoff/               # Histórico das passagens de estágio
│   └── integracoes-midias.md
├── electron/                  # Código nativo do Electron Desktop
│   ├── assets/                # Ícones da barra de tarefas (prev, play, pause, next)
│   ├── main.cjs               # Processo principal, persistência de sessão e thumbar
│   └── preload.cjs            # IPC seguro para comunicação do player
├── prompts/                   # Histórico de prompts e especificações dos agentes
├── public/                    # Assets estáticos, ícones e amostras PCM
│   ├── icon.ico               # Ícone multi-resolução para Windows
│   ├── icon.png               # Ícone em alta resolução
│   └── samples/               # Áudios PCM de demonstração
├── referencias/               # Especificações visuais e protótipo de design Stitch
├── scripts/                   # Scripts de instalação, geração de ícones e testes
│   ├── generate_app_icon.cjs
│   ├── generate_thumbar_icons.cjs
│   ├── install-windows.ps1
│   ├── run_all_tests.js
│   └── uninstall-windows.ps1
├── src/                       # Código-fonte da aplicação React + TypeScript
│   ├── assets/                # Logos e ilustrações vetoriais
│   ├── components/
│   │   ├── layout/            # Header, Sidebar, Container
│   │   ├── player/            # Turntable, Tonearm, VinylDisc, VUMeters, ScrubBar
│   │   └── widget/            # MiniPlayerWidget (Modo Dock Horizontal e Mini Deck)
│   ├── services/              # Áudio Web Audio API, SMTC, Spotify, Storage
│   ├── views/                 # Início, Biblioteca, Playlists, YouTubeMusic, Fontes, Fullscreen
│   ├── App.tsx                # Orquestrador central e atalhos
│   ├── index.css              # Estilos e animações de rotação física de vinil
│   └── main.tsx               # Ponto de entrada React
├── .gitignore                 # Filtros para o Git (ignora binários pesados e caches)
├── index.html                 # Template HTML com fontes e CSP configurada
├── LICENSE                    # Licença de código aberto (MIT)
├── package.json               # Configurações de pacotes e scripts de build
├── tailwind.config.js         # Tokens de cor, tipografia e espaçamento retro
├── tsconfig.json              # Configuração do TypeScript
└── vite.config.ts             # Configuração do Vite com base relativa para desktop
```

---

## 📤 Como Subir este Projeto no seu GitHub

Se você deseja subir este repositório para o seu GitHub pessoal:

1. **Crie um novo repositório no seu GitHub:**
   - Acesse [github.com/new](https://github.com/new)
   - Nomeie o repositório (exemplo: `vitrola-hi-fi`)
   - Deixe o repositório **sem** marcar inicializar com README (pois este projeto já possui tudo pronto).

2. **No terminal dentro desta pasta, execute:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   git push -u origin main
   ```

*(O `.gitignore` já está configurado para não subir pastas temporárias, dependências nem binários pesados de mais de 100 MB).*

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.
