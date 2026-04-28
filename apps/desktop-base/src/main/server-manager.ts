import { app } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import log from 'electron-log'
import { ServerConfig } from './config'
import { ResourceManager } from './resource-manager'

export type ServerStatus = 'stopped' | 'starting' | 'running' | 'error'

interface ServerInstance {
  config: ServerConfig
  process: ChildProcess | null
  status: ServerStatus
  restartCount: number
  stopping: boolean
}

const MAX_RESTARTS = 3
const BASE_RESTART_DELAY_MS = 1000

export class ServerManager {
  private servers = new Map<string, ServerInstance>()

  constructor(private readonly resourceManager: ResourceManager) {}

  register(configs: ServerConfig[]): void {
    for (const config of configs) {
      this.servers.set(config.id, {
        config,
        process: null,
        status: 'stopped',
        restartCount: 0,
        stopping: false,
      })
    }
  }

  async startAll(): Promise<void> {
    const toStart = [...this.servers.values()].filter(s => s.config.autoStart)
    await Promise.all(toStart.map(s => this.start(s.config.id)))
  }

  async start(id: string): Promise<void> {
    const instance = this.servers.get(id)
    if (!instance) throw new Error(`Unknown server: ${id}`)
    if (instance.status === 'running' || instance.status === 'starting') return

    let binaryPath = this.resourceManager.getResourcePath(instance.config.resource)
    if (process.platform === 'win32' && !binaryPath.endsWith('.exe')) {
      binaryPath += '.exe'
    }
    
    instance.status = 'starting'
    instance.stopping = false

    log.info(`[ServerManager] Starting "${id}" from ${binaryPath}`)

    const proc = spawn(binaryPath, [], {
      env: {
        ...process.env,
        PORT: String(instance.config.port),
        APP_DATA_DIR: app.getPath('userData'),
        ...instance.config.env,
      },
      stdio: 'pipe',
    })

    instance.process = proc

    proc.stdout?.on('data', d => log.info(`[${id}]`, d.toString().trimEnd()))
    proc.stderr?.on('data', d => log.warn(`[${id}]`, d.toString().trimEnd()))

    proc.on('spawn', () => {
      instance.status = 'running'
      instance.restartCount = 0
      log.info(`[ServerManager] "${id}" running on port ${instance.config.port}`)
    })

    proc.on('error', err => {
      instance.status = 'error'
      log.error(`[ServerManager] "${id}" spawn error:`, err.message)
    })

    proc.on('exit', code => {
      instance.process = null
      instance.status = 'stopped'
      log.warn(`[ServerManager] "${id}" exited with code ${code}`)

      if (!instance.stopping && instance.restartCount < MAX_RESTARTS) {
        const delay = BASE_RESTART_DELAY_MS * Math.pow(2, instance.restartCount)
        instance.restartCount++
        log.info(`[ServerManager] Restarting "${id}" in ${delay}ms (attempt ${instance.restartCount}/${MAX_RESTARTS})`)
        setTimeout(() => this.start(id), delay)
      }
    })
  }

  async stop(id: string): Promise<void> {
    const instance = this.servers.get(id)
    if (!instance || !instance.process) return

    instance.stopping = true

    return new Promise(resolve => {
      const proc = instance.process!
      const kill = setTimeout(() => { proc.kill('SIGKILL'); resolve() }, 5000)
      proc.once('exit', () => { clearTimeout(kill); resolve() })
      proc.kill('SIGTERM')
    })
  }

  async stopAll(): Promise<void> {
    await Promise.all([...this.servers.keys()].map(id => this.stop(id)))
  }

  killAll(): void {
    for (const instance of this.servers.values()) {
      if (instance.process) {
        instance.stopping = true
        instance.process.kill('SIGKILL')
      }
    }
  }

  async waitReady(id: string): Promise<void> {
    const instance = this.servers.get(id)
    if (!instance) throw new Error(`Unknown server: ${id}`)

    const { port, healthPath, startupTimeoutMs } = instance.config
    const url = `http://localhost:${port}${healthPath}`
    const deadline = Date.now() + startupTimeoutMs

    log.info(`[ServerManager] Waiting for "${id}" at ${url}`)

    while (Date.now() < deadline) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(1000) })
        if (res.ok) {
          log.info(`[ServerManager] "${id}" is ready`)
          return
        }
      } catch {}
      await new Promise(r => setTimeout(r, 500))
    }

    throw new Error(`Server "${id}" did not become ready within ${startupTimeoutMs}ms`)
  }

  async waitAllReady(): Promise<void> {
    const toWait = [...this.servers.values()].filter(s => s.config.autoStart)
    await Promise.all(toWait.map(s => this.waitReady(s.config.id)))
  }

  getStatus(id?: string): ServerStatus | Record<string, ServerStatus> {
    if (id) return this.servers.get(id)?.status ?? 'stopped'
    const result: Record<string, ServerStatus> = {}
    for (const [k, v] of this.servers) result[k] = v.status
    return result
  }
}
