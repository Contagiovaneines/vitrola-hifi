import { Album, Playlist, Track } from '../types';

/**
 * Biblioteca limpa e sem dados mocados fictícios.
 * As faixas, álbuns e playlists passam a ser exclusivamente povoadas por arquivos reais
 * importados pelo usuário ou consultados diretamente nas APIs oficiais (Deezer/Spotify/YouTube).
 */
export const initialTracks: Track[] = [];

export const initialAlbums: Album[] = [];

export const initialPlaylists: Playlist[] = [];
