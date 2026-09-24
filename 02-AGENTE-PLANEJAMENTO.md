# 02 — Agente arquiteto

Leia `docs/01-analise.md`, o ZIP extraído e `docs/handoff/01.md`. Defina arquitetura de um app Windows local-first. Produza `docs/02-arquitetura.md` com: diagrama curto de módulos, interfaces TypeScript de Track/Album/Playlist/ProviderCapabilities/PlaybackProvider e fluxo de eventos de player; fronteira Tauri/Rust; persistência e migração; diretórios monitorados, cache de capas e tratamento de arquivo movido; segurança de tokens; controle de erro.

Fases: A shell visual, B biblioteca local e playback, C mini player e temas, D Spotify com conta Premium e OAuth, E prova de capacidade Deezer/YouTube, F empacotamento. Priorize MVP A–C. Defina formatos locais previstos (MP3, FLAC, WAV, M4A conforme suporte real da tecnologia escolhida), sem prometer codec não testado. Defina estratégias de Windows media controls, dispositivos de áudio e VU meter; VU verdadeiro apenas se houver medição de PCM legítima. Para streaming, painel decorativo claramente rotulado ou oculto se sem sinal.

Escreva `docs/handoff/02.md`. Aceite: arquitetura permite fonte local funcional sem serviços externos, contratos deixam capacidades distintas por fonte, dependências e riscos documentados.
