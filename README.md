# Vitrola — Hi-Fi Turntable Desktop Console

Console de alta fidelidade para Windows com estética retro de toca-discos analógico dos anos 1970 (madeira nobre, latão usinado, iluminação âmbar de filamento e medidores VU balísticos).

---

## 🎵 Visão Geral e Recursos Principais

- **Arquitetura Local-First:** Prioridade absoluta para reprodução bit-perfect de arquivos locais (FLAC, MP3, WAV, OGG, AAC/M4A) com decodificação direta, leitura nativa de metadados ID3/Vorbis e persistência local sem depender de conexões externas.
- **Toca-Discos Tátil com Física Real:** Disco de vinil com micro-ranhuras ópticas e rotação física (33⅓ e 45 RPM) acoplada estritamente ao estado de reprodução (`playing`); braço mecânico (*Tonearm*) articulado com agulha fonocaptora iluminada, repouso a 0°, elevação hidráulica (Cue a 12°) e descida no sulco (21° a 32°).
- **Medidores VU Balísticos:** Monitoramento estéreo de canal esquerdo e direito (L/R) calibrado em dBFS com balística analógica autêntica calculada a partir de amostras PCM reais via `AnalyserNode`. Agulhas caem para -40 dBFS ao pausar ou quando o prato estiver sem disco.
- **Equalizador & Pré-Amplificador Valvulado:** Potenciômetros recartilhados para Graves (Low-Shelf 150 Hz), Agudos (High-Shelf 3000 Hz), Saturação Harmônica Valvulada (curva não-linear de triodo 12AX7) e Volume Master.
- **Estante de Vinis (Crate Digging):** Prateleira de álbuns clássicos com capas de alta resolução, efeito realista de saída do disco no hover e prateleira de inspeção com detalhes da prensagem, matriz e faixa selecionada.
- **Ateliê de Customização:** 3 temas mestres com os mesmos tokens de design:
  - **Madeira Clássica:** Jacarandá nobre avermelhado, ferragens em latão e iluminação âmbar incandescente (2700K).
  - **Preto & Ouro 24K:** Acabamento piano black laqueado, detalhes banhados a ouro 24k e trama de alta rigidez.
  - **Neon Moderno:** Chassi em grafite acetinado mineral com iluminação perimetral ciano e magenta neon.
  - Opções adicionais de madeiras (Mogno, Carvalho, Nogueira, Bambu), metais (Latão, Cobre, Cromo, Ouro), tecidos de grelha e dimerização contínua de lâmpadas.
- **Mini Player Widget Flutuante:** Janela compacta e gadget de área de trabalho com mini disco giratório, indicador da fonte de áudio ativa, atalho *Always on Top* (Sempre no Topo), arraste livre na tela e mini medidor VU dinâmico sincronizado com a janela principal (sem áudios simultâneos).
- **Modo Tela Cheia (Audiophile Theatre):** Interface OSD imersiva com telemetria do codec ativo, rotação expandida e iluminação de sala de audição.
- **Integração Windows SMTC:** Controle via teclas multimídia do teclado do Windows (Play/Pause, Next, Prev, Stop).

---

## 🚀 Requisitos e Inicialização

### Pré-requisitos do Sistema:
- **Sistema Operacional:** Windows 10 ou Windows 11 (64-bit)
- **Node.js:** Versão LTS (v20+ ou v24+ recomendada)
- **Microsoft Edge WebView2 Runtime:** Instalado por padrão no Windows 10/11
- **Navegadores Suportados:** Microsoft Edge, Google Chrome ou navegadores baseados em Chromium/WebKit

### Inicialização Rápida no Windows (Um Duplo Clique):
Basta dar um duplo clique no arquivo:
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

## 📂 Como Importar Músicas Locais

1. Acesse a aba **Biblioteca** na navegação superior ou pressione a tecla `2`.
2. Clique no botão **"Importar Arquivos de Áudio"** ou arraste arquivos diretamente para a janela.
3. O Vitrola lê instantaneamente metadados (título, artista, álbum, arte da capa e formato) e armazena os registros no banco de dados local da aplicação (`LibraryStorage`).
4. Para reproduzir qualquer faixa, clique no botão de reprodução da capa ou do item na lista; o disco será carregado no prato, o braço mecânico descerá e o áudio começará a tocar com deflexão real dos medidores VU.

---

## 🌐 Configuração e Políticas dos Provedores de Áudio

O Vitrola adota uma política de **transparência e conformidade estrita** com as plataformas de streaming:

| Provedor | Modo Suportado | Limitações Declaradas |
| :--- | :--- | :--- |
| **Arquivos Locais** | **100% Funcional** (FLAC, MP3, WAV, OGG, AAC) | Sem restrições. Reprodução direta sem compressão ou rede com medidores VU analógicos reais. |
| **Spotify** | **OAuth 2.0 PKCE** + Web Playback SDK / Connect | **Exige Spotify Premium ativo** para streaming direto via SDK. Não expõe `client_secret` nem solicita senhas no app. Fallback para controle remoto Spotify Connect. Consulte `docs/06-spotify-config.md`. |
| **Deezer** | **Busca Pública + Prévia Oficial de 30s** | Prévias de 30s funcionam diretamente com VU balístico. Faixas completas exigem plano pago e são abertas na plataforma oficial deezer.com. |
| **YouTube** | **IFrame Player Oficial com Vídeo Visível** | Em conformidade com os Termos de Serviço da API do YouTube (Seção III.A.1/III.E), **não há extração de áudio isolado nem reprodução em segundo plano com vídeo oculto**. O vídeo permanece visível no monitor CRT integrado. |
| **YouTube Music** | **Indisponível** | Declarado abertamente como indisponível por ausência de API pública de áudio para reprodutores de terceiros. |

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
| **1** | Ir para aba **Início** (Toca-Discos Principal) |
| **2** | Ir para aba **Biblioteca** |
| **3** | Ir para aba **Playlists** |
| **4** | Ir para aba **Fontes de Áudio** |
| **5** | Ir para aba **Aparência / Ateliê** |
| **ESC** | Sair do modo **Tela Cheia** |

---

## 🛠️ Solução de Problemas (Troubleshooting)

- **Áudio não toca ao clicar em uma faixa (Autoplay):** Os navegadores modernos bloqueiam reprodução automática sem interação prévia do usuário. Clique em qualquer ponto da interface para desbloquear o contexto do Web Audio.
- **Medidores VU não se movem:** Os medidores VU medem amostras reais de PCM via `AnalyserNode`. Verifique se o volume master não está zerado e se uma faixa válida está em reprodução (`playing`). Fontes embutidas em sandboxes protegidos como YouTube executam em IFrame isolado e mantêm as agulhas em repouso por razões de segurança da plataforma.
- **Falha ao importar arquivo local grande:** O navegador pode impor limites de memória em buffers gigantes (> 500 MB). Para faixas muito longas, utilize arquivos FLAC ou WAV padrão de até 24-bit/96kHz.
