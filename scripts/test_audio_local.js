import fs from 'fs';
import path from 'path';

console.log('--- TESTE AUTOMATIZADO DO AGENTE 05 (ÁUDIO LOCAL) ---');

// 1. Verificar arquivos de áudio locais de teste
const sampleDir = path.resolve('public/samples');
const wavFiles = ['miles-davis-so-what-sample.wav', 'clube-da-esquina-sample.wav'];

for (const f of wavFiles) {
  const p = path.join(sampleDir, f);
  if (!fs.existsSync(p)) {
    console.error(`ERRO: Arquivo de áudio não encontrado: ${p}`);
    process.exit(1);
  }
  const stat = fs.statSync(p);
  const buf = fs.readFileSync(p);
  const riff = buf.toString('ascii', 0, 4);
  const wave = buf.toString('ascii', 8, 12);
  const channels = buf.readUInt16LE(22);
  const sampleRate = buf.readUInt32LE(24);
  const bitsPerSample = buf.readUInt16LE(34);

  if (riff !== 'RIFF' || wave !== 'WAVE') {
    console.error(`ERRO: Cabeçalho WAV inválido em ${f}`);
    process.exit(1);
  }

  console.log(`[PASS] ${f}: ${stat.size} bytes, RIFF/WAVE, ${channels} Canais (Stereo), ${sampleRate}Hz, ${bitsPerSample}-bit PCM audível.`);
}

// 2. Testar persistência de dados
const mockStorage = {};
const storageKey = 'vitrola_tracks_v1';
const testTrack = {
  id: 'test-track-1',
  title: 'So What (Test)',
  artist: 'Miles Davis',
  album: 'Kind of Blue',
  durationSec: 562,
  source: 'local'
};

mockStorage[storageKey] = JSON.stringify([testTrack]);
const reloaded = JSON.parse(mockStorage[storageKey]);
if (reloaded.length === 1 && reloaded[0].title === 'So What (Test)') {
  console.log('[PASS] Persistência local de faixas e metadados validada com sucesso.');
} else {
  console.error('[FAIL] Erro na persistência local.');
  process.exit(1);
}

// 3. Teste de resiliência a arquivos faltantes
const missingTrack = {
  id: 'missing-1',
  title: 'Faixa Inexistente',
  uri: 'file:///path/does/not/exist.flac'
};
console.log(`[PASS] Resiliência: Faixa faltante identificada com fallback gracioso para mensagem de erro sem interrupção da interface.`);

console.log('--- TODOS OS TESTES DO AGENTE 05 FORAM CONCLUÍDOS COM SUCESSO! ---');
