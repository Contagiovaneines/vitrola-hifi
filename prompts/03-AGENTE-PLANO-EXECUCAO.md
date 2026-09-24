# 03 — Agente de execução

Leia documentos 01–02 e handoffs. Produza `docs/03-plano-execucao.md` como backlog ordenado de pequenas tarefas para os estágios 04–11. Cada tarefa precisa de entrada, arquivos prováveis, resultado observável, comando de verificação e dependência. Defina marcos de demonstração: interface navegável, primeira música local, biblioteca reiniciada sem perda, mini player, Spotify, instalador.

Defina critérios de aceite por tela e estados de carregando, vazio, erro e desconectado. Estabeleça matriz de teste para 1366×768, 1920×1080 e escala Windows 125%/150%. Liste pré-requisitos de Windows: Node LTS, Rust/MSVC C++ Build Tools, WebView2, Tauri CLI; verificar versões atuais antes de instalar. O projeto deve compilar em Windows; ambiente Linux pode validar frontend e lógica, mas não declarar instalador Windows testado.

Escreva `docs/handoff/03.md`. Aceite: plano suficientemente concreto para outro agente executar sem decisões arquiteturais grandes.
