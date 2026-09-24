const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'Vitrola — Hi-Fi Turntable Desktop Console',
    backgroundColor: '#0c0a09',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Habilita o componente <webview> para o YouTube Music embutido
      partition: 'persist:vitrola_session', // Persiste o login do Google entre reinicializações
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
  } else if (fs.existsSync(distIndexPath)) {
    mainWindow.loadFile(distIndexPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Configura a partição de sessão persistente para armazenar cookies de login do Google
  const ses = session.fromPartition('persist:vitrola_session');
  ses.setUserAgent(
    ses.getUserAgent().replace(/Electron\/[0-9.]+\s/gi, '')
  );

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
