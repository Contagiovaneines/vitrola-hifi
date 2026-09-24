/**
 * SpotifyAuth - Fluxo de Autorização OAuth 2.0 com PKCE
 * Em estrita conformidade com as diretrizes oficiais de segurança do Spotify:
 * - Sem Client Secret no frontend
 * - Geração criptográfica segura de Code Verifier e Code Challenge (SHA-256)
 * - Escopos mínimos para reprodução e leitura de estado
 */

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export class SpotifyAuth {
  private static readonly SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  private static readonly SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
  private static readonly SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
  ];

  private static readonly STORAGE_KEYS = {
    CLIENT_ID: 'vitrola_spotify_client_id',
    ACCESS_TOKEN: 'vitrola_spotify_access_token',
    REFRESH_TOKEN: 'vitrola_spotify_refresh_token',
    EXPIRES_AT: 'vitrola_spotify_expires_at',
    CODE_VERIFIER: 'vitrola_spotify_code_verifier',
  };

  /**
   * Armazena ou recupera o Client ID configurado pelo usuário.
   */
  public static getClientId(): string {
    return localStorage.getItem(this.STORAGE_KEYS.CLIENT_ID) || '';
  }

  public static setClientId(clientId: string): void {
    localStorage.setItem(this.STORAGE_KEYS.CLIENT_ID, clientId.trim());
  }

  /**
   * Inicia o fluxo de autorização no navegador/webview.
   */
  public static async initiateAuthFlow(redirectUri: string): Promise<string> {
    const clientId = this.getClientId();
    if (!clientId) {
      throw new Error('Client ID do Spotify não configurado.');
    }

    const verifier = this.generateRandomString(64);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem(this.STORAGE_KEYS.CODE_VERIFIER, verifier);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      scope: this.SCOPES.join(' '),
    });

    return `${this.SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
  }

  /**
   * Troca o authorization code pelo access token e refresh token.
   */
  public static async handleCallback(code: string, redirectUri: string): Promise<SpotifyTokenResponse> {
    const clientId = this.getClientId();
    const verifier = localStorage.getItem(this.STORAGE_KEYS.CODE_VERIFIER);

    if (!clientId || !verifier) {
      throw new Error('Sessão de autorização inválida ou expirada.');
    }

    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    });

    const response = await fetch(this.SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error_description || 'Falha ao autenticar no Spotify.');
    }

    const data: SpotifyTokenResponse = await response.json();
    this.saveTokens(data);
    localStorage.removeItem(this.STORAGE_KEYS.CODE_VERIFIER);
    return data;
  }

  /**
   * Renova o token expirado usando o refresh token.
   */
  public static async refreshToken(): Promise<string> {
    const clientId = this.getClientId();
    const refreshToken = localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);

    if (!clientId || !refreshToken) {
      throw new Error('Refresh token não encontrado.');
    }

    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await fetch(this.SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      this.disconnect();
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const data = await response.json();
    this.saveTokens(data);
    return data.access_token;
  }

  public static getValidAccessToken(): string | null {
    const token = localStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAt = Number(localStorage.getItem(this.STORAGE_KEYS.EXPIRES_AT) || 0);

    if (!token) return null;
    if (Date.now() >= expiresAt - 60000) {
      // Expirou ou expira em menos de 1 minuto
      return null;
    }
    return token;
  }

  public static isConnected(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  public static disconnect(): void {
    localStorage.removeItem(this.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.EXPIRES_AT);
    localStorage.removeItem(this.STORAGE_KEYS.CODE_VERIFIER);
  }

  private static saveTokens(data: Partial<SpotifyTokenResponse>): void {
    if (data.access_token) {
      localStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
    }
    if (data.expires_in) {
      const expiresAt = Date.now() + data.expires_in * 1000;
      localStorage.setItem(this.STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
    }
  }

  private static generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  private static async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
