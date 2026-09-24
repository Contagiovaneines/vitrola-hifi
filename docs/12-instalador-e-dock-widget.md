# Guia de Instalação no Windows e Widget para Dock (Vitrola Hi-Fi)

## 1. Visão Geral da Entrega

Atendendo à solicitação do usuário, a Vitrola Hi-Fi agora é:
1. **100% Instalável no Windows**:
   - Atalho com ícone de vinil em alta resolução na **Área de Trabalho (Desktop)** (`Vitrola Hi-Fi.lnk`).
   - Atalho no **Menu Iniciar** (`%APPDATA%\Microsoft\Windows\Start Menu\Programs\Vitrola Hi-Fi\Vitrola Hi-Fi.lnk`).
   - Inicialização silenciosa nativa (`vitrola-desktop.vbs`) sem abrir janela preta de terminal do CMD.
   - Registro oficial no Windows em **Configurações > Aplicativos > Aplicativos Instalados** (`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\Vitrola`).
   - Scripts dedicados de instalação (`instalar-vitrola.bat`) e desinstalação limpa (`desinstalar-vitrola.bat`).
   - Suporte a empacotamento executável com `electron-builder` (`npm run package:win` / `npm run package:dir`).

2. **Widget Dedicado para Dock do Windows (Modo Dock)**:
   - Projetado especificamente para ser encaixado diretamente no dock/barra de tarefas do Windows (ou em docks como Nexus, RocketDock, MyDockFinder).
   - Componentes incluídos:
     - 💿 **Disquinho Girando**: Disco de vinil em miniatura com ranhuras usinadas, reflexo cônico de luz, agulha de latão e rotação em 33 ⅓ RPM quando tocando, parando suavemente ao pausar.
     - ⏮ **Botão Volta**: Retorna para a faixa anterior com resposta tátil retrô.
     - ⏯ **Botão Pausa/Play**: Botão central usinado com iluminação âmbar quente que acende e brilha quando ativo.
     - ⏭ **Botão Passa pra Frente**: Avança para a próxima faixa.
     - 🎵 **Mostrador da Música e Artista**: Display âmbar hi-fi com título da faixa atual e micro-barra de progresso clicável para seek.
     - ⚓ **Encaixe no Dock**: Botão de encaixe magnético com 1 clique no centro inferior da tela (logo acima da barra de tarefas).
     - 📌 **Sempre no Topo (Always on Top)**: Flutua acima de todas as outras janelas e jogos.
     - 🎛 **Alternador Dock / Mini Deck**: Alterna entre a barra horizontal compacta e o mini deck vertical com ponteiros VU balísticos.
     - 🖱 **Arrasto Livre com Memória**: Pode ser arrastado livremente para qualquer posição da tela ou múltiplos monitores, lembrando a posição exata.

3. **Controles Nativos na Barra de Tarefas do Windows (Thumbnail Toolbar)**:
   - Ao passar o mouse por cima do ícone da Vitrola na barra de tarefas do Windows, a miniatura exibe botões nativos integrados do Windows:
     - `[⏮ Voltar Faixa]`
     - `[⏯ Pausar / Tocar]`
     - `[⏭ Passar pra Frente]`

---

## 2. Como Instalar no Windows

1. Dê um duplo-clique no arquivo:
   ```cmd
   instalar-vitrola.bat
   ```
2. O instalador irá:
   - Gerar os ícones de vinil de alta definição (`public/icon.ico` e `public/icon.png`).
   - Compilar os assets de produção.
   - Criar o atalho **Vitrola Hi-Fi** na Área de Trabalho com o ícone do vinil.
   - Criar a pasta no Menu Iniciar.
   - Registrar no Windows.
3. Para abrir a qualquer momento:
   - Dê dois cliques no ícone **Vitrola Hi-Fi** na sua Área de Trabalho.
   - Ou pesquise **Vitrola** no Menu Iniciar do Windows.

---

## 3. Como Usar o Widget no Dock do Windows

- **Pelo Teclado**: Pressione a tecla **`D`** a qualquer momento para abrir ou fechar o Widget Dock.
- **Pela Interface**: Clique no botão **"Modo Dock"** (com ícone de vinil) no canto superior direito do console.
- **Ao Minimizar**: Clicar no botão de minimizar (`-`) abre automaticamente o Widget Dock no desktop.
- **Para Encaixar no Dock**: Clique no ícone de âncora (**⚓**) para que o widget se posicione imediatamente no centro inferior da tela, colado na barra de tarefas/dock do Windows.
- **Para Mover**: Clique e arraste o widget para onde preferir.
