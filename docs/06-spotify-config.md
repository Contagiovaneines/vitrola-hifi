# Guia de Configuração: Integração Spotify no Vitrola

**Data:** 24 de setembro de 2026  
**Documento de Referência:** `06-AGENTE-SPOTIFY.md`

Este documento orienta o usuário/desenvolvedor sobre como registrar a aplicação Vitrola no Spotify Developer Dashboard e habilitar o controle de reprodução e streaming.

---

## 1. Princípios de Segurança e Privacidade
- **Nunca insira o Client Secret** no Vitrola. O Vitrola utiliza o fluxo oficial **OAuth 2.0 Authorization Code com PKCE (Proof Key for Code Exchange)**, projetado especificamente para aplicações desktop e webviews seguras.
- O Vitrola nunca solicita e nunca terá acesso à sua senha da conta Spotify.
- Tokens de acesso temporários são armazenados localmente e renovados automaticamente.

---

## 2. Passo a Passo para Criar o Aplicativo no Spotify

1. Acesse o **Spotify Developer Dashboard**:  
   👉 [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Faça login com sua conta Spotify habitual.
3. Clique no botão **"Create App"**.
4. Preencha os campos básicos:
   - **App Name:** `Vitrola Desktop Player`
   - **App Description:** `Retro Hi-Fi Turntable Music Player para Windows`
   - **Redirect URIs:** Adicione exatamente:
     - `http://localhost:5173/callback` (para modo desenvolvimento Vite)
     - `tauri://localhost/callback` ou `vitrola://callback` (para modo desktop nativo)
   - **Which API/SDKs are you planning to use?**
     - Selecione: `Web API` e `Web Playback SDK`.
5. Aceite os Termos de Serviço do Spotify Developer e clique em **"Save"**.
6. Na página do seu app recém-criado, localize e copie o **Client ID** (uma sequência alfanumérica de 32 caracteres).

---

## 3. Configuração no Vitrola

1. Abra o Vitrola e navegue até a aba **"Fontes"** (menu lateral ou tecla `4`).
2. No cartão **"Spotify Connect & SDK"**, insira o seu **Client ID**.
3. Clique em **"Conectar com Spotify"**.
4. Uma janela segura do navegador abrirá a página oficial de autorização do Spotify solicitando aprovação para os escopos:
   - `streaming` (reprodução de áudio)
   - `user-read-email` e `user-read-private` (identificação da conta)
   - `user-read-playback-state` e `user-modify-playback-state` (controle de reprodução)
5. Após autorizar, o retorno automático salvará o token de acesso no Vitrola.

---

## 4. Requisitos e Limitações Conhecidas

| Recurso | Requisito de Conta | Comportamento no Vitrola |
|---|---|---|
| **Spotify Connect (Controle Remoto)** | Spotify Free ou Premium | Permite selecionar faixas, pausar e pular músicas em qualquer player Spotify ativo. |
| **Web Playback SDK (Streaming Direto)** | **Spotify Premium Obrigatório** | Permite que o áudio toque diretamente dentro do motor do Vitrola. Contas sem Premium recebem erro `403 Forbidden`. |
| **Acesso ao fluxo PCM para VU Meter** | Indisponível | Devido à proteção de DRM (Widevine/EME), o Spotify não permite acesso aos dados brutos de PCM. As agulhas dos medidores VU ficam em repouso no modo Spotify. |
| **Equalização e Modulação de RPM** | Indisponível | Os filtros de 33/45 RPM e saturação analógica do Vitrola não se aplicam a streams externos do Spotify, em conformidade com as regras de integridade de áudio da plataforma. |
