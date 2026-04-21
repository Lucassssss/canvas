import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,

  versions: (): Promise<Record<string, string>> =>
    ipcRenderer.invoke('app:versions'),

  window: {
    minimize: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
    maximize: (): Promise<void> => ipcRenderer.invoke('window:maximize'),
    close: (): Promise<void> => ipcRenderer.invoke('window:close'),
  },

  server: {
    getStatus: (id?: string) => ipcRenderer.invoke('server:status', id),
    restart: (id?: string) => ipcRenderer.invoke('server:restart', id),
  },
})
