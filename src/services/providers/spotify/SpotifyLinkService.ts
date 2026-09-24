import { Album, Track } from '../../../types/index';
import { SpotifyAuth } from './SpotifyAuth';

export interface ParsedSpotifyLink {
  type: 'track' | 'album';
  id: string;
  originalUrl: string;
}

export interface SpotifyImportResult {
  type: 'track' | 'album';
  track?: Track;
  album?: Album;
  tracks: Track[];
  message: string;
}

export class SpotifyLinkService {
  /**
   * Expressões regulares seguras para validação e extração de IDs Base62 (22 caracteres alfanuméricos)
   */
  private static readonly TRACK_REGEX =
    /(?:spotify:track:|open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/)([a-zA-Z0-9]{22})/i;
  private static readonly ALBUM_REGEX =
    /(?:spotify:album:|open\.spotify\.com\/(?:intl-[a-z]{2}\/)?album\/)([a-zA-Z0-9]{22})/i;

  /**
   * Valida se a string é uma URL ou URI válida do Spotify e extrai o tipo e o ID.
   */
  public static parseLink(rawInput: string): ParsedSpotifyLink {
    const input = (rawInput || '').trim();

    if (!input) {
      throw new Error('Por favor, informe um link ou URI do Spotify.');
    }

    const trackMatch = input.match(this.TRACK_REGEX);
    if (trackMatch && trackMatch[1]) {
      return {
        type: 'track',
        id: trackMatch[1],
        originalUrl: `https://open.spotify.com/track/${trackMatch[1]}`,
      };
    }

    const albumMatch = input.match(this.ALBUM_REGEX);
    if (albumMatch && albumMatch[1]) {
      return {
        type: 'album',
        id: albumMatch[1],
        originalUrl: `https://open.spotify.com/album/${albumMatch[1]}`,
      };
    }

    throw new Error(
      'Formato de link do Spotify inválido. Utilize URLs como open.spotify.com/track/... ou open.spotify.com/album/...'
    );
  }

  /**
   * Consulta os endpoints oficiais do Spotify para extrair os metadados completos.
   * Utiliza a Spotify Web API oficial quando autenticado via OAuth;
   * Se não houver token, utiliza a API oEmbed oficial do Spotify com fallback seguro.
   */
  public static async fetchMetadata(parsed: ParsedSpotifyLink): Promise<SpotifyImportResult> {
    const token = SpotifyAuth.getValidAccessToken();

    if (token) {
      try {
        if (parsed.type === 'track') {
          return await this.fetchTrackFromWebApi(parsed.id, token);
        } else {
          return await this.fetchAlbumFromWebApi(parsed.id, token);
        }
      } catch (err) {
        console.warn('Falha na Spotify Web API autenticada, tentando fallback oEmbed:', err);
        // Fallback para oEmbed se o token falhar
      }
    }

    // Fallback público via Spotify oEmbed API (não exige token)
    return await this.fetchFromOEmbed(parsed);
  }

  /**
   * Consulta GET https://api.spotify.com/v1/tracks/{id}
   */
  private static async fetchTrackFromWebApi(id: string, token: string): Promise<SpotifyImportResult> {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      await this.handleHttpError(res);
    }

    const data = await res.json();
    const coverUrl = data.album?.images?.[0]?.url || data.album?.images?.[1]?.url;
    const artistName = (data.artists || []).map((a: { name: string }) => a.name).join(', ') || 'Artista Spotify';
    const albumName = data.album?.name || 'Single / Spotify';
    const durationSec = Math.round((data.duration_ms || 180000) / 1000);

    const track: Track = {
      id: `spotify-track-${id}`,
      source: 'spotify',
      title: data.name,
      artist: artistName,
      album: albumName,
      durationSec,
      uri: data.uri || `spotify:track:${id}`,
      coverUri: coverUrl,
      format: {
        codec: 'AAC',
        sampleRate: 44100,
        bitDepth: 16,
        channels: 2,
        isLossless: false,
      },
      addedAt: new Date().toISOString(),
      playCount: 0,
      labelInfo: {
        recordLabel: data.album?.label || 'SPOTIFY DIRECT MASTER',
        matrixRpm: 33,
        catalogNumber: `SPT-${id.slice(0, 8).toUpperCase()}`,
      },
    };

    const singleAlbum: Album = {
      id: `spotify-single-${id}`,
      title: `${data.name} (Single)`,
      artist: artistName,
      year: data.album?.release_date ? parseInt(data.album.release_date.slice(0, 4), 10) : new Date().getFullYear(),
      coverUri: coverUrl,
      trackCount: 1,
      totalDurationSec: durationSec,
      tracks: [track],
      isHiRes: false,
      source: 'spotify',
    };

