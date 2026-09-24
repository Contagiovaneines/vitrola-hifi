# Vitrola — Hi-Fi Turntable Desktop Console

Console de alta fidelidade para Windows com estética retro de toca-discos analógico dos anos 1970 (madeira nobre, latão usinado, iluminação âmbar de filamento e medidores VU balísticos).

---

## 🎵 Visão e Recursos Principais
- **Local-First:** Prioridade absoluta para reprodução bit-perfect de arquivos locais (FLAC, MP3, WAV, OGG, AAC/M4A) sem depender de conexões externas.
- **Toca-Discos Tátil Animado:** Disco de vinil com micro-ranhuras e rotação física (33⅓ e 45 RPM) acoplada estritamente ao estado de reprodução (`playing`); braço mecânico articulado com agulha fonocaptora iluminada e elevação hidráulica (Cue).
- **Medidores VU Balísticos:** Monitoramento estéreo de canal esquerdo e direito (L/R) calibrado em dBFS com balística analógica autêntica.
- **Equalizador & Pré-Amplificador Analógico:** Potenciômetros recartilhados para Graves (Bass), Agudos (Treble), Saturação Valvular Harmônica (Tubo Sat) e Volume Master.
- **Estante de Vinis (Crate Digging):** Visualização em estante, caixote inclinado ou lista detalhada, com capas em papelão envelhecido e efeito realista de saída do disco no hover.
- **Ateliê de Customização:** 3 temas mestres (*Madeira Clássica*, *Preto & Ouro 24K*, *Neon Moderno*) com opções de madeiras (Mogno, Carvalho, Nogueira, Bambu), metais (Latão, Cobre, Cromo, Ouro) e tecidos de grelha acústica.
- **Mini Player & Widget Flutuante:** Janela compacta e gadget de área de trabalho com mini disco giratório e controles essenciais.
- **Modo Tela Cheia (Audiophile Theatre):** Interface OSD imersiva com telemetria valvular e iluminação de sala de audição.
- **Integração Windows SMTC:** Controle via teclas multimídia do teclado e painel de mídia do Windows 10/11.

---

## 🚀 Requisitos e Instalação

### Pré-requisitos:
- **Sistema Operacional:** Windows 10 ou Windows 11 (64-bit)
- **Node.js:** Versão LTS (v20+ ou v24+ recomendada)
- **Microsoft Edge WebView2 Runtime:** Instalado por padrão no Windows 10/11

### Comandos de Execução:

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```
Acesse a aplicação no navegador em `http://localhost:5173`.

3. **Compilar para produção:**
```bash
npm run build
```
Os artefatos otimizados serão gerados no diretório `dist/`.

4. **Pré-visualizar o build de produção:**
```bash
npm run preview
```

---

## 📁 Estrutura do Projeto
```
vitrola/
├── src/
│   ├── assets/           # Logotipo vetorial e ícones
│   ├── components/
│   │   ├── layout/       # WindowHeader, Sidebar, MainLayout
│   │   ├── player/       # Turntable, Tonearm, VinylDisc, VU Meters, Knobs
│   │   └── widget/       # MiniPlayerWidget
│   ├── data/             # Coleção mock inicial e metadados
│   ├── services/         # Motores de áudio e provedores
│   ├── store/            # Gerenciamento de estado
│   ├── types/            # Contratos de domínio TypeScript
│   ├── views/            # PlayerView, LibraryView, CustomizationView, etc.
│   ├── App.tsx           # Orquestrador de rotas e estado
│   ├── index.css         # Tokens de tema e física de animações
│   └── main.tsx          # Ponto de entrada
├── docs/                 # Handoffs e documentação técnica de engenharia
└── referencias/stitch/   # Ativos e diretrizes visuais do Stitch
```
