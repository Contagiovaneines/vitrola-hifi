# 10 — Agente testes

Execute casos reais: importar pasta com faixas válidas e inválidas; tocar, pausar, seek, fila, volume, playlist, reiniciar, remover arquivo, trocar tema, abrir mini player, desconectar fornecedor, ficar offline. Verifique atalhos e navegação por teclado. Teste 1366×768 e 1920×1080, escala Windows 125%/150%, e pausa/retomada do SO. Teste provedores externos só com contas disponíveis e registre explicitamente o que não foi validado.

Adicione testes automatizados apenas para riscos relevantes: indexação, persistência, máquina de estados e capacidades de providers. Rode build e suíte. Em Windows, teste instalador em ambiente limpo e cheque WebView2. Produza `docs/10-testes.md` com comandos, resultados, evidências e bugs; corrigir bugs encontrados e repetir casos afetados. Escreva `docs/handoff/10.md`.
