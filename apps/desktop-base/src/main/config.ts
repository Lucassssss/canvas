import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

export interface WindowConfig {
  width: number
  height: number
  minWidth: number
  minHeight: number
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover'
}

export interface DevConfig {
  enabled: boolean
  webUrl: string
  skipServers: boolean
}

export interface ServerConfig {
  id: string
  resource: string
  port: number
  healthPath: string
  startupTimeoutMs: number
  autoStart: boolean
  env: Record<string, string>
}

export interface UpdateConfig {
  enabled: boolean
  webManifestUrl: string
  binManifestUrl: string
  checkIntervalMs: number
}

export interface AppConfig {
  appName: string
  appId: string
  window: WindowConfig
  dev: DevConfig
  servers: ServerConfig[]
  update: UpdateConfig
}

let cachedConfig: AppConfig | null = null

export function loadConfig(): AppConfig {
  if (cachedConfig) return cachedConfig

  const configPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app.config.json')
    : path.join(app.getAppPath(), 'resources', 'app.config.json')

  if (!fs.existsSync(configPath)) {
    throw new Error(`app.config.json not found at: ${configPath}`)
  }

  const raw = fs.readFileSync(configPath, 'utf-8')
  cachedConfig = JSON.parse(raw) as AppConfig
  
  if (app.isPackaged) {
    cachedConfig.dev.enabled = false
  }
  
  return cachedConfig
}

export function getConfig(): AppConfig {
  if (!cachedConfig) throw new Error('Config not loaded. Call loadConfig() first.')
  return cachedConfig
}
