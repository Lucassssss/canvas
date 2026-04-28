import { $, BunFile } from 'bun'
import { join, dirname } from 'path'
import { rm, mkdir, cp, stat } from 'fs/promises'
import * as os from 'os'

const isWindows = os.platform() === 'win32'

async function safeRm(path: string) {
  try { await rm(path, { recursive: true, force: true }) } catch {}
}

async function safeExists(path: string) {
  try { await stat(path); return true } catch { return false }
}

async function run() {
  console.log("=== Packaging Joii Berry Desktop ===")

  // 1. Clean up old resources
  console.log("[1/4] Cleaning old resources...")
  await safeRm(join('apps', 'desktop-base', 'resources', 'web'))
  await safeRm(join('apps', 'desktop-base', 'resources', 'resources'))
  await mkdir(join('apps', 'desktop-base', 'resources', 'resources'), { recursive: true })

  // 2. Build browser-web
  console.log("[2/4] Building browser-web...")
  await $`cd apps/browser-web && npm run build`.nothrow()
  await cp(join('apps', 'browser-web', 'out'), join('apps', 'desktop-base', 'resources', 'web'), { recursive: true })

  // 3. Build local-daemon
  console.log("[3/4] Building local-daemon...")
  await $`cd apps/local-daemon && bun run build`.nothrow()
  
  if (await safeExists(join('apps', 'local-daemon', 'jbrowser-server.exe'))) {
    await cp(join('apps', 'local-daemon', 'jbrowser-server.exe'), join('apps', 'desktop-base', 'resources', 'resources', 'jbrowser-server.exe'))
  } else if (await safeExists(join('apps', 'local-daemon', 'jbrowser-server'))) {
    await cp(join('apps', 'local-daemon', 'jbrowser-server'), join('apps', 'desktop-base', 'resources', 'resources', 'jbrowser-server'))
  } else {
    console.warn("Warning: local-daemon binary not found!")
  }

  console.log("[3.5/4] Extracting agent-browser native binary...")
  const resDir = join('apps', 'desktop-base', 'resources', 'resources')
  
  if (isWindows) {
    const src = join('apps', 'local-daemon', 'node_modules', 'agent-browser', 'bin', 'agent-browser-win32-x64.exe')
    if (await safeExists(src)) await cp(src, join(resDir, 'agent-browser.exe'))
  } else if (os.platform() === 'darwin') {
    const isArm = os.arch() === 'arm64'
    const src = join('apps', 'local-daemon', 'node_modules', 'agent-browser', 'bin', isArm ? 'agent-browser-darwin-arm64' : 'agent-browser-darwin-x64')
    if (await safeExists(src)) await cp(src, join(resDir, 'agent-browser'))
  } else {
    const isArm = os.arch() === 'arm64'
    const src = join('apps', 'local-daemon', 'node_modules', 'agent-browser', 'bin', isArm ? 'agent-browser-linux-arm64' : 'agent-browser-linux-x64')
    if (await safeExists(src)) await cp(src, join(resDir, 'agent-browser'))
  }

  // 4. Build desktop-base
  console.log("[4/4] Packaging desktop-base...")
  if (isWindows) {
    await $`cd apps/desktop-base && bun run dist:win`
  } else if (os.platform() === 'darwin') {
    await $`cd apps/desktop-base && bun run dist:mac`
  } else {
    await $`cd apps/desktop-base && bun run dist:linux`
  }

  console.log("=== Build Complete ===")
}

run().catch(console.error)
