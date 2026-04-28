import { app, net } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { execFileSync } from 'child_process'
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
    return path.join(this.userDataPath, 'bin', resourceId)
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
    const resourcesDir = path.join(this.userDataPath, 'bin')
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

  /**
   * Check remote manifest and apply web update if a newer version is available.
   * Returns { updated, version } so the caller can notify the renderer.
   */
  async checkAndApplyWebUpdate(manifestUrl: string): Promise<{ updated: boolean; version: string }> {
    log.info('[OTA] Checking web manifest:', manifestUrl)

    // 1. Fetch manifest (append timestamp to bypass S3/CDN edge caching)
    let manifest: { web: { version: string; url: string } }
    try {
      const urlWithTimestamp = manifestUrl.includes('?') 
        ? `${manifestUrl}&t=${Date.now()}` 
        : `${manifestUrl}?t=${Date.now()}`
      const res = await net.fetch(urlWithTimestamp, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      manifest = await res.json() as typeof manifest
    } catch (err: any) {
      log.warn('[OTA] Failed to fetch manifest:', err.message)
      return { updated: false, version: '' }
    }

    const { version, url } = manifest.web
    const currentVersion = this.getInstalledVersions()['web'] ?? ''

    if (version === currentVersion) {
      log.info(`[OTA] Web is up-to-date (${version})`)
      return { updated: false, version }
    }

    log.info(`[OTA] Web update available: ${currentVersion} → ${version}`)

    // 2. Download zip
    const updatesDir = this.getUpdatesDir()
    const zipPath = path.join(updatesDir, `web-${version}.zip`)
    try {
      const res = await net.fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`)
      const buffer = await res.arrayBuffer()
      fs.writeFileSync(zipPath, Buffer.from(buffer))
      log.info(`[OTA] Downloaded ${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB → ${zipPath}`)
    } catch (err: any) {
      log.error('[OTA] Download error:', err.message)
      return { updated: false, version }
    }

    // 3. Extract into web_tmp (Windows built-in tar, same as pack-browser.ts)
    const webDir = this.getWebDir()
    const tmpDir = path.join(this.userDataPath, 'web_tmp')
    const oldDir = path.join(this.userDataPath, 'web_old')
    try {
      if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true })
      fs.mkdirSync(tmpDir, { recursive: true })
      execFileSync('tar', ['-xf', zipPath, '-C', tmpDir], { windowsHide: true })
      log.info('[OTA] Extraction complete')
    } catch (err: any) {
      log.error('[OTA] Extraction failed:', err.message)
      try { fs.unlinkSync(zipPath) } catch { }
      return { updated: false, version }
    }

    // 4. Atomic swap: web → web_old, web_tmp → web
    try {
      if (fs.existsSync(oldDir)) fs.rmSync(oldDir, { recursive: true, force: true })
      if (fs.existsSync(webDir)) fs.renameSync(webDir, oldDir)
      fs.renameSync(tmpDir, webDir)
      if (fs.existsSync(oldDir)) fs.rmSync(oldDir, { recursive: true, force: true })
      fs.unlinkSync(zipPath)
      log.info('[OTA] Atomic swap complete')
    } catch (err: any) {
      log.error('[OTA] Swap failed:', err.message)
      return { updated: false, version }
    }

    // 5. Persist version
    this.setInstalledVersion('web', version)
    log.info(`[OTA] Web updated to ${version}`)
    return { updated: true, version }
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
