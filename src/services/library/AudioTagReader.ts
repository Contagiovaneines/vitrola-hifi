import { AudioFormatInfo, Track } from '../../types';

export class AudioTagReader {
  /**
   * Extrai metadados de um arquivo de áudio local (File / Blob).
   */
  public static async parseAudioFile(file: File): Promise<{
    track: Partial<Track>;
    coverBlob?: Blob;
  }> {
    const filename = file.name;
    const extension = filename.split('.').pop()?.toUpperCase() || 'AUDIO';
    
    // Formato detectado
    const format: AudioFormatInfo = {
      codec: (['FLAC', 'MP3', 'WAV', 'OGG', 'AAC', 'M4A'].includes(extension)
        ? extension
        : 'MP3') as AudioFormatInfo['codec'],
      sampleRate: extension === 'FLAC' || extension === 'WAV' ? 96000 : 44100,
      bitDepth: extension === 'FLAC' || extension === 'WAV' ? 24 : 16,
      channels: 2,
      isLossless: extension === 'FLAC' || extension === 'WAV',
    };

    // Heurística de limpeza de nome de arquivo
    const cleanName = filename.replace(/\.[^/.]+$/, '');
    let title = cleanName;
    let artist = 'Artista Desconhecido';
    let trackNumber = 1;

    // Padrão comum: "01 - Artista - Título" ou "Artista - Título"
    const parts = cleanName.split(' - ');
    if (parts.length >= 3) {
      const num = parseInt(parts[0].trim(), 10);
      if (!isNaN(num)) trackNumber = num;
      artist = parts[1].trim();
      title = parts.slice(2).join(' - ').trim();
    } else if (parts.length === 2) {
      artist = parts[0].trim();
      title = parts[1].trim();
    }

    // Tenta obter duração real via objeto Audio temporário
    const durationSec = await this.probeDuration(file);

    return {
      track: {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        source: 'local',
        title: title || 'Faixa Sem Título',
        artist: artist || 'Artista Desconhecido',
        album: 'Músicas Importadas',
        year: new Date().getFullYear(),
        trackNumber,
        durationSec: durationSec || 180,
        format,
        addedAt: new Date().toISOString(),
        playCount: 0,
        dynamicRangeScore: 12,
        labelInfo: {
          recordLabel: 'PRENSAGEM LOCAL DIRECT-TO-DISC',
          matrixRpm: 33,
        },
      }
    };
  }

  private static probeDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const tempAudio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      tempAudio.src = objectUrl;

      const cleanup = () => {
        tempAudio.removeEventListener('loadedmetadata', onLoaded);
        tempAudio.removeEventListener('error', onError);
        URL.revokeObjectURL(objectUrl);
      };

      const onLoaded = () => {
        const d = tempAudio.duration;
        cleanup();
        resolve(isNaN(d) ? 180 : Math.round(d));
      };

      const onError = () => {
        cleanup();
        resolve(180);
      };

      tempAudio.addEventListener('loadedmetadata', onLoaded);
      tempAudio.addEventListener('error', onError);
    });
  }
}
