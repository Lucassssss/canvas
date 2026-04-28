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
    let target = path.join(webDir, relative)

    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, 'index.html')
    }

    const index = path.join(webDir, 'index.html')

    let filePath = target
    const isAsset = relative.match(/\.(js|css|json|txt|ico|png|jpg|woff2?|svg)$/i) || relative.startsWith('_next/')

    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      if (isAsset) {
        // log.warn(`[Protocol] 404 Not Found: app://${relative}`)
        return new Response('Not Found', { status: 404 })
      } else {
        filePath = index
      }
    }

    // log.debug(`[Protocol] app://${relative} → ${filePath}`)
    return net.fetch(`file://${filePath}`)
  })

  // log.info('[Protocol] app:// registered, serving from', webDir)
}
