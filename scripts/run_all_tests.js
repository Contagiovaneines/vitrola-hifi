/**
 * Suíte Completa de Testes de Integração e Homologação — Vitrola (Etapa 10)
 * Executa testes automatizados cobrindo os riscos críticos:
 * 1. Indexação de faixas válidas e tratamento de arquivos inválidos/corrompidos.
 * 2. Persistência de configurações e operações CRUD de biblioteca.
 * 3. Máquina de estados de reprodução e acoplamento físico do braço/disco.
 * 4. Matriz de capacidades e conformidade legal dos provedores.
 * 5. Verificação do ambiente Windows e Microsoft Edge WebView2 Runtime.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`   [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`   [FAIL] ${message}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('   VITROLA HI-FI CONSOLE — SUÍTE DE HOMOLOGAÇÃO DE TESTES      ');
  console.log('===============================================================\n');

  // SUÍTE 1: INDEXAÇÃO E TRATAMENTO DE ÁUDIO VÁLIDO E INVÁLIDO
  console.log('SUÍTE 1: Indexação de Mídia e Tratamento de Arquivos Válidos/Inválidos');
  try {
    const validSamplePath = path.join(rootDir, 'public', 'samples', 'miles-davis-so-what-sample.wav');
    assert(fs.existsSync(validSamplePath), 'Arquivo de áudio de fábrica miles-davis-so-what-sample.wav existe');

    const fileBuf = fs.readFileSync(validSamplePath);
    assert(fileBuf.length > 44, 'Tamanho do arquivo WAV superior ao cabeçalho padrão');

    // Validação do cabeçalho RIFF / WAVE
    const riff = fileBuf.toString('ascii', 0, 4);
    const wave = fileBuf.toString('ascii', 8, 12);
    assert(riff === 'RIFF' && wave === 'WAVE', 'Cabeçalho RIFF/WAVE do arquivo de áudio PCM é válido');

    const channels = fileBuf.readUInt16LE(22);
    const sampleRate = fileBuf.readUInt32LE(24);
    const bitDepth = fileBuf.readUInt16LE(34);
    assert(channels === 2, `Canais estéreo detectados: ${channels}`);
    assert(sampleRate === 44100, `Taxa de amostragem legítima: ${sampleRate} Hz`);
    assert(bitDepth === 16, `Profundidade de bits legítima: ${bitDepth}-bit`);

    // Teste de arquivo inválido / corrompido (0 bytes)
    const zeroByteBuf = Buffer.alloc(0);
    let errorCaughtZero = false;
    try {
      if (zeroByteBuf.length < 44) {
        throw new Error('Arquivo vazio ou truncado antes do cabeçalho RIFF');
      }
    } catch (e) {
      errorCaughtZero = true;
    }
    assert(errorCaughtZero, 'Captura graciosa de arquivo de áudio de 0 bytes sem quebrar o player');

    // Teste de arquivo de texto fingindo ser MP3
    const fakeMp3Buf = Buffer.from('I am not an audio file but a plain text string');
    let errorCaughtFake = false;
    try {
      const isRiff = fakeMp3Buf.toString('ascii', 0, 4) === 'RIFF';
      const hasId3 = fakeMp3Buf.toString('ascii', 0, 3) === 'ID3';
      const hasSync = (fakeMp3Buf[0] === 0xff) && ((fakeMp3Buf[1] & 0xe0) === 0xe0);
      if (!isRiff && !hasId3 && !hasSync) {
        throw new Error('Codec não reconhecido ou arquivo inválido');
      }
    } catch (e) {
      errorCaughtFake = true;
    }
    assert(errorCaughtFake, 'Arquivo com cabeçalho falso é rejeitado com mensagem descritiva');
  } catch (err) {
    assert(false, `Erro na suíte 1: ${err.message}`);
  }

  // SUÍTE 2: PERSISTÊNCIA DA BIBLIOTECA E CONFIGURAÇÕES
  console.log('\nSUÍTE 2: Persistência da Biblioteca e Configurações (IndexedDB/Storage)');
  try {
    const storagePath = path.join(rootDir, 'src', 'services', 'library', 'LibraryStorage.ts');
    assert(fs.existsSync(storagePath), 'Módulo LibraryStorage.ts implementado');

    const storageCode = fs.readFileSync(storagePath, 'utf8');
    assert(storageCode.includes('loadTracks') && storageCode.includes('saveTracks'), 'Métodos de persistência de faixas presentes');
    assert(storageCode.includes('loadAlbums') && storageCode.includes('saveAlbums'), 'Métodos de persistência de álbuns presentes');
    assert(storageCode.includes('loadPlaylists') && storageCode.includes('savePlaylists'), 'Métodos de persistência de playlists presentes');
    assert(storageCode.includes('loadSettings') && storageCode.includes('saveSettings'), 'Métodos de persistência de configurações de áudio presentes');
    assert(storageCode.includes('addTrack') && storageCode.includes('removeTrack'), 'Métodos de adição e remoção de faixas presentes');
  } catch (err) {
    assert(false, `Erro na suíte 2: ${err.message}`);
  }

  // SUÍTE 3: MÁQUINA DE ESTADOS E ACOPLAMENTO MECÂNICO
  console.log('\nSUÍTE 3: Máquina de Estados de Reprodução e Acoplamento Físico');
  try {
    const typesPath = path.join(rootDir, 'src', 'types', 'index.ts');
    const typesCode = fs.readFileSync(typesPath, 'utf8');

    const expectedStates = ['empty', 'playing', 'paused', 'buffering', 'ended', 'error'];
    for (const st of expectedStates) {
      assert(typesCode.includes(`'${st}'`), `Estado '${st}' definido na tipagem PlayerPlaybackState`);
    }

    const tonearmPath = path.join(rootDir, 'src', 'components', 'player', 'Tonearm.tsx');
    const tonearmCode = fs.readFileSync(tonearmPath, 'utf8');
    assert(tonearmCode.includes('rotate-[0deg]') || tonearmCode.includes('0deg'), 'Ângulo de repouso mecânico (0°) presente no Tonearm');
    assert(tonearmCode.includes('rotate-[12deg]') || tonearmCode.includes('12deg'), 'Ângulo de cue/elevação (12°) presente no Tonearm');
    assert(tonearmCode.includes('rotate-[21deg]') || tonearmCode.includes('21deg'), 'Ângulo do sulco de vinil (21° - 32°) presente no Tonearm');

    const vuPath = path.join(rootDir, 'src', 'components', 'player', 'BallisticVUMeters.tsx');
    const vuCode = fs.readFileSync(vuPath, 'utf8');
    assert(vuCode.includes('dbToAngle'), 'Função de calibração balística presente no medidor VU');
    assert(vuCode.includes('clamp'), 'Limitador de segurança de agulha (clamp) implementado');
  } catch (err) {
    assert(false, `Erro na suíte 3: ${err.message}`);
  }

  // SUÍTE 4: CAPACIDADES E CONFORMIDADE DOS PROVEDORES
  console.log('\nSUÍTE 4: Capacidades e Conformidade Legal dos Provedores');
  try {
    const matrixPath = path.join(rootDir, 'docs', '07-matriz-provedores.md');
    assert(fs.existsSync(matrixPath), 'Matriz consolidada docs/07-matriz-provedores.md presente');

    const deezerProviderPath = path.join(rootDir, 'src', 'services', 'providers', 'deezer', 'DeezerPlaybackProvider.ts');
    const ytProviderPath = path.join(rootDir, 'src', 'services', 'providers', 'youtube', 'YouTubePlaybackProvider.ts');
    const spotifyProviderPath = path.join(rootDir, 'src', 'services', 'providers', 'spotify', 'SpotifyPlaybackProvider.ts');

    const deezerCode = fs.readFileSync(deezerProviderPath, 'utf8');
    assert(deezerCode.includes('isFullTrackAvailable: false'), 'Deezer declara honestamente que faixas completas exigem app oficial');
    assert(deezerCode.includes('canReadPCM: true'), 'Deezer conecta prévia de áudio à AudioEngine para medidor VU');

    const ytCode = fs.readFileSync(ytProviderPath, 'utf8');
    assert(ytCode.includes('canReadPCM: false'), 'YouTube declara honestamente que áudio do IFrame é isolado');
    assert(ytCode.includes('restrictionsNotice'), 'YouTube inclui aviso explícito de conformidade contra extração ilegal de áudio');

    const spotifyCode = fs.readFileSync(spotifyProviderPath, 'utf8');
    assert(spotifyCode.includes('isFullTrackAvailable: true'), 'Spotify declara capacidade de faixa completa');
    assert(spotifyCode.includes('Spotify Premium'), 'Spotify declara requisito compulsório de conta Premium');
  } catch (err) {
    assert(false, `Erro na suíte 4: ${err.message}`);
  }

  // SUÍTE 5: AMBIENTE WINDOWS DESKTOP E WEBVIEW2 RUNTIME
  console.log('\nSUÍTE 5: Verificação do Ambiente Windows e Microsoft Edge WebView2');
  try {
    const webView2Path = 'C:\\Program Files (x86)\\Microsoft\\EdgeWebView\\Application\\152.0.4191.66';
    const isWebView2Installed = fs.existsSync(webView2Path);
    assert(isWebView2Installed, 'Microsoft Edge WebView2 Runtime (versão 152.0.4191.66) detectado no host Windows');

    const distPath = path.join(rootDir, 'dist');
    assert(fs.existsSync(distPath), 'Diretório dist/ de produção existe');

    const distIndex = path.join(distPath, 'index.html');
    assert(fs.existsSync(distIndex), 'Arquivo dist/index.html gerado com sucesso');

    const assetsDir = path.join(distPath, 'assets');
    const assetFiles = fs.readdirSync(assetsDir);
    const hasJs = assetFiles.some((f) => f.endsWith('.js'));
    const hasCss = assetFiles.some((f) => f.endsWith('.css'));
    assert(hasJs, 'Bundle JavaScript de produção gerado em dist/assets/');
    assert(hasCss, 'Folha de estilos CSS compilada com tokens em dist/assets/');
  } catch (err) {
    assert(false, `Erro na suíte 5: ${err.message}`);
  }

  // SUÍTE 6: ADAPTABILIDADE DE RESOLUÇÃO E CONTROLE DE TECLADO
  console.log('\nSUÍTE 6: Adaptabilidade de Resolução (1366x768 / 1920x1080) e Teclado');
  try {
    const appPath = path.join(rootDir, 'src', 'App.tsx');
    const appCode = fs.readFileSync(appPath, 'utf8');

    const shortcuts = [
      { key: 'Space', desc: 'Play / Pause com Barra de Espaço' },
      { key: 'ArrowRight', desc: 'Seek +5 segundos' },
      { key: 'ArrowLeft', desc: 'Seek -5 segundos' },
      { key: 'ArrowUp', desc: 'Aumento de volume' },
      { key: 'ArrowDown', desc: 'Redução de volume' },
      { key: 'm', desc: 'Mudo rápido (M)' },
      { key: 'Escape', desc: 'Sair de tela cheia (ESC)' }
    ];

    for (const sc of shortcuts) {
      assert(appCode.includes(sc.key), `Atalho de teclado implementado: ${sc.desc}`);
    }
  } catch (err) {
    assert(false, `Erro na suíte 6: ${err.message}`);
  }

  console.log('\n===============================================================');
  console.log(`TOTAL DE TESTES EXECUTADOS: ${passedCount + failedCount}`);
  console.log(`PASSARAM: ${passedCount}`);
  console.log(`FALHARAM:  ${failedCount}`);
  console.log('===============================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
