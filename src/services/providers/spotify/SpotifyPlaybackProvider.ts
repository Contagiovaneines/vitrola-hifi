import {
  AudioSourceType,
  PlaybackProvider,
  ProviderCapabilities,
  Track
} from '../../../types';
import { SpotifyAuth } from './SpotifyAuth';

export class SpotifyPlaybackProvider implements PlaybackProvider {
  public readonly id: AudioSourceType = 'spotify';
  public readonly name: string = 'Spotify HiFi Connect';
  public readonly capabilities: ProviderCapabilities = {
    canSeek: true,
    canAdjustSpeedPitch: false, // Streams de terceiros não suportam modulação mecânica de velocidade
    canReadPCM: false,          // Não há acesso a fluxo bruto de PCM de conteúdo protegido por DRM
    canExtractCoverArt: true,
    canRepeat: true,
    canShuffle: true,
    hasTrackDuration: true,
    isOfflineCapable: false,
    isFullTrackAvailable: true,
    restrictionsNotice: 'Requer conta Spotify Premium ativa para streaming direto.'
  };

  private activeDeviceId: string | null = null;

  public async initialize(): Promise<void> {
    if (!SpotifyAuth.isConnected()) {
      throw new Error('Spotify não conectado. Faça login nas configurações de Fontes.');
    }
  }

  public async loadTrack(track: Track): Promise<void> {
    const token = await this.getAccessToken();
    const uri = track.uri || `spotify:track:${track.id}`;

    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    });

    if (!res.ok) {
      await this.handleApiError(res);
    }
  }

  public async play(): Promise<void> {
    const token = await this.getAccessToken();
    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) await this.handleApiError(res);
  }

  public async pause(): Promise<void> {
    const token = await this.getAccessToken();
    const res = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) await this.handleApiError(res);
  }

  public async seek(positionSec: number): Promise<void> {
    const token = await this.getAccessToken();
    const posMs = Math.round(positionSec * 1000);
    const res = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${posMs}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) await this.handleApiError(res);
  }

  public setVolume(volume: number): void {
    // Spotify API volume: 0 a 100
    const volPercent = Math.round(volume * 100);
    this.getAccessToken().then((token) => {
      fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volPercent}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      }).catch((e) => console.warn('Falha ao ajustar volume Spotify:', e));
    });
  }

  public setSpeedPitch(): void {
    // Não suportado no Spotify por proteção de DRM
  }

  public async stop(): Promise<void> {
    await this.pause();
  }

  public async destroy(): Promise<void> {}

  private async getAccessToken(): Promise<string> {
    let token = SpotifyAuth.getValidAccessToken();
    if (!token) {
      token = await SpotifyAuth.refreshToken();
    }
    return token;
  }

  private async handleApiError(res: Response): Promise<void> {
    if (res.status === 401) {
      await SpotifyAuth.refreshToken();
      throw new Error('Sessão expirada. Token renovado.');
    } else if (res.status === 403) {
      throw new Error('Ação não autorizada. Verifique se sua conta possui Spotify Premium ativo.');
    } else if (res.status === 404) {
      throw new Error('Nenhum dispositivo Spotify ativo. Abra o Spotify em seu computador ou celular.');
    } else if (res.status === 429) {
      throw new Error('Limite de chamadas atingido temporariamente (Rate Limit Spotify).');
    } else {
      throw new Error(`Erro Spotify API (${res.status}): ${res.statusText}`);
    }
  }
}
