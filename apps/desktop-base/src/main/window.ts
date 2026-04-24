import { BrowserWindow, shell } from 'electron'
import * as path from 'path'
import log from 'electron-log'
import { AppConfig } from './config'

let mainWindow: BrowserWindow | null = null

export function createWindow(config: AppConfig): BrowserWindow {
  log.info('[Window] Creating main window')

  mainWindow = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    frame: false,
    titleBarStyle: config.window.titleBarStyle,
    titleBarOverlay: false,
    title: config.appName,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    log.info('[Window] Shown')
  })

  if (config.dev.enabled) {
    log.info('[Window] Dev mode → loading', config.dev.webUrl)
    mainWindow.loadURL(config.dev.webUrl)
    mainWindow.webContents.openDevTools()
  } else {
    log.info('[Window] Prod mode → loading app://web/index.html')
    mainWindow.loadURL('app://web/index.html')
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  return mainWindow
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function reloadWindow(): void {
  mainWindow?.webContents.reload()
}
