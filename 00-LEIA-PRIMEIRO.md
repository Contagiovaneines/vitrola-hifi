# Vitrola — execução dos agentes

Coloque esta pasta e o arquivo `stitch_vitrola_retro_desktop_player.zip` na raiz de um repositório novo. Extraia o ZIP em `referencias/stitch/`. Execute os prompts de 01 a 11 **um por vez**, em sessões de agente separadas. Cada agente deve ler o resultado do anterior e o código real do repositório. Não avance se o critério de aceite do estágio falhar. O agente 01 não modifica o produto; o 02 planeja; o 03 define a execução; do 04 em diante há código.

## Visão
Aplicativo Windows chamado Vitrola. A referência visual é o ZIP Stitch: `code.html`, `screen.png` e `DESIGN.md`. Primeira entrega realmente funcional: arquivos locais, biblioteca, playlists, reprodução, vitrola animada, temas e mini player. Integrações externas são adaptadores independentes, sujeitos às APIs e contas. Não simular streaming, qualidade de áudio ou serviço conectado. Sem backend ou banco remoto na primeira versão.

## Contrato de passagem
Ao terminar, cada agente escreve `docs/handoff/NN.md` com: objetivo, arquivos alterados, decisões, comandos/testes e resultados, riscos e próximos passos. Nunca apagar o handoff anterior. Se uma etapa travar, registrar o bloqueio e entregar o que for possível, sem afirmar conclusão.

## Regras globais
- Stack alvo: Tauri 2 + React + TypeScript + Vite; Rust para acesso ao sistema de arquivos e ponte nativa; persistência local SQLite, se justificada pelo agente 02. Use versões estáveis verificadas na instalação, sem números fixados por palpite.
- Segurança: escopo mínimo de permissões Tauri, sem segredos no frontend ou no git; OAuth Authorization Code com PKCE e token em armazenamento seguro do SO quando possível.
- Respeitar direitos e APIs oficiais; sem baixar faixas protegidas, interceptar áudio de outros apps, usar endpoints privados ou contornar DRM.
- Separar visualização, estado de reprodução e provedores. Um `PlaybackProvider` por fonte com capacidades explícitas. Controles indisponíveis ficam desabilitados com motivo visível.
- Tests úteis para indexação, estado e fluxos; revisão visual das quatro telas. Não usar dados fictícios como se fossem telemetria real.
- Fazer commits por estágio se houver git; não publicar, cadastrar aplicativos em serviços nem inserir credenciais pelo usuário.
