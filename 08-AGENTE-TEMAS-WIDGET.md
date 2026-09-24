# 08 — Agente temas e mini player

Leia handoffs. Implementar os temas Madeira Clássica, Preto e Dourado, Neon Moderno sobre os mesmos tokens, com persistência e contraste legível. Personalização deve prever cor de destaque, intensidade de iluminação e animação. Não copiar o design do protótipo em um tema genérico; manter disco e braço em todos.

Criar mini player em janela separada Tauri, ajustável, sempre no topo opcional, com capa, faixa, fonte e transportes suportados. Sincronizar com a janela principal por um único estado de reprodução, sem dois áudios simultâneos. Definir comportamento ao fechar janela principal, ícone na bandeja e encerramento do app. Registrar se a opção desejada de 'widget na área de trabalho' é uma janela flutuante; fixação dentro do desktop do Explorer exige outra implementação e deve ser avaliada separadamente.

Testar mover/redimensionar, escala 125%/150%, dois monitores, troca de tema e alternância de fonte. Escreva `docs/handoff/08.md`.
