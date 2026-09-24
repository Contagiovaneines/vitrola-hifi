# 05 — Agente player local

Leia projeto e handoffs 01–04. Implemente seleção de pastas locais via diálogo nativo, indexação incremental, metadados/capas, biblioteca persistente, busca, filtros, fila e playlists locais. Use os módulos e permissões definidos na arquitetura. Proteja contra arquivos indisponíveis, metadados inválidos, nomes repetidos e pasta removida. Não copiar as músicas sem necessidade.

Implemente `LocalPlaybackProvider`: play/pause, seek, anterior/próxima, volume, mute, repeat/shuffle; atualizar título, capa, duração, progresso, rotação e braço pelo estado real. Limpar recursos ao trocar faixa; preservar último volume e tema. Se a engine escolhida não suportar certo codec, indicar erro amigável e registrar compatibilidade comprovada no README. Implementar atalhos de teclado e integração com controles de mídia do Windows se tecnicamente viável; documentar eventual pendência.

Verifique com arquivos de teste próprios/licenciados: primeira música, faixa seguinte, seek, pausa, reinício do app, arquivo faltante. Teste lógica de indexação e transições. Escreva `docs/handoff/05.md`. Aceite: música local audível e controlável no Windows, estado da UI sincronizado; se sem Windows, declarar explicitamente limite da validação.
