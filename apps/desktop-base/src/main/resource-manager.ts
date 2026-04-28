import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import log from 'electron-log'

export class ResourceManager {
  private readonly userDataPath: string
  private readonly bundledResourcesPath: string

  constructor() {
    this.userDataPath = app.getPath('userData')
    this.bundledResourcesPath = process.resourcesPath
  }

  getWebDir(): string {
    return path.join(this.userDataPath, 'web')
  }

  getResourcePath(resourceId: string): string {
    return path.join(this.userDataPath, 'resources', resourceId)
  }

  getUpdatesDir(): string {
    return path.join(this.userDataPath, 'updates')
  }

  private getInstalledPath(): string {
    return path.join(this.userDataPath, 'installed.json')
  }

  getInstalledVersions(): Record<string, string> {
    const p = this.getInstalledPath()
    if (!fs.existsSync(p)) return {}
    try {
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    } catch {
      return {}
    }
  }

  setInstalledVersion(resourceId: string, version: string): void {
    const versions = this.getInstalledVersions()
    versions[resourceId] = version
    fs.writeFileSync(this.getInstalledPath(), JSON.stringify(versions, null, 2))
  }

  async ensureInitialAssets(): Promise<void> {
    const webDir = this.getWebDir()
    const resourcesDir = path.join(this.userDataPath, 'resources')
    const updatesDir = this.getUpdatesDir()

    fs.mkdirSync(webDir, { recursive: true })
    fs.mkdirSync(resourcesDir, { recursive: true })
    fs.mkdirSync(updatesDir, { recursive: true })

    const bundledWeb = path.join(this.bundledResourcesPath, 'web')
    if (!fs.existsSync(path.join(webDir, 'index.html')) && fs.existsSync(bundledWeb)) {
      log.info('[ResourceManager] Copying initial web assets...')
      this.copyDirSync(bundledWeb, webDir)
    }

    const bundledRes = path.join(this.bundledResourcesPath, 'resources')
    if (fs.existsSync(bundledRes)) {
      for (const entry of fs.readdirSync(bundledRes)) {
        const dest = path.join(resourcesDir, entry)
        const src = path.join(bundledRes, entry)
        log.info(`[ResourceManager] Copying/updating resource: ${entry}`)

        const stat = fs.statSync(src)
        if (stat.isDirectory()) {
          this.copyDirSync(src, dest)
        } else {
          try {
            fs.copyFileSync(src, dest)
            if (process.platform !== 'win32') fs.chmodSync(dest, 0o755)
          } catch (err: any) {
            log.warn(`[ResourceManager] Failed to copy resource ${src} to ${dest}: ${err.message}`)
          }
        }
      }
    }
  }

  private copyDirSync(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry)
      const destPath = path.join(dest, entry)
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirSync(srcPath, destPath)
      } else {
        try {
          fs.copyFileSync(srcPath, destPath)
        } catch (err: any) {
          log.warn(`[ResourceManager] Failed to copy ${srcPath} to ${destPath}: ${err.message}`)
        }
      }
    }
  }
}
