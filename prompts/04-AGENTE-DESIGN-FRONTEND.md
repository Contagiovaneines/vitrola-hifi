# 04 — Agente design/frontend

Leia 01–03 e handoffs. Crie o projeto Tauri + React + TypeScript + Vite conforme arquitetura, com rotas Início, Biblioteca, Playlists, Fontes e Aparência. Reaproveite o Stitch como referência visual, sem colar HTML monolítico ou carregar scripts de CDN em produção. Organize tokens e componentes: WindowHeader, Sidebar, Turntable, Tonearm, Vinyl, Transport, TrackReadout, LibraryGrid, SourceBadge, ThemePreview, MiniPlayer. Substitua imagens remotas por assets locais próprios/licenciados ou placeholders identificados.

A vitrola deve ter disco animado apenas em `playing`, braço em repouso/posição de reprodução, progress bar acessível, estados de foco/teclado, contraste e preferência `prefers-reduced-motion`. Respeite proporção em 1366×768 e 1920×1080. Leia cores do DESIGN.md (`#161311`, `#E0A96D`, `#F59E0B`) e fontes indicadas Syne/Plus Jakarta Sans/Space Mono, com fallback local. Preserve sensação de console hi-fi, mas dê tamanho legível a controles. Não exibir ASIO, bit depth, FLAC ou VU como fatos de demonstração.

Pode usar estado de demonstração claramente sinalizado nesta etapa. Adicione instruções `npm install`, `npm run dev`, `npm run build` no README. Gere capturas ou registre revisão visual. Escreva `docs/handoff/04.md`. Aceite: navegação real, componentes separados, sem erros TS, sem controles mortos aparentando funcionar.
