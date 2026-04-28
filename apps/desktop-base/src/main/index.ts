import { app, BrowserWindow, Menu } from 'electron'
import log from 'electron-log'
import { loadConfig } from './config'
import { registerSchemesBeforeReady, registerAppProtocol } from './protocol'
import { ResourceManager } from './resource-manager'
import { ServerManager } from './server-manager'
import { registerIpcHandlers } from './ipc-handlers'
import { createWindow } from './window'

log.initialize()
log.transports.file.level = 'debug'
log.transports.console.level = 'debug'

// Must run before app.whenReady()
registerSchemesBeforeReady()

const resourceManager = new ResourceManager()
const serverManager = new ServerManager(resourceManager)

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null)
  
  // Kill any stray local-daemon processes from previous runs to release file locks
  try {
    const { execSync } = require('child_process')
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM jbrowser-server.exe /T', { stdio: 'ignore', windowsHide: true })
    } else {
      execSync('pkill -f jbrowser-server', { stdio: 'ignore' })
    }
  } catch (e) { }

  let config
  try {
    config = loadConfig()
  } catch (err) {
    log.error('[App] Failed to load config:', err)
    app.quit()
    return
  }

  log.info(`[App] Starting ${config.appName}`)

  registerAppProtocol(resourceManager.getWebDir())
  registerIpcHandlers(serverManager, resourceManager)
  serverManager.register(config.servers)

  await resourceManager.ensureInitialAssets()

  if (!config.dev.skipServers && config.servers.length > 0) {
    await serverManager.startAll()
    try {
      await serverManager.waitAllReady()
    } catch (err) {
      log.warn('[App] Some servers did not become ready:', err)
    }
  }

  createWindow(config)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(config)
  })
})

app.on('window-all-closed', async () => {
  log.info('[App] All windows closed')
  await serverManager.stopAll()
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  serverManager.killAll()
})

process.on('uncaughtException', err => log.error('[App] Uncaught exception:', err))
process.on('unhandledRejection', reason => log.error('[App] Unhandled rejection:', reason))