    return {
      type: 'track',
      track,
      album: singleAlbum,
      tracks: [track],
      message: `Faixa "${track.title}" importada com sucesso do Spotify.`,
    };
  }

  /**
   * Consulta GET https://api.spotify.com/v1/albums/{id}
   */
  private static async fetchAlbumFromWebApi(id: string, token: string): Promise<SpotifyImportResult> {
    const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      await this.handleHttpError(res);
    }

    const data = await res.json();
    const coverUrl = data.images?.[0]?.url || data.images?.[1]?.url;
    const albumArtist = (data.artists || []).map((a: { name: string }) => a.name).join(', ') || 'Vários Artistas';
    const releaseYear = data.release_date ? parseInt(data.release_date.slice(0, 4), 10) : new Date().getFullYear();

    const items = data.tracks?.items || [];
    const tracks: Track[] = items.map((t: { id: string; name: string; artists: { name: string }[]; duration_ms: number; uri: string; track_number: number }) => ({
      id: `spotify-track-${t.id || Math.random().toString(36).slice(2)}`,
      source: 'spotify' as const,
      title: t.name,
      artist: (t.artists || []).map((a) => a.name).join(', ') || albumArtist,
      album: data.name,
      trackNumber: t.track_number,
      durationSec: Math.round((t.duration_ms || 180000) / 1000),
      uri: t.uri || `spotify:track:${t.id}`,
      coverUri: coverUrl,
      format: {
        codec: 'AAC' as const,
        sampleRate: 44100,
        bitDepth: 16,
        channels: 2 as const,
        isLossless: false,
      },
      addedAt: new Date().toISOString(),
      playCount: 0,
      labelInfo: {
        recordLabel: data.label || 'SPOTIFY DIRECT MASTER',
        matrixRpm: 33 as const,
        catalogNumber: `SPT-${id.slice(0, 8).toUpperCase()}`,
      },
    }));

    const album: Album = {
      id: `spotify-album-${id}`,
      title: data.name,
      artist: albumArtist,
      year: releaseYear,
      coverUri: coverUrl,
      trackCount: tracks.length,
      totalDurationSec: tracks.reduce((acc, t) => acc + t.durationSec, 0),
      tracks,
      isHiRes: false,
      source: 'spotify',
    };

    return {
      type: 'album',
      album,
      tracks,
      message: `Álbum "${album.title}" importado com ${tracks.length} faixas do Spotify.`,
    };
  }

  /**
   * Consulta pública e oficial via Spotify oEmbed API (não requer OAuth token)
   */
  private static async fetchFromOEmbed(parsed: ParsedSpotifyLink): Promise<SpotifyImportResult> {
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(parsed.originalUrl)}`;
    const res = await fetch(oembedUrl);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Conteúdo não encontrado ou indisponível no Spotify.');
      }
      throw new Error(`Falha ao obter metadados do Spotify (Status ${res.status}).`);
    }

    const data = await res.json();
    const coverUrl = data.thumbnail_url;
    const rawTitle = data.title || (parsed.type === 'album' ? 'Álbum Spotify' : 'Faixa Spotify');

    // Tenta separar "Título - Artista" se houver hífen
    let title = rawTitle;
    let artist = 'Artista Spotify';
    if (rawTitle.includes(' - ')) {
      const parts = rawTitle.split(' - ');
      title = parts[0].trim();
      artist = parts.slice(1).join(' - ').trim();
    }

    const durationSec = 210;

    const track: Track = {
      id: `spotify-track-${parsed.id}`,
      source: 'spotify',
      title: parsed.type === 'track' ? title : `${title} (Faixa 1)`,
      artist: artist,
      album: title,
      durationSec,
      uri: `spotify:${parsed.type}:${parsed.id}`,
      coverUri: coverUrl,
      format: {
        codec: 'AAC',
        sampleRate: 44100,
        bitDepth: 16,
        channels: 2,
        isLossless: false,
      },
      addedAt: new Date().toISOString(),
      playCount: 0,
      labelInfo: {
        recordLabel: 'SPOTIFY OFFICIAL STREAM',
        matrixRpm: 33,
        catalogNumber: `SPT-${parsed.id.slice(0, 8).toUpperCase()}`,
      },
    };

    const album: Album = {
      id: `spotify-${parsed.type}-${parsed.id}`,
      title,
      artist,
      year: new Date().getFullYear(),
      coverUri: coverUrl,
      trackCount: 1,
      totalDurationSec: durationSec,
      tracks: [track],
      isHiRes: false,
      source: 'spotify',
    };

    return {
      type: parsed.type,
      track,
      album,
      tracks: [track],
      message: `${parsed.type === 'album' ? 'Álbum' : 'Faixa'} "${title}" adicionado(a) à biblioteca.`,
    };
  }

  private static async handleHttpError(res: Response): Promise<void> {
    if (res.status === 401) {
      throw new Error('Autenticação expirada no Spotify. Por favor, reconecte sua conta em Fontes.');
    }
    if (res.status === 403) {
      throw new Error('Acesso não autorizado pelo Spotify.');
    }
    if (res.status === 404) {
      throw new Error('Faixa ou álbum não encontrado no Spotify. Verifique o link informado.');
    }
    if (res.status === 429) {
      throw new Error('Limite de requisições excedido temporariamente (Spotify Rate Limit). Tente novamente em alguns segundos.');
    }
    throw new Error(`Erro na API do Spotify (${res.status}): ${res.statusText}`);
  }
}
