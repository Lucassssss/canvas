#!/usr/bin/env bun

import { watch } from 'fs'
import { execSync, spawn } from 'child_process'
import { join } from 'path'

const NEWS_DIR = join(process.cwd(), 'content/news')
let buildTimeout: ReturnType<typeof setTimeout> | null = null
let isBuilding = false

console.log('📡 News Watcher Started')
console.log(`📁 Watching: ${NEWS_DIR}`)
console.log('⏳ Waiting for changes...\n')

function rebuild() {
  if (isBuilding) {
    console.log('⏳ Build in progress, queuing...')
    return
  }

  isBuilding = true
  console.log('\n🔄 Changes detected! Rebuilding...')
  
  try {
    execSync('bun run build', {
      cwd: process.cwd(),
      stdio: 'inherit',
      timeout: 120000
    })
    
    console.log('\n✅ Build complete!')
    console.log('📝 Restart server with: bun run start\n')
    
    isBuilding = false
    
    // 自动重启服务器（可选）
    // restartServer()
    
  } catch (error) {
    console.error('\n❌ Build failed:', error)
    isBuilding = false
  }
}

// 监听 news 目录
watch(NEWS_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename || !filename.endsWith('.mdx')) return
  
  console.log(`\n📝 File changed: ${filename}`)
  
  // 防抖：等待 2 秒后再构建
  if (buildTimeout) clearTimeout(buildTimeout)
  buildTimeout = setTimeout(rebuild, 2000)
})

console.log('Press Ctrl+C to stop\n')

// 保持进程运行
process.stdin.resume()
