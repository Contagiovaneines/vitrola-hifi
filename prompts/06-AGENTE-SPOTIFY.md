# 06 — Agente Spotify

Leia handoffs e revalide documentação oficial atual do Spotify. Implemente integração separada da local somente se credenciais de desenvolvimento e conta de teste estiverem disponíveis. OAuth Authorization Code + PKCE, escopos mínimos, retorno seguro ao app, refresh/revogação e desconexão. Nunca colocar client secret no binário nem pedir senha Spotify dentro da Vitrola. Web Playback SDK requer Premium; configurar WebView2/EME e origem/redirect conforme suporte oficial. Se SDK não funcionar no WebView2, oferecer controle remoto do Spotify Connect pelo caminho oficial e registrar essa diferença na interface.

Buscar biblioteca/playlist e controlar reprodução só dentro das capacidades permitidas; erros 401, 403, 429, ausência de dispositivo e conta sem Premium devem ter mensagens específicas. Não aplicar equalizador, alteração de áudio, gravação ou cache ao conteúdo Spotify. Badge Spotify e dados de reprodução devem refletir sessão real.

Se não houver conta/configuração para validar, entregar tela de conexão e adaptador com estados reais documentados, `docs/06-spotify-config.md` com passos para registrar o app; não declarar streaming concluído. Escreva `docs/handoff/06.md` com evidências e pendências.
