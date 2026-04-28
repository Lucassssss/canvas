import { ipcMain, app } from 'electron'
import log from 'electron-log'
import { ServerManager } from './server-manager'
import { ResourceManager } from './resource-manager'
import { getConfig } from './config'
import { getMainWindow } from './window'

export function registerIpcHandlers(
  serverManager: ServerManager,
  resourceManager: ResourceManager,
): void {
  ipcMain.handle('window:minimize', () => getMainWindow()?.minimize())

  ipcMain.handle('window:maximize', () => {
    const w = getMainWindow()
    if (!w) return
    w.isMaximized() ? w.unmaximize() : w.maximize()
  })

  ipcMain.handle('window:close', () => getMainWindow()?.close())

  ipcMain.handle('app:versions', () => ({
    app: app.getVersion(),
    appName: getConfig().appName,
    ...resourceManager.getInstalledVersions(),
  }))

  ipcMain.handle('server:status', (_e, id?: string) => serverManager.getStatus(id))

  ipcMain.handle('server:restart', async (_e, id?: string) => {
    if (id) {
      await serverManager.stop(id)
      await serverManager.start(id)
    } else {
      await serverManager.stopAll()
      await serverManager.startAll()
    }
  })

  // OTA: renderer triggers a manual check; main downloads + swaps, then notifies renderer
  ipcMain.handle('update:check-web', async () => {
    const config = getConfig()
    if (!config.update.enabled || !config.update.webManifestUrl) {
      return { updated: false, version: '' }
    }
    const result = await resourceManager.checkAndApplyWebUpdate(config.update.webManifestUrl)
    if (result.updated) {
      // Notify renderer to show "new version ready" prompt
      getMainWindow()?.webContents.send('update:web-ready', result.version)
    }
    return result
  })

  // OTA: renderer calls this after user confirms reload
  ipcMain.handle('update:apply-web', () => {
    log.info('[IPC] Reloading renderer for web update')
    getMainWindow()?.webContents.reload()
  })

  log.info('[IPC] P0 handlers registered')
}
