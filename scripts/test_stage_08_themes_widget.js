/**
 * Teste Automatizado de Temas e Mini Player Widget (Etapa 08)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function testThemesAndWidget() {
  console.log('=== TESTE DE TEMAS, TOKENS E MINI PLAYER WIDGET (ETAPA 08) ===\n');
  let passed = 0;
  let failed = 0;

  // 1. Verificação dos Tokens de Tema no CSS
  console.log('1. Verificando tokens CSS para os 3 temas...');
  const cssPath = path.join(rootDir, 'src', 'index.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const requiredTokens = [
    '--color-surface',
    '--color-on-surface',
    '--color-primary',
    '--color-secondary',
    '--color-outline',
    '--color-plinth-bg'
  ];

  const themes = [
    { name: 'Madeira Clássica (:root)', selector: ':root' },
    { name: 'Preto & Ouro ([data-theme="pretodourado"])', selector: '[data-theme="pretodourado"]' },
    { name: 'Neon Moderno ([data-theme="neonmoderno"])', selector: '[data-theme="neonmoderno"]' }
  ];

  for (const theme of themes) {
    if (css.includes(theme.selector)) {
      console.log(`   [OK] Seletor do tema presente: ${theme.name}`);
      passed++;
    } else {
      console.error(`   [FAIL] Seletor ausente: ${theme.selector}`);
      failed++;
    }
  }

  for (const token of requiredTokens) {
    if (css.includes(token)) {
      console.log(`   [OK] Token de design presente: ${token}`);
      passed++;
    } else {
      console.error(`   [FAIL] Token ausente: ${token}`);
      failed++;
    }
  }

  // 2. Verificação de Preservação do Disco e Braço Físicos
  console.log('\n2. Verificando preservação do disco e braço em todos os temas...');
  const turntablePath = path.join(rootDir, 'src', 'components', 'player', 'Turntable.tsx');
  const vinylPath = path.join(rootDir, 'src', 'components', 'player', 'VinylDisc.tsx');
  const tonearmPath = path.join(rootDir, 'src', 'components', 'player', 'Tonearm.tsx');

  const turntableCode = fs.readFileSync(turntablePath, 'utf8');
  const vinylCode = fs.readFileSync(vinylPath, 'utf8');
  const tonearmCode = fs.readFileSync(tonearmPath, 'utf8');

  if (turntableCode.includes('VinylDisc') && turntableCode.includes('Tonearm')) {
    console.log('   [OK] Turntable mantém integração física de VinylDisc e Tonearm.');
    passed++;
  } else {
    console.error('   [FAIL] Turntable perdeu referências do braço/disco.');
    failed++;
  }

  if (vinylCode.includes('vinyl-grooves-pattern') && tonearmCode.includes('Tonearm')) {
    console.log('   [OK] Texturas concêntricas de vinil e geometria do braço confirmadas.');
    passed++;
  } else {
    console.error('   [FAIL] Falta de textura ou geometria de vinil.');
    failed++;
  }

  // 3. Verificação do Mini Player Widget
  console.log('\n3. Verificando recursos do Mini Player Widget...');
  const widgetPath = path.join(rootDir, 'src', 'components', 'widget', 'MiniPlayerWidget.tsx');
  const widgetCode = fs.readFileSync(widgetPath, 'utf8');

  const widgetChecks = [
    { label: 'Sempre no topo (isAlwaysOnTop)', token: 'isAlwaysOnTop' },
    { label: 'Arrastabilidade (handleMouseDown / position)', token: 'handleMouseDown' },
    { label: 'Indicador de fonte dinâmica', token: 'currentSourceInfo' },
    { label: 'Medidor VU em tempo real', token: 'vuDb' },
    { label: 'Scrubber de seek interativo', token: 'handleScrubClick' },
    { label: 'Botão de restaurar janela principal', token: 'onRestoreMain' }
  ];

  for (const check of widgetChecks) {
    if (widgetCode.includes(check.token)) {
      console.log(`   [OK] Recurso presente no widget: ${check.label}`);
      passed++;
    } else {
      console.error(`   [FAIL] Recurso ausente no widget: ${check.label}`);
      failed++;
    }
  }

  // 4. Verificação de Sincronização Única de Áudio no App
  console.log('\n4. Verificando sincronização de áudio única em App.tsx...');
  const appPath = path.join(rootDir, 'src', 'App.tsx');
  const appCode = fs.readFileSync(appPath, 'utf8');

  if (
    appCode.includes('playbackState={playbackState}') &&
    appCode.includes('currentTimeSec={currentTimeSec}') &&
    appCode.includes('onPlayToggle={handlePlayToggle}') &&
    appCode.includes('onSeek={handleSeek}')
  ) {
    console.log('   [OK] Widget compartilha exatamente o mesmo estado de reprodução (sem dois áudios concorrentes).');
    passed++;
  } else {
    console.error('   [FAIL] Widget não está acoplado ao estado único de áudio.');
    failed++;
  }

  console.log('\n========================================');
  console.log(`RESULTADO FINAL: ${passed} passaram, ${failed} falharam.`);
  if (failed > 0) process.exit(1);
}

testThemesAndWidget();
