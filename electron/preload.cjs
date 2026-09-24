// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  sendPlaybackState: (state) => ipcRenderer.send('playback-state-changed', state),
  onMediaPrev: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('media-prev', subscription);
    return () => ipcRenderer.removeListener('media-prev', subscription);
  },
  onMediaPlayPause: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('media-play-pause', subscription);
    return () => ipcRenderer.removeListener('media-play-pause', subscription);
  },
  onMediaNext: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('media-next', subscription);
    return () => ipcRenderer.removeListener('media-next', subscription);
  }
});
