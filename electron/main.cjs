const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Permite autoplay de áudio/vídeo imediatamente sem exigir clique prévio do usuário
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;

function updateThumbarButtons(win, isPlaying = false) {
  if (process.platform !== 'win32' || !win || win.isDestroyed()) return;

  const assetsDir = path.join(__dirname, 'assets');
  const prevIcon = path.join(assetsDir, 'prev.png');
  const playIcon = path.join(assetsDir, 'play.png');
  const pauseIcon = path.join(assetsDir, 'pause.png');
  const nextIcon = path.join(assetsDir, 'next.png');

  if (!fs.existsSync(prevIcon) || !fs.existsSync(playIcon)) return;

  try {
    win.setThumbarButtons([
      {
        tooltip: 'Voltar Faixa (⏮)',
        icon: prevIcon,
        click() {
          win.webContents.send('media-prev');
        }
      },
      {
        tooltip: isPlaying ? 'Pausar (⏯)' : 'Tocar (⏯)',
        icon: isPlaying ? pauseIcon : playIcon,
        click() {
          win.webContents.send('media-play-pause');
        }
      },
      {
        tooltip: 'Passar pra Frente (⏭)',
        icon: nextIcon,
        click() {
          win.webContents.send('media-next');
        }
      }
    ]);
  } catch (err) {
    // Some Windows display configurations may not support thumbar
    console.warn('Aviso: setThumbarButtons:', err.message);
  }
}

function createWindow() {
  const iconPath = path.join(__dirname, '..', 'public', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'Vitrola — Hi-Fi Turntable Desktop Console',
    backgroundColor: '#0c0a09',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webviewTag: true, // Habilita o componente <webview> para o YouTube Music embutido
      partition: 'persist:vitrola_session', // Persiste o login do Google entre reinicializações
      webSecurity: false, // Permite carregar iframes e mídias sem bloqueio de protocolo local
      allowRunningInsecureContent: true,
    },
  });

  // Ajusta o User-Agent removendo o identificador do Electron para compatibilidade perfeita com login Google
  const customUserAgent = mainWindow.webContents
    .getUserAgent()
    .replace(/Electron\/[0-9.]+\s/gi, '');
  mainWindow.webContents.setUserAgent(customUserAgent);

  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
  const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(distIndexPath).catch((err) => {
      console.warn('Falha ao carregar dist/index.html, tentando localhost:', err.message);
      mainWindow.loadURL('http://localhost:5173');
    });
  }

  // F12 para abrir DevTools se necessário
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Erro de carregamento da página:', errorCode, errorDescription, validatedURL);
  });

  // Windows Taskbar Thumbnail Toolbar (Volta, Pausa/Play, Passa pra Frente)
  mainWindow.once('ready-to-show', () => {
    updateThumbarButtons(mainWindow, false);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.on('playback-state-changed', (event, { isPlaying }) => {
  if (mainWindow) {
    updateThumbarButtons(mainWindow, isPlaying);
  }
});

app.whenReady().then(() => {
  // Configura a partição de sessão persistente para armazenar cookies de login do Google
  const ses = session.fromPartition('persist:vitrola_session');
  ses.setUserAgent(
    ses.getUserAgent().replace(/Electron\/[0-9.]+\s/gi, '')
  );

  // Intercepta e remove bloqueios de iframe (X-Frame-Options / Referer) para YouTube e mídia externa
  const setupMediaHeaders = (targetSession) => {
    const filter = {
      urls: [
        '*://*.youtube.com/*',
        '*://*.youtube-nocookie.com/*',
        '*://*.googlevideo.com/*',
      ],
    };

    targetSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      details.requestHeaders['Referer'] = 'https://www.youtube.com/';
      details.requestHeaders['Origin'] = 'https://www.youtube.com';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    targetSession.webRequest.onHeadersReceived(filter, (details, callback) => {
      const responseHeaders = { ...details.responseHeaders };
      delete responseHeaders['x-frame-options'];
      delete responseHeaders['X-Frame-Options'];
      if (responseHeaders['content-security-policy']) {
        responseHeaders['content-security-policy'] = responseHeaders['content-security-policy'].map((csp) =>
          csp.replace(/frame-ancestors[^;]+;?/gi, '')
        );
      }
      callback({ cancel: false, responseHeaders });
    });
  };

  setupMediaHeaders(ses);
  setupMediaHeaders(session.defaultSession);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
