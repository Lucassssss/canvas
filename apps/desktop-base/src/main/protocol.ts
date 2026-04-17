import { protocol, net } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import log from 'electron-log'

// Must be called before app.whenReady()
export function registerSchemesBeforeReady(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ])
}

export function registerAppProtocol(webDir: string): void {
  protocol.handle('app', (request) => {
    const urlPath = new URL(request.url).pathname
    const decoded = decodeURIComponent(urlPath)
    const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\//, '')
    const target = path.join(webDir, relative)
    const index = path.join(webDir, 'index.html')

    const filePath =
      fs.existsSync(target) && fs.statSync(target).isFile() ? target : index

    log.debug(`[Protocol] app://${relative} → ${filePath}`)
    return net.fetch(`file://${filePath}`)
  })

  log.info('[Protocol] app:// registered, serving from', webDir)
}
